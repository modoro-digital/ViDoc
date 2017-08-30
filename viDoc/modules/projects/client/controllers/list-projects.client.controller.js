(function () {
  'use strict';

  angular
    .module('projects')
    .controller('ProjectsListController', ProjectsListController);

  ProjectsListController.$inject = ['$scope', 'ProjectsService', 'menuService', '$state'];

  function ProjectsListController($scope, ProjectsService, menuService, $state) {
    var vm = this;

    vm.projects = ProjectsService.query();
  }
}());
