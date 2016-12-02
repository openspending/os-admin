'use strict';

var ngModule = require('../module');

ngModule.filter('html', [
  '$sce',
  function($sce) {
    return function(input) {
      return $sce.trustAsHtml(input);
    };
  }
]);
