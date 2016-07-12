'use strict';

var angular = require('angular');
var template = require('./template.html');

var application = angular.module('Application');

application.directive('test', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      template: template,
      scope: {},
      link: function() {
      }
    };
  }
]);
