'use strict';

var angular = require('angular');
var osAdminService = require('../services/os-admin');
var $q = require('../services/ng-utils').$q;

var application = angular.module('Application');

application.controller('MainController', [
  '$scope', 'LoginService', 'Configuration',
  function($scope, LoginService, Configuration) {
    $scope.state = {
      page: 'profile'
    };

    LoginService.tryGetToken()
      .then(function() {
        if (LoginService.username) {
          $scope.state.page = 'datasets';
        }
        return $q(osAdminService.getSettings());
      })
      .then(function(settings) {
        $scope.isLoaded.application = true;

        $scope.viewerUrl = settings.viewerUrl;
        $scope.packagerUrl = settings.packagerUrl;
        osAdminService.conductorUrl = settings.conductorUrl;
        osAdminService.searchUrl = settings.searchUrl;

        return $q(osAdminService.getDataPackages(LoginService.getToken(), LoginService.getUserId()));
      })
      .then(function(dataPackages) {
        $scope.isLoaded.packages = true;
        $scope.dataPackages = dataPackages;
      })
      .catch(function() {
        LoginService.login();
      });
  }
]);
