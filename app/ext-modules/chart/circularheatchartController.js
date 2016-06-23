'use strict';

/**
 * @ngdoc function
 * @name yeomanGeneratedProjectApp.controller:CircularheatchartCtrl
 * @description
 * # CircularheatchartCtrl
 * Controller of the yeomanGeneratedProjectApp
 */
angular.module('chartModule')
  .controller('CircularheatchartCtrl', ['$scope',function ($scope) {
    $scope.$on ('dataService-received-dataPercentage-event', function (evt, data){
      $scope.data = data;

    });

  }]);
