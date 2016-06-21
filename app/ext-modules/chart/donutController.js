'use strict';

/**
 * @ngdoc function
 * @name yeomanGeneratedProjectApp.controller:DonutCtrl
 * @description
 * # DonutCtrl
 * Controller of the yeomanGeneratedProjectApp
 */
angular.module('chartModule')
  .controller('DonutCtrl', ['$scope','$http', '$interval', function ($scope, $http, $interval){
    /*d3.json('resources/donut-data.json', function(err, data){
     if(err)
     {
     throw err;
     }
     $scope.data = data;
     console.log(data);
     $scope.$apply();
     });*/

    $interval(function(){
      $http.get('resources/donut-data.json').success(function(response){
        console.log(response);
        var data = response.map(function(d){ return d * Math.random() });
        console.log(data);
        $scope.data = data;
      }).error(function(err){
        throw err;
      });
    }, 1000);
  }]);
