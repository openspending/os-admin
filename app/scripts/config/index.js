'use strict';

var angular = require('angular');

var application = angular.module('Application');

var config = {
  events: {
    profile: {
      usernameModalAccept: 'profile.usernameModalAccept'
    }
  }
};

application.constant('Configuration', config);

require('../services/login');

application.run([
  '$rootScope', 'LoginService',
  function($rootScope, LoginService) {
    $rootScope.isLoaded = {};
    $rootScope.login = LoginService;
  }
]);
