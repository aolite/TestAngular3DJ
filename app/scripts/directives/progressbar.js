'use strict';

/**
 * @ngdoc directive
 * @name yeomanGeneratedProjectApp.directive:progressBar
 * @description
 * # progressBar
 */
angular.module('app')
  .directive('progressBar', function () {
    return {
      scope:{
        progress:'='
      },
      template: '',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var el = element[0];
        var width = 500;
        var height = 20;
        var svg = d3.select(el).append('svg')
          .attr({width: width, height: height})
          .style('border', '1px solid black');

        // the inner progress bar `<rect>`
        var rect = svg.append('rect').style('fill', 'blue');
        scope.$watch('progress', function(progress) {
          rect.attr({x: 0, y: 0, width: width * progress / 100, height: height});
        });
      }
    };
  });
