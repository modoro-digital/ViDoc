(function () {
  'use strict';

  // Projects controller
  angular
    .module('projects')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'projectResolve', 'AdminService'];

  function ProjectsController ($scope, $state, $window, Authentication, project, AdminService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.project = project;
    AdminService.query(function (data) {
      var l = data.length;
      vm.users = {
        row1: (l % 3) > 1 ? data.splice(0, l / 3 + 1) : data.splice(0, l / 3 + l % 3),
        row2: (l % 3) > 1 ? data.splice(0, l / 3 + 1) : data.splice(0, l / 3),
        row3: data.splice(0, l / 3)
      };
    });
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.close = close;
    if (!vm.project.userID) {
      vm.project.userID = [];
    }
    vm.addUser = function(userId) {
      var index = vm.project.userID.indexOf(userId);
      if (index === -1) {
        vm.project.userID.push(userId);
      } else {
        vm.project.userID.splice(index, 1);
      }
    };
    vm.check = function(userId) {
      if (vm.project.userID && vm.project.userID.indexOf(userId) >= 0) {
        return true;
      }
      return false;
    };
    // Remove existing Project
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.project.$remove(function() {
          $state.go('projects.list');
        });
      }
    }
    function close() {
      $state.go('projects.list');
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
        $state.go('projects.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
