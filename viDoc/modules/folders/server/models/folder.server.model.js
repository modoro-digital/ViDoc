'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Folder Schema
 */
var FolderSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    trim: true
  },
  projectId: {
    type: String
  },
  articles: {
    type: Array
  },
  folders: {
    type: Array,
    default: []
  },
  userId: {
    type: String
  }
});

mongoose.model('Folder', FolderSchema);
