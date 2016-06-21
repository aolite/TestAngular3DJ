'use strict';

describe('Controller: DonutCtrl', function () {

  // load the controller's module
  beforeEach(module('yeomanGeneratedProjectApp'));

  var DonutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DonutCtrl = $controller('DonutCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DonutCtrl.awesomeThings.length).toBe(3);
  });
});
