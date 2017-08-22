(function () {
  'use strict';

  angular
    .module('folders')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'Folders',
      state: 'folders',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'folders', {
      title: 'List Folders',
      state: 'folders.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('sidebar', 'folders', {
      title: 'Create Folder',
      state: 'folders.create',
      roles: ['user']
    });
  }
}());
