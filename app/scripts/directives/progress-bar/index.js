'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('progressBar', [
    function() {
      return {
        restrict: 'EA',
        scope: {
          value: '@',
          label: '@'
        },
        template: template,
        replace: true,
        link: function($scope) {
          $scope.$watch('value', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              newValue = parseFloat(newValue);
              if (isFinite(newValue) && (newValue >= 0)) {
                $scope.value = newValue;
              } else {
                $scope.value = 0.0;
              }
            }
          });
        }
      };
    }
  ]);
