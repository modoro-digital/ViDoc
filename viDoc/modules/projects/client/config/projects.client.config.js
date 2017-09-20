(function () {
  'use strict';

  angular
    .module('projects')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', 'ProjectsService'];

  function menuConfig(menuService, ProjectsService) {
    // Set top bar menu items
    ProjectsService.query(projects => {
      for (let project of projects) {
        menuService.addMenuItem('sidebar', {
          title: project.name,
          state: 'projects.view',
          params: { name: 'projectId', id: project._id },
          roles: ['*']
        });
      }
    });
  }
}());
