'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
    folders :{
        type: Array,
        default: []
},
    articles :{
        type : String,
        default:[]
    },
    tag:{
         type: String,
          default: []
    },
    userID :{
        type: Schema.ObjectId,
        default: []
    },
    description :{
        type: String,
        default: []
    },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Project', ProjectSchema);
