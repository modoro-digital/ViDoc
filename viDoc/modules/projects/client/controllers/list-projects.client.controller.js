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
    vm.projectName = function (name) {
        return name.replace(/ /gi, '-').toLowerCase();
    };
    function initController() {
      vm.setPage(1);
    }
    function setPage(page) {
      if (page < 1 || page > vm.pager.totalPages) {
          return;
      }
      vm.pager = GetPager(vm.dummyItems.length, page);
      vm.items = vm.projects.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
    }
    function GetPager(totalItems, currentPage, pageSize) {
      // default to first page
      currentPage = currentPage || 1;

      // default page size is 10
      pageSize = pageSize || 12;

      // calculate total pages
      var totalPages = Math.ceil(totalItems / pageSize);

      var startPage, endPage;
      if (totalPages <= 12) {
          // less than 10 total pages so show all
          startPage = 1;
          endPage = totalPages;
      } else {
          // more than 10 total pages so calculate start and end pages
        if (currentPage <= 6) {
            startPage = 1;
            endPage = 12;
        } else if (currentPage + 4 >= totalPages) {
            startPage = totalPages - 9;
            endPage = totalPages;
        } else {
            startPage = currentPage - 5;
            endPage = currentPage + 4;
        }
      }
      // calculate start and end item indexes
      var startIndex = (currentPage - 1) * pageSize;
      var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
      // create an array of pages to ng-repeat in the pager control
      var pages = _.range(startPage, endPage + 1);
      // return object with all pager properties required by the view
      return {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
    };
    }
  }
})();

