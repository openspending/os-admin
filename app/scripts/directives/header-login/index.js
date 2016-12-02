'use strict';

var ngModule = require('../../module');
var template = require('./template.html');

ngModule.directive('headerLogin', [
  function() {
    return {
      template: template,
      replace: true,
      restrict: 'E',
      scope: {
        userProfile: '=',
        metrics: '=?'
      },
      link: function($scope) {
      }
    };
  }
]);
