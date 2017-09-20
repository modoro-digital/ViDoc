(function () {
  'use strict';

  angular
    .module('articles.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/projects/:projectId/folders/:folderId/articles',
        template: '<ui-view/>'
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: '/modules/articles/client/views/admin/create-articles.client.view.html',
        controller: 'CreateArticlesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'New Articles'
        },
        resolve: {
          articleResolve: newArticleFolder
        }
      })
      .state('articles.edit', {
        url: '/:articleId',
        templateUrl: '/modules/articles/client/views/admin/edit-articles.client.view.html',
        controller: 'EditArticlesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: '{{articleResolve.title}}'
        },
        resolve: {
          articleResolve: getArticleFolder
        }
      })
      .state('article', {
        abstract: true,
        url: '/projects/:projectId/articles',
        template: '<ui-view/>'
      })
      .state('article.create', {
        url: '/create',
        templateUrl: '/modules/articles/client/views/admin/create-articles.client.view.html',
        controller: 'CreateArticlesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'New Articles'
        },
        resolve: {
          articleResolve: newArticleProject
        }
      })
      .state('article.edit', {
        url: '/:articleId',
        templateUrl: '/modules/articles/client/views/admin/edit-articles.client.view.html',
        controller: 'EditArticlesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: '{{articleResolve.title}}'
        },
        resolve: {
          articleResolve: getArticleProject
        }
      });
  }

  getArticleFolder.$inject = ['$stateParams', 'ArticlesService'];

  function getArticleFolder($stateParams, ArticlesService) {
    return ArticlesService.get({
      projectId: $stateParams.projectId,
      folderId: $stateParams.folderId,
      articleId: $stateParams.articleId
    }).$promise;
  }

  newArticleFolder.$inject = ['ArticlesService'];

  function newArticleFolder(ArticlesService) {
    return new ArticlesService();
  }

  getArticleProject.$inject = ['$stateParams', 'ArticlesServiceProject'];

  function getArticleProject($stateParams, ArticlesServiceProject) {
    return ArticlesServiceProject.get({
      projectId: $stateParams.projectId,
      articleId: $stateParams.articleId
    }).$promise;
  }

  newArticleProject.$inject = ['ArticlesServiceProject'];

  function newArticleProject(ArticlesServiceProject) {
    return new ArticlesServiceProject();
  }
}());
