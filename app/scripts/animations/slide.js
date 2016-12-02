'use strict';

var $ = require('jquery');
var ngModule = require('../module');

module.exports = ngModule.animation('.slide-animation', [
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
