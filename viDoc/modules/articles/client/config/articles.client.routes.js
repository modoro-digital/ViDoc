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
        url: '/folders/:folderName/articles',
        template: '<ui-view/>'
      })
      .state('articles.list', {
        url: '',
        templateUrl: '/modules/articles/client/views/list-articles.client.view.html',
        controller: 'ArticlesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Articles List'
        }
      }).state('articles.create', {
        url: '/create',
        templateUrl: '/modules/articles/client/views/admin/create-articles.client.view.html',
        controller: 'CreateArticlesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'New Articles'
        },
        resolve: {
          articleResolve: newArticle
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
          articleResolve: getArticle
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'ArticlesService'];

  function getArticle($stateParams, ArticlesService) {
    return ArticlesService.get({
      folderId: $stateParams.folderName,
      articleId: $stateParams.articleId
    }).$promise;
  }

  newArticle.$inject = ['ArticlesService'];

  function newArticle(ArticlesService) {
    return new ArticlesService();
  }
}());
