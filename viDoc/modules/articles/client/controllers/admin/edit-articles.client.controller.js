(function () {
  'use strict';

  angular
    .module('articles.admin')
    .controller('EditArticlesAdminController', EditArticlesAdminController);

  EditArticlesAdminController.$inject = [
    '$scope',
    '$location',
    '$anchorScroll',
    '$sce',
    'CommentService',
    '$state',
    '$window',
    'articleResolve',
    'Authentication',
    'Notification',
    'menuService',
    '$timeout'
  ];
  function EditArticlesAdminController(
    $scope,
    $location,
    $anchorScroll,
    $sce,
    CommentService,
    $state,
    $window,
    article,
    Authentication,
    Notification,
    menuService,
    $timeout
  ) {
    var vm = this;

    vm.inline = false;
    vm.x = {};
    vm.html = '';
    vm.article = article;
    vm.authentication = Authentication;
    vm.projectId = $state.params.projectId;
    vm.folderId = $state.params.folderId;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.options = {
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
    vm.deliberatelyTrustDangerousSnippet = function () {
      return $sce.trustAsHtml(vm.article.content);
    };
    vm.editor = function () {
      vm.inline = true;
      vm.x = $window.CKEDITOR.replace('editor2', {
        extraPlugins: vm.options.extraPlugins,
        filebrowserUploadUrl: vm.options.filebrowserUploadUrl,
        toolbarGroups: vm.options.toolbarGroups,
        removeButtons: vm.options.removeButtons,
        height: 310
      });
      vm.html = vm.x.getData();
    };
    vm.close = function () {
      vm.x.setData(vm.html, {
        callback: function() {
          vm.x.destroy();
        }
      });
      vm.html = '';
      vm.inline = false;
    };
    vm.comments = [];
    vm.users = [];
    CommentService.get({ projectId: vm.projectId, articleId: vm.article._id }, function (data) {
      vm.comments = data.comments;
      vm.users = data.users;
    });
    vm.comment = null;
    vm.textArea = null;
    vm.tag = angular.element($('#tag'))[0];
    vm.a = angular.element($('#a'));
    vm.tagBox = false;
    vm.padding = 76;
    vm.searchUsers = '';
    vm.offsetLeft = angular.element($('#b'))[0];
    vm.isUpdate = false;
    vm.isUpdateSubcomment = false;
    vm.editComment = editComment;
    vm.editSubcomment = editSubcomment;
    vm.deleteComment = deleteComment;
    vm.keydownComment = function (event, comment) {
      let value = event.target.value;
      $timeout(function() {
        event.target.style.height = 'auto';
        event.target.style.height = (event.target.scrollHeight + 2) + 'px';
      }, 0);
      if (event.shiftKey && event.keyCode === 13) {
        event.target.style.height = (event.target.scrollHeight + 22) + 'px';
      }
      if (vm.tagBox) {
        if (event.keyCode === 8) {
          if (vm.searchUsers === '') {
            vm.tag.style.display = 'none';
          }
          vm.searchUsers = vm.searchUsers.slice(0, vm.searchUsers.length - 1);
        } else if (event.which > 47) {
          vm.searchUsers += event.key;
        }
      }
      if (event.shiftKey && event.keyCode === 50) {
        vm.searchUsers = '';
        vm.tagBox = true;
        let selectionStart = event.target.selectionStart;
        let height, offsetLeft, place, top;
        top = 0;
        $timeout(function () {
          place = event.target.value.indexOf(' ', selectionStart) !== -1
            ? event.target.value.indexOf(' ', selectionStart) : selectionStart + 1;
          vm.a[0].innerText = event.target.value.slice(0, place);
          vm.a[0].style.display = 'inline';
          offsetLeft = vm.offsetLeft.offsetLeft;
          height = Math.round(vm.a[0].offsetHeight / 20);
          if (place - selectionStart !== 1) {
            vm.a[0].innerText = event.target.value.slice(selectionStart, place);
            offsetLeft = offsetLeft - vm.a[0].offsetWidth;
          }
          vm.tag.style.display = '';
          if (event.target.offsetTop - $window.pageYOffset > 200) {
            top = 164;
          }
          vm.tag.style.top = event.target.offsetTop + height * 22 - top + 'px';
          vm.tag.style.left = offsetLeft + vm.padding + 'px';
          vm.a[0].style.display = 'none';
        }, 0);
      }
      if (!event.shiftKey && event.keyCode === 13) {
        event.preventDefault();
        if (value) {
          if (vm.padding === 122) {
            if (vm.isUpdateSubcomment) {
              vm.isUpdateSubcomment = false;
              updateComment(vm.comment, event.target.value);
            } else {
              createSubcomment(comment, event.target.value);
            }
          } else {
            if (vm.isUpdate) {
              vm.isUpdate = false;
              updateComment(vm.comment, value);
            } else {
              createComment(value);
            }
          }
          event.target.value = '';
        }
      }
    };
    vm.focus = function (count, event) {
      if (count !== vm.padding) {
        vm.padding = count;
      }
      if (event.target!== vm.textArea) {
        vm.textArea = event.target;
      }
    };
    vm.addUserComment = function (value) {
      vm.tag.style.display = 'none';
      vm.isTag = true;
      let selectionStart = vm.textArea.selectionStart;
      let text = vm.textArea.value.slice(0, selectionStart);
      let i = text.lastIndexOf('@');
      vm.textArea.value = text.slice(0, i + 1) + value.replace(/ /gi, '') + ' ' + vm.textArea.value.slice(selectionStart);
      vm.textArea.selectionEnd = selectionStart + value.replace(/ /gi, '').length + 1;
      vm.textArea.focus();
    }
    vm.setTime = function (date) {
      var minutes = Math.round((new Date().getTime() - new Date(date).getTime()) / (1000 * 60));
      if (minutes < 1) {
        return 'Vừa xong';
      }
      if (minutes < 60) {
        return minutes + ' phút';
      }
      if (minutes < 60 * 24) {
        return Math.round(minutes / 60) + ' giờ';
      }
      if (new Date().getFullYear() === new Date(date).getFullYear()) {
        return new Date(date).getDay() + ' Tháng ' + new Date(date).getMonth()
          + ' lúc ' + new Date(date).toLocaleTimeString();
      }
      return new Date(date).getDay() + ' Tháng ' + new Date(date).getMonth()
        + ' ' + new Date(date).getFullYear() + ' lúc ' + new Date(date).toLocaleTimeString();
    };
    vm.subcommentList = function (comment) {
      if (comment.subcommentList) {
        return;
      }
      var tag = angular.element($('#' + comment._id))[0];
      tag.style.display = '';
      CommentService.query({
        projectId: vm.projectId,
        articleId: vm.article._id,
        commentId: comment._id,
        child: 'child'
      }, function (data) {
        comment.subcommentList = data;
      });
    };
    vm.changText = function (content) {
      return changText(content, 'string');
    };
    function changText(content, type) {
      let value = content.replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/\n/g, '<br/>');
      let users = [];
      let l = value.length;
      var i = 0;
      while (i < l) {
        if (value[i] === '@' && value[i + 1] !== '@') {
          let space = value.indexOf(' ', i);
          space = space === -1 ? value.indexOf('<br/>', i) : space;
          if (space === -1) {
            if (i < l - 1) {
              let name = value.slice(i, l);
              let length = vm.users.length;
              for (let j = 0; j < length; j++) {
                if (vm.users[j].displayName.replace(/ /gi, '') === name.slice(1)) {
                  if (users.indexOf(vm.users[j]._id) === -1) {
                    users.push(vm.users[j]._id);
                  }
                  value = value.replace(name, `<span style="color: #365899">${vm.users[j].displayName}</span>`);
                  break;
                }
              }
            }
            break;
          } else {
            let name = value.slice(i, space);
            let length = vm.users.length;
            for (let j = 0; j < length; j++) {
              if (vm.users[j].displayName.replace(/ /gi, '') === name.slice(1)) {
                if (users.indexOf(vm.users[j]._id) === -1) {
                  users.push(vm.users[j]._id);
                }
                value = value.replace(name, `<span style="color: #365899">${vm.users[j].displayName}</span>`);
                l = l + 36 + vm.users[j].displayName.length - name.length;
                i = space + 36 + vm.users[j].displayName.length - name.length;
                break;
              }
            }
            i += 1;
          }
        } else {
          i += 1;
        }
      }
      if (vm.isTag) {
        vm.isTag = false;
      }
      if (type === 'array') {
        return users;
      }
      return $sce.trustAsHtml(value);
    };
    function createComment(content) {
      $anchorScroll('comment');
      var cm = new CommentService();
      var _id = Date.now();
      vm.comments.push({
        _id: _id,
        created: _id,
        content: content.trim(),
        user: {
          displayName: vm.authentication.user.displayName,
          profileImageURL: vm.authentication.user.profileImageURL
        }
      });
      cm.content = content;
      cm.article = vm.article._id;
      cm.project = vm.projectId;
      cm.$save(function (res) {
        if (res.message) {
          vm.comments = vm.comments.filter(item => item._id !== _id);
        } else {
          console.log(changText(res.content, 'array'));
          vm.comments = vm.comments.map(item => {
            if (item._id === _id) {
              return res;
            }
            return item;
          });
        }
      });
    }
    function createSubcomment(comment, content) {
      var cm = new CommentService();
      var _id = Date.now();
      if (!comment.subcommentList) {
        comment.subcommentList = [];
      }
      comment.subcommentList.push({
        _id: _id,
        created: _id,
        content: content.trim(),
        user: {
          displayName: vm.authentication.user.displayName,
          profileImageURL: vm.authentication.user.profileImageURL
        }
      });
      cm.content = content;
      cm.article = vm.article._id;
      cm.project = vm.projectId;
      cm._id = comment._id;
      cm.child = 'child';
      cm.$save(function (res) {
        if (res.message) {
          comment.subcommentList = comment.subcommentList.filter(item => item._id !== _id);
        } else {
          comment.subcommentList = comment.subcommentList.map(item => {
            if (item._id === _id) {
              return res;
            }
            return item;
          });
        }
      });
    }
    function updateComment(comment, content) {
      var prevComment = Object.assign({}, comment);
      comment.content = content;
      comment.isChange = true;
      comment.article = vm.article._id;
      comment.project = vm.projectId;
      comment = new CommentService(comment);
      comment.$update(res => {
        if (res.message) {
          comment.content = prevComment.content;
          comment.isChange = prevComment.isChange;
        }
      });
    }
    function editComment(comment) {
      var event = angular.element($('#comment'))[0];
      $timeout(function() {
        event.style.height = 'auto';
        event.style.height = (event.scrollHeight + 2) + 'px';
        event.focus();
        $anchorScroll('comment');
      }, 0);
      vm.comment = comment;
      event.value = comment.content;
      vm.isUpdate = true;
    }
    function editSubcomment(comment, subcomment) {
      var event = angular.element($('#form' + comment._id))[0];
      $timeout(function() {
        event.style.height = 'auto';
        event.style.height = (event.scrollHeight + 2) + 'px';
        event.focus();
        $anchorScroll(comment._id);
        $window.scrollTo(0, $window.scrollY - ($window.innerHeight / 3 * 2));
      }, 0);
      vm.comment = subcomment;
      event.value = subcomment.content;
      vm.isUpdateSubcomment = true;
    }
    function deleteComment(comment) {
      var prevComment = Object.assign({}, comment);
      comment.article = vm.article._id;
      comment.project = vm.projectId;
      comment = new CommentService(comment);
      comment.$remove(res => {
        if (res.message) {
          Notification.error({ message: res.message, title: '<i class="glyphicon glyphicon-remove"></i> Error!' });
        } else {
          if (res.parentComment) {
            vm.comments = vm.comments.map(item => {
              if (item._id === res.parentComment) {
                item.subcommentList = item.subcommentList.filter(subitem => subitem._id !== res._id);
              }
              return item;
            });
          } else {
            vm.comments = vm.comments.filter(item => item._id !== res._id);
          }
        }
      });
    }
    // Remove existing Article
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.article.$remove(function(res) {
          menuService.updateMenuItem('sidebar', {
            title: res.project.name,
            state: 'projects.view',
            id: res.project._id,
            params: { name: 'projectId', id: res.project._id },
            roles: ['*']
          });
          if (vm.folderId) {
            $state.go('folders.view', {
              projectId: vm.projectId,
              folderId: vm.folderId
            });
          } else {
            $state.go('projects.view', {
              projectId: vm.projectId
            });
          }
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article deleted successfully!' });
        });
      }
    }

    // Save Article
    function save() {

      // Create a new article, or update the current instance
      vm.article.content = vm.x.getData();
      vm.article.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        vm.x.destroy();
        menuService.updateMenuItem('sidebar', {
          title: res.project.name,
          state: 'projects.view',
          id: res.project._id,
          params: { name: 'projectId', id: res.project._id },
          roles: ['*']
        });
        if (vm.folderId) {
          $state.go('folders.view', {
            projectId: vm.projectId,
            folderId: vm.folderId
          });
        } else {
          $state.go('projects.view', {
            projectId: vm.projectId
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
