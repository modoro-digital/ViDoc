(function () {
  'use strict';

  angular
    .module('projects')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {

    $stateProvider
      .state('projects', {
        abstract: true,
        url: '/projects',
        template: '<ui-view/>'
      })
      .state('projects.list', {
        url: '',
        templateUrl: '/modules/projects/client/views/list-projects.client.view.html',
        controller: 'ProjectsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Projects List'
        }
      })
      .state('projects.create', {
        url: '/create',
        templateUrl: '/modules/projects/client/views/create-project.client.view.html',
        controller: 'ProjectsController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: newProject,
          users: usersList
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Projects Create'
        }
      })
      .state('projects.edit', {
        url: '/:projectId/edit',
        templateUrl: '/modules/projects/client/views/create-project.client.view.html',
        controller: 'ProjectsController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: getProject,
          users: usersList
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Project {{ projectResolve.name }}'
        }
      })
      .state('projects.view', {
        url: '/:projectId',
        templateUrl: '/modules/projects/client/views/view-project.client.view.html',
        controller: 'ProjectsController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: getProject,
          users: function () {
            return [];
          }
        },
        data: {
          pageTitle: '{{ projectResolve.name }}'
        }
      });
  }

  getProject.$inject = ['$stateParams', 'ProjectsService'];

  function getProject($stateParams, ProjectsService) {
    return ProjectsService.get({
      projectId: $stateParams.projectId
    }).$promise;
  }

  usersList.$inject = ['$stateParams', 'AdminService'];

  function usersList($stateParams, AdminService) {
    return AdminService.query().$promise;
  }

  newProject.$inject = ['ProjectsService'];

  function newProject(ProjectsService) {
    return new ProjectsService();
  }
}());
