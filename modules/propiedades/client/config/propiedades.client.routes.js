(function () {
  'use strict';

  angular
    .module('propiedades')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('propiedades', {
        abstract: true,
        url: '/propiedades',
        template: '<ui-view/>'
      })
      .state('propiedades.list', {
        url: '',
        templateUrl: 'modules/propiedades/client/views/list-propiedades.client.view.html',
        controller: 'PropiedadesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Propiedades List'
        }
      })
      .state('propiedades.create', {
        url: '/create',
        templateUrl: 'modules/propiedades/client/views/form-propiedade.client.view.html',
        controller: 'PropiedadesController',
        controllerAs: 'vm',
        resolve: {
          propiedadeResolve: newPropiedade
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Propiedades Create'
        }
      })
      .state('propiedades.edit', {
        url: '/:propiedadeId/edit',
        templateUrl: 'modules/propiedades/client/views/form-propiedade.client.view.html',
        controller: 'PropiedadesController',
        controllerAs: 'vm',
        resolve: {
          propiedadeResolve: getPropiedade
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Propiedade {{ propiedadeResolve.name }}'
        }
      })
      .state('propiedades.view', {
        url: '/:propiedadeId',
        templateUrl: 'modules/propiedades/client/views/view-propiedade.client.view.html',
        controller: 'PropiedadesController',
        controllerAs: 'vm',
        resolve: {
          propiedadeResolve: getPropiedade
        },
        data:{
          pageTitle: 'Propiedade {{ articleResolve.name }}'
        }
      });
  }

  getPropiedade.$inject = ['$stateParams', 'PropiedadesService'];

  function getPropiedade($stateParams, PropiedadesService) {
    return PropiedadesService.get({
      propiedadeId: $stateParams.propiedadeId
    }).$promise;
  }

  newPropiedade.$inject = ['PropiedadesService'];

  function newPropiedade(PropiedadesService) {
    return new PropiedadesService();
  }
})();
