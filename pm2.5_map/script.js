$("#select-area").change(function() {
  $('svg').remove();
  drew_pic($(this).val());
})

drew_pic("中部空品區")

var width = 960,
    height = 156,
    cellSize = 17; // cell size

var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    format = d3.time.format("%Y/%m/%d");

var color = d3.scale.linear()
    .domain([0, 12, 35, 55, 150, 250])
    .range(["#70bf48", "#fbe20b", "#f08c36", "#e12f2b", "#c13f89", "#954731"]);

var domain = d3.scale.linear()
    .domain([0, 12, 35, 55, 150, 250])
    .range([0, 50, 100, 150, 200, 250])

var xAxis = d3.svg.axis()
  .scale(domain)
  .tickValues(domain.domain())
  .orient("bottom");

var domain_svg = d3.select('#domain')
  .append("svg")
  .attr("height", 100)
  .attr("width", 500)

var g = domain_svg
  .append("g")
  .attr("class", "key")
  .attr("transform", "translate(40,40)");

g.call(xAxis).append("text")
  .attr("class", "caption")
  .attr("y", -10)
  .text("美國空污標準");

g.selectAll("rect")
  .data(["#70bf48", "#fbe20b", "#f08c36", "#e12f2b", "#c13f89", "#954731"])
  .enter().append("rect")
  .attr("height", 10)
  .attr("x", function(d, i) { return 50 * i; })
  .attr("y", -3)
  .attr("width", 50)
  .style("fill", function(d) { return d; });

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "valueTip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")


function drew_pic(area) {

  d3.json("./filter/103_HOUR_00_20150324/103年 " + area + "/fs_name.json", function(err, fs_name) {

    var svg = d3.select("#chart").selectAll("svg")
        .data(fs_name)
      .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "RdYlGn")
        .attr("id", function(d) { return 'region-' + d;})
      .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(," + cellSize * 3.5 + ")rotate(0)")
        .style("text-anchor", "start")
        .attr("x", "-10")
        .attr("y", "-10")
        .text(function(d) { return d; });

    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(2014, 0, 1), new Date(2015, 0, 1)); })
      .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) { return week(d) * cellSize; })
        .attr("y", function(d) { return day(d) * cellSize; })
        .datum(format);

    rect.append("title")
        .text(function(d) { return d; });

    svg.selectAll(".month")
        .data(function(d) { return d3.time.months(new Date(2014, 0, 1), new Date(2015, 0, 1)); })
      .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);


    d3.json("./filter/103_HOUR_00_20150324/103年 " + area + "/fs_path.json", function(error, fs_path) {
      fs_path.forEach(function(path, i) {

        d3.json(path, function(err, json) {
          var data = d3.nest()
            .key(function(d) { return d["日期"]; })
            .rollup(function(d) { return d[0].sum; })
            .map(json);

          d3.selectAll('#region-' + fs_name[i] + ' .day')
              .filter(function(d) { return d in data; })
              .style("fill", function(d) {return color(data[d])})
              .attr("original-title", function(d) {return d + ": " + data[d].toFixed(2); })
            .select("title")
              .text(function(d) {return d + ": " + data[d]; })
        })
      })
    })
    $(function() {
      $('.day').tipsy({gravity: $.fn.tipsy.autoNS});
    });
  })

  function monthPath(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = +day(t0), w0 = +week(t0),
        d1 = +day(t1), w1 = +week(t1);
    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
        + "H" + w0 * cellSize + "V" + 7 * cellSize
        + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
        + "H" + (w1 + 1) * cellSize + "V" + 0
        + "H" + (w0 + 1) * cellSize + "Z";
  }
}
