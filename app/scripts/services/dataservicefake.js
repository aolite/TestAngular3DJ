'use strict';

/**
 * @ngdoc service
 * @name yeomanGeneratedProjectApp.dataServiceFAKE
 * @description
 * # dataServiceFAKE
 * Factory in the yeomanGeneratedProjectApp.
 */
angular.module('dataServiceFAKE',[])
  .factory('dataService', [
    '$rootScope',
    '$http',
    function ($rootScope,$http) {
      // Service logic
      // ...
      var data = [30,40,50,60];
      var personalPercentage = 50;
      var neighbourPercentage = 50;
      var communityPercentage = 50;

      var broadcastMessage = function (data){
        $rootScope.$broadcast('dataService-received-data-event',{
          'data':data
        });
      };

      var broadcastPercentageMessage= function (personalpercentage, neighbourpercentage, communityPercentage){

        $rootScope.$broadcast('dataService-received-dataPercentage-event',{
          'personalPercentage':personalpercentage,
          'neighbourpercentage': neighbourpercentage,
          'communityPercentage':communityPercentage
        });

      };

      setInterval(function(){

        $http.get('resources/donut-data.json').success(function(response){

          //manipulation of the service response...
          data = response.map(function(d){ return d * Math.random(); });

          broadcastMessage(data);
        }).error(function(err){
          throw err;
        });
      }, 1000);

      setInterval(function(){

        $http.get('resources/donut-data.json').success(function(response){

          response=0;
          //manipulation of the service response...
          personalPercentage = Math.floor((Math.random() * 100));
          neighbourPercentage = Math.floor((Math.random() * 100));
          communityPercentage = Math.floor((Math.random() * 100));

          broadcastPercentageMessage(personalPercentage,neighbourPercentage,communityPercentage);

        }).error(function(err){
          throw err;
        });
      }, 5000);





    // Public API here
    return {

    };
  }]);
