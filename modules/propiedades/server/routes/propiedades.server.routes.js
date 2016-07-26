'use strict';

/**
 * Module dependencies
 */
var propiedadesPolicy = require('../policies/propiedades.server.policy'),
  propiedades = require('../controllers/propiedades.server.controller');

module.exports = function(app) {
  // Propiedades Routes
  app.route('/api/propiedades').all(propiedadesPolicy.isAllowed)
    .get(propiedades.list)
    .post(propiedades.create);

  app.route('/api/propiedades/:propiedadeId').all(propiedadesPolicy.isAllowed)
    .get(propiedades.read)
    .put(propiedades.update)
    .delete(propiedades.delete);

  // Finish by binding the Propiedade middleware
  app.param('propiedadeId', propiedades.propiedadeByID);
};
