(function () {
  'use strict';

  angular
    .module('articles.services')
    .factory('ArticlesServiceProject', ArticlesServiceProject);

  ArticlesServiceProject.$inject = ['$resource', '$log'];

  function ArticlesServiceProject($resource, $log) {
    var Article = $resource('/api/projects/:projectId/articles/:articleId', {
      projectId: '@project._id',
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Article.prototype, {
      createOrUpdate: function () {
        var article = this;
        return createOrUpdate(article);
      }
    });

    return Article;

    function createOrUpdate(article) {
      if (article._id) {
        return article.$update(onSuccess, onError);
      } else {
        return article.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(article) {
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
