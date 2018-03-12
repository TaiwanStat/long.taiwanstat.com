
var margin = { top: 20, right: 50, bottom: 30, left: 50 },
    donut_width = donut_get_screen_width() - margin.left - margin.right,
    donut_height = donut_get_screen_width() - margin.top - margin.bottom,
    radius = Math.min(donut_width, donut_height) / 2;

function donut_get_screen_width() {
    console.log(innerWidth)
    if (innerWidth < 470) {
        return innerWidth;
    }
    return 470;
}


var init_arc = d3.arc()
    .outerRadius(function (d) {
        if (d.data.name == "台電") {
            return radius * 0.85;
        } else {
            return radius * 0.8;
        }
    })
    .innerRadius(radius * 0.55);

var arc = d3.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.55);
var water_color = d3.scaleOrdinal()
    .range(["#87CEFA", "#4169E1"]);
var wind_color = d3.scaleOrdinal()
    .range(["#32CD32", "#3CB371"]);
var sun_color = d3.scaleOrdinal()
    .range(["#FFDD55", "#FFBB00"]);
var pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.percent });

    var donut_transform_x = (donut_width/2)

    
var sun_svg = d3.select("#donut_chart").append("svg")
    .attr("width", donut_width)
    .attr("height", donut_height)
    .append("g")
    .attr("transform", "translate(" + donut_transform_x + "," + donut_height / 2 + ")");

var water_svg = d3.select("#donut_chart").append("svg")
    .attr("width", donut_width)
    .attr("height", donut_height)
    .append("g")
    .attr("transform", "translate(" + donut_transform_x + "," + donut_height / 2 + ")");

var wind_svg = d3.select("#donut_chart").append("svg")
    .attr("width", donut_width)
    .attr("height", donut_height)
    .append("g")
    .attr("transform", "translate(" + donut_transform_x + "," + donut_height / 2 + ")");

var sun_label_text = sun_svg.append("text")
    .attr("transform", "translate(0,0)")
    .attr("dy", "-7.5em")
    .attr("font-size", "1.3em")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("太陽能發電")

var water_label_text = water_svg.append("text")
    .attr("transform", "translate(0,0)")
    .attr("dy", "-7.5em")
    .attr("font-size", "1.3em")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("水力發電")

var wind_label_text = wind_svg.append("text")
    .attr("transform", "translate(0,0)")
    .attr("dy", "-7.5em")
    .attr("font-size", "1.3em")
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("風力發電")

var mouseenter_arc = d3.arc()
    .outerRadius(radius * 0.85)
    .innerRadius(radius * 0.55);

