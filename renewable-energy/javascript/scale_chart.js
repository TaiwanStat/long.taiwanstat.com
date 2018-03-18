//台灣近年各項能源甜甜圈圖
var scale_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    scale_width = scale_get_screen_width() - scale_margin.left - scale_margin.right,
    scale_height = scale_get_screen_width() - scale_margin.top - scale_margin.bottom,
    scale_radius = Math.min(scale_width, scale_height) / 2;


function scale_get_screen_width() {
    if (innerWidth < 500) {
        return innerWidth;
    }
    return 500;
}
var scale_transform_x = (scale_width/2)+scale_margin.left

var scale_svg = d3.select("#scale_chart")
    .append("svg")
    .attr("width", scale_width + scale_margin.left + scale_margin.right)
    .attr("height", scale_height + scale_margin.top + scale_margin.bottom)
    .append("g").attr("transform", "translate(" + scale_transform_x + "," + scale_height / 2 + ")");

var scale_color = d3.scaleOrdinal()
    .range(["#A51C1E", "#354872", "#EBAD30", "	#568D4B"]);


var scale_arc = d3.arc()
    .outerRadius(function (d) {
        if (d.data.name == "renewable") {
            return scale_radius * 0.85;
        } else {
            return scale_radius * 0.8;
        }

    })
    .innerRadius(scale_radius * 0.55);

var scale_text_arc = d3.arc()
    .outerRadius(scale_radius * 0.9)
    .innerRadius(scale_radius * 0.9);

var scale_pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.percent });

var scale;
var scale_data;
var scale_total = 0;
var scale_text_year;
var scale_text;
var scale_donut;
var scale_text_name;
var select_cir_year = 97;

function scale_defaultsetting() {
    return {
        circle_color: "#568D4B",
        text_content: "4%",
        text_year_content: "民國97年",
        text_name_content: "再生能源發電比例達"
    };
}

d3.csv("./data/his_ele_cate.csv", function (d, i, columns) {
    return {
        year: +d.year,
        energy: columns.slice(1).map(function (key) {
            return {
                name: key,
                percent: +d[key]
            };
        })
    };

}, function (error, data) {
    scale_data = data;

    var config = scale_defaultsetting();

    if (error) throw error;
    for (i = 0; i < data[1].energy.length; i++) {
        scale_total = scale_total + data[1].energy[i].percent;
    }
    scale_color.domain(data[1].energy.map(function (d) { return d.name; }));
    var temp;
    for (i = 0; i < data.length; i++) {
        temp = data[i].energy[0].name;
        data[i].energy[0].name = data[i].energy[2].name;
        data[i].energy[2].name = temp;
        temp = data[i].energy[0].percent;
        data[i].energy[0].percent = data[i].energy[2].percent;
        data[i].energy[2].percent = temp
    }

    scale = scale_svg.selectAll(".scalearc")
        .data(function (d) { return scale_pie(data[0].energy); })
        .enter().append("g")
        .attr("class", "scalearc");

    scale_circle = scale.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("opacity", 0.2)
        .attr("r", scale_radius * 0.54)
        .attr("fill", config.circle_color);

    scale_text = scale.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "0.7em")
        .attr("font-size", "3.5em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(config.text_content)
    scale_text_year = scale.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "-2.0em")
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(config.text_year_content)
    scale_text_name = scale.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "-1.0em")
        .attr("font-size", "1.0em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(config.text_name_content)

    var polyline = scale.append('polyline')
        .attr('points', calculatePoints)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", "2px");

    scale_donut = scale.append("path")
        .attr("d", scale_arc)
        .style("fill", function (d) { return scale_color(d.data.name) })
        .style("opacity", function (d) {
            if (d.data.name == "renewable") {
                return 1;
            } else {
                return 0.6;
            }
        })
        .on("mouseenter", function (data) {
            var select_name = d3.select(this).data()[0].data.name;
            var select_value = d3.select(this).data()[0].value;
            var select_value_per = calculate_percent(select_value, scale_total)

            scale_circle
                .attr("opacity", 0.2)
                .style("fill", set_scale_color(select_name))

            var temp_scale_arc = d3.arc()
                .outerRadius(scale_radius * 0.85)
                .innerRadius(scale_radius * 0.55);

            scale_donut
                .attr("d", scale_arc)
                .style("opacity", function (d) {
                    if (d.data.name == "renewable" || d.data.name == "water") {
                        return 1;
                    } else {
                        return 0.6;
                    }
                })
            d3.select(this)
                .attr("d", temp_scale_arc)
                .style("opacity", 1)

            scale_text_name.text(select_scale_name(select_name) + "發電比例達");

            scale_text_year.text("民國" + select_cir_year + "年");
            scale_text.text(Math.round(select_value_per) + "%")
            scale_stack_rect.select("rect")
                .style("opacity", function (d) {
                    if (d.name == select_name || d.name == "renewable") {
                        return 1;
                    } else {
                        return 0.6;
                    }
                })
        }) .on("click", function (data) {
            var select_name = d3.select(this).data()[0].data.name;
            var select_value = d3.select(this).data()[0].value;
            var select_value_per = calculate_percent(select_value, scale_total)

            scale_circle
                .attr("opacity", 0.2)
                .style("fill", set_scale_color(select_name))

            var temp_scale_arc = d3.arc()
                .outerRadius(scale_radius * 0.85)
                .innerRadius(scale_radius * 0.55);

            scale_donut
                .attr("d", scale_arc)
                .style("opacity", function (d) {
                    if (d.data.name == "renewable" || d.data.name == "water") {
                        return 1;
                    } else {
                        return 0.6;
                    }
                })
            d3.select(this)
                .attr("d", temp_scale_arc)
                .style("opacity", 1)

            scale_text_name.text(select_scale_name(select_name) + "發電比例達");

            scale_text_year.text("民國" + select_cir_year + "年");
            scale_text.text(Math.round(select_value_per) + "%")
            scale_stack_rect.select("rect")
                .style("opacity", function (d) {
                    if (d.name == select_name || d.name == "renewable") {
                        return 1;
                    } else {
                        return 0.6;
                    }
                })
        })

    scale.append("text")
        .attr("font-size", "15px")
        .attr('transform', labelTransform)
        .style('text-anchor', function (d) {
            return (midAngle(d)) < Math.PI ? 'start' : 'end';
        })
        .text(function (d) {
            return select_scale_name(d.data.name);
        });
})


function select_scale_name(select_name) {
    if (select_name == "fire") {
        return "火力";
    }
    else if (select_name == "nuclear") { return "核能"; }
    else if (select_name == "water") { return "抽蓄水力"; }
    else if (select_name == "renewable") { return "再生能源" }
}
function set_scale_color(scale_name) {
    if (scale_name == "fire") { choose_ener = 2; return scale_color.range()[0]; }
    else if (scale_name == "nuclear") { choose_ener = 1; return scale_color.range()[1] }
    else if (scale_name == "water") { choose_ener = 0; return scale_color.range()[2] }
    else if (scale_name == "renewable") { choose_ener = 3; return scale_color.range()[3] }
}


function calculatePoints(d) {
    var pos = scale_text_arc.centroid(d);
    pos[0] = scale_radius * 0.7 * (midAngle(d) < Math.PI ? 1 : -1);
    return [scale_arc.centroid(d), scale_text_arc.centroid(d), pos]
}

function labelTransform(d) {
    var pos = scale_text_arc.centroid(d);

    pos[0] = scale_radius * 0.75 * (midAngle(d) < Math.PI ? 1 : -1);
    return 'translate(' + pos + ')';
}

function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }
