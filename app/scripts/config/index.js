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

application
  .config([
    '$httpProvider', '$compileProvider', '$logProvider', 'markedProvider',
    function($httpProvider, $compileProvider, $logProvider, markedProvider) {
      $compileProvider.aHrefSanitizationWhitelist(
        /^\s*(https?|ftp|mailto|file|javascript):/);
      $logProvider.debugEnabled(true);
      markedProvider.setOptions({gfm: true});
    }
  ])
  .run([
    '$rootScope', 'LoginService',
    function($rootScope, LoginService) {
      $rootScope.isLoaded = {};
      $rootScope.login = LoginService;
    }
  ]);