var sun;
var water;
var wind;
var sun_data;
var water_data;
var wind_data;
var sun_text_year;
var sun_text;
var sun_text_type;
d3.csv("./data/sun.csv", function (d, i, columns) {
    return {
        year: +d.year,
        pers: columns.slice(1).map(function (key) {
            return {
                name: key,
                percent: +d[key]
            };
        })
    };
}, function (error, data) {
    sun_data = data;
    if (error) throw error;
    sun_color.domain(data[1].pers.map(function (d) { return d.name; }));

    sun = sun_svg.selectAll(".arc")
        .data(function (d) { return pie(data[0].pers); })
        .enter().append("g")
    sun_circle = sun.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("opacity", 0.2)
        .attr("r", radius * 0.54)
        .attr("fill", "#FFDD55")
    sun_text = sun.append("text")
        .attr("dy", "0.8em")
        .attr("font-size", "1.8em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("0.098百萬度")
    sun_text_type = sun.append("text")
        .attr("dy", "-0.8em")
        .attr("font-size", "1em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("台電發電量達")
    sun_text_year = sun.append("text")
        .attr("dy", "-1.8em")
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("民國97年")
    var sun_donut = sun.append("path")
        .attr("d", init_arc)
        .style("fill", function (d) { return sun_color(d.data.name) })
        .on("mouseenter", function (data) {
            var select_name = d3.select(this).data()[0].data.name;
            var select_value = d3.select(this).data()[0].value;

            sun_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    if (select_name === "台電") { return sun_color.range()[0]; }
                    else { return sun_color.range()[1] }
                })


            sun_donut.attr("d", arc)
            d3.select(this)
                .attr("d", mouseenter_arc)



            text_update(sun_text_year, "民國" + select_cir_year + "年")
            text_update(sun_text_type, select_name + "發電量達")
            text_update(sun_text, select_value + "百萬度")


        }).on("click", function (data) {
            var select_name = d3.select(this).data()[0].data.name;
            var select_value = d3.select(this).data()[0].value;

            sun_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    if (select_name === "台電") { return sun_color.range()[0]; }
                    else { return sun_color.range()[1] }
                })


            sun_donut.attr("d", arc)
            d3.select(this)
                .attr("d", mouseenter_arc)



            text_update(sun_text_year, "民國" + select_cir_year + "年")
            text_update(sun_text_type, select_name + "發電量達")
            text_update(sun_text, select_value + "百萬度")


        })

    sun.append("text")
        .attr("class", "text_remove_sun")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) { return d.data.name; });


})
var water_text;
var water_text_type;
var water_text_year;
d3.csv("./data/water.csv", function (d, i, columns) {
    return {
        year: +d.year,
        pers: columns.slice(1).map(function (key) {
            return {
                name: key,
                percent: +d[key]
            };
        })
    };
}, function (error, data) {
    water_data = data;
    if (error) throw error;

    water_color.domain(data[1].pers.map(function (d) { return d.name; }));

    water = water_svg.selectAll(".arc")
        .data(function (d) { return pie(data[0].pers); })
        .enter().append("g")
    water_circle = water.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("opacity", 0.2)
        .attr("r", radius * 0.54)
        .attr("fill", "#87CEFA")
    water_text = water.append("text")
        .attr("dy", "0.8em")
        .attr("font-size", "1.8em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("3411百萬度")
    water_text_type = water.append("text")
        .attr("dy", "-0.8em")
        .attr("font-size", "1em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("台電發電量達")
    water_text_year = water.append("text")
        .attr("dy", "-1.8em")
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("民國97年")

    var water_donut = water.append("path")
        .attr("d", init_arc)
        .style("fill", function (d) { return water_color(d.data.name) })
        .on("mouseenter", function (data) {
            var select_name = d3.select(this).data()[0].data.name;
            var select_value = d3.select(this).data()[0].value;

            water_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    if (select_name === "台電") { return water_color.range()[0]; }
                    else { return water_color.range()[1] }
                })


            water_donut.attr("d", arc)
            d3.select(this)
                .attr("d", mouseenter_arc)


            text_update(water_text_year, "民國" + select_cir_year + "年")
            text_update(water_text_type, select_name + "發電量達")
            text_update(water_text, Math.round(select_value) + "百萬度")

        }).on("click", function (data) {
            var select_name = d3.select(this).data()[0].data.name;
            var select_value = d3.select(this).data()[0].value;

            water_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    if (select_name === "台電") { return water_color.range()[0]; }
                    else { return water_color.range()[1] }
                })


            water_donut.attr("d", arc)
            d3.select(this)
                .attr("d", mouseenter_arc)


            text_update(water_text_year, "民國" + select_cir_year + "年")
            text_update(water_text_type, select_name + "發電量達")
            text_update(water_text, Math.round(select_value) + "百萬度")

        })


    water.append("text")
        .attr("class", "text_remove_water")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) { return d.data.name; });



})
var wind_text;
var wind_text_type;
var wind_text_year;
d3.csv("./data/wind.csv", function (d, i, columns) {
    return {
        year: +d.year,
        pers: columns.slice(1).map(function (key) {
            return {
                name: key,
                percent: +d[key]
            };
        })
    };
}, function (error, data) {
    wind_data = data;
    if (error) throw error;

    wind_color.domain(data[1].pers.map(function (d) { return d.name; }));


    wind = wind_svg.selectAll(".arc")
        .data(function (d) { return pie(data[0].pers); })
        .enter().append("g")
    wind_circle = wind.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("r", radius * 0.54)
        .attr("opacity", 0.2)
        .attr("fill", "#32CD32")
    wind_text = wind.append("text")
        .attr("dy", "0.8em")
        .attr("font-size", "180%")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("273百萬度")
    wind_text_type = wind.append("text")
        .attr("dy", "-0.8em")
        .attr("font-size", "1em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("台電發電量達")
    wind_text_year = wind.append("text")
        .attr("dy", "-1.8em")
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("民國97年")


    var wind_donut = wind.append("path")
        .attr("d", init_arc)
        .style("fill", function (d) { return wind_color(d.data.name) })
        .on("mouseenter", function (data) {
            var select_name = d3.select(this).data()[0].data.name;
            var select_value = d3.select(this).data()[0].value;

            wind_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    if (select_name == "台電") { return wind_color.range()[0]; }
                    else { return wind_color.range()[1] }
                })

            wind_donut.attr("d", arc)
            d3.select(this)
                .attr("d", mouseenter_arc)


            text_update(wind_text_year, "民國" + select_cir_year + "年")
            text_update(wind_text_type, select_name + "發電量達")
            text_update(wind_text, Math.round(select_value) + "百萬度")

        }).on("click", function (data) {
            var select_name = d3.select(this).data()[0].data.name;
            var select_value = d3.select(this).data()[0].value;

            wind_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    if (select_name == "台電") { return wind_color.range()[0]; }
                    else { return wind_color.range()[1] }
                })

            wind_donut.attr("d", arc)
            d3.select(this)
                .attr("d", mouseenter_arc)


            text_update(wind_text_year, "民國" + select_cir_year + "年")
            text_update(wind_text_type, select_name + "發電量達")
            text_update(wind_text, Math.round(select_value) + "百萬度")

        })
    wind.append("text")
        .attr("class", "text_remove_wind")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) { return d.data.name; });
})

function text_update(text_var, text_content) {
    text_var.text(text_content);
}
