'use strict';

module.exports.defaultSettingsUrl = 'config.json';

function getSettings(settingsUrl) {
  var url = settingsUrl || module.exports.defaultSettingsUrl;
  return fetch(url).then(function(response) {
    if (response.status != 200) {
      throw 'Failed to load data from ' + response.url;
    }
    return response.json();
  });
}

module.exports.getSettings = getSettings;
