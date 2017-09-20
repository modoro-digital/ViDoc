(function () {
  'use strict';

  angular
    .module('folders')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
  }
}());
