'use strict';

describe('Controller: HellocontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('yeomanGeneratedProjectApp'));

  var HellocontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HellocontrollerCtrl = $controller('HellocontrollerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HellocontrollerCtrl.awesomeThings.length).toBe(3);
  });
});
