'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var CommentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  isChange: {
    type: Boolean,
    default: false
  },
  article: {
    type: String
  },
  parentComment: {
    type: String
  },
  subcomment: {
    type: Number,
    default: 0
  }
});

mongoose.model('Comment', CommentSchema);
