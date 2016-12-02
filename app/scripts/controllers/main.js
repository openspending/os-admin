'use strict';

var angular = require('angular');
var osAdminService = require('../services/os-admin');
var $q = require('../services/ng-utils').$q;

var application = angular.module('Application');

application.controller('MainController', [
  '$scope', '$location', 'LoginService',
  function($scope, $location, LoginService) {
    var state = $scope.state = {
      showProfile: false,
      dataPackageFilter: 'all' // 'published' / 'hidden'
    };

    $scope.highlightPackage = $location.search().hl;
    $scope.$on('$locationChangeSuccess', function() {
      $scope.highlightPackage = $location.search().hl;
    });

    $scope.$on('profile.edit', function() {
      state.showProfile = true;
    });

    function getMetrics(packages) {
      var result = {
        total: 0,
        published: 0,
        hidden: 0
      };
      _.each(packages, function(item) {
        result.total += 1;
        if (item.isPublished) {
          result.published += 1;
        } else {
          result.hidden += 1;
        }
      });
      return result;
    }

    function filterDataPackages(items, filter) {
      if (filter == 'published') {
        return _.filter(items, function(item) {
          return item.isPublished;
        });
      }
      if (filter == 'hidden') {
        return _.filter(items, function(item) {
          return !item.isPublished;
        });
      }
      return items;
    }

    state.metrics = getMetrics([]);
    $scope.$on('packages.changed', function() {
      state.dataPackages = filterDataPackages(
        $scope.dataPackages, state.dataPackageFilter
      );
      state.metrics = getMetrics($scope.dataPackages);
    });

    $scope.$watch('state.dataPackageFilter', function(newValue, oldValue) {
      if (newValue !== oldValue) {
        state.dataPackages = filterDataPackages(
          $scope.dataPackages, state.dataPackageFilter
        );
      }
    });

    LoginService.tryGetToken()
      .then(function() {
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
          function() {
            // This callback will be called on package loading status update
            $scope.$applyAsync();
          }
        ));
      })
      .then(function(dataPackages) {
        $scope.isLoaded.packages = true;
        $scope.dataPackages = dataPackages;
        state.dataPackages = filterDataPackages(
          $scope.dataPackages, state.dataPackageFilter
        );
        state.metrics = getMetrics(state.dataPackages);
      })
      .catch(function() {
        LoginService.login();
      });
  }
]);
