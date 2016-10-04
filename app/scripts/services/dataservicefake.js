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

      var broadcastEnergyData = function (jsonData){

        /* Data format for the json
          {
            "light": 0,
            "electricity": 0,
            "tv": 0,
            "pv":0,
            "demand":0,
            "objective":0,
            "timeStamp": todayDate.toISOString()
          }
         */
        $rootScope.$broadcast("dataService-received-energyData-event",jsonData);
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

      setInterval(function(){

        $http.get('resources/donut-data.json').success(function(response){

          response=0;

          //manipulation of the service response...
          var obj = {};
          var todayDate = new Date ();

          var jsonData = [
            /*{
             "light": 0,
             "electricity": 0,
             "tv": 0,
             "pv":0,
             "demand:0"
             "timeStamp": todayDate.toISOString()
             }*/
          ];

          for (var i=0; i< 24*6; i++){
            obj.light= Math.random()*2000;
            obj.electricity= Math.random()*2000;
            obj.tv= Math.random()*300;
            obj.pv= Math.random()*1000;
            obj.demand= obj.light+obj.electricity+obj.tv;
            obj.objective= Math.random()*100;

            obj.timeStamp= todayDate.toISOString();

            jsonData.push(obj);
            obj={};
            todayDate =  new Date(todayDate.getTime() - (10*60*1000))
          }

          console.log("sendJSON:", jsonData);
          broadcastEnergyData(jsonData);

        }).error(function(err){
          throw err;
        });
      }, 10000);


    // Public API here
    return {

    };
  }]);
