(function(window) {
  
  window.drawChart = drawChart;

  var barDivWidth = $("#bar").width(),
      parseDate = d3.time.format("%Y/%m/%d").parse;

  var margin = {top: 20, right: 20, bottom: 70, left: 40},
      width = barDivWidth - margin.left - margin.right,
      height = 200;

  var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05),
      y = d3.scale.linear().range([height, 0]),
      xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%m/%d")),
      yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);
  

  d3.json("./bar-data.json", function(error, data) {
    drawChart(data, showTip, true);
  });
  
  function showTip(d) {
      return d.date.toLocaleDateString() + 
      '  <strong>病例數：</strong> <span style="color:red">' + d.value + '</span><br/>' +
      '<strong>氣溫：</strong> <span style="color:red">' + d.氣溫 + '</span> '+
      '<strong>降水量：</strong> <span style="color:red">' + d.降水量 + '</span> ' +
      '<strong>相對溼度：</strong> <span style="color:red">' + d.相對溼度 + '</span>';
  }

  function drawChart(data, tipInfo, showLine) {
    tip.html(tipInfo);

    svg = d3.select("#bar").append("svg")
      .attr("width", '100%')
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")")
      .call(tip);
    
    data.forEach(function(d) {
      if (typeof d.date === 'string') 
        d.date = parseDate(d.date);
      d.value = +d.value;
    });
    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);
    addAxis();
    addBar(data);
    if (showLine) {
      addMovingLine(data, 5, '五日移動平均線', '#E10707', -10, width-100);
      addMovingLine(data, 10, '十日移動平均線', '#15B321', -10, width-220);
    }
  }

  function addMovingLine(data, days, title, color, y_pos, x_pos) {

    var movingAverageLine = movingAvg(days);
    var lineData = movingAverageLine(data);
    var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); });

    svg.append("path")
      .datum(lineData)
      .attr("class", "line")
      .attr("stroke", color)
      .attr("d", line);
  
    svg.append("text")
      .attr("transform", "translate(" + x_pos + "," + y_pos + ")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", color)
      .text(title);
  }

  function addBar(data) {
    svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", function(d) {
        if (d.降水量 > 0) {
          return 'orange';
        }
        return "steelblue";
      })
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr('id', function(d) {
        var _d = new Date(d.date.getTime()+86400000);
        var id = 'bar-'+_d.toISOString().substring(0, 10).replace(/-/g, '-');
        return id;
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
  }

  function addAxis() {
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-65)" );

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("當日病例數（人）");
  }

  function movingAvg(n) {
    return function (points) {
      points = points.map(function(each, index, array) {
        var to = index + n - 1;
        var subSeq, sum;
        if (to < points.length) {
            subSeq = array.slice(index, to + 1);
            sum = subSeq.reduce(function(a,b) { 
                return {value: a.value + b.value}; 
            });
            return {value: sum.value/n, date: subSeq[subSeq.length-1].date};
        }
        return undefined;
      });
      points = points.filter(function(each) { return typeof each !== 'undefined';});
      return points;
    };
  }

   

})(window);
