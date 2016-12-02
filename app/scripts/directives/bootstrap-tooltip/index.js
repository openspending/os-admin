'use strict';

var angular = require('angular');
var application = angular.module('Application');

application.directive('bootstrapTooltip', [
  function() {
    return {
      restrict: 'A',
      replace: false,
      template: '',
      scope: false,
      link: function($scope, element) {
        element.tooltip();
      }
    };
  }
]);
