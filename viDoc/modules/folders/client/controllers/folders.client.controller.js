(function () {
  'use strict';

  // Folders controller
  angular
    .module('folders')
    .controller('FoldersController', FoldersController);

  FoldersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'folderResolve', 'menuService'];

  function FoldersController ($scope, $state, $window, Authentication, folder, menuService) {
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
        vm.folder.project = vm.projectId;
        vm.folder.$remove(function(res) {
          menuService.updateMenuItem('sidebar', {
            title: res.project.name,
            state: 'projects.view',
            id: res.project._id,
            params: { name: 'projectId', id: res.project._id },
            roles: ['*']
          });
          if (res.parentfolder) {
            $state.go('folders.view', {
              projectId: res.project._id,
              folderId: res.parentfolder
            });
          } else {
            $state.go('projects.view', {
              projectId: res.project._id
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
        menuService.updateMenuItem('sidebar', {
          title: res.project.name,
          state: 'projects.view',
          id: res.project._id,
          params: { name: 'projectId', id: res.project._id },
          roles: ['*']
        });
        if (vm.folder.parentfolder) {
          $state.go('folders.view', {
            projectId: res.project._id,
            folderId: res.parentfolder
          });
        } else {
          $state.go('projects.view', {
            projectId: res.project._id
          });
        }
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
