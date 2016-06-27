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

        var width = 300;
        var height = 300;
        var min = Math.min(width, height);
        var svg = d3.select(element[0]).append('svg');

        var arc = d3.svg.arc()
          .outerRadius(min / 2 * 0.9)
          .innerRadius(min / 2 * 0.5);

        //pie.value(function(d){ return d.value; });
        svg.attr({width: width, height: height});

        var g = svg.append('g')
          // center the donut chart
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        g.append('circle')
          .attr('cx', 30)
          .attr('cy', 30)
          .attr('r',50);


      }
    };
  });
