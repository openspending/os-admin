'use strict';

var angular = require('angular');
var template = require('./template.html');

var $q = require('../../services/ng-utils').$q;
var osAdminService = require('../../services/os-admin');

var application = angular.module('Application');

application.directive('userProfile', [
  'Configuration', 'LoginService',
  function(Configuration, LoginService) {
    return {
      restrict: 'E',
      replace: true,
      template: template,
      scope: {
        profile: '=',
        visible: '='
      },
      link: function($scope, element) {
        element.modal({
          backdrop: true,
          keyboard: true,
          show: !!$scope.visible
        });

        element.on('shown.bs.modal', function() {
          $scope.visible = true;
          $scope.$applyAsync();
        });
        element.on('hidden.bs.modal', function() {
          $scope.visible = false;
          $scope.$applyAsync();
        });

        $scope.$watch('visible', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            element.modal($scope.visible ? 'show' : 'hide');
          }
        });

        $scope.profileModel = {
          email: $scope.profile.email,
          username: $scope.profile.username
        };
        $scope.saveUsername = function() {
          $scope.profile.username = $scope.profileModel.username;
          var token = LoginService.getToken();
          $q(osAdminService.updateUserProfile(token, {
            username: $scope.profileModel.username
          })).finally(function() {
            $scope.visible = false;
          });
        };
      }
    };
  }
]);
