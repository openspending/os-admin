'use strict';

var angular = require('angular');

var application = angular.module('Application');

require('../services/login');

application.run([
  '$rootScope', 'LoginService',
  function($rootScope, LoginService) {
    $rootScope.isLoaded = {};
    $rootScope.login = LoginService;
  }
]);
