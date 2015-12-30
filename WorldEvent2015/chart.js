var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// var x = d3.scale.ordinal()
    // .rangeRoundBands([0, width], .1);

// var y = d3.scale.linear()
    // .range([height, 0]);

// var xAxis = d3.svg.axis()
    // .scale(x)
    // .orient("bottom");

// var yAxis = d3.svg.axis()
    // .scale(y)
    // .orient("left");

console.log(width);
console.log(height);

var chart = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

line_width = 4
rect_width = 70
rect_height = 30

chart.append("line")
    .attr("x1", 0)
    .attr("y1", height-230 + rect_height/2)
    .attr("x1", line_width)
    .attr("y2", height-230 + rect_height/2)
    .attr("stroke-width", 2)
    .attr("stroke", "black");

for (i = 1; i < 13; i++) {
  chart.append("rect")
      .attr("x", line_width + ((line_width + rect_width) * (i-1)))
      .attr("y", height-230)
      .attr("width", rect_width)
      .attr("height", 30)
      .attr("fill", 'gray');

  chart.append("text")
      .attr("x", line_width + ((line_width + rect_width) * (i-1)) + rect_width/2 - 11)
      .attr("y", height-230 + rect_height/2 + 5)
      .text(i + "月");

  chart.append("line")
      .attr("x1", (line_width+rect_width) * i)
      .attr("y1", height-230 + rect_height/2)
      .attr("x2", (line_width+rect_width) * i + line_width)
      .attr("y2", height-230 + rect_height/2)
      .attr("stroke-width", 2)
      .attr("stroke", "black");
}

// var defs = chart.append("defs").attr("id", "imgdefs");

// d3.json("data.json",function(error, data) {
  // x.domain([1,2,3,4,5,6,7,8,9,10,11,12]);
  // y.domain([0,1200]);

  // chart.append("g")
      // .attr("class", "x axis")
      // .attr("transform", "translate(0," + height + ")")
      // .call(xAxis);

  // chart.append("g")
      // .attr("class", "y axis")
      // .call(yAxis);

  // catpattern = defs.append("pattern")
                    // .data(data)
                    // .attr("id", function(d) {return d.count})
                    // .attr("height", 1)
                    // .attr("width", 1)
                    // .attr("x", "0")
                    // .attr("y", "0");

  // catpattern.append("image")
          // .data(data)
          // .attr("x", function(d) {return x(d.month) - 50})
          // .attr("y", function(d) {return y(d.count) - 50})
          // .attr("height", 640)
          // .attr("width", 480)
          // .attr("xlink:href", function(d) {return d.image_link})

  // chart.selectAll(".bar")
      // .data(data)
    // .enter().append("circle")
      // .attr("class", "bar")
      // .attr("cx", function(d) { return x(d.month)+20; })
      // .attr("cy", function(d) { return y(d.count); })
      // .attr("r", function(d) { return d.count/60; })
      // .style("fill", function(d) { return "url(#" + d.count + ")"});
// });

// function type(d) {
  // d.count = +d.count; // coerce to number
  // return d;
// }
