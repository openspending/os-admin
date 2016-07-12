'use strict';

var angular = require('angular');
require('angular-marked');
require('angular-animate');

angular.module('Application', [
  'ngAnimate',
  'hc.marked',
  'authClient.services'
]);

require('./config');
require('./controllers');
require('./directives');
require('./animations');
