'use strict';

var _ = require('lodash');
var url = require('url');
var downloader = require('../downloader');

module.exports.defaultSettingsUrl = 'config.json';
module.exports.conductorUrl = null;
module.exports.searchUrl = null;

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
  var originUrl = dataPackage.__origin_url ? dataPackage.__origin_url :
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

function getDataPackages(authToken, userid) {
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
