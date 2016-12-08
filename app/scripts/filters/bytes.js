'use strict';

var ngModule = require('../module');

ngModule.filter('bytes', [
  function() {
    return function formatDataSize(input, si) {
      var thresh = si ? 1000 : 1024;
      if (Math.abs(input) < thresh) {
        return input + ' B';
      }
      var units = si ?
        ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] :
        ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
      var u = -1;
      do {
        input /= thresh;
        u++;
      } while (Math.abs(input) >= thresh && u < units.length - 1);
      return input.toFixed(1) + ' ' + units[u];
    };
  }
]);
