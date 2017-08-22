'use strict';

/**
 * Module dependencies
 */
var foldersPolicy = require('../policies/folders.server.policy'),
  folders = require('../controllers/folders.server.controller');

module.exports = function(app) {
  // Folders Routes
  app.route('/api/folders').all(foldersPolicy.isAllowed)
    .get(folders.list)
    .post(folders.create);

  app.route('/api/folders/:folderId').all(foldersPolicy.isAllowed)
    .get(folders.read)
    .put(folders.update)
    .delete(folders.delete);

  // Finish by binding the Folder middleware
  app.param('folderId', folders.folderByID);
};
