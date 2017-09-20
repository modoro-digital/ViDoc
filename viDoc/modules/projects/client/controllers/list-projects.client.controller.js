(function () {
  'use strict';

  angular
    .module('projects')
    .controller('ProjectsListController', ProjectsListController);

  ProjectsListController.$inject = ['ProjectsService', 'PagerService'];

  function ProjectsListController(ProjectsService,PagerService) {
    var vm = this;
    vm.pager = {};
    vm.setPage = setPage;
    ProjectsService.query(function (data) {
      vm.projects = data;
      vm.dummyItems =_.range(1, vm.projects.length);
      initController();
    });

    function initController() {
      vm.setPage(1);
    }
    function setPage(page) {
      if (page < 1 || page > vm.pager.totalPages) {
          return;
      }
      vm.pager = PagerService.GetPager(vm.dummyItems.length, page);
      vm.items = vm.projects.slice(vm.pager.startIndex, vm.pager.endIndex + 1);

    }
  }
})();

