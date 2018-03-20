var co_line_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    co_line_width = 800 - co_line_margin.left - co_line_margin.right,
    co_line_height = 300 - co_line_margin.top - co_line_margin.bottom;

var co_line_svg = d3.select("#co")
    .append("svg")
    .attr("width", co_line_width + co_line_margin.left + co_line_margin.right)
    .attr("height", co_line_height + co_line_margin.top + co_line_margin.bottom)
    .attr("transform", "translate(0,-100)");


var co_line_g = co_line_svg.append("g").attr("transform", "translate(" + co_line_margin.left + "," + co_line_margin.top + ")");

var co_line_x = d3.scaleTime().range([0, co_line_width]),
    co_line_y = d3.scaleLinear().range([co_line_height, 0]);


var co_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return co_line_x(d.year); })
    .y(function (d) { return co_line_y(d.co); });

d3.csv("./data/energy_type.csv", function (d) {
    d.year = +d.year;
    d.co = (+d.solar + d.water + d.wind)*0.529/1000;
    d.wind = +d.wind;
    d.solar = +d.solar;
    d.water = +d.water;
    d.bio = +d.bio;
    d.gar = +d.gar;
    return d;
}, function (error, data) {
    co_line_x.domain(d3.extent(data, function (d) { return d.year; }));
    co_line_y.domain([0, d3.max(data, function (d) {
        return Math.max(d.co);
    })])
    co_line_g.append("g")
        .attr("transform", "translate(0," + co_line_height + ")")
        .call(d3.axisBottom(co_line_x))
        .select(".domain");


    co_line_g.append("g")
        .call(d3.axisLeft(co_line_y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .select(".domain")
        .remove();
    
        co_line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "co_line")
        .attr("stroke", "#FF5511")
        .attr("stroke-width", 2.5)
        .attr("d", co_line);
})