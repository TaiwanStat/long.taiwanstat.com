//日本近年各項資源甜甜圈圖
var japan_scale_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    japan_scale_width = japan_scale_get_screen_width() - japan_scale_margin.left - japan_scale_margin.right,
    japan_scale_height = japan_scale_get_screen_width() - japan_scale_margin.top - japan_scale_margin.bottom,
    japan_scale_radius = Math.min(japan_scale_width, japan_scale_height) / 2;


function japan_scale_get_screen_width() {
    if (innerWidth < 500) {
        return innerWidth;
    }
    return 500;
}
var japan_scale_transform_x = (scale_width / 2) + scale_margin.left

var japan_scale_svg = d3.select("#japan_scale")
    .append("svg")
    .attr("width", japan_scale_width + japan_scale_margin.left + japan_scale_margin.right)
    .attr("height", japan_scale_height + japan_scale_margin.top + japan_scale_margin.bottom)
    //.attr("transform", "translate（1000,0)")
    .append("g").attr("transform", "translate(" + japan_scale_transform_x + "," + japan_scale_height / 2 + ")");

var japan_scale_color = d3.scaleOrdinal()
    .range(["#354872", "#A51C1E", "#EBAD30", "	#568D4B"]);


var japan_scale_arc = d3.arc()
    .outerRadius(function (d) {

        if (d.data.name == "renewable") {
            return japan_scale_radius * 0.8;
        } else {
            return japan_scale_radius * 0.75;
        }

    })
    .innerRadius(japan_scale_radius * 0.5);

var japan_scale_text_arc = d3.arc()
    .outerRadius(japan_scale_radius * 0.85)
    .innerRadius(japan_scale_radius * 0.85);

var japan_scale_pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.percent });

var japan_scale;
var japan_scale_data;
var japan_scale_total = 0;
var japan_scale_text_year;
var japan_scale_text;
var japan_scale_donut;
var japan_scale_text_name;
var select_cir_year = 97;
var japan_polyline;
var japan_pol_text;
var japan_choose = 3;

function japan_scale_defaultsetting() {
    return {
        circle_color: "#568D4B",
        text_content: "7%",
        text_year_content: "民國97年",
        text_name_content: "再生能源發電比例達"
    };
}

d3.csv("./data/日本各項電力.csv", function (d, i, columns) {
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
    japan_scale_data = data;
    var config = japan_scale_defaultsetting();
    if (error) throw error;
    for (i = 0; i < data[0].energy.length; i++) {
        japan_scale_total = japan_scale_total + data[0].energy[i].percent;
    }
    japan_scale_color.domain(data[0].energy.map(function (d) { return d.name; }));
    var temp;
    for (i = 0; i < data.length; i++) {

        temp = data[i].energy[0].name;
        data[i].energy[0].name = data[i].energy[2].name;
        data[i].energy[2].name = temp;
        temp = data[i].energy[0].percent;
        data[i].energy[0].percent = data[i].energy[2].percent;
        data[i].energy[2].percent = temp
    }

    japan_scale = japan_scale_svg.selectAll(".japan_scalearc")
        .data(function (d) { return japan_scale_pie(data[0].energy); })
        .enter().append("g")
        .attr("class", "japan_scalearc");

    prompt = japan_scale_svg.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "-14.0em")
        .attr("font-size", "0.8em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("用鼠標滑上折線圖可以切換年份資料 ")
    japan_scale_circle = japan_scale.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("opacity", 0.2)
        .attr("r", japan_scale_radius * 0.49)
        .attr("fill", config.circle_color);

    japan_scale_text = japan_scale.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "0.7em")
        .attr("font-size", "3.3em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(config.text_content)

    japan_scale_text_year = japan_scale.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "-2.0em")
        .attr("font-size", "1.3em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(config.text_year_content)

    japan_scale_text_name = japan_scale.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "-1.0em")
        .attr("font-size", "0.8em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(config.text_name_content)

    japan_polyline = japan_scale.append('polyline')
        .attr('points', calculatePoints)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", "2px");

    japan_scale_donut = japan_scale.append("path")
        .attr("d", japan_scale_arc)
        .style("fill", function (d) { return japan_scale_color(d.data.name) })
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
            var select_value_per = calculate_percent(select_value, japan_scale_total)

            japan_scale_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    if (select_name == "fire") { japan_choose = 1; return japan_scale_color.range()[1]; }
                    else if (select_name == "nuclear") { japan_choose = 2; return japan_scale_color.range()[0] }
                    else if (select_name == "water") { japan_choose = 0; return japan_scale_color.range()[2] }
                    else if (select_name == "renewable") { japan_choose = 3; return japan_scale_color.range()[3] }
                })

            var temp_japan_scale_arc = d3.arc()
                .outerRadius(japan_scale_radius * 0.8)
                .innerRadius(japan_scale_radius * 0.5);

            japan_scale_donut
                .attr("d", japan_scale_arc)
                .style("opacity", function (d) {
                    if (d.data.name == "renewable" || d.data.name == "water") {
                        return 1;
                    } else {
                        return 0.6;
                    }
                })

            d3.select(this)
                .attr("d", temp_japan_scale_arc)
                .style("opacity", 1)

            text_update(japan_scale_text_name, select_scale_name(select_name) + "發電比例達")
            text_update(japan_scale_text_year, "民國" + select_cir_year + "年")
            text_update(japan_scale_text, Math.round(select_value_per) + "%")



        }).on("click", function (data) {
            var select_name = d3.select(this).data()[0].data.name;
            var select_value = d3.select(this).data()[0].value;
            var select_value_per = calculate_percent(select_value, japan_scale_total)

            japan_scale_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    if (select_name == "fire") { japan_choose = 1; return japan_scale_color.range()[1]; }
                    else if (select_name == "nuclear") { japan_choose = 2; return japan_scale_color.range()[0] }
                    else if (select_name == "water") { japan_choose = 0; return japan_scale_color.range()[2] }
                    else if (select_name == "renewable") { japan_choose = 3; return japan_scale_color.range()[3] }
                })

            var temp_japan_scale_arc = d3.arc()
                .outerRadius(japan_scale_radius * 0.8)
                .innerRadius(japan_scale_radius * 0.5);

            japan_scale_donut
                .attr("d", japan_scale_arc)
                .style("opacity", function (d) {
                    if (d.data.name == "renewable" || d.data.name == "water") {
                        return 1;
                    } else {
                        return 0.6;
                    }
                })

            d3.select(this)
                .attr("d", temp_japan_scale_arc)
                .style("opacity", 1)

            text_update(japan_scale_text_name, select_scale_name(select_name) + "發電比例達")
            text_update(japan_scale_text_year, "民國" + select_cir_year + "年")
            text_update(japan_scale_text, Math.round(select_value_per) + "%")



        })

    japan_pol_text = japan_scale.append("text")
        .attr("class", "poly")
        .attr("font-size", "15px")
        .attr('transform', labelTransform)
        .style('text-anchor', function (d) {
            // if slice centre is on the left, anchor text to start, otherwise anchor to end
            return (midAngle(d)) < Math.PI ? 'start' : 'end';
        })
        .text(function (d) {
            return select_scale_name(d.data.name);
        });
})

function text_update(text_var, text_content) {
    text_var.text(text_content);
}

