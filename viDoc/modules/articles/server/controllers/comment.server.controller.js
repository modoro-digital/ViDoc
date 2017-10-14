'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  Comment = mongoose.model('Comment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an comment
 */
exports.create = function (req, res) {
  var comment = new Comment();
  comment.content = req.body.content;
  comment.user = req.user._id;
  comment.article = req.article._id;
  comment.save(err => {
    if (err) {
      return res.send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      let project = req.project;
      project.update = Date.now();
      project.save(err => {
        if (err) {
          return res.send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        let cm = Object.assign({}, comment)._doc;
        cm.user = {
          _id: req.user._id,
          displayName: req.user.displayName,
          profileImageURL: req.user.profileImageURL
        };
        res.json(cm);
      });
    }
  });
};

/**
 * create Subcomment
 */
exports.createSubcomment = function (req, res) {
  var comment = new Comment();
  comment.content = req.body.content;
  comment.user = req.user._id;
  comment.parentComment = req.comment._id;
  comment.save(err => {
    if (err) {
      return res.send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      let parentComment = req.comment;
      parentComment.subcomment += 1;
      parentComment.save(err => {
        if (err) {
          return res.send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        let project = req.project;
        project.update = Date.now();
        project.save(err => {
          if (err) {
            return res.send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          let cm = Object.assign({}, comment)._doc;
          cm.user = {
            _id: req.user._id,
            displayName: req.user.displayName,
            profileImageURL: req.user.profileImageURL
          };
          res.json(cm);
        });
      });
    }
  });
};
/**
 * Update an comment
 */
exports.update = function (req, res) {
  var comment = req.comment;

  comment.isChange = true;
  comment.content = req.body.content;
  if (comment.user.toString() === req.user._id.toString()) {
    comment.save(function (err) {
      if (err) {
        return res.send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        let project = req.project;
        project.update = Date.now();
        project.save(err => {
          if (err) {
            return res.send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          let cm = Object.assign({}, comment)._doc;
          cm.user = {
            _id: req.user._id,
            displayName: req.user.displayName,
            profileImageURL: req.user.profileImageURL
          };
          res.json(cm);
        });
      }
    });
  } else {
    return res.send({
      message: 'User is not authorized'
    });
  }
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var comment = req.comment;
  if (comment.user.toString() === req.user._id.toString() || req.user.roles[0] === 'admin') {
    comment.remove(function (err) {
      if (err) {
        return res.send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (comment.parentComment) {
        Comment.update({ _id: comment.parentComment }, {
          $inc: { subcomment: -1 }
        }, function(err, docs) {
          if (err) {
            return res.send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          let project = req.project;
          project.update = Date.now();
          project.save(err => {
            if (err) {
              return res.send({
                message: errorHandler.getErrorMessage(err)
              });
            }
            res.json(comment);
          });
        });
      } else {
        let project = req.project;
        project.update = Date.now();
        project.save(err => {
          if (err) {
            return res.send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          res.json(comment);
        });
      }
    });
  } else {
    return res.send({
      message: 'User is not authorized'
    });
  }
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Comment.find({ article: req.article._id }).populate([{ path: 'user', select: ['displayName', 'profileImageURL'] }])
    .exec(function (err, comments) {
      if (err) {
        return res.send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json({
          comments: comments,
          users: req.users
        });
      }
    });
};
/**
 * List of Articles
 */
exports.subcommentList = function (req, res) {
  Comment.find({ parentComment: req.comment._id }).populate([{ path: 'user', select: ['displayName', 'profileImageURL'] }])
    .exec(function (err, comments) {
      if (err) {
        return res.send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(comments);
      }
    });
};

/**
 * Article middleware
 */
exports.commentByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.send({
      message: 'comment is invalid'
    });
  }
  Comment.findById(id).exec(function (err, comment) {
    if (err) {
      return next(err);
    } else if (!comment) {
      return res.send({
        message: 'No comment with that identifier has been found'
      });
    }
    req.comment = comment;
    next();
  });
};
