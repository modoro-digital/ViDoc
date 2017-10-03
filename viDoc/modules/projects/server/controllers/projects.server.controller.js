'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Project = mongoose.model('Project'),
  Notification = mongoose.model('Notification'),
  Article = mongoose.model('Article'),
  Folder = mongoose.model('Folder'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  addNotificationFunction = require(path.resolve('./modules/notifications/server/controllers/notifications.server.controller')),
  _ = require('lodash');

/**
 * Create a Project
 */
exports.create = function(req, res) {
  var project = new Project(req.body);
  project.user = req.user._id;

  project.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var users = [],
        message = "You were added on " + project.name + " project",
        user = project.user._id;

      project.users.map( (elem) => {
        users.push({user: elem})
      });
      addNotificationFunction.addNotification(users, message, user);
      res.jsonp(project);
    }
  });

};

/**
 * Show the current Project
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var project = req.project ? req.project.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  project.isCurrentUserOwner = req.user && project.user && project.user._id.toString() === req.user._id.toString();
  Folder.find({ _id: project.folders }, { name: 1, articles: 1, subfolders: 1 }).exec(function (err, folders) {
    if (err) {
      return res.status(404).send({
        message: 'No Folder with that identifier has been found'
      });
    }
    Article.find({ _id: project.articles }, { 'created': 1, 'title': 1, 'user': 1 }).sort('-created')
      .populate('user', 'displayName').exec(function (err, articles) {
        if (err) {
          return res.status(404).send({
            message: 'No Folder with that identifier has been found'
          });
        }
        res.jsonp({
          _id: project._id,
          name: project.name,
          description: project.description,
          users: project.users,
          folders: folders,
          articles: articles
        });
      });
  });
};

/**
 * Update a Project
 */
exports.update = function(req, res) {
  var project = req.project;

  project = _.extend(project, req.body);
  project.update = Date.now();

  project.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(project);
    }
  });
};

/**
 * Delete an Project
 */
exports.delete = function(req, res) {
  var project = req.project;

  project.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(project);
    }
  });
};

/**
 * List of Projects
 */
exports.list = function(req, res) {
  if (req.user.roles[0] === 'admin') {
    Project.find().sort('-update').populate({ path: 'user', select: ['displayName', 'profileImageURL'] })
      .exec(function(err, projects) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(projects);
        }
      });
  } else {
    var id = req.user._id.toString();
    Project.find({ users: id }).sort('-update')
      .populate({ path: 'user', select: ['displayName', 'profileImageURL'] }).exec(function(err, projects) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(projects);
        }
      });
  }
};

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) {

  Project.findById(id).populate('user', 'displayName').exec(function (err, project) {
    if (err) {
      return next(err);
    } else if (!project) {
      return res.status(404).send({
        message: 'No Project with that identifier has been found'
      });
    }
    if (project.users.indexOf(req.user._id) === -1 && req.user.roles[0] !== 'admin') {
      return res.status(404).send({
        message: 'User is not authorized'
      });
    }
    User.find({
      $or: [{
        roles: "admin"
      }, {
        _id: project.users
      }]
    }, (err, users) => {
      req.users = users;
      req.project = project;
      next();
    });
  });
};