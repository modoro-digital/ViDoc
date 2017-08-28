(function () {
  'use strict';

  angular
    .module('folders')
    .controller('FoldersListController', FoldersListController);

  FoldersListController.$inject = ['FoldersService'];

  function FoldersListController(FoldersService) {
    var vm = this;
    vm.folders = FoldersService.query();
  }
}());