(function () {
  'use strict';

  angular
    .module('folders')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
  }
}());
