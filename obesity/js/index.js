var margin = {top: 20, right: 20, bottom: 60, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .3);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["rgb(96, 79, 230)", "rgb(251, 210, 35)", "rgb(255, 87, 44)"]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(function(d) { return d + "%"; });

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>百分比:</strong> <span style='color:red'>" + d.value + "%"+ "</span>";
      })


    var svg = d3.select("#vis").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);



  d3.csv("output.csv", function(error, data) {



  var Group_Names = d3.keys(data[0]).filter(function(key) { return (key !== "County" && key!== "Sample_size"); });

  data.forEach(function(d) {
  d.groups = Group_Names.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0.domain(data.map(function(d) { return d.County; }));
  x1.domain(Group_Names).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, 70]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)


  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("百分比");

  var County = svg.selectAll(".County")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.County) + ",0)"; });

  County.selectAll("rect")
      .data(function(d) { return d.groups; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);


  var legend = svg.selectAll(".legend")
      .data(Group_Names.slice())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


  legend.append("rect")
      .attr("x", width - 18)
        .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);


  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

      // debugger;
      

    //SORTING
    
    d3.select(".male_sort").on("click", sort_male);
    d3.select(".female_sort").on("click", sort_female);
    d3.select(".average_sort").on("click", sort_average);


    function sort_male() {

    var x2 = x0.domain(data.sort(this.checked
          = function(a, b) { return b.男性 - a.男性; })
          .map(function(d) { return d.County; }))
          .copy();

      var transition = svg.transition().duration(750),
          delay = function(d, i) { return i * 50; };

      var County2 = transition.selectAll(".County")
          .delay(delay)
          .attr("x", function(d) { return x2(d.County); });

      svg.selectAll("g.g")
         .transition().duration(750)
         .delay(delay)
         .attr("transform", function(d) { return "translate(" + x2(d.County) + ",0)"; });

      transition.select(".x.axis")
          .call(xAxis)
          .selectAll("g")
          .delay(delay);

      // svg.append("text")
      //   .attr("x", 50)
      //   .attr("y", 400)
      //   .attr("font-size", "20px")
      //   .text("第一名");
    }

    function sort_female() {

      var x2 = x0.domain(data.sort(this.checked
        = function(a, b) { return b.女性 - a.女性; })
        .map(function(d) { return d.County; }))
        .copy();

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    var County2 = transition.selectAll(".County")
        .delay(delay)
        .attr("x", function(d) { return x2(d.County); });

    svg.selectAll("g.g")
       .transition().duration(750)
       .delay(delay)
       .attr("transform", function(d) { return "translate(" + x2(d.County) + ",0)"; });

    transition.select(".x.axis")
        .call(xAxis)
        .selectAll("g")
        .delay(delay);
    }

  

    function sort_average() {

      var x2 = x0.domain(data.sort(this.checked
          = function(a, b) { return b.男女平均 - a.男女平均; })
          .map(function(d) { return d.County; }))
          .copy();

      var transition = svg.transition().duration(750),
          delay = function(d, i) { return i * 50; };

      var County2 = transition.selectAll(".County")
          .delay(delay)
          .attr("x", function(d) { return x2(d.County); });

      svg.selectAll("g.g")
         .transition().duration(750)
         .delay(delay)
         .attr("transform", function(d) { return "translate(" + x2(d.County) + ",0)"; });

      transition.select(".x.axis")
          .call(xAxis)
          .selectAll("g")
          .delay(delay);
    }
    


  })

