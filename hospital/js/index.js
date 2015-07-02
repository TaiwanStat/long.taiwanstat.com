(function() {

  var app = angular.module('myApp', ['ngRoute'])
                   .controller('mainController', mainCtrl);

  mainCtrl.$inject = ['$scope', '$rootScope', '$location', '$http'];

  function mainCtrl ($scope, $rootScope, $location, $http, mapService) {
    
    var vm = this;
    var tip = d3.tip();
    vm.previousCountry = '';
    init();

    function init () {
      $http.get('./data/data.json').then(function(resp) {
        for (var obj in resp.data) {
          for (var key in resp.data[obj]) {
            if (key != 'population') {
              resp.data[obj][key] = zhutil.annotate(resp.data[obj][key]);
            }
            else {
              resp.data[obj][key] = zhutil.approximate(resp.data[obj][key], {base: '萬', extra_decimal: 2}); 
            }
          }
        }

        $scope.data = resp.data;
        vm.data = resp.data;
        initMap();
      });
    }

    function initMap () {
      d3.json("./data/city.json",function(topodata2){


        var features = topojson.feature(topodata2, topodata2.objects["city"]).features;
        var projection = d3.geo.mercator().center([122,24]).scale(7200); // 座標變換函式
        var path = d3.geo.path().projection(projection);
        var svg = d3.select('#map');
        var windowWidth = $( window ).width();
        var width = '50%';
        var height = '600';
        if (windowWidth < 600) {
          width = '400px';
          height = '500';
        }

        svg.attr('width', width)
          .attr('height', height)
          .attr("viewBox", "0 0 600 650");

        tip.attr('class', 'd3-tip')
           .offset([-10, 0])
           .html(function(d) {
                return d.properties.C_Name;
           })

        svg.call(tip);
        var g = svg.append("g");


        g.selectAll("path").data(features).enter().append("path")
          .attr("class",function(d) {
            return d.properties.C_Name;
          })
          .attr("d",path)
          .attr("fill",function(d,i) {  	
            var name = d.properties.C_Name;
            var color = 0.9; //-value/max * 0.6;
            var max = 1025.1;
            for (var i in vm.data) {
              if (vm.data[i].country === name) {
                color = 0.9 
                  - (parseFloat(vm.data[i].hospBedRate) 
                  + parseFloat(vm.data[i].hospHumanRate))
                  / max * 0.6;
                return  d3.hsl(210,color, color);
              
              }
            }
            return  d3.hsl(210,color, color);
          })
          .classed("city",true)
		      .on("mouseover", mouseover)
		      .on("click", click);
      });
    }

    function mouseover (d) {
      d3.select(this)
        .classed("mouse",true)
        .on("mouseleave",leave);

      tip.show(d);
      var Cname = d.properties.C_Name;
      d3.selectAll("."+Cname).classed("mouse",true);

    }

    function click (d) {
      $('.' + vm.previousCountry + '1').hide(); 
      $('.' + d.properties.C_Name + '1').show(); 
      vm.previousCountry = d.properties.C_Name;
      d3.selectAll("."+Cname).classed("mouse",false);
    }

    function leave(d){
      tip.hide(d);
      var Cname = d.properties.C_Name;
      d3.select(this).classed("mouse",false);
      d3.selectAll("."+Cname).classed("mouse",false);
    }

  } 

})();
