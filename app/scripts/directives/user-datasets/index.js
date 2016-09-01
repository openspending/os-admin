'use strict';

var angular = require('angular');
var template = require('./template.html');

var $q = require('../../services/ng-utils').$q;
var osAdminService = require('../../services/os-admin');

require('./package-resources');

var application = angular.module('Application');

application.directive('userDatasets', [
  'LoginService',
  function(LoginService) {
    return {
      restrict: 'E',
      replace: false,
      template: template,
      scope: {
        packages: '=',
        loaded: '@',
        viewerUrl: '@',
        packagerUrl: '@'
      },
      link: function($scope) {
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

        $scope.metrics = getMetrics($scope.packages);
        $scope.$watchCollection('packages', function() {
          $scope.metrics = getMetrics($scope.packages);
        });

        function getFilters(filters) {
          var result = {};
          if (filters.title) {
            result.title = filters.title;
          }
          if (filters.isPublished !== null) {
            result.isPublished = filters.isPublished;
          }
          return result;
        }

        $scope.filters = {
          title: '',
          isPublished: null
        };
        $scope.actualFilters = getFilters($scope.filters);
        $scope.$watch('filters', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            $scope.actualFilters = getFilters($scope.filters);
          }
        }, true);

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
                $scope.metrics = getMetrics($scope.packages);
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
