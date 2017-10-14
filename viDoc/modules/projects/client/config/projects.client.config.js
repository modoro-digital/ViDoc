(function () {
  'use strict';

  angular
    .module('projects')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', 'ProjectsService'];

  function menuConfig(menuService, ProjectsService) {
    // Set top bar menu items
    ProjectsService.query(projects => {
      var l = projects.length > 5 ? 5 : projects.length;
      for (let i = 0; i < l; i++) {
        menuService.addMenuItem('sidebar', {
          title: projects[i].name,
          state: 'projects.view',
          id: projects[i]._id,
          params: { name: 'projectId', id: projects[i]._id },
          roles: ['*']
        });
      }
    });
  }
}());
