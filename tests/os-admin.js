'use strict';

var _ = require('lodash');
var nock = require('nock');
var assert = require('chai').assert;
var downloader = require('../app/scripts/services/downloader');
var osAdmin = require('../app/scripts/services/os-admin');

var data = require('./data');

describe('OS-Admin', function() {
  var authToken = '1234';

  before(function(done) {
    osAdmin.defaultSettingsUrl = 'http://example.com/config.json';
    osAdmin.conductorUrl = 'http://example.com';
    osAdmin.searchUrl = 'http://example.com/search/package';

    var scope = nock('http://example.com/')
      .persist();

    scope
      .get('/config.json')
      .reply(200, {
        conductorUrl: osAdmin.conductorUrl,
        searchUrl: osAdmin.searchUrl
      }, {'access-control-allow-origin': '*'});

    scope
      .get('/search/package?size=10000')
      .reply(200, function() {
        return data.rawPackages;
      }, {'access-control-allow-origin': '*'});

    scope
      .post('/user/update?username=test&jwt=' + authToken)
      .reply(200, {
        success: true
      }, {'access-control-allow-origin': '*'});

    // http://example.com/package/publish?jwt=1234&id=583b10ad15f2e7f078afd3431c2c09ea%3Atest2&publish=toggle
    var dataPackage = _.first(data.rawPackages);
    scope
      .post('/package/publish?jwt=' + authToken + '&id=' +
        encodeURIComponent(dataPackage.id) + '&publish=toggle')
      .reply(200, function() {
        dataPackage.package.private = !dataPackage.package.private;
        return {
          success: true
        };
      }, {'access-control-allow-origin': '*'});

    done();
  });

  it('Should load settings', function(done) {
    osAdmin.getSettings()
      .then(function(result) {
        assert.equal(result.conductorUrl, osAdmin.conductorUrl);
        assert.equal(result.searchUrl, osAdmin.searchUrl);
        done();
      })
      .catch(done);
  });

  it('Should load datapackages', function(done) {
    osAdmin.getDataPackages()
      .then(function(results) {
        assert.deepEqual(results, data.loadedPackages);
        done();
      })
      .catch(done);
  });

  it('Should update username', function(done) {
    var dataToUpdate = {
      username: 'test',
      unusedField: 'qwerty'
    };
    var responseToCheck = {
      username: 'test'
    };
    osAdmin.updateUserProfile(authToken, dataToUpdate)
      .then(function(results) {
        assert.deepEqual(results, responseToCheck);
        done();
      })
      .catch(done);
  });

  it('Should toggle publication status', function(done) {
    var dataPackage = _.first(data.rawPackages);
    var wasPublished = null;
    osAdmin.getDataPackages()
      .then(function(results) {
        var neededPackage = _.find(results, {
          id: dataPackage.id
        });
        wasPublished = neededPackage.isPublished;

        return osAdmin.togglePackagePublicationStatus(authToken, neededPackage);
      })
      .then(function() {
        downloader.clearCache();
        return osAdmin.getDataPackages();
      })
      .then(function(results) {
        var neededPackage = _.find(results, {
          id: dataPackage.id
        });
        assert.equal(wasPublished, !neededPackage.isPublished);
        done();
      })
      .catch(done);
  });
});
