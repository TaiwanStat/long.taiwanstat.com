var margin = {top: 20, right: 20, bottom: 30, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, 1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return d.total;
  })

var svg = d3.select("#content").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.json("population.json", function(error, data) {
  var year = [];
  var district = [];
  var districtName =  [];
  var total = [];

  for(_key in data) {
    // year
    year.push(_key);
  }

  var year_data = data[year[0]];

  for(_key_year in year_data) {
    district.push(_key_year);
    // district
    var _count = 0;
    for(_district in year_data[_key_year]) {
      districtName.push(_district);
      _count += year_data[_key_year][_district];
    }
    total.push(_count);
  }

  total.forEach(function(d) {
    d = +d;
  });

  x.domain(district);
  y.domain([0, d3.max(total)]);

  d3.select("#year_population").html(+year[0] + 1911)

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Population");

  var stat_arr = [];
  district.forEach(function(d, i) {
    stat_arr.push({
      "district": d,
      "total": total[i]
    });
  });

  svg.selectAll(".bar")
    .data(stat_arr)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.district); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.total); })
      .attr("height", function(d) { return height - y(d.total); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  var count_year = 0;
  var set_switch_year;

  function set_loop() {
    clearTimeout(set_switch_year);
    set_switch_year = setInterval(function() {
      addYear(count_year);
      count_year++;
    }, 1000)
  }

  set_loop();

  document.getElementById("restart").onclick = function() {
    count_year = 0;
    set_loop();
  }

  document.getElementById("start").onclick = function() {
    if (count_year == 23){
      count_year = 0; //prevent for NaN
    }
    set_loop()
  }

  document.getElementById("stop").onclick = function() {
    clearTimeout(set_switch_year);
  }

  document.getElementById("next").onclick = function() {
    if (count_year == 22){
      count_year = 0;
    }else {
      count_year++;
    }
    addYear(count_year);
  }

  document.getElementById("prev").onclick = function () {
    if (count_year == 0){
      count_year = 22;
    }else {
      count_year--;
    }
    addYear(count_year);
  }

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(stat_arr.sort(this.checked
        ? function(a, b) { return b.total - a.total; }
        : function(a, b) { return d3.ascending(a.district, b.district); })
        .map(function(d) { return d.district; }))
        .copy();

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.district); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }

  function addYear(count) {
    if(year[count] === "102") {
      clearInterval(set_switch_year);
    }
    var year_data = data[year[count]];
    var district = [];
    var districtName = [];
    var total = [];

    for(_key_year in year_data) {
      district.push(_key_year);
      // district
      var _count = 0;
      for(_district in year_data[_key_year]) {
        districtName.push(_district);
        _count += year_data[_key_year][_district];
      }
      total.push(_count);
    }

    var stat_arr_new = [];
    district.forEach(function(d, i) {
      stat_arr_new.push({
        "district": d,
        "total": +total[i]
      });
    });



    var transition = svg.transition().duration(750);
    var x1 = x.domain(stat_arr.map(function(d) { return d.district}));

    var y1 = y.domain([0, d3.max(stat_arr_new, function(d) { return d.total; })]);

    d3.select("#year_population").html(+year[count] + 1911);

    svg.selectAll(".bar")
      .data(stat_arr_new)
      .attr("y", function(d) { return y1(d.total); })
      .attr("height", function(d) { return height - y1(d.total); });

  }
});
