'use strict';

var _ = require('lodash');
var url = require('url');
var downloader = require('../downloader');

module.exports.defaultSettingsUrl = 'config.json';
module.exports.conductorUrl = null;
module.exports.searchUrl = null;
module.exports.pollInterval = 1000;

var RemoteProcessingStatus = {
  'queued': 'Waiting in queue for an available processor',
  'initializing': 'Getting ready to load the package',
  'loading-datapackage': 'Reading the Fiscal Data Package',
  'validating-datapackage': 'Validagin Data Package correctness',
  'loading-resource': 'Loading Resource data',
  'deleting-table': 'Clearing previous rows for this dataset from the database',
  'creating-table': 'Preparing space for rows in the database',
  'loading-data-ready': 'Starting to load rows to database',
  'loading-data': 'Loading data into the database',
  'creating-babbage-model': 'Converting the Data Package into an API model',
  'saving-metadata': 'Saving package metadata',
  'done': 'Done',
  'fail': 'Failed'
};

function getSettings(settingsUrl) {
  var url = settingsUrl || module.exports.defaultSettingsUrl;
  return downloader.getJson(url);
}

function updateUserProfile(authToken, profileData) {
  var url = module.exports.conductorUrl + '/user/update';

  profileData = _.pick(profileData || {}, [
    'username'
  ]);

  var data = _.chain(profileData)
    .map(function(value, key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    })
    .push('jwt=' + encodeURIComponent(authToken))
    .join('&')
    .value();

  var options = {
    method: 'POST'
  };
  return downloader.getJson(url + '?' + data, options, true)
    .then(function(result) {
      if (!result.success) {
        throw new Error(result.error);
      }
      return profileData;
    });
}

function getDataPackageMetadata(dataPackage) {
  // jscs:disable
  var originUrl = dataPackage.origin_url ? dataPackage.origin_url :
    [
      'http://datastore.openspending.org',
      dataPackage.package.owner,
      dataPackage.package.name,
      'datapackage.json'
    ].join('/');
  // jscs:enable

  return {
    id: dataPackage.id,
    name: dataPackage.package.name,
    title: dataPackage.package.title,
    description: dataPackage.package.description,
    owner: dataPackage.package.owner,
    isPublished: !dataPackage.package.private,
    loadingStatus: (function() {
      // Old packages will have no `loaded`/`loading_*` properties;
      // treat them as successfully loaded.

      var isLoaded = _.isUndefined(dataPackage.loaded) ? true :
        !!dataPackage.loaded;

      // jscs:disable
      var loadingStatus = isLoaded ? 'done' :
        (dataPackage.loaging_status || 'queued');
      // jscs:enable

      var isFailed = loadingStatus == 'fail';

      var result = {
        loaded: isLoaded,
        failed: isFailed,
        status: loadingStatus,
        message: RemoteProcessingStatus[loadingStatus] ||
          RemoteProcessingStatus.queued,
        // jscs:disable
        error: isFailed ? dataPackage.loading_error : null
        // jscs:enable
      };

      // Show UI message for failed and in-progress packages
      result.showMessage = !result.loaded;

      // Calculate count of rows (if available)
      result.countOfRecords = 0;
      result.processedRecords = 0;
      _.each(dataPackage.package.resources, function(resource) {
        // jscs:disable
        var count = parseInt(resource.count_of_rows, 10) || 0;
        // jscs:enable
        if (count > 0) {
          result.countOfRecords += count;
        }
      });
      if (result.countOfRecords == 0) {
        // jscs:disable
        var count = parseInt(dataPackage.package.count_of_rows, 10) || 0;
        // jscs:enable
        if (count > 0) {
          result.countOfRecords = count;
        }
      }

      return result;
    })(),
    author: _.chain(dataPackage.package.author)
      .split(' ')
      .dropRight(1)
      .join(' ')
      .value(),
    url: originUrl,
    resources: _.chain(dataPackage.package.resources)
      .map(function(resource) {
        var resourceUrl = null;
        if (resource.url) {
          resourceUrl = resource.url;
        }
        if (resource.path) {
          resourceUrl = url.resolve(originUrl, resource.path);
        }

        if (resourceUrl) {
          return {
            name: resource.name,
            url: resourceUrl
          };
        }
      })
      .filter()
      .value()
  };
}

