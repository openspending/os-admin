'use strict';

var angular = require('angular');

var application = angular.module('Application');

application.controller('MainController', [
  '$scope',
  function($scope) {
    $scope.isLoaded.application = true;
  }
]);
