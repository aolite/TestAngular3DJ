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

        var orderedIdsTable = ['electricity', 'light', 'objective', 'pv', 'tv'],
          idsInfoTable = {
            'light': {
              'id': 'light',
              'nombre': 'light',
              'nombreAbrev': 'light',
              'color': '7EAADD',
              'highlightColor': 'c6d1dd',
              'icon': '\\e82b',
            },
            'electricity': {
              'id': 'hid',
              'nombre': 'electricity',
              'nombreAbrev': 'electricity',
              'color': '33537A',
              'highlightColor': '446fa4',
              'icon': '\\e82d'
            },
            'tv': {
              'id': 'sol',
              'nombre': 'tv',
              'nombreAbrev': 'tv',
              'color': 'F5A623',
              'highlightColor': 'f5cc89',
              'icon': '\\e82c'
            },
            'pv': {
              'id': 'pv',
              'nombre': 'pv',
              'nombreAbrev': 'pv',
              'color': '9B9B9B',
              'highlightColor': 'bdbdbd',
              'icon': '\\e800'
            },
            'objective': {
              'id': 'objective',
              'nombre': 'objective',
              'nombreAbrev': 'objective',
              'color': '6F93A4',
              'highlightColor': '96C6DD',
              'icon': '\\e806'
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

        var min = Math.min(canvasWidth, canvasHeight);
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

        function printVerticalBar (evt, data){
          console.log("Print vertical bar", data);
          //var keys = getJsonKeys(data);

          var consumptionAgg = [data.light, data.electricity, data.tv, data.pv, data.objective];
          var demandEnergy = normaliseConsumption (consumptionAgg);
          var hourDemand = data.demand;



          var accInner = 0,
            thickConsumption = 0,
            ln = demandEnergy.length,
            tsDate = isoDateFormat.parse(data.timeStamp),
            h = tsDate.getHours(),
            m = tsDate.getMinutes(),
            ecoPercent = data.pv*100/data.demand,
            path,
            i;

          console.log ("demandEnergy=",demandEnergy);
          console.log("ecoPercent= ", ecoPercent);
          desglose.attr('opacity', 1);

          textoRenovables.text("renovables " + US.numberFormat(",.2f")(ecoPercent)+ "% ")
            .transition()
            .attr('x', -(scaleRadix / 100 * ecoPercent) / 2);

          fechaBloque
            .text(US.timeFormat("%A %d")(tsDate));

          horaBloque
            .text(US.timeFormat("%H:%M")(tsDate) + "h");



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

        // Print the lateral information regarding the clicked bar

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
            .attr('fill', '#666'),
          horaBloque = desglose.append('text')
            .text("21:00h")
            .attr('y', Radix2Bar + 62)
            .attr('text-anchor', 'start')
            .style('font-size', '27')
            .style('font-family', 'Roboto Slab, Helvetica Neue, Helvetica, sans-serif')
            .attr('fill', '#666'),
          desgloseBloqueRenovable = desglose.append('g'),
          altoRenovables = desgloseBloqueRenovable.append('rect')
            .attr('x', -8)
            .attr('width', 2)
            .attr('height', 200)
            .attr('fill', '#669C83'),
          textoRenovables = desgloseBloqueRenovable.append('text')
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

        var gConsumptionValues = svg.append('g').attr('id', 'consumptionBars');


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
          })
          .each (function (d){
            var group = d3.select(this);


            group.selectAll('path')
              .data(orderedIdsTable)
              .enter().append('path')
              .on('click', function() {
                var that = d3.select(this);
                console.log("click", isoDateFormat.parse(d.timeStamp), that.datum(), d[that.datum()]);

                printVerticalBar("",d);
              })
              .on('mouseover', function() {
                var that = d3.select(this);
                that
                  .attr('fill', '#' + idsInfoTable[that.datum()].highlightColor);
              })
              .on('mouseout', function() {
                var that = d3.select(this);
                that
                  .attr('fill', '#' + idsInfoTable[that.datum()].color);
              })
              .attr('fill', function(d, n) {
                var that = d3.select(this);
                return '#' + idsInfoTable[that.datum()].color;
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
          "demand:0"
          "timeStamp": todayDate.toISOString()
        }*/
      ];

      var obj = {};

      for (var i=0; i< 24*6; i++){
        obj.light= Math.random()*2000;
        obj.electricity= Math.random()*2000;
        obj.tv= Math.random()*300;
        obj.pv= Math.random()*1000;
        obj.demand= obj.light+obj.electricity+obj.tv+obj.pv;
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

    function normaliseConsumption(arr){

      var dataNormalization,
        normParameter;

      normParameter = arr.reduce(function (a,b){return a+b},0);

      dataNormalization= arr.map (function (a){return a*100/normParameter});


      return dataNormalization;

    }

    function getJsonKeys (data){
      var keys = [];
      for(var k in data) keys.push(k);

      console.log("total " + keys.length + " keys: " + keys);

      return keys;
    }


    function grades2Rad (grades){
      return (Math.PI/180)*grades;
    }

    function rd3 (max, data, measure){
      var mx =+ max;
      var med = (measure)? measure: 100;

      return (data*med)/mx;
    }

    function grad2rad (grad){
      return Math.PI / 180 * grad;
    }


  });
