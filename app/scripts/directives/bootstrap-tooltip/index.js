'use strict';

var ngModule = require('../../module');

ngModule.directive('bootstrapTooltip', [
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
