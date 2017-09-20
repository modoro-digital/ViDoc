(function () {
  'use strict';

  angular
    .module('folders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('folders', {
        abstract: true,
        url: '/projects/:projectId/folders',
        template: '<ui-view/>'
      })
      .state('folders.create', {
        url: '/create',
        templateUrl: '/modules/folders/client/views/form-folder.client.view.html',
        controller: 'FoldersController',
        controllerAs: 'vm',
        resolve: {
          folderResolve: newFolder
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Folders Create'
        }
      })
      .state('folders.edit', {
        url: '/:folderId/edit',
        templateUrl: '/modules/folders/client/views/form-folder.client.view.html',
        controller: 'FoldersController',
        controllerAs: 'vm',
        resolve: {
          folderResolve: getFolder
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Folder {{ folderResolve.name }}'
        }
      })
      .state('folders.view', {
        url: '/:folderId',
        templateUrl: '/modules/folders/client/views/view-folder.client.view.html',
        controller: 'FoldersController',
        controllerAs: 'vm',
        resolve: {
          folderResolve: getFolder
        },
        data: {
          pageTitle: '{{ folderResolve.name }}'
        }
      })
      .state('folders.subfolder', {
        url: '/:folderId/subfolder/create',
        templateUrl: '/modules/folders/client/views/form-folder.client.view.html',
        controller: 'FoldersController',
        controllerAs: 'vm',
        resolve: {
          folderResolve: newSubfolder
        },
        data: {
          pageTitle: '{{ folderResolve.name }}'
        }
      });
  }

  getFolder.$inject = ['$stateParams', 'FoldersService'];

  function getFolder($stateParams, FoldersService) {
    return FoldersService.get({
      projectId: $stateParams.projectId,
      folderId: $stateParams.folderId
    }).$promise;
  }

  newFolder.$inject = ['FoldersService'];

  function newFolder(FoldersService) {
    return new FoldersService();
  }

  newSubfolder.$inject = ['SubfoldersService'];

  function newSubfolder(SubfoldersService) {
    return new SubfoldersService();
  }
}());
