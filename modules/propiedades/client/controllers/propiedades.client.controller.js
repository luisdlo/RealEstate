(function () {
  'use strict';

  // Propiedades controller
  angular
    .module('propiedades')
    .controller('PropiedadesController', PropiedadesController);

  PropiedadesController.$inject = ['$scope', '$state', 'Authentication', 'propiedadeResolve'];

  function PropiedadesController ($scope, $state, Authentication, propiedade) {
    var vm = this;

    vm.authentication = Authentication;
    vm.propiedade = propiedade;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Propiedade
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.propiedade.$remove($state.go('propiedades.list'));
      }
    }

    // Save Propiedade
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.propiedadeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.propiedade._id) {
        vm.propiedade.$update(successCallback, errorCallback);
      } else {
        vm.propiedade.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('propiedades.view', {
          propiedadeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
