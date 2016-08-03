'use strict';

var angular = require('angular');
require('angular-marked');
require('angular-animate');

angular.module('Application', [
  'ngAnimate',
  'hc.marked',
  'authClient.services'])
  .config(['$locationProvider',
  function ($locationProvider) {
    $locationProvider.html5Mode(true)
  }]);

require('./config');
require('./controllers');
require('./directives');
require('./animations');
