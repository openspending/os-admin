'use strict';

var angular = require('angular');
var template = require('./template.html');

angular.module('Application')
  .directive('mainSidebar', [
    function() {
      return {
        template: template,
        replace: true,
        restrict: 'E',
        scope: {
          userProfile: '=',
          metrics: '=?',
          datapackageFilter: '=?'
        },
        link: function($scope) {
          $scope.changeDataPackageFilter = function(value) {
            $scope.datapackageFilter = value;
          };

          $scope.editProfile = function() {
            $scope.$emit('profile.edit');
          };
        }
      };
    }
  ]);
