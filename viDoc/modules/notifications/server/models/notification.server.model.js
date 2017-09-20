'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Notification Schema
 */
var NotificationSchema = new Schema({
  message: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  users: [
    {
      user: {
        type: String,
        default: ''
      },
      read: {
        type: Boolean,
        default: false
      }
    }
  ],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Notification', NotificationSchema);
