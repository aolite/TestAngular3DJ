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
        var Radix2Bar= (radix *.75)*2

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

        var gRads = svg.append('g').attr('id','rads');
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

        //Print the lateral bar...

        var desglose = svg.append('g')
          .attr('id', 'desglose_grupo')
          .attr('transform', 'translate(' + (centerX + radix + 100) + ',' + (centerY - (radix * .75)) + ')')
          .attr('opacity', 0);

        desglose.append('rect')
          .attr('y', Radix2Bar + 20)
          .attr('width', 165)
          .attr('height', 3)
          .attr('fill', '#3C3C3C');

        var fechaBloque = desglose.append('text')
          .text("hoy")
          .attr('y', Radix2Bar + 39)
          .attr('text-anchor', 'start')
          .style('font-size', '14')
          .style('font-family', 'Roboto Slab, Helvetica Neue, Helvetica, sans-serif')
          .attr('fill', '#666');

        var  horaBloque = desglose.append('text')
          .text("21:00h")
          .attr('y', Radix2Bar + 62)
          .attr('text-anchor', 'start')
          .style('font-size', '27')
          .style('font-family', 'Roboto Slab, Helvetica Neue, Helvetica, sans-serif')
          .attr('fill', '#666');

        var desgloseBloqueRenovable = desglose.append('g');

        var altoRenovables = desgloseBloqueRenovable.append('rect')
          .attr('x', -8)
          .attr('width', 2)
          .attr('height', 200)
          .attr('fill', '#669C83');

        var textoRenovables = desgloseBloqueRenovable.append('text')
          .text("--")
          .attr('text-anchor', 'middle')
          .style('font-size', '13')
          .style('font-family', 'Roboto Slab, Helvetica Neue, Helvetica, sans-serif')
          .attr('fill', '#669C83')
          .attr('x', -100)
          .attr('y', -12)
          .attr('transform', 'rotate(-90)');


        //

        var tooltipWidth = 120;
        var tooltipHeight = 28;
        var currentTooltipFormat;
        var tooltip = svg.append('g').attr('id', 'dem-tooltip').attr('opacity', 0);
        var tooltip_shadow = tooltip.append('rect')
          .attr({
            'width': tooltipWidth + 4,
            'height': tooltipHeight + 4,
            'fill': 'black',
            'fill-opacity': .15
          });

        var tooltip_rect = tooltip.append('rect')
          .attr({
            'width': tooltipWidth,
            'height': tooltipHeight
          });

        var tooltip_fecha = tooltip.append('text')
          .attr('id', 'fecha')
          .attr('x', 5)
          .attr('y', 11)
          .attr('text-anchor', 'start')
          .style('font-size', '11')
          .style('font-family', 'Roboto Slab, Helvetica Neue, Helvetica, sans-serif')
          .style('fill', 'black')
          .style('fill-opacity', .75);

        var tooltip_mw = tooltip.append('text')
          .text('')
          .attr('x', 15)
          .attr('y', 24)
          .style('font-size', '13')
          .style('font-family', 'Roboto Slab, Helvetica Neue, Helvetica, sans-serif')
          .style('fill', 'white');

      }
    };

    function grades2Rad (grades){
      return (Math.PI/180)*grades;
    }

    function rd3 (max, data, measure){
      var mx =+ max;
      var med = (measure)? measure: 100;

      return (data*med)/mx;
    }

    function printLateralBar (){

    }


  });
