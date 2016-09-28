'use strict';

/**
 * @ngdoc function
 * @name yeomanGeneratedProjectApp.controller:RadialgraphcontrollerCtrl
 * @description
 * # RadialgraphcontrollerCtrl
 * Controller of the yeomanGeneratedProjectApp
 */
angular.module('chartModule')
  .controller('RadialgraphcontrollerCtrl', ['$scope',function ($scope) {
    $scope.$on ('dataService-received-energyData-event', function (evt, data){
      $scope.energyData = data;

    });

  }]);
