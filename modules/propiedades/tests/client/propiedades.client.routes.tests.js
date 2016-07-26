(function () {
  'use strict';

  describe('Propiedades Route Tests', function () {
    // Initialize global variables
    var $scope,
      PropiedadesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PropiedadesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PropiedadesService = _PropiedadesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('propiedades');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/propiedades');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          PropiedadesController,
          mockPropiedade;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('propiedades.view');
          $templateCache.put('modules/propiedades/client/views/view-propiedade.client.view.html', '');

          // create mock Propiedade
          mockPropiedade = new PropiedadesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Propiedade Name'
          });

          //Initialize Controller
          PropiedadesController = $controller('PropiedadesController as vm', {
            $scope: $scope,
            propiedadeResolve: mockPropiedade
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:propiedadeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.propiedadeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            propiedadeId: 1
          })).toEqual('/propiedades/1');
        }));

        it('should attach an Propiedade to the controller scope', function () {
          expect($scope.vm.propiedade._id).toBe(mockPropiedade._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/propiedades/client/views/view-propiedade.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PropiedadesController,
          mockPropiedade;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('propiedades.create');
          $templateCache.put('modules/propiedades/client/views/form-propiedade.client.view.html', '');

          // create mock Propiedade
          mockPropiedade = new PropiedadesService();

          //Initialize Controller
          PropiedadesController = $controller('PropiedadesController as vm', {
            $scope: $scope,
            propiedadeResolve: mockPropiedade
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.propiedadeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/propiedades/create');
        }));

        it('should attach an Propiedade to the controller scope', function () {
          expect($scope.vm.propiedade._id).toBe(mockPropiedade._id);
          expect($scope.vm.propiedade._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/propiedades/client/views/form-propiedade.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PropiedadesController,
          mockPropiedade;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('propiedades.edit');
          $templateCache.put('modules/propiedades/client/views/form-propiedade.client.view.html', '');

          // create mock Propiedade
          mockPropiedade = new PropiedadesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Propiedade Name'
          });

          //Initialize Controller
          PropiedadesController = $controller('PropiedadesController as vm', {
            $scope: $scope,
            propiedadeResolve: mockPropiedade
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:propiedadeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.propiedadeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            propiedadeId: 1
          })).toEqual('/propiedades/1/edit');
        }));

        it('should attach an Propiedade to the controller scope', function () {
          expect($scope.vm.propiedade._id).toBe(mockPropiedade._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/propiedades/client/views/form-propiedade.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
