'use strict';

describe('Propiedades E2E Tests:', function () {
  describe('Test Propiedades page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/propiedades');
      expect(element.all(by.repeater('propiedade in propiedades')).count()).toEqual(0);
    });
  });
});
