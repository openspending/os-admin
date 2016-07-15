'use strict';

var angular = require('angular');

var application = angular.module('Application');

application.controller('MainController', [
  '$scope', 'LoginService',
  function($scope, LoginService) {
    $scope.state = {
      page: 'profile'
    };

    LoginService.tryGetToken()
      .then(function() {
        $scope.isLoaded.application = true;
      })
      .catch(function() {
        LoginService.login();
      });
  }
]);
