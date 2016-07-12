'use strict';

var angular = require('angular');
var $ = require('jquery');

var application = angular.module('Application');

module.exports = application.animation('.slide-animation', [
  function() {
    return {
      enter: function(element, doneFn) {
        $(element).hide().slideDown(350, doneFn);
      },
      leave: function(element, doneFn) {
        $(element).slideUp(350, doneFn);
      }
    };
  }
]);
