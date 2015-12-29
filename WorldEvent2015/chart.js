var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


var chart = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data.json",function(error, data) {
  x.domain([1,2,3,4,5,6,7,8,9,10,11,12]);
  y.domain([0,1200]);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);


  chart.selectAll(".bar")
      .data(data)
    .enter().append("circle")
      .attr("class", "bar")
      .attr("cx", function(d) { return x(d.month)+20; })
      .attr("cy", function(d) { return y(d.count); })
      .attr("r", function(d) { return sqrt(d.count)*20; });
});

function type(d) {
  d.count = +d.count; // coerce to number
  return d;
}
