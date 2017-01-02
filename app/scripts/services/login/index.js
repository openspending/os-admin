'use strict';

var _ = require('lodash');
var ngModule = require('../../module');

ngModule.factory('LoginService', [
  '$q', 'authenticate', 'authorize', '$window',
  function($q, authenticate, authorize, $window) {
    var result = {};

    result.onLogout = null;

    result.reset = function() {
      result.isLoggedIn = false;
      result.name = null;
      result.username = null;
      result.userid = null;
      result.email = null;
      result.avatar = null;
      result.permissions = null;
      result.permissionToken = null;
    };
    result.reset();

    var token = null;
    var href = null;
    var isInitialCheckDone = false;

    result.getToken = function() {
      return token;
    };

    result.getUserId = function() {
      return result.userid;
    };

    result.tryGetToken = function() {
      return $q(function(resolve, reject) {
        var check = function() {
          if (isInitialCheckDone) {
            var token = result.getToken();
            token ? resolve(token) : reject(new Error('Not logged in'));
          } else {
            setTimeout(check, 50);
          }
        };
        check();
      });
    };

    result.check = function() {
      var next = $window.location.href;
      authenticate.check(next)
        .then(function(response) {
          isInitialCheckDone = true;
          token = response.token;
          result.isLoggedIn = true;
          result.name = response.profile.name;
          result.username = response.profile.username;
          result.userid = response.profile.idhash;
          result.email = response.profile.email;
          result.avatar = response.profile.avatar_url;

          authorize.check(token, 'os.datastore')
            .then(function(permissionData) {
              result.permissionToken = permissionData.token;
              result.permissions = permissionData.permissions;
            });
        })
        .catch(function(providers) {
          isInitialCheckDone = true;
          href = providers.google.url;
        });
    };
    result.check();

    result.login = function() {
      if (result.isLoggedIn || (href === null)) {
        return true;
      }
      authenticate.login(href, '_self');
    };

    result.logout = function() {
      if (result.isLoggedIn) {
        result.reset();
        authenticate.logout();

        if (_.isFunction(result.onLogout)) {
          result.onLogout();
        }
      }
    };

    return result;
  }
]);
