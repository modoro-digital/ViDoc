(function () {
  'use strict';

  angular
    .module('projects')
    .controller('ProjectsListController', ProjectsListController);

  ProjectsListController.$inject = ['ProjectsService', 'PagerService', 'Authentication'];

  function ProjectsListController(ProjectsService, PagerService, Authentication) {
    var vm = this;
    vm.pager = {};
    vm.setPage = setPage;
    vm.roles = Authentication.user.roles[0] === 'admin';
    ProjectsService.query(function (data) {
      vm.projects = data;
      vm.dummyItems = _.range(0, vm.projects.length);
      initController();
    });
    function initController() {
      vm.setPage(1);
    }
    function setPage(page) {
      if (page < 1 || page > vm.pager.totalPages) {
        return;
      }
      vm.pager = PagerService.getPager(vm.dummyItems.length, page);
      vm.items = vm.projects.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
    }
  }
}());

