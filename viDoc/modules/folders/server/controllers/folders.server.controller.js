'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Folder = mongoose.model('Folder'),
  Article = mongoose.model('Article'),
  Project = mongoose.model('Project'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Folder
 */
exports.create = function(req, res) {
  var folder = new Folder(req.body);
  folder.user = req.user._id;
  folder.project = req.project._id;

  folder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      let project = req.project;
      project.update = Date.now();
      project.folders.push(folder._id);
      project.save(err => {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        res.jsonp({
          _id: folder._id,
          name: folder.name,
          parentfolder: folder.parentfolder,
          project: {
            _id: project._id,
            name: project.name
          }
        });
      });
    }
  });
};

/**
 * Create a subFolder
 */
exports.createSub = function(req, res) {
  var subFolder = new Folder(req.body);
  subFolder.user = req.user._id;
  subFolder.parentfolder = req.folder._id;

  subFolder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var folder = req.folder;
      folder.subfolders.push(subFolder._id);
      folder.save(err => {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        let project = req.project;
        project.update = Date.now();
        project.save((err) => {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          res.jsonp({
            _id: subFolder._id,
            name: subFolder.name,
            parentfolder: subFolder.parentfolder,
            project: {
              _id: project._id,
              name: project.name
            }
          });
        });
      });
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
  Article.find({ _id: folder.articles }, { 'created': 1, 'title': 1, 'user': 1 }).sort('-created')
    .populate('user', 'displayName').exec(function(err, articles) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        Folder.find({ _id: folder.subfolders }, { name: 1, articles: 1, subfolders: 1 }).sort('-created')
          .exec(function(err, subfolders) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
            res.jsonp({
              _id: folder._id,
              name: folder.name,
              description: folder.description,
              parentfolder: folder.parentfolder,
              project: folder.project,
              articles: articles,
              subfolders: subfolders
            });
          });
      }
    });
};

/**
 * Update a Folder
 */
exports.update = function(req, res) {
  let folder = req.folder;
  let project = req.project;

  folder = _.extend(folder, req.body);

  folder.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      project.update = Date.now();
      project.save(err => {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        res.jsonp({
          _id: folder._id,
          name: folder.name,
          parentfolder: folder.parentfolder,
          project: {
            _id: project._id,
            name: project.name
          }
        });
      });
    }
  });
};

/**
 * Delete an Folder
 */
exports.delete = function(req, res) {
  var folder = req.folder;
  var project = req.project;

  folder.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (folder.parentfolder) {
        Folder.updateOne({ _id: folder.parentfolder }, {
          $pull: { subfolders: folder._id }
        }, function (err, parentfolder) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          project.update = Date.now();
          project.save(err => {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
            res.jsonp(folder);
          });
        });
      } else {
        project.folders.splice(project.folders.indexOf(folder._id), 1);
        project.update = Date.now();
        project.save(err => {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          res.jsonp(folder);
        });
      }
    }
  });
};

/**
 * List of Folders
 */
exports.list = function(req, res) {
  Folder.find().sort('-update').populate('user', 'displayName').exec(function(err, folders) {
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
    .populate([{ path: 'user', select: 'displayName' }, { path: 'project', select: 'name' }]).exec(function (err, folder) {
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
