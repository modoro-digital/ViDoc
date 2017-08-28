'use strict';

/**
 * Module dependencies
 */
var foldersPolicy = require('../policies/folders.server.policy'),
  folders = require('../controllers/folders.server.controller');

module.exports = function(app) {
  // Folders Routes
  app.route('/api/projects/:projectId/folders').all(foldersPolicy.isAllowed)
    .get(folders.list)
    .post(folders.create);

  app.route('/api/projects/:projectId/folders/:folderId').all(foldersPolicy.isAllowed)
    .get(folders.read)
    .put(folders.update)
    .delete(folders.delete);

  app.route('/api/projects/:projectId/folders/:folderId/subfolder').all(foldersPolicy.isAllowed)
    .post(folders.createSub);

  // Finish by binding the Folder middleware
  app.param('folderId', folders.folderByID);
};
