'use strict';

var angular = require('angular');
var template = require('./template.html');
var $digest = require('../../../services/ng-utils').$digest;

angular.module('Application')
  .directive('saveUsernameModal', [
    'Configuration',
    function(Configuration) {
      return {
        template: template,
        replace: true,
        restrict: 'E',
        scope: {
          visible: '='
        },
        link: function($scope, element) {
          var addVisModal = element.modal({
            show: false
          });

          element.on('show.bs.modal', function() {
            $scope.visible = true;
            $digest();
          });

          element.on('hide.bs.modal', function() {
            $scope.visible = false;
            $digest();
          });

          $scope.save = function() {
            addVisModal.modal('hide');
            $scope.$emit(Configuration.events.profile.usernameModalAccept);
          };

          $scope.cancel = function() {
            addVisModal.modal('hide');
          };

          $scope.$watch('visible', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              addVisModal.modal(newValue ? 'show' : 'hide');
            }
          });

          $scope.$on('$destroy', function() {
            element.off('show.bs.modal');
            element.off('hide.bs.modal');
          });
        }
      };
    }
  ]);
