'use strict';

/**
 * Module dependencies
 */
var comment = require('../controllers/comment.server.controller'),
  articlesPolicy = require('../policies/articles.server.policy'),
  articlesFolder = require('../controllers/articles.server.controller'),
  articlesProject = require('../controllers/articles-project.server.controller');

module.exports = function (app) {
  // Articles collection routes in folder
  app.route('/api/projects/:projectId/folders/:folderId/articles').all(articlesPolicy.isAllowed)
    .get(articlesFolder.list)
    .post(articlesFolder.create);
  app.route('/api/projects/:projectId/folders/:folderId/articles/:articleId').all(articlesPolicy.isAllowed)
    .get(articlesFolder.read)
    .put(articlesFolder.update)
    .delete(articlesFolder.delete);
  // Articles collection routes in project
  app.route('/api/projects/:projectId/articles').all(articlesPolicy.isAllowed)
    .get(articlesProject.list)
    .post(articlesProject.create);
  app.route('/api/projects/:projectId/articles/:articleId').all(articlesPolicy.isAllowed)
    .get(articlesProject.read)
    .put(articlesProject.update)
    .delete(articlesProject.delete);
  // comment
  app.route('/api/projects/:projectId/articles/:articleId/comment').all(articlesPolicy.isAllowed)
    .get(comment.list)
    .post(comment.create);
  app.route('/api/projects/:projectId/articles/:articleId/comment/:commentId').all(articlesPolicy.isAllowed)
    .put(comment.update)
    .delete(comment.delete);
  app.route('/api/projects/:projectId/articles/:articleId/comment/:commentId/child').all(articlesPolicy.isAllowed)
    .get(comment.subcommentList)
    .post(comment.createSubcomment);
  // Finish by binding the article middleware
  app.param('articleId', articlesFolder.articleByID);
  app.param('commentId', comment.commentByID);
};
