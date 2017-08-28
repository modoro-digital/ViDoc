// Folders service used to communicate Folders REST endpoints
(function () {
  'use strict';

  angular
    .module('folders')
    .factory('SubfoldersService', SubfoldersService);

  SubfoldersService.$inject = ['$resource'];

  function SubfoldersService($resource) {
    return $resource('/api/projects/:projectId/folders/:folderId/subfolder', {
      projectId: '@project',
      folderId: '@parentfolder'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
