(function () {
  'use strict';

  angular
    .module('articles.services')
    .factory('CommentService', CommentService);

  CommentService.$inject = ['$resource', '$log'];

  function CommentService($resource, $log) {
    var Comment = $resource('/api/projects/:projectId/articles/:articleId/comment/:commentId/:child', {
      projectId: '@project',
      articleId: '@article',
      commentId: '@_id',
      child: '@child'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Comment.prototype, {
      createOrUpdate: function () {
        var comment = this;
        return createOrUpdate(comment);
      }
    });

    return Comment;

    function createOrUpdate(comment) {
      if (comment._id) {
        return comment.$update(onSuccess, onError);
      } else {
        return comment.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(comment) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
