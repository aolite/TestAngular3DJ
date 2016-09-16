'use strict';

/**
 * @ngdoc directive
 * @name yeomanGeneratedProjectApp.directive:radialGraph
 * @description
 * # radialGraph
 */
angular.module('app')
  .directive('radialGraph', function () {
    return {
      template: '',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {


        var energyCategories = {
          'light':{
            'category': "Consumption"
          },

          'electricity':{
            'category': "Consumption"
          },

          'pv':{
            'category': "Saving"
          }
        };
        var energyConsumptionData = {

          'light':{
            'dayAverage': 1000,
            'percentageDay': [],
            'objective':[]
          },

          'electricity':{
            'dayAverage': 1000,
            'percentageDay': [],
            'objective':[]
          },

          'pv':{
            'dayAverage': 1000,
            'percentageDay': [],
            'objective':[]
          },

          'tv':{
            'dayAverage': 1000,
            'percentageDay': [],
            'objective':[]
          },

          'objective':[]

        };

        var jsonData = randomEnergyData ()
        console.log(jsonData [0])
        energyConsumptionData= parseJSONData(jsonData,energyConsumptionData);

        console.log (energyConsumptionData);

        element.text('this is the radialGraph directive');

        //Create the graph place

        var canvasWidth = 960;
        var canvasHeight = 600;
        var radix = 250;
        var centerX = canvasWidth * .4;
        var centerY = canvasHeight / 2;
        var hourRadix = radix + 12;
        var totalHours = 24;
        var rotationHours=0;
        var Radix2Bar= (radix *.75)*2;
        var isoDateFormat = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

        var min = Math.min(canvasWidth, canvasHeight);
        var svg = d3.select(element[0]).append('svg')
          .attr({width: canvasWidth, height: canvasHeight});

        //Create a rectangle for place the graph
        svg.append('rect')
          .attr('id', 'bg')
          .attr({
            'x': 0,
            'y': 0,
            'width': canvasWidth,
            'height': canvasHeight,
            'fill': '#2f2f2f'
          });

        //Create a <g id='base'> inside the svg.
        var gBase = svg.append('g').attr('id', 'base');

        //Place a circle to create the graph
        gBase.append('circle')
          .attr('id', 'circleBG')
          .attr('r', radix)
          .attr('cx', centerX)
          .attr('cy', centerY)
          .attr('fill', '#222222');

        //Create a <g id='horas'> inside the svg.
        var gHoras= svg.append('g').attr('id', 'horas')
          .attr('transform', 'translate(' + centerX + ',' + centerY + ')');

        var hoursRotation = d3.scale.linear()
          .domain([0, 24 * 60])
          .range([0, 360]);


        var gDashedCircle = svg.append('g').attr('id','consumption');

        gDashedCircle.append('circle')
          .attr('r', radix)
          .attr('cx', centerX)
          .attr('cy', centerY)
          .attr('stroke', '#990000')
          .attr('fill', 'none')
          .attr('stroke-dasharray', 3)
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0);


        var gConsumption = svg.append('g').attr('id','dottedConsumption');

        gConsumption.append('circle')
          .attr('r', 5)
          .attr('cx', -9999)
          .attr('cy', -9999)
          .attr('stroke', 'none')
          .attr('fill', '#900');

        var today = new Date();
        var currentHourRotation = hoursRotation(60*today.getHours()+today.getMinutes());


        //Place in svg a small circle to see the current time...
        var circleHour = svg.append('circle')
          .attr('id', 'circleHour')
          .attr('r', 3)
          .attr('cx', centerX + (radix + 12) * Math.sin(grades2Rad(180 + 360 - currentHourRotation)))
          .attr('cy', centerY + (radix + 12) * Math.cos(grades2Rad(180 + 360 - currentHourRotation)))
          .attr('stroke-width', '2')
          .attr('stroke', '#BCD5D5')
          .attr('fill', '#BCD5D5');

        //Make a transition to create a parpadeness for the clock
        var clockTimer = setInterval(function() {

          var date = new Date(),
            currentHourRotation = hoursRotation((60 * date.getHours()) + date.getMinutes()),
            calc = grades2Rad(180 + 360 - currentHourRotation);

          circleHour.transition()
            .attr('cx', centerX + hourRadix * Math.sin(calc))
            .attr('cy', centerY + hourRadix * Math.cos(calc))
            .attr('r', function() {
              return ((circleHour.attr('r') != 3) ? 3 : 1);
            });
        }, 1000);

        //Place and print the different 'Hour Text'

        for (var nHours = 0; nHours < totalHours; nHours++) {
          rotationHours = 180 - (360 / totalHours) * nHours;
          gHoras.append('text')
            .text(((nHours > 9) ? nHours : "0" + nHours) + ':00')
            .attr('x', (radix + 33) * Math.sin(grades2Rad(rotationHours)))
            .attr('y', (radix + 33) * Math.cos(grades2Rad(rotationHours)) + 7)
            .attr('text-anchor', 'middle')
            .style('font-size', '14')
            .style('font-family', 'Roboto Slab, Helvetica Neue, Helvetica, sans-serif')
            .style('fill', '#666')
        }

        // Print the consumption values for each of the hours.

        var gConsumptionValues = svg.append('g').attr('id', 'consumptionBars');

        //Draw the mouse as a circle
        var groupCircle = svg.append('g').attr('id','consumption'),
            consumptionCircle = groupCircle.append ('circle')
              .attr('r', radix)
              .attr('cx', centerX)
              .attr('cy', centerY)
              .attr('stroke', '#990000')
              .attr('fill', 'none')
              .attr('stroke-dasharray', 3)
              .attr('stroke-width', 2)
              .attr('stroke-opacity', 0);

        var consumptionGroup = svg.append('g').attr('id', 'consumo-dot'),
            consumoDot = consumptionGroup.append('circle')
              .attr('r', 5)
              .attr('cx', -9999)
              .attr('cy', -9999)
              .attr('stroke', 'none')
              .attr('fill', '#900');


        var grupoHoras = d3.select("svg #horas")
          .attr('transform', 'translate(' + centerX + ',' + centerY + ')');

        //introduce the data values and convert it into bars...

        var consumptionBars = svg.select('#consumptionBars').selectAll('.rad')
          .data(jsonData, function (d){
            return d.timeStamp;
          });

        consumptionBars.enter().append('g')
          .attr ('class','rad')
          .attr ('id', function (d){
            var tStamp = isoDateFormat.parse(d.timeStamp);
            return ['id-' , tStamp.getHours() , ':' , tStamp.getMinutes() , '-dia-' , tStamp.getDate()].join("");
          });

        consumptionBars.each(function(d,i){
          var paths = d3.select(this).selectAll('path');

        });

      }
    };

    // Function that returns the data filled with random values. Just for testing purposes.

    function randomEnergyData (){
      //{"light":4087,"electricity":5075,"tv":2441, "pv":100, "objective":1200, "timeStamp":"2016-09-16T08:30:00.000Z"}

      var todayDate = new Date ();

      var jsonData = [
        /*{
          "light": 0,
          "electricity": 0,
          "tv": 0,
          "pv":0,
          "timeStamp": todayDate.toISOString()
        }*/
      ];

      var obj = {};

      for (var i=0; i< 24*6; i++){
        obj.light= Math.random()*100;
        obj.electricity= Math.random()*100;
        obj.tv= Math.random()*100;
        obj.pv= Math.random()*100;
        obj.objective= Math.random()*100;

        obj.timeStamp= todayDate.toISOString();

        jsonData.push(obj);
        obj={};
        todayDate =  new Date(todayDate.getTime() - (10*60*1000))
      }

      return jsonData;
    }

    // This function permit to format JSON incoming information into the desirable variables for D3.js
    function parseJSONData (jsonData,energyConsumptionData ){

      /*

       var energyConsumptionData = {

       'light':{
       'dayAverage': 1000,
       'percentageDay': [],
       },

       'electricity':{
       'dayAverage': 1000,
       'percentageDay': [],

       },

       'tv':{
       'dayAverage': 1000,
       'percentageDay': [],
       },

       'pv':{
       'dayAverage': 1000,
       'percentageDay': [],
       }

       'objective':[]
       };
       */
      for (var elem in jsonData){
        energyConsumptionData.light.percentageDay.push(jsonData[elem].light);
        energyConsumptionData.electricity.percentageDay.push(jsonData[elem].electricity);
        energyConsumptionData.tv.percentageDay.push(jsonData[elem].tv);
        energyConsumptionData.pv.percentageDay.push(jsonData[elem].pv);
        energyConsumptionData.objective.push(jsonData[elem].objective);
      }

      console.log(energyConsumptionData);
      return energyConsumptionData;
    }

    function grades2Rad (grades){
      return (Math.PI/180)*grades;
    }

    function rd3 (max, data, measure){
      var mx =+ max;
      var med = (measure)? measure: 100;

      return (data*med)/mx;
    }


  });
