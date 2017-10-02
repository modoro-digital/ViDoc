(function () {
  'use strict';

  angular
    .module('articles')
    .controller('CreateArticlesAdminController', CreateArticlesAdminController);

  CreateArticlesAdminController.$inject = ['$scope', '$state', '$window', 'articleResolve', 'Authentication', 'Notification', '$stateParams', 'menuService'];

  function CreateArticlesAdminController($scope, $state, $window, article, Authentication, Notification, $stateParams, menuService) {
    var vm = this;
    vm.article = article;
    vm.authentication = Authentication;
    vm.form = {};
    vm.close = close;
    vm.save = save;
    vm.options = {
      height: 310,
      language: 'en',
      extraPlugins: 'colorbutton,colordialog,image2',
      filebrowserUploadUrl: '/api/users/upload',
      toolbarGroups: [
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'clipboard', groups: ['undo', 'clipboard'] },
        { name: 'styles', groups: ['styles'] },
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'forms', groups: ['forms'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'colors', groups: ['colors'] }
      ],
      removeButtons: 'Underline,Subscript,Superscript,Cut,Copy,Paste,PasteText,PasteFromWord,About,Outdent,Indent,Source'
    };
    vm.content = $window.CKEDITOR.replace('editor1', vm.options);
    // Remove existing Article
    function close() {
      vm.content.destroy();
      if ($state.params.folderId) {
        $state.go('folders.view', {
          projectId: $state.params.projectId,
          folderId: $state.params.folderId
        });
      } else {
        $state.go('projects.view', {
          projectId: $state.params.projectId
        });
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      vm.article.content = vm.content.getData();
      vm.article.project = { _id: $state.params.projectId };
      vm.article.folder = $state.params.folderId;
      vm.article.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        menuService.updateMenuItem('sidebar', {
          title: res.project.name,
          state: 'projects.view',
          id: res.project._id,
          params: { name: 'projectId', id: res.project._id },
          roles: ['*']
        });
        if ($state.params.folderId) {
          $state.go('folders.view', {
            projectId: $state.params.projectId,
            folderId: $state.params.folderId
          });
        } else {
          $state.go('projects.view', {
            projectId: $state.params.projectId
          });
        }
        // should we send the User to the list or the updated Article's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Article save error!' });
      }
    }
  }
}());
