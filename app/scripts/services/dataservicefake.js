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

      var broadcastMessage = function (data){
        $rootScope.$broadcast('dataService-received-data-event',{
          'data':data
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



    // Public API here
    return {

    };
  }]);
