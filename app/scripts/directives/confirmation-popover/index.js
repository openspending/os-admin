'use strict';

var ngModule = require('../../module');

ngModule.directive('confirmationPopover', [
  function() {
    return {
      restrict: 'A',
      replace: false,
      template: '',
      scope: {
        onClick: '&'
      },
      link: function($scope, element, attrs) {
        var content = 'This will DELETE this data-set - <br/>' +
          'Are you sure?<br/>' +
          '<button class="btn btn-danger btn-sm btn-block">' +
          'Yes, Delete</button>';
        var container = '.delete-confirmation';
        var deletePackage = $scope.onClick;
        element.popover({
          container: container,
          content: content,
          html: true,
          placement: 'bottom'
        });
        element.on('inserted.bs.popover', function(e) {
          $(container+' button').on('click', function() {
            console.log('Deleting '+deletePackage);
            deletePackage();
            element.popover('hide');
            $scope.$applyAsync();
          });
        });
      }
    };
  }
]);
