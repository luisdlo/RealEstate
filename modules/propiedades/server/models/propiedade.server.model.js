'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Propiedade Schema
 */
var PropiedadeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Propiedade name',
    trim: true
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

mongoose.model('Propiedade', PropiedadeSchema);
