(function () {
  'use strict';

  // Projects controller
  angular
    .module('projects')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'projectResolve', 'users', 'menuService'];

  function ProjectsController ($scope, $state, $window, Authentication, project, users, menuService) {
    var vm = this;
    var l = users.length;

    vm.authentication = Authentication;
    vm.roles = Authentication.user.roles[0] === 'admin';
    vm.project = project;
    vm.users = {
      row1: (l % 3) > 1 ? users.splice(0, l / 3 + 1) : users.splice(0, l / 3 + l % 3),
      row2: (l % 3) > 1 ? users.splice(0, l / 3 + 1) : users.splice(0, l / 3),
      row3: users.splice(0, l / 3)
    };
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.close = close;
    if (!vm.project.users) {
      vm.project.users = [];
    }
    vm.addUser = function(userId) {
      var index = vm.project.users.indexOf(userId);
      if (index === -1) {
        vm.project.users.push(userId);
      } else {
        vm.project.users.splice(index, 1);
      }
    };
    vm.check = function(user) {
      if (vm.project.users && vm.project.users.indexOf(user._id) >= 0) {
        return true;
      }
      if (user.roles[0] === 'admin') {
        return true;
      }
      return false;
    };
    // Remove existing Project
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.project.$remove(function() {
          $state.go('home');
        });
      }
    }
    function close() {
      if (vm.project._id) {
        $state.go('projects.view', {
          projectId: vm.project._id
        });
      } else {
        $state.go('home');
      }
    }
    // Save Project
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.projectForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.project._id) {
        vm.project.$update(successCallback, errorCallback);
      } else {
        vm.project.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        menuService.updateMenuItem('sidebar', {
          title: vm.project.name,
          state: 'projects.view',
          id: vm.project._id,
          params: { name: 'projectId', id: vm.project._id },
          roles: ['*']
        });
        $state.go('home');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
