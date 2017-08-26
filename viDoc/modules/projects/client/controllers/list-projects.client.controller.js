(function () {
  'use strict';

  angular
    .module('projects')
    .controller('ProjectsListController', ProjectsListController);

  ProjectsListController.$inject = ['ProjectsService'];

  function ProjectsListController(ProjectsService) {
    var vm = this;

    vm.projects = ProjectsService.query();
    vm.projectName = function (name) {
      return name.replace(/ /gi, '-').toLowerCase();
    };
  }
}());
