'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('sidebar', [
    function() {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
          selected: '='
        },
        link: function($scope) {
          $scope.selectItem = function(item) {
            $scope.selected = item;
          };
        }
      };
    }
  ]);
