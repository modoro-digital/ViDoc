(function () {
  'use strict';

  // Folders controller
  angular
    .module('folders')
    .controller('FoldersController', FoldersController);

  FoldersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'folderResolve'];

  function FoldersController ($scope, $state, $window, Authentication, folder) {
    var vm = this;

    vm.authentication = Authentication;
    vm.folder = folder;
    vm.folderId = $state.params.folderId;
    vm.projectId = $state.params.projectId;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Folder
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.folder.$remove(function() {
          if (vm.folder.parentfolder) {
            $state.go('folders.view', {
              projectId: $state.params.projectId,
              folderId: vm.folder.parentfolder
            });
          } else {
            $state.go('projects.view', {
              projectId: $state.params.projectId,
            });
          }
        });
      }
    }

    // Save Folder
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.folderForm');
        return false;
      }

      // TODO: move create/update logic to service
      vm.folder.project = vm.projectId;
      if (vm.folder._id) {
        vm.folder.$update(successCallback, errorCallback);
      } else {
        if ($state.params.folderId) {
          vm.folder.parentfolder = $state.params.folderId;
        }
        vm.folder.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        if (vm.folder.parentfolder) {
          $state.go('folders.view', {
            projectId: vm.projectId,
            folderId: vm.folder.parentfolder
          });
        } else {
          $state.go('projects.view', {
            projectId: vm.projectId,
          });
        }
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
