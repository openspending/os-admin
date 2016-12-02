'use strict';

var angular = require('angular');
var template = require('./template.html');

var $q = require('../../services/ng-utils').$q;
var osAdminService = require('../../services/os-admin');

var application = angular.module('Application');

application.directive('userDatasets', [
  '$rootScope', 'LoginService',
  function($rootScope, LoginService) {
    return {
      restrict: 'E',
      replace: false,
      template: template,
      scope: {
        packages: '=',
        loaded: '=',
        viewerUrl: '@',
        packagerUrl: '@',
        highlightPackage: '@?'
      },
      link: function($scope) {
        $scope.filter = {
          title: ''
        };

        $scope.togglePublicationStatus = function(packageId) {
          var dataPackage = _.find($scope.packages, {
            id: packageId
          });
          if (dataPackage) {
            dataPackage.isUpdating = true;
            var token = LoginService.permissionToken;
            $q(osAdminService.togglePackagePublicationStatus(token,
              dataPackage))
              .finally(function() {
                dataPackage.isUpdating = false;
                $rootScope.$broadcast('packages.changed');
              });
          }
        };

        $scope.runWebHooks = function(packageId) {
          var dataPackage = _.find($scope.packages, {
            id: packageId
          });
          if (dataPackage) {
            dataPackage.isRunningWebhooks = true;
            var token = LoginService.permissionToken;
            $q(osAdminService.runWebHooks(token,dataPackage))
              .finally(function() {
                dataPackage.isRunningWebhooks = false;
              });
          }
        };

      }
    };
  }
]);
