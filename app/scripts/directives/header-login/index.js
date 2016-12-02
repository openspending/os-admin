'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('headerLogin', [
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
