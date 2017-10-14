'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config'));

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Project name',
    trim: true
  },
  folders: {
    type: Array,
    default: []
  },
  articles: {
    type: Array,
    default: []
  },
  tag: {
    type: Array,
    default: []
  },
  users: {
    type: Array,
    default: []
  },
  description: {
    type: String,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  },
  update: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Project', ProjectSchema);


