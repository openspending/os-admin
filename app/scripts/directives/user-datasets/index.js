'use strict';

var angular = require('angular');
var template = require('./template.html');

require('./package-resources');

var application = angular.module('Application');

application.directive('userDatasets', [
  function() {
    return {
      restrict: 'E',
      replace: false,
      template: template,
      scope: {
        packages: '=',
        loaded: '@',
        viewerUrl: '@'
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
        $scope.$watch('packages', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            $scope.metrics = getMetrics($scope.packages);
          }
        });
      }
    };
  }
]);
