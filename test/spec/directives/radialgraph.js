'use strict';

describe('Directive: radialGraph', function () {

  // load the directive's module
  beforeEach(module('yeomanGeneratedProjectApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<radial-graph></radial-graph>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the radialGraph directive');
  }));
});
