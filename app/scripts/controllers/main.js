'use strict';

var angular = require('angular');
var osAdminService = require('../services/os-admin');
var $q = require('../services/ng-utils').$q;

var application = angular.module('Application');

application.controller('MainController', [
  '$scope', '$location', 'LoginService',
  function($scope, $location, LoginService) {
    $scope.state = {
      page: 'profile'
    };

    $scope.highlightPackage = $location.search().hl;
    $scope.$on('$locationChangeSuccess', function() {
      $scope.highlightPackage = $location.search().hl;
    });

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

        return $q(osAdminService.getDataPackages(
          LoginService.getToken(),
          LoginService.getUserId(),
          function(d) {
            // This callback will be called on package loading status update
            $scope.$applyAsync();
          }
        ));
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
