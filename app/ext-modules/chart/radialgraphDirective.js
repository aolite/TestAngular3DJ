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
      scope:{
        idsInfoTable:'=?',
        energyData:'=?'
      },
      template: '',
      controller:'RadialgraphcontrollerCtrl',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        if (!scope.idsInfoTable){
          scope.idsInfoTable = {
            'light': {
              'id': 'light',
              'name': 'light',
              'shortName': 'light',
              'color': '7EAADD',
              'highlightColor': 'c6d1dd',
              'icon': '\\e82b',
              'category': 'consumption'
            },
            'electricity': {
              'id': 'elec',
              'name': 'electricity',
              'shortName': 'electricity',
              'color': '33537A',
              'highlightColor': '446fa4',
              'icon': '\\e82d',
              'category': 'consumption'
            },
            'tv': {
              'id': 'tv',
              'name': 'tv',
              'shortName': 'tv',
              'color': 'F5A623',
              'highlightColor': 'f5cc89',
              'icon': '\\e82c',
              'category': 'consumption'
            },
            'pv': {
              'id': 'pv',
              'name': 'pv',
              'shortName': 'pv',
              'color': '9B9B9B',
              'highlightColor': 'bdbdbd',
              'icon': '\\e800',
              'category': 'consumption'
            },
            'objective': {
              'id': 'objective',
              'name': 'objective',
              'shortName': 'objective',
              'color': '6F93A4',
              'highlightColor': '96C6DD',
              'icon': '\\e806'
            }
          };
        }



        var jsonData=[];
        scope.$watch('energyData', function (energyData){
          console.log ("received Data", energyData);
          jsonData= energyData;
          //TODO: It is required to call an updateGraphData function
          graphGenerator (jsonData);
        });

        /****** Function graphGenerator *****/

        function graphGenerator (jsonData){


          if (!jsonData) return;

          var energyConsumptionData = { };

          var jsonKeys = getJsonKeys(jsonData);

          var jsonKeysData = jsonKeys.slice();
          jsonKeysData.splice(jsonKeys.length-3,jsonKeys.length-1);

          console.log(scope.idsInfoTable);
          energyConsumptionData= parseJSONData(jsonData,jsonKeys);

          console.log (energyConsumptionData);

          element.text('this is the radialGraph directive');


          //Create the graph place

          var arcPart = (360 / jsonData.length) / 1.05;
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
          var scaleRadix = d3.scale.linear().range([0, radix]);
          var opacityScale = d3.scale.linear()
            .range([.4, 1]);

          var rotHour = d3.scale.linear()
            .domain([0, 24 * 60])
            .range([0, 360]);


          var svg = d3.select(element[0]).append('svg')
            .attr({width: canvasWidth, height: canvasHeight});

          opacityScale.domain([0, jsonData.length]);

          var en_US= {
            "decimal": ".",
            "thousands": ",",
            "grouping": [3],
            "currency": ["$", ""],
            "dateTime": "%a %b %e %X %Y",
            "date": "%m/%d/%Y",
            "time": "%H:%M:%S",
            "periods": ["AM", "PM"],
            "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          };

          var US = d3.locale(en_US);

          /****************/

          function printVerticalBar (data){

            //var keys = getJsonKeys(data);

            var consumptionAgg = [data.light, data.electricity, data.tv, data.pv, data.objective];
            var demandEnergy = normaliseConsumption (consumptionAgg);

            var demand = 0;



            var accInner = 0,
              thickConsumption = 0,
              tsDate = isoDateFormat.parse(data.timeStamp),
              h = tsDate.getHours(),
              ecoPercent = data.pv*100/data.demand,
              path,
              i;

            console.log("ecoPercent= ", ecoPercent);
            verticalDetail.attr('opacity', 1);

            renevableHigh.transition()
              .attr("height",ecoPercent/100 * Radix2Bar);

            renevableText.text("renovables " + US.numberFormat(",.2f")(ecoPercent)+ "% ")
              .transition()
              .attr('x', -(ecoPercent/100 * Radix2Bar)/2); //scaleRadix / 100 * ecoPercent) / 2

            blockDate
              .text(US.timeFormat("%A %d")(tsDate));

            hourBlock
              .text(US.timeFormat("%H:%M")(tsDate) + "h");

            var dataTable =[];

            for (i = 0; i < jsonKeysData.length; i++) {
              dataTable[i] = {
                id: jsonKeys [i],
                datos: data[jsonKeysData [i]]
              };
            }

            var blocks = verticalDetail.selectAll('.j-bloque')
              .data(dataTable, function(d) {
                return d.id;
              });

            blocks.enter()
              .append('g')
              .attr('id', function(d) {
                return "des_" + d.id;
              })
              .attr('class', 'j-bloque')
              .each(function() {

                var that = d3.select(this);

                that.append('rect')
                  .attr('width', 6)
                  .attr('height', 10)
                  .attr('fill', function(d) {
                    return '#' + scope.idsInfoTable[d.id].color;
                  });

                that.append('text')
                  .text(function(d) {
                    return scope.idsInfoTable[d.id].id;
                  })
                  .attr('class', 'j-nombre')
                  .attr('x', 30)
                  .attr('y', 20)
                  .attr('text-anchor', 'start')
                  .style('font-size', '13')
                  .style('font-family', 'Roboto Slab, Helvetica Neue, Helvetica, sans-serif')
                  .style('fill', '#B3B3B3')
                  .style('fill', function(d) {
                    return '#' + scope.idsInfoTable[d.id].highlightColor;
                  })
                  .attr('transform', 'rotate(-45)');

                that.append('text')
                  .text(function(d) {
                    return scope.idsInfoTable[d.id].id;
                  })
                  .attr('class', 'j-MW')
                  .attr('x', 30)
                  .attr('y', 32)
                  .attr('text-anchor', 'start')
                  .style('font-size', '12')
                  .style('font-family', 'Roboto Slab, Helvetica Neue, Helvetica, sans-serif')
                  .style('fill', '#B3B3B3')
                  .style('fill', function(d) {
                    return '#' + scope.idsInfoTable[d.id].highlightColor;
                  })
                  .attr('transform', 'rotate(-45)');

                that.append('path')
                  .style('fill', 'none')
                  .style('stroke-width', '1')
                  .style('stroke', function(d) {
                    return '#' + scope.idsInfoTable[d.id].color;
                  });


              }).attr('transform', function(d, i) {
              return 'translate(0,' + (50 * i) + ')'
            });


            var colision =0;
            var minPercentStep =8;
            var safeStepCalc=0;
            var safeStep=33;

            blocks.each (function (d,i){

              if (demandEnergy[i-1]< minPercentStep){
                colision++;
              }

              safeStepCalc=safeStep + colision;
              thickConsumption= (demandEnergy[i]/100)* Radix2Bar;

              d3.select(this)
                .transition()
                .attr('transform', 'translate(0,' + accInner + ')')
                .each(function() {
                  var that = d3.select(this);
                  that.select('rect')
                    .transition()
                    .attr('height', thickConsumption);


                  that.select('.j-nombre')
                    .text(function(d) {
                      console.log(d," i: ",d.id);
                      return scope.idsInfoTable[d.id].shortName + " ";
                    })
                    .transition()
                    .attr('transform', 'translate(' + safeStepCalc + ',' + 0 + ') ' + 'rotate(-45 0 0) ');

                  that.select('.j-MW')
                    .text(function(d) {
                      return US.numberFormat(",.2f")(demandEnergy[i]) + "% " + US.numberFormat(",.2f")(d.datos) + "MW ";
                    })
                    .transition()
                    .attr('transform', 'translate(' + safeStepCalc + ',' + 0 + ') ' + 'rotate(-45 0 0) ');

                  that.select('path')
                    .transition()
                    .attr('d', 'M6,1 H' + Math.floor(31 + safeStepCalc) + " l3,-3")

                });


              accInner += thickConsumption;

            });
          }


          /****************/

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
          setInterval(function() {

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

          // Print the lateral information regarding the clicked bar

          var verticalDetail = svg.append('g')
            .attr('id', 'desglose_grupo')
            .attr('transform', 'translate(' + (centerX + radix + 100) + ',' + (centerY - (radix * .75)) + ')')
            .attr('opacity', 0);

          verticalDetail.append('rect')
            .attr('y', Radix2Bar + 20)
            .attr('width', 165)
            .attr('height', 3)
            .attr('fill', '#3C3C3C');

          var blockDate = verticalDetail.append('text')
              .text("hoy")
              .attr('y', Radix2Bar + 39)
              .attr('text-anchor', 'start')
              .style('font-size', '14')
              .style('font-family', 'Roboto Slab, Helvetica Neue, Helvetica, sans-serif')
              .attr('fill', '#666'),
            hourBlock = verticalDetail.append('text')
              .text("21:00h")
              .attr('y', Radix2Bar + 62)
              .attr('text-anchor', 'start')
              .style('font-size', '27')
              .style('font-family', 'Roboto Slab, Helvetica Neue, Helvetica, sans-serif')
              .attr('fill', '#666'),
            renevableBlockDetail = verticalDetail.append('g'),
            renevableHigh = renevableBlockDetail.append('rect')
              .attr('x', -8)
              .attr('width', 2)
              .attr('height', 200)
              .attr('fill', '#669C83'),

            renevableText = renevableBlockDetail.append('text')
              .text("--")
              .attr('text-anchor', 'middle')
              .style('font-size', '13')
              .style('font-family', 'Roboto Slab, Helvetica Neue, Helvetica, sans-serif')
              .attr('fill', '#669C83')
              .attr('x', -100)
              .attr('y', -12)
              .attr('transform', 'rotate(-90)');

          // Print the consumption values for each of the hours.

          /*
           <g class="rad" id="id-21:20-dia-15" opacity="0.4" transform="translate(384,300)">
           <path fill="#7EAADD" d="M-34.574056563273665,-41.2037561198368A53.787683586704446,53.787683586704446 0 0,1 -32.832460432141175,-42.60451205676834L0,0Z"></path>
           <path fill="#33537A" d="M-55.07005416665147,-65.6299348974646A85.6737954135532,85.6737954135532 0 0,1 -52.2960148200572,-67.86107908443341L-32.832460432141175,
           -42.60451205676834A53.787683586704446,53.787683586704446 0 0,0 -34.574056563273665,-41.2037561198368Z"></path>
           <path fill="#F5A623" d="M-56.29670856867181,-67.09180468794385A87.58213089409945,87.58213089409945 0 0,1 -53.46087905994006,-69.37264635351337L-52.2960148200572,
           -67.86107908443341A85.6737954135532,85.6737954135532 0 0,0 -55.07005416665147,-65.6299348974646Z"></path>
           <path fill="#9B9B9B" d="M-77.31545762607516,-92.14097438894044A120.28149961350167,120.28149961350167 0 0,1 -73.42085238552768,-95.27338339880323L-53.46087905994006,
           -69.37264635351337A87.58213089409945,87.58213089409945 0 0,0 -56.29670856867181,-67.09180468794385Z"></path>
           <path fill="#6F93A4" d="M-77.31545762607516,-92.14097438894044A120.28149961350167,120.28149961350167 0 0,1 -73.42085238552768,-95.27338339880323L-73.42085238552768,
           -95.27338339880323A120.28149961350167,120.28149961350167 0 0,0 -77.31545762607516,-92.14097438894044Z"></path>
           <path fill="#BD10E0" d="M-113.60268974660087,-135.38641363387694A176.734411234218,176.734411234218 0 0,1 -107.88019072231539,-139.98898729551027L-73.42085238552768,
           -95.27338339880323A120.28149961350167,120.28149961350167 0 0,0 -77.31545762607516,-92.14097438894044Z"></path>
           <path fill="#583636" d="M-143.8860437812886,-171.47670960051843A223.8469466632311,223.8469466632311 0 0,1 -136.63808383436,-177.30620287098205L-107.88019072231539,
           -139.98898729551027A176.734411234218,176.734411234218 0 0,0 -113.60268974660087,-135.38641363387694Z"></path>
           <path fill="#3D4163" d="M-160.69690242163486,-191.51111077974446A249.99999999999997,249.99999999999997 0 0,1 -152.6021304636406,-198.02169017044068L-136.63808383436,
           -177.30620287098205A223.8469466632311,223.8469466632311 0 0,0 -143.8860437812886,-171.47670960051843Z"></path>
           </g>
           */


          var maxData = d3.max(jsonData, function (d){return d.demand});

          scaleRadix.domain ([0, maxData]);

          svg.append('g').attr('id', 'consumptionBars');


          d3.select("svg #horas")
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
            })
            .each (function (d){
              var group = d3.select(this);


              group.selectAll('path')
                .data(jsonKeysData)
                .enter().append('path')
                .on('click', function() {
                  var that = d3.select(this);
                  console.log("click", isoDateFormat.parse(d.timeStamp), that.datum(), d[that.datum()]);

                  printVerticalBar(d);
                })
                .on('mouseover', function() {
                  var that = d3.select(this);
                  that
                    .attr('fill', '#' + scope.idsInfoTable[that.datum()].highlightColor);
                })
                .on('mouseout', function() {
                  var that = d3.select(this);
                  that
                    .attr('fill', '#' + scope.idsInfoTable[that.datum()].color);
                })
                .attr('fill', function() {
                  var that = d3.select(this);
                  return '#' + scope.idsInfoTable[that.datum()].color;
                });

            }).attr('opacity', 0)
            .attr('transform', 'translate(' + centerX + ',' + centerY + ')');

          consumptionBars.each(function(d){
            var paths = d3.select(this).selectAll('path');

            //define a variable that aggregattes all the energy consumption values
            var consumptionAgg = [d.light, d.electricity, d.tv, d.pv, d.objective];
            var demandEnergy = normaliseConsumption (consumptionAgg);

            //console.log("demandEnergy", demandEnergy);
            var gConsumptionBar,
              n=0,
              accInner = 0;

            var arc = d3.svg.arc(),
              tsDate = isoDateFormat.parse(d.timeStamp),
              h = tsDate.getHours(),
              m = tsDate.getMinutes(),
              angle = rotHour((h * 60) + m);

            paths.each (function (){


              gConsumptionBar = (demandEnergy[n]/100) * scaleRadix (d.demand);


              d3.select(this).attr ('d', arc.startAngle(function (){
                return grad2rad(angle);})
                .endAngle (function (){
                  return grad2rad (angle + arcPart)
                }).outerRadius (function (){
                  return gConsumptionBar + accInner
                }).innerRadius (function (){
                  return accInner;
                }));

              accInner += gConsumptionBar;

              n++;

            });
          });

          consumptionBars.transition().duration(500).delay(function(d, i) {
            return (jsonData.length - i) * 25
          })
            .attr('opacity', function(d, i) {
              return opacityScale(i);
            })
            .attr('transform', 'translate(' + centerX + ',' + centerY + ')');
        }

        /***********************************/

      }
    };

    // This function permit to format JSON incoming information into the desirable variables for D3.js
    function parseJSONData (jsonData, jsonKeys){

      /*
       'light':{
       'dayAverage': 1000,
       'percentageDay': []
       },

       'electricity':{
       'dayAverage': 1000,
       'percentageDay': []
       },

       'pv':{
       'dayAverage': 1000,
       'percentageDay': []
       },

       'tv':{
       'dayAverage': 1000,
       'percentageDay': []
       },

       'objective':[]

       */

      var energyConsumptionData={};


      for (var elem in jsonData){
        for (var key in jsonKeys){
          energyConsumptionData[jsonKeys[key]]=
          {
            'percentageDay':[]
          };
          energyConsumptionData[jsonKeys[key]]['percentageDay'].push(jsonData[elem][jsonKeys[key]]);
        }
        /*energyConsumptionData.light.percentageDay.push(jsonData[elem].light);
        energyConsumptionData.electricity.percentageDay.push(jsonData[elem].electricity);
        energyConsumptionData.tv.percentageDay.push(jsonData[elem].tv);
        energyConsumptionData.pv.percentageDay.push(jsonData[elem].pv);
        energyConsumptionData.objective.push(jsonData[elem].objective);*/
      }

      console.log(energyConsumptionData);

      return energyConsumptionData;
    }

    function normaliseConsumption(arr){

      var dataNormalization,
        normParameter;

      normParameter = arr.reduce(function (a,b){return a+b},0);

      dataNormalization= arr.map (function (a){return a*100/normParameter});


      return dataNormalization;

    }

    function getJsonKeys (data){
      var keys = [];

      for(var k in data[0]) keys.push(k);

      console.log("total " + keys.length + " keys: " + keys);

      return keys;
    }


    function grades2Rad (grades){
      return (Math.PI/180)*grades;
    }


    function grad2rad (grad){
      return Math.PI / 180 * grad;
    }

  });
