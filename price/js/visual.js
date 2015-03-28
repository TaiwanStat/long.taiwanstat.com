var typeColor = ["#FFA000", "#E040FB", "#673AB7", "#4CAF50", "#448AFF", "#F44336", "#727272"];
var typeTable = ["食物類", "衣著類", "居住類", "交通及通訊類", "醫藥保健類", "教養娛樂類", "雜項類"]


var curData = "";
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    var html = '<div class="ui tooltip segment">' +
               '<h5 class="ui header">' + curData[d.x].name + '</h5>較去年同月 ' + curData[d.x].stat +
               '<h5 class="ui header">' + curData[d.y].name + '</h5>較去年同月 ' + curData[d.y].stat +
               '</div>';
    return html;
  })

function plot(data, year, month) {
  data = data[year][month];
  curData = data;

  var margin = {top: 10, right: 0, bottom: 140, left: 150},
    w = 800,
    h = 800,
    n = data.length;

  if (n <10)
    margin.bottom = 200;

  var matrix = []

  data.forEach(function(c, i){
    if(parseFloat(c.value)>0)
        c.stat = '漲 ' + c.value + ' (%)';
    else if(parseFloat(c.value)<0)
        c.stat = '跌 ' + c.value + ' (%)';
    else
        c.stat = '--';

    matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, v: 1}; });
  })

  var maxUp = 0;
  var minUp = 0;
  var maxDown = 0;
  var minDown = 0;

  data.forEach(function(c, i){
    data.forEach(function(r, j){
      var cv = parseFloat(c.value);
      var rv = parseFloat(r.value);

      if(i == j)
        matrix[i][j].v = 0;
      else if(cv && rv) {
        if(cv>0 && rv>0){
          matrix[i][j].v = ((cv > rv) ? rv : cv);
          if(matrix[i][j].v > maxUp)
            maxUp = matrix[i][j].v;
          else if(matrix[i][j].v < minUp)
            minUp = matrix[i][j].v;
        }
        else if(cv<0 && rv<0){
          matrix[i][j].v = ((cv < rv) ? rv : cv);
          if(matrix[i][j].v > minDown)
            minDown = matrix[i][j].v;
          else if(matrix[i][j].v < maxDown)
            maxDown = matrix[i][j].v;
        }
        else
          matrix[i][j].v = 0;
      }
      else
        matrix[i][j].v = 0;

    })
  })

  var x = d3.scale.ordinal().rangeBands([0, w]);
  var orders = {
    type: d3.range(n).sort(function(a, b) { return d3.ascending(data[b].type, data[a].type); })
    // role: d3.range(n).sort(function(a, b) {
    //   if(roleTable.indexOf(data.nodes[a].mainRole) == roleTable.indexOf(data.nodes[b].mainRole))
    //     return d3.ascending(data.nodes[a].name, data.nodes[b].name);
    //   else
    //     return roleTable.indexOf(data.nodes[a].mainRole) - roleTable.indexOf(data.nodes[b].mainRole);
    // })
  };

  x.domain(orders.type);

  var svg = d3.select(".plot").append("svg")
    .attr("width", $(this).parent().width())
    .attr("height", $(this).parent().height())
    .attr("viewBox", "0 0 " + (w + margin.left + margin.right) + " " + (h + margin.top + margin.bottom))
    .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

  svg.append("rect")
   .attr("fill", '#eee')
   .attr("width", w)
   .attr("height", h);

  var row = svg.selectAll(".row")
    .data(matrix)
    .enter().append("g")
    .attr("class", "row")
    .attr("transform", function(d, i) {return "translate(0," + x(i) + ")"; })
    .each(row);

  row.append("line")
     .attr("x2", w);

  var colorScale = d3.scale.ordinal()
    .domain(typeTable)
    .range(typeColor);

  row.append("text")
     .attr("x", -6)
     .attr("y", x.rangeBand()/2 +3)
     .attr("dy", function(){
       if(data.length <10){
          return "25px"
       }
       else
          return ".32em";
    })
     .style("font-size", function(){
       if(data.length <10){
          return "25px"
       }
       else
          return ".32em";
    })
     .style("font-weight", "bold")
     .attr("text-anchor", "end")
     .text(function(d, i) { return data[i].name; })
     .attr("fill", function(d, i){
       return colorScale(data[i].type)
     });

  var column = svg.selectAll(".column")
    .data(matrix)
    .enter().append("g")
    .attr("class", "column")
    .attr("transform", function(d, i) { return "translate(" + x(i) + ")"; });

  var columnLine = svg.selectAll(".columnLine")
    .data(matrix)
    .enter().append("g")
    .attr("class", "columnLine")
    .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });


  columnLine.append("line").attr("x1", -w);

  column.append("text")
    .attr("x", x.rangeBand()/2)
    .attr("y", h+2)
    .attr("dy", function(){
       if(data.length <10){
          return "25px"
       }
       else
          return ".32em";
    })
    .attr("text-anchor", "start")
    .style("writing-mode", "tb")
    .style("font-weight", "bold")
    .style("glyph-orientation-vertical", 0)
    .style("font-size",function(){
       if(data.length <10){
          return "25px"
       }
       else
          return ".32em";
    })
    .attr("fill", function(d, i){
       return colorScale(data[i].type)
     })
    .text(function(d, i) { return data[i].name; });

  function row(row) {
    var cell = d3.select(this).selectAll(".cell")
      .data(row)
      //  .data(row.filter(function(d) {return d.z; }))
      .enter().append("rect")
      .attr("class", "cell")
      .attr("x", function(d) {return x(d.x); })
      .attr("width", x.rangeBand())
      .attr("height", x.rangeBand())
      .attr("fill", function(d){
        if(d.v>0)
          return "#EB1201"
        else if(d.v<0)
          return "#34C800"
      })
      .style("fill-opacity", function(d) {
        var upScale = d3.scale.linear()
          .domain([minUp, maxUp])
          .range([0.1, 1]);
        var downScale = d3.scale.linear()
          .domain([minDown, maxDown])
          .range([0.1, 1]);

        if(d.v > 0)return upScale(d.v);
        else if(d.v < 0) return downScale(d.v);
        else return 0;
      })
     .on('mouseover', tip.show)
     .on('mouseout', tip.hide)
  }

}

