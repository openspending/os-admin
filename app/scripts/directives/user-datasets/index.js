'use strict';

var angular = require('angular');
var template = require('./template.html');

var application = angular.module('Application');

application.directive('userDatasets', [
  function() {
    return {
      restrict: 'E',
      replace: false,
      template: template,
      scope: {},
      link: function() {
      }
    };
  }
]);
