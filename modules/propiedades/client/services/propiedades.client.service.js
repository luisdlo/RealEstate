//Propiedades service used to communicate Propiedades REST endpoints
(function () {
  'use strict';

  angular
    .module('propiedades')
    .factory('PropiedadesService', PropiedadesService);

  PropiedadesService.$inject = ['$resource'];

  function PropiedadesService($resource) {
    return $resource('api/propiedades/:propiedadeId', {
      propiedadeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
