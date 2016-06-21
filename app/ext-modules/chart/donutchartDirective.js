'use strict';

/**
 * @ngdoc directive
 * @name yeomanGeneratedProjectApp.directive:donutChart
 * @description
 * # donutChart
 */
angular.module('chartModule')
  .directive('donutChart', ['dataService',function (dataService) {
    return {
      scope:{
        data:'='
      },
      template: '',
      controller:'DonutCtrl',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var color = d3.scale.category10();
        var data = [10,20,30,40];//scope.data; //[10, 20, 30];
        var width = 300;
        var height = 300;
        var min = Math.min(width, height);
        var svg = d3.select(element[0]).append('svg')
        var pie = d3.layout.pie().sort(null);

        var arc = d3.svg.arc()
          .outerRadius(min / 2 * 0.9)
          .innerRadius(min / 2 * 0.5);

        //pie.value(function(d){ return d.value; });
        svg.attr({width: width, height: height});

        var g = svg.append('g')
        // center the donut chart
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        // add the <path>s for each arc slice

        var arcs = g.selectAll('path');

        scope.$watch('data', function (data){
          if(!data){ return; }
          arcs = arcs.data(pie(data));
          arcs.exit().remove();
          arcs.enter().append('path')
            .style('stroke', 'white')
            .attr('d', arc)
            .attr('fill', function(d, i){ return color(i) });

          arcs.data(pie(data)).attr('d', arc);
        }, true);

      }
    };
  }]);