function getDataPackageLoadingStatus(dataPackage) {
  var url = module.exports.conductorUrl + '/package/status' +
    '?datapackage=' + encodeURIComponent(dataPackage.url);

  return fetch(url)
    .then(function(response) {
      if (response.status != 200) {
        throw new Error('Failed to load data from ' + response.url);
      }
      return response.json();
    })
    .then(function(response) {
      if (!_.isObject(response)) {
        throw new Error('Response should be an object');
      }
      var responseStatus = ('' + response.status).toLowerCase();
      if (responseStatus == 'fail') {
        throw new Error(response.error); // Go to .catch()
      } else {
        var progress = parseInt(response.progress, 10) || 0;
        if (progress < 0) {
          progress = 0;
        }
        return {
          status: responseStatus,
          progress: progress
        };
      }
    });
}

function pollPackageStatus(dataPackage, dataPackageUpdatedCallback) {
  if (_.isObject(dataPackage.loadingStatus)) {
    var status = dataPackage.loadingStatus;
    // If package was not loaded and there is no error - it's still loading
    if (!status.loaded && !status.error) {
      dataPackage.loadingStatus.showMessage = true;
      dataPackage.loadingStatus.processedRecords = 0;
      var poll = function() {
        getDataPackageLoadingStatus(dataPackage)
          .then(function(result) {
            var loadingStatus = dataPackage.loadingStatus;

            loadingStatus.loaded = result.status == 'done';
            loadingStatus.failed = false;
            loadingStatus.status = result.status;
            loadingStatus.message = RemoteProcessingStatus[result.status];
            loadingStatus.error = null;
            loadingStatus.processedRecords = result.progress;

            if (loadingStatus.processedRecords > loadingStatus.countOfRecords) {
              if (loadingStatus.countOfRecords > 0) {
                loadingStatus.processedRecords = loadingStatus.countOfRecords;
              }
            }

            if (_.isFunction(dataPackageUpdatedCallback)) {
              dataPackageUpdatedCallback(dataPackage);
            }

            if (result.status != 'done') {
              setTimeout(poll, module.exports.pollInterval);
            } else {
              loadingStatus.processedRecords = loadingStatus.countOfRecords;
            }
          })
          .catch(function(error) {
            var loadingStatus = dataPackage.loadingStatus;

            loadingStatus.loaded = false;
            loadingStatus.failed = true;
            loadingStatus.status = 'fail';
            loadingStatus.message = RemoteProcessingStatus.fail;
            loadingStatus.error = error.message;

            if (_.isFunction(dataPackageUpdatedCallback)) {
              dataPackageUpdatedCallback(dataPackage);
            }
          });
      };
      poll();
    }
  }
  return dataPackage;
}

function getDataPackages(authToken, userid, dataPackageUpdatedCallback) {
  var url = module.exports.searchUrl + '?size=10000';
  if (authToken) {
    url += '&jwt=' + encodeURIComponent(authToken);
  }
  if (userid) {
    url += '&package.owner=' + encodeURIComponent(JSON.stringify(userid));
  }
  return downloader.getJson(url).then(function(packages) {
    return _.chain(packages)
      .map(getDataPackageMetadata)
      .map(function(dataPackage) {
        return pollPackageStatus(dataPackage, dataPackageUpdatedCallback);
      })
      .sortBy(function(item) {
        return item.title;
      })
      .value();
  });
}

function togglePackagePublicationStatus(permissionToken, dataPackage) {
  var url = module.exports.conductorUrl + '/package/publish';

  var data = _.chain({
      jwt: permissionToken,
      id: dataPackage.id,
      publish: 'toggle'
    })
    .map(function(value, key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    })
    .join('&')
    .value();

  var options = {
    method: 'POST'
  };
  return downloader.getJson(url + '?' + data, options, true)
    .then(function(result) {
      if (!result.success) {
        throw new Error(result.error);
      }
      dataPackage.isPublished = !!result.published;
      return dataPackage;
    });
}

function runWebHooks(permissionToken, dataPackage) {
  var url = module.exports.conductorUrl + '/package/run-hooks';

  var data = _.chain({
      jwt: permissionToken,
      id: dataPackage.id
    })
    .map(function(value, key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    })
    .join('&')
    .value();

  var options = {
    method: 'POST'
  };
  return downloader.getJson(url + '?' + data, options, true)
    .then(function(result) {
      if (!result.success) {
        throw new Error(result.error);
      }
      return dataPackage;
    });
}

module.exports.getSettings = getSettings;
module.exports.updateUserProfile = updateUserProfile;
module.exports.getDataPackages = getDataPackages;
module.exports.togglePackagePublicationStatus = togglePackagePublicationStatus;
module.exports.runWebHooks = runWebHooks;
