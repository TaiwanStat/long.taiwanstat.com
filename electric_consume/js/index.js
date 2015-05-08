(function(){

  var data = {};
  var years = [];
  var svg;
  var current = '0';
  var total = '0';

  var UiCtrl = angular.module("UiCtrl", []);
  UiCtrl.controller('YearCtrl', function($scope){
    var index = 0;

    $scope.init = function(){
      index = years.length-1;
      $scope.year = years[index];
      d3init(data, years[index]);
    }

    $scope.nextPage = function(i){
      index += i;
      if(index == years.length)
        index = 0;
      else if(index < 0)
        index = years.length-1;
      $scope.year = years[index];
      updatePlot(years[index]);
    }

  })

  UiCtrl.controller('InfoCtrl', function($scope){
    $scope.update = function(){
      $scope.current = current.name;
      $scope.value = Math.round(parseFloat(current.value)/1000000);
      $scope.percent = Math.round(parseFloat(current.value)/parseFloat(total)*10000)/100;
    }

  })

  d3.csv("data/data.csv", function(raw){
    data = preprocess(raw);
    // console.log(JSON.stringify( raw));
    init();
  })

  function init() {

    angular.element('#YearCtrl').scope().init();
    angular.element('#YearCtrl').scope().$apply();

    angular.element('#InfoCtrl').scope().update();
    angular.element('#InfoCtrl').scope().$apply();
  }

  function preprocess(raw){

    years = Object.keys(raw[0]);
    years.splice(years.length-2, 2);

    var obj = {'name':'總計', 'children':[]};

    var lv1Id = null;
    var lv1 = {};
    var lv2 = {};

    for(var k = raw.length-2; k > -1; k--){
      if(raw[k]['id'].indexOf('.') != -1){
        if(lv2['name'] != undefined){
          if(lv1Id != null)
            lv2['children'].push(lv1);
          lv1 = {};
          lv1Id = null;
          obj['children'].push(lv2);
        }
        lv2 = {'name':raw[k]['行業別'], 'children':[]};
      }
      else if(raw[k]['行業別'].indexOf('合計') != -1){
        if(lv1['name'] != undefined){
          lv2['children'].push(lv1);
          lv1Id = null;
        }
        lv1 = {'name':raw[k]['行業別'], 'children':[]};
        lv1Id = raw[k]['id'];
      }
      else{
        var atom = {};

        atom['name'] = raw[k]['行業別'];
        // console.log(atom['name']);
        for(var y in years){
          atom[years[y]] = raw[k][years[y]];
        }

        if(lv1Id == null){
          lv2['children'].push(atom);
        }
        else if(raw[k]['id'].indexOf(lv1Id) == -1){
          lv2['children'].push(lv1);
          lv1 = {};
          lv1Id = null;
          lv2['children'].push(atom);
        }
        else{
          lv1['children'].push(atom);
        }
      }

      if(k == 0){
        lv2['children'].push(lv1);
        obj['children'].push(lv2);
      }
    }
    // console.log(JSON.stringify( obj ));
    return obj;
  }


  var x, y, color, partition, arc, path, node, back, labels, polyline, backbtn;
  function d3init(original, year){
    // console.log(JSON.stringify( original ));
    var data = JSON.parse( JSON.stringify( original ) );

    var trueWidth = $('.plot').width();

    svg = d3.select(".plot").append("svg")
      .attr("width", trueWidth)
      .attr("height", trueWidth*0.75)
      .attr("viewBox", "0 0 " + 800 + " " + 600)
      .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
      .attr("transform", "translate(" + 400 + "," + 300 + ")")

    x = d3.scale.linear()
      .range([0, 2 * Math.PI])

    y = d3.scale.sqrt()
      .range([0, 250])


    color = d3.scale.category20c();

    partition = d3.layout.partition()
      .sort(null)
      .value(function(d) { return d[year]; });

    arc = d3.svg.arc()
      .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
      .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
      .innerRadius(function(d) { return Math.max(0, y(d.y)); })
      .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy))-2; });

    node = data;
    current = data;

    path = svg.datum(data).selectAll("path")
        .data(partition.nodes)
      .enter().append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
        .style("opacity", function(d) {
          if(d.name == node.name)
            return 0;
          else if(d.parent == undefined)
            return 0;
          else if(node.parent != undefined)
            if(d.name == node.parent.name)
              return 0;
            else
              return 1;
          else
            return 1;
        })
        .on("click", click)
        .on("mouseover", function(d){
          // console.log(d);
          if(d3.select(this).style('opacity') == 1){
            current = d;
            d3.select(this).style('opacity', 0.5);
            $('.current.header').css('color', d3.select(this).style('fill'));
            angular.element('#InfoCtrl').scope().update();
            angular.element('#InfoCtrl').scope().$apply();
          }
          else if(d.name == node.name){
            current = d;
            angular.element('#InfoCtrl').scope().update();
            angular.element('#InfoCtrl').scope().$apply();
          }
        })
        .on("mouseout", function(){
          if(d3.select(this).style('opacity') == 0.5)
            d3.select(this).style('opacity', 1);
        })
        .each(stash)

      total = node.value;

      backbtn = svg.append('rect')
        .attr('width', 160)
        .attr('height', 70)
        .attr('x', -80)
        .attr('y', -35)
        .attr('rx', 20)
        .attr('ry', 20)
        .style('opacity', 0)
        .style('fill', '#D9499A')

      back = svg.append('text')
        .style('font-size', '50px')
        .text('上一層')
        .attr('x', function(){ return this.getBBox().width/2*-1 })
        .attr('y', function(){ return this.getBBox().height/4 })
        .on("click", function(){
          if(node.parent != undefined)
            click(node.parent);
        })
        .style('opacity', node.parent? 1 : 0)
        .style('fill', '#EEEEEE')
        .style('cursor', '')

      svg.append("g")
        .attr("class", "labels");

      labels = svg.select(".labels").selectAll("text")
        .data(node.children)
        .enter()
        .append('text')
        .attr("dy", ".35em")
        .style("font-size","15px")
        .style("font-weight", "bold")
        .text(function(d) {
          return d.name;
        })

      var lastY = 1000;
      labels.transition().duration(1000)
        .attrTween("transform", function(d) {

          return function(t) {
            var pos = arc.centroid(d);
            pos[0] = pos[0] *1.6;
            pos[1] = pos[1] *1.6;
            pos[0] = 220 * (midAngle(d) < Math.PI ? 1 : -1);

            if(Math.abs(lastY-pos[1]) < 20)
              pos[1] = lastY + 20;

            lastY = pos[1];
            return "translate("+ pos +")";
          };
        })
        .styleTween("text-anchor", function(d){
          return function(t) {
            return midAngle(d) < Math.PI ? "start":"end";
          };
        })

    svg.append("g")
        .attr("class", "lines");

    polyline = svg.select(".lines").selectAll("polyline")
      .data(node.children)
    .enter()
      .append("polyline");

    var lastY = 1000;
    polyline.transition().duration(1000)
      .attrTween("points", function(d){
        return function(t) {
          var pos = arc.centroid(d);
          pos[0] = pos[0] *1.6;
          pos[1] = pos[1] *1.6;

          if(Math.abs(lastY-pos[1]) < 20)
              pos[1] = lastY + 20;

          var pos2 = pos.slice(0);

          pos[0] = 220 * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
          lastY = pos[1]
          if(Math.abs(pos2[0]-arc.centroid(d)[0]) > Math.abs(pos[0]-arc.centroid(d)[0]))
            return [arc.centroid(d), pos];
          return [arc.centroid(d), pos2, pos];

        };
      });

    d3.select(self.frameElement).style("height", 800 + "px");

  }

  function click(d) {
    // console.log(d.children);
    d = d.children? d : d.parent;
    node = d;

    path.transition()
      .duration(1000)
      .attrTween("d", arcTweenZoom(d))
      .style("opacity", function(d) {
        if(d.name == node.name && d.children != undefined)
          return 0;
        else if(d.parent == undefined)
          return 0;
        else if(node.parent != undefined)
          if(d.name == node.parent.name && node.children != undefined)
            return 0;
          else
            return 1;
        else
          return 1;
      })
      .style("fill", function(d) {
        if(node.children && node.parent){
          if(!node.children[0].children)
            return color(d.name)
          else
            return color((d.children ? d : d.parent).name);
        }
        else
          return color((d.children ? d : d.parent).name);
      })

    backbtn.transition()
      .duration(1000)
      .style('opacity', node.parent? 1 : 0)

    back.transition()
      .duration(1000)
      .style('opacity', node.parent? 1 : 0)
      .style('cursor', node.parent?'pointer' : '')

    updateLabels();
  }

  // Setup for switching data: stash the old values for transition.
  function stash(d) {
    d.x0 = d.x;
    d.dx0 = d.dx;
  }

  // When zooming: interpolate the scales.
  function arcTweenZoom(d) {
    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(y.domain(), [d.y, 1]),
        yr = d3.interpolate(y.range(), [d.y ? 20 : 0, 250]);
    return function(d, i) {
      return i
          ? function(t) { return arc(d); }
          : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
    };
  }

  // When switching data: interpolate the arcs in data space.
  function arcTweenData(a, i) {
    var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
    function tween(t) {
      var b = oi(t);
      a.x0 = b.x;
      a.dx0 = b.dx;
      return arc(b);
    }
    if (i == 0) {
     // If we are on the first arc, adjust the x domain to match the root node
     // at the current zoom level. (We only need to do this once.)
      var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
      return function(t) {
        x.domain(xd(t));
        return tween(t);
      };
    } else {
      return tween;
    }
  }


  function updatePlot(year){

    partition.value(function(d) { return d[year]; });


    path.data(partition.nodes)
      .transition()
        .duration(1000)
        .attrTween("d", arcTweenData);

    var n = node;
    while(true){
      if(n.parent)
        n = n.parent;
      else
        break;
    }

    total = n.value;

    angular.element('#InfoCtrl').scope().update();

    updateLabels2();
    // angular.element('#InfoCtrl').scope().$apply();

  }

  function midAngle(d){
     var st = Math.max(0, Math.min(2 * Math.PI, x(d.x)));
     var ed = Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
     return st + (ed - st)/2;
  }

  function updateLabels(){

      labels.transition()
        .style("opacity", 0)
        .remove()

      svg.select('.labels').remove()

      polyline.transition()
        .style("opacity", 0)
        .remove()

      svg.select('.lines').remove()

      svg.append("g")
        .attr("class", "labels");

      svg.append("g")
        .attr("class", "lines");

      labels = svg.select(".labels").selectAll("text")
        .data(node.children)
        .enter()
        .append('text')
        .attr("dy", ".35em")
        .style("font-size","15px")
        .style("font-weight", "bold")
        .text(function(d) {
          // console.log(d.name);
          return d.name;
        })

      var lastY = 1000;
      labels.transition().duration(1000)
        .attrTween("transform", function(d, i) {
          return function(t) {
            var pos = arc.centroid(d);
            pos[1] = pos[1] *1.6;
            pos[0] = pos[0] *1.6;
            pos[0] = 220 * (midAngle(d) < Math.PI ? 1 : -1);

            if(Math.abs(lastY-pos[1]) < 20)
                pos[1] = lastY + 20;

            if(pos[1]<-295)
              pos[1] = -280;
            else if(pos[1] > 295)
              pos[1] = 280;

            lastY = pos[1];
            return "translate("+ pos +")";
          };
        })
        .styleTween("text-anchor", function(d){
          return function(t) {
            return midAngle(d) < Math.PI ? "start":"end";
          };
        })

    polyline = svg.select(".lines").selectAll("polyline")
      .data(node.children)
    .enter()
      .append("polyline");

    lastY = 1000;
    polyline.transition().duration(1000)
      .attrTween("points", function(d){
        return function(t) {
          var pos = arc.centroid(d);
          pos[0] = pos[0] *1.6;
          pos[1] = pos[1] *1.6;

          if(Math.abs(lastY-pos[1]) < 20)
              pos[1] = lastY + 20;

          if(pos[1]<-295)
            pos[1] = -280;
          else if(pos[1] > 295)
            pos[1] = 280;

          var pos2 = pos.slice(0);
          lastY = pos[1];
          pos[0] = 220 * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
          if(Math.abs(pos2[0]-arc.centroid(d)[0]) > Math.abs(pos[0]-arc.centroid(d)[0]))
            return [arc.centroid(d), pos];
          return [arc.centroid(d), pos2, pos];
        };
      });

  }

  function updateLabels2(){
    var lastY = 1000;
    labels.transition().duration(1000)
      .attrTween("transform", function(d, i) {
        return function(t) {
          var pos = arc.centroid(d);
          pos[1] = pos[1] *1.6;
          pos[0] = pos[0] *1.6;
          pos[0] = 220 * (midAngle(d) < Math.PI ? 1 : -1);

          if(Math.abs(lastY-pos[1]) < 20)
              pos[1] = lastY + 20;

          if(pos[1]<-295)
            pos[1] = -280;
          else if(pos[1] > 295)
            pos[1] = 280;

          lastY = pos[1];
          return "translate("+ pos +")";
        };
      })
      .styleTween("text-anchor", function(d){
        return function(t) {
          return midAngle(d) < Math.PI ? "start":"end";
        };
      })

  lastY = 1000;
  polyline.transition().duration(1000)
    .attrTween("points", function(d){
      return function(t) {
        var pos = arc.centroid(d);
        pos[0] = pos[0] *1.6;
        pos[1] = pos[1] *1.6;

        if(Math.abs(lastY-pos[1]) < 20)
            pos[1] = lastY + 20;

        if(pos[1]<-295)
          pos[1] = -280;
        else if(pos[1] > 295)
          pos[1] = 280;

        var pos2 = pos.slice(0);
        lastY = pos[1];
        pos[0] = 220 * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        if(Math.abs(pos2[0]-arc.centroid(d)[0]) > Math.abs(pos[0]-arc.centroid(d)[0]))
          return [arc.centroid(d), pos];
        return [arc.centroid(d), pos2, pos];
      };
    });
  }

})()
