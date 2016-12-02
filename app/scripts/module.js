'use strict';

var angular = require('angular');
require('angular-marked');
require('angular-animate');

var ngModule = angular.module('Application', [
  'ngAnimate',
  'hc.marked',
  'authClient.services'
])
  .constant('Configuration', {})
  .config([
    '$httpProvider', '$compileProvider', '$logProvider', 'markedProvider',
    '$locationProvider',
    function($httpProvider, $compileProvider, $logProvider, markedProvider,
      $locationProvider) {
      $compileProvider.aHrefSanitizationWhitelist(
        /^\s*(https?|ftp|mailto|file|javascript):/);
      $logProvider.debugEnabled(true);
      $locationProvider.html5Mode(true);
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

module.exports = ngModule;
