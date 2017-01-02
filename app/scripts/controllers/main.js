'use strict';

var osAdminService = require('../services/os-admin');
var filteringService = require('../services/filtering');
var $q = require('../services/ng-utils').$q;

var ngModule = require('../module');

ngModule.controller('MainController', [
  '$scope', '$window', '$location', 'LoginService',
  function($scope, $window, $location, LoginService) {
    var state = $scope.state = {
      showProfile: false,
      dataPackageFilter: {
        publishingStatus: 'all', // 'published' / 'hidden'
        loadingStatus: 'all' // 'loaded' / 'loading' / 'failed'
      }
    };

    $scope.highlightPackage = $location.search().hl;
    $scope.$on('$locationChangeSuccess', function() {
      $scope.highlightPackage = $location.search().hl;
    });

    $scope.$on('profile.edit', function() {
      state.showProfile = true;
    });

    function updatePackagesAndMetrics() {
      var dataPackages = _.isArray($scope.dataPackages) ?
        $scope.dataPackages: [];
      var filterValues = _.extend({}, state.dataPackageFilter);

      var filter = filteringService(dataPackages, filterValues);
      state.dataPackages = filter.getItems();
      state.metrics = filter.getMetrics();

      filter = filteringService(dataPackages, {});
      state.globalMetrics = filter.getMetrics();
    }

    updatePackagesAndMetrics();

    $scope.$on('packages.changed', function() {
      updatePackagesAndMetrics();
    });

    $scope.$watch('state.dataPackageFilter', function(newValue, oldValue) {
      if (newValue !== oldValue) {
        updatePackagesAndMetrics();
      }
    }, true);

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

        LoginService.onLogout = function() {
          if (settings.explorerUrl) {
            $window.location.href = settings.explorerUrl;
          } else {
            LoginService.login();
          }
        };

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
        updatePackagesAndMetrics();
      })
      .catch(function() {
        LoginService.login();
      });
  }
]);
