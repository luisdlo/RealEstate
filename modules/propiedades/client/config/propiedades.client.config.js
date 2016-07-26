(function () {
  'use strict';

  angular
    .module('propiedades')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Propiedades',
      state: 'propiedades',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'propiedades', {
      title: 'List Propiedades',
      state: 'propiedades.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'propiedades', {
      title: 'Create Propiedade',
      state: 'propiedades.create',
      roles: ['user']
    });
  }
})();