function updatePlot(data, year, month) {
  var matrix = [];
  data = data[year][month];
  curData = data;

  var n = data.length;

  data.forEach(function(c, i){
    if(parseFloat(c.value)>0)
        c.stat = '漲 ' + c.value + ' (%)';
    else if(parseFloat(c.value)<0)
        c.stat = '跌 ' + c.value + ' (%)';
    else
        c.stat = '--';

    matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, v: 1}; });
  })

  var maxUp = 0;
  var minUp = 0;
  var maxDown = 0;
  var minDown = 0;

  data.forEach(function(c, i){
    data.forEach(function(r, j){
      var cv = parseFloat(c.value);
      var rv = parseFloat(r.value);
      if(i == j)
        matrix[i][j].v = 0;
      else if(cv && rv) {
        if(cv>0 && rv>0){
          matrix[i][j].v = ((cv > rv) ? rv : cv);
          if(matrix[i][j].v > maxUp)
            maxUp = matrix[i][j].v;
          else if(matrix[i][j].v < minUp)
            minUp = matrix[i][j].v;
        }
        else if(cv<0 && rv<0){
          matrix[i][j].v = ((cv < rv) ? rv : cv);
          if(matrix[i][j].v > minDown)
            minDown = matrix[i][j].v;
          else if(matrix[i][j].v < maxDown)
            maxDown = matrix[i][j].v;
        }
        else
          matrix[i][j].v = 0;
      }
      else
        matrix[i][j].v = 0;

    })
  })

  // var x = d3.scale.ordinal().rangeBands([0, w]);
  var orders = {
    type: d3.range(n).sort(function(a, b) { return d3.ascending(data[b].type, data[a].type); })
    // role: d3.range(n).sort(function(a, b) {
    //   if(roleTable.indexOf(data.nodes[a].mainRole) == roleTable.indexOf(data.nodes[b].mainRole))
    //     return d3.ascending(data.nodes[a].name, data.nodes[b].name);
    //   else
    //     return roleTable.indexOf(data.nodes[a].mainRole) - roleTable.indexOf(data.nodes[b].mainRole);
    // })
  };

  // x.domain(orders.type);

  var svg = d3.select(".plot");

  var row = svg.selectAll(".row")
    .data(matrix)
    .each(updateRow);

  function updateRow(row) {
    var cell = d3.select(this).selectAll(".cell")
      .data(row)
      .transition().duration(1000)
      .attr("fill", function(d){
        if(d.v>0)
          return "#EB1201"
        else if(d.v<0)
          return "#34C800"
        else
          return "#EEEEEE"
      })
      .style("fill-opacity", function(d) {
        var upScale = d3.scale.linear()
          .domain([minUp, maxUp])
          .range([0.1, 1]);
        var downScale = d3.scale.linear()
          .domain([minDown, maxDown])
          .range([0.1, 1]);

        if(d.v > 0)return upScale(d.v);
        else if(d.v < 0) return downScale(d.v);
        else return 0;
      })

  }

}

function updateTable(data, year, month) {
  var sorted = data[year][month].slice(0);;
  sorted.sort(function(a, b){
    if(parseFloat(a.value) && parseFloat(b.value)){
      return a.value - b.value;
    }
    else if(parseFloat(a.value))
      return 0;
    else if(parseFloat(b.value))
      return 0;
    else return 0;
  })

  var little = sorted.slice(0, 5);
  var large = sorted.slice(sorted.length-5, sorted.length).reverse();

  for(var k in large){
    var key = 'upType'+ (parseInt(k)+1);
    $('.name.' + key).text(large[k].name);
    $('.value.' + key).html('<i class="caret up icon"></i>'+large[k].value);
  }

  for(var k in little){
    var key = 'downType'+ (parseInt(k)+1);
    $('.name.' + key).text(little[k].name);
    $('.value.' + key).html('<i class="caret down icon"></i>'+little[k].value);
  }

}
