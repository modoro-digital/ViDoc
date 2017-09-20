'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Notification = mongoose.model('Notification'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  async = require('async');

/**
 * Create a Notification
 */
exports.create = function(req, res) {
  var notification = new Notification(req.body);
  notification.user = req.user;

  notification.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(notification);
    }
  });
};

/**
 * Show the current Notification
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var notification = req.notification ? req.notification.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  notification.isCurrentUserOwner = req.user && notification.user && notification.user._id.toString() === req.user._id.toString();

  res.jsonp(notification);
};

/**
 * Update a Notification
 */
exports.update = function(req, res) {
  var notification = req.notification;

  notification = _.extend(notification, req.body);

  notification.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(notification);
    }
  });
};
// Update isRead
exports.updateRead = (req, res) => {
  var me = String(req.user._id);
  //console.log(req.body.countNewNotification);
  
  Notification.find({
    users: { $elemMatch: { user: me, read: false }}
  }, (err, notifications) => {
    _.each(notifications,(notification)=>{
      _.each(notification.users,(user)=>{
        if(user.user === me)
        user.read = true;
      });
      notification.save((err,notification)=>{
        console.log(err,notification);
      });
    });

    res.json({
      success: true
    });
  });
   
}
/**
 * Delete an Notification
 */
exports.delete = function(req, res) {
  var notification = req.notification;

  notification.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(notification);
    }
  });
};

/**
 * List of Notifications
 */
exports.list = function(req, res) {
  var me = String(req.user._id);

  async.parallel([
    function(callback) {
      Notification.find({
        users: { $elemMatch: { user: me}}
        //_id: mongoose.Types.ObjectId("59baaf6a1ea123657f5a58f1")
      }, (err, result) => {
            if (err) {
                next(err);
            } else {
              var listAllNotifications = {
                listAllNotifications: result
              }
              callback(null, listAllNotifications);
            }
        }).sort('-created');
    },
    function(callback) {
      Notification.find({
      users: { $elemMatch: { user: me, read: false}}
      //_id: mongoose.Types.ObjectId("59baaf6a1ea123657f5a58f1")
      }, (err, result) => {
            if (err) {
                next(err);
            } else {
              var listAllNotificationsWithReadFalse = {
                listAllNotificationsWithReadFalse: result
              }
              callback(null, listAllNotificationsWithReadFalse);
            }
        }).sort('-created');
    }
  ],
  function(err, results) {
      res.jsonp(results)
  });
};

/**
 * Notification middleware
 */
exports.notificationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Notification is invalid'
    });
  }

  Notification.findById(id).populate('user', 'displayName').exec(function (err, notification) {
    if (err) {
      return next(err);
    } else if (!notification) {
      return res.status(404).send({
        message: 'No Notification with that identifier has been found'
      });
    }
    req.notification = notification;
    next();
  });
};

exports.addNotification = (users, message, user) => {
  var notification = new Notification();
  
  notification.users = users;
  notification.message = message;
  notification.user = user;
  notification.save();
};
