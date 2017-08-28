// Folders service used to communicate Folders REST endpoints
(function () {
  'use strict';

  angular
    .module('folders')
    .factory('FoldersService', FoldersService);

  FoldersService.$inject = ['$resource'];

  function FoldersService($resource) {
    return $resource('/api/projects/:projectId/folders/:folderId', {
      projectId: '@project',
      folderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
