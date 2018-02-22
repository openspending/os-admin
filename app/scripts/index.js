'use strict';

require('js-polyfills/xhr');
require('isomorphic-fetch');

var _ = require('lodash');

// Init some global variables - needed for proper work of angular and
// some other 3rd-party libraries
(function(globals) {
  if (globals.globalConfig === undefined) {
    throw Error('Missing globalConfig object in the global scope');
  }

  globals._ = _;

  var jquery = require('jquery');
  globals.jQuery = globals.$ = jquery;

  // fetch() polyfill
  require('isomorphic-fetch/fetch-npm-browserify');

  require('os-bootstrap/dist/js/os-bootstrap');

  var angular = require('angular');
  globals.angular = angular;
  if (typeof globals.Promise != 'function') {
    globals.Promise = require('bluebird');
  }

  // Load externally hosted authClient.services lib (makes `authenticate`
  // and `authorize` services available to angular modules).
  var libUrl = globalConfig.conductorUrl + '/user/lib';
  $.getScript(libUrl)
    .fail(function(jqxhr, settings, exception) {
      throw Error('Unable to load authClient.services from ' + libUrl);
    })
    .done(function() {
      require('./application');
      angular.bootstrap(globals.document, ['Application']);
    });
})(window);
