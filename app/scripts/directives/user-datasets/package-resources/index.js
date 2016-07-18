'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('packageResources', [
    function() {
      return {
        template: template,
        replace: false,
        restrict: 'E',
        scope: {
          package: '='
        },
        link: function($scope, element) {
        }
      };
    }
  ]);
