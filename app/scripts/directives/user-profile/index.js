'use strict';

var angular = require('angular');
var template = require('./template.html');

require('./save-username-modal');

var application = angular.module('Application');

application.directive('userProfile', [
  'Configuration',
  function(Configuration) {
    return {
      restrict: 'E',
      replace: false,
      template: template,
      scope: {
        profile: '='
      },
      link: function($scope) {
        $scope.state = {
          isModalVisible: false
        };
        $scope.profileModel = {
          email: $scope.profile.email,
          username: $scope.profile.username
        };
        $scope.saveUsername = function() {
          $scope.state.isModalVisible = true;
        };

        $scope.$on(Configuration.events.profile.usernameModalAccept,
          function() {
            $scope.profile.username = $scope.profileModel.username;
            // TODO: Update username via API
          });
      }
    };
  }
]);
