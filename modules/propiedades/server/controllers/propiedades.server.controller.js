'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Propiedade = mongoose.model('Propiedade'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Propiedade
 */
exports.create = function(req, res) {
  var propiedade = new Propiedade(req.body);
  propiedade.user = req.user;

  propiedade.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(propiedade);
    }
  });
};

/**
 * Show the current Propiedade
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var propiedade = req.propiedade ? req.propiedade.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  propiedade.isCurrentUserOwner = req.user && propiedade.user && propiedade.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(propiedade);
};

/**
 * Update a Propiedade
 */
exports.update = function(req, res) {
  var propiedade = req.propiedade ;

  propiedade = _.extend(propiedade , req.body);

  propiedade.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(propiedade);
    }
  });
};

/**
 * Delete an Propiedade
 */
exports.delete = function(req, res) {
  var propiedade = req.propiedade ;

  propiedade.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(propiedade);
    }
  });
};

/**
 * List of Propiedades
 */
exports.list = function(req, res) { 
  Propiedade.find().sort('-created').populate('user', 'displayName').exec(function(err, propiedades) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(propiedades);
    }
  });
};

/**
 * Propiedade middleware
 */
exports.propiedadeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Propiedade is invalid'
    });
  }

  Propiedade.findById(id).populate('user', 'displayName').exec(function (err, propiedade) {
    if (err) {
      return next(err);
    } else if (!propiedade) {
      return res.status(404).send({
        message: 'No Propiedade with that identifier has been found'
      });
    }
    req.propiedade = propiedade;
    next();
  });
};
