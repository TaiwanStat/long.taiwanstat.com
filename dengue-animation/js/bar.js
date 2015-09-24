var barDivWidth = $("#bar").width();

var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = barDivWidth - margin.left - margin.right,
    height = 200;

// Parse the date / time
var parseDate = d3.time.format("%Y/%m/%d").parse;

var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%m/%d"));

var x2 = d3.scale.linear()
      .domain([0, 1])
      .range([0, width]);

var y2 = d3.scale.linear()
      .domain([0, 100])
      .rangeRound([height, 0]);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return d.date.toLocaleDateString() + '<br/>' +
    '<strong>病例數:</strong> <span style="color:red">' + d.value + '</span>' +
    '<strong>氣溫:</strong> <span style="color:red">' + d.氣溫 + '</span>'+
    '<strong>降水量:</strong> <span style="color:red">' + d.降水量 + '</span>';
  });

var svg = d3.select("#bar").append("svg")
    .attr("width", '100%')
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);


d3.json("./bar-data.json", function(error, data) {
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });
 
  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

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

  movingAvg = function(n) {
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
  };
  var movingAverageLine = movingAvg(5);
  var lineData = movingAverageLine(data);
  var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

  svg.append("path")
      .datum(lineData)
      .attr("class", "line")
      .attr("d", line);
  
  svg.append("text")
    .attr("transform", "translate(" + (width-100) + "," + -10 + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("5日移動平均線");

});
