(function () {
  'use strict';

  angular
    .module('propiedades')
    .controller('PropiedadesListController', PropiedadesListController);

  PropiedadesListController.$inject = ['PropiedadesService'];

  function PropiedadesListController(PropiedadesService) {
    var vm = this;

    vm.propiedades = PropiedadesService.query();
  }
})();
