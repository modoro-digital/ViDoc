'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Folder = mongoose.model('Folder'),
  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Folder
 */
exports.create = function(req, res) {
  var folder = new Folder(req.body);
  folder.user = req.user;
  folder.project = req.project || req.user;

  folder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(folder);
    }
  });
};

/**
 * Show the current Folder
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var folder = req.folder ? req.folder.toJSON() : {};

  // Add a custom field to the Folder, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Folder model.
  folder.isCurrentUserOwner = req.user && folder.user && folder.user._id.toString() === req.user._id.toString();
  Article.find({ _id: folder.articles }).sort('-created').populate('user', 'displayName').exec(function(err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      folder.articles = articles;
      res.jsonp(folder);
    }
  });
};

/**
 * Update a Folder
 */
exports.update = function(req, res) {
  var folder = req.folder;

  folder = _.extend(folder, req.body);

  folder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(folder);
    }
  });
};

/**
 * Delete an Folder
 */
exports.delete = function(req, res) {
  var folder = req.folder;

  folder.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(folder);
    }
  });
};

/**
 * List of Folders
 */
exports.list = function(req, res) {
  Folder.find().sort('-created').populate('user', 'displayName').exec(function(err, folders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(folders);
    }
  });
};

/**
 * Folder middleware
 */
exports.folderByID = function(req, res, next, id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    Folder.findById(id)
    .populate('user', 'displayName').exec(function (err, folder) {
      if (err) {
        return next(err);
      } else if (!folder) {
        return res.status(404).send({
          message: 'No article with that identifier has been found'
        });
      }
      req.folder = folder;
      next();
    });
  } else {
    var name = id.replace(/-/gi, ' ');
    Folder.findOne({ name: { $regex: name, $options: 'i' } }).populate('user', 'displayName').exec(function (err, folder) {
      if (err) {
        return next(err);
      } else if (!folder) {
        return res.status(404).send({
          message: 'No Folder with that identifier has been found'
        });
      }
      req.folder = folder;
      next();
    });
  }
};
