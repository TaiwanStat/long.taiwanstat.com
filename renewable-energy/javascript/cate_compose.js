var cate_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    cate_width = 500 - cate_margin.left - cate_margin.right,
    cate_height = 500 - cate_margin.top - cate_margin.bottom,
    cate_radius = Math.min(cate_width, cate_height) / 2;

var cate_svg = d3.select("#cate")
    .append("svg")
    .attr("width", cate_width + cate_margin.left + cate_margin.right)
    .attr("height", cate_height + cate_margin.top + cate_margin.bottom)
    //.attr("transform", "translate（1000,0)")
    .append("g").attr("transform", "translate(" + cate_width * 1.2 / 2 + "," + cate_height / 2 + ")");

var cate_arc = d3.arc()
    .outerRadius(cate_radius * 0.8)
    .innerRadius(cate_radius * 0.55);

var cate_color = d3.scaleOrdinal()
    .range(["#FF5511", "#FFFF33", "#5599FF", "	#00AA00", "#AAFFEE"]);

var cate_pie = d3.pie()
    .sort(null)
    .value(function (d) {
        return d.percent
    });
var temp = 0;
var cate;
var sun_temp = 0;
var wind_temp = 0;
var cate_data;
var cate_total = 0;
d3.csv("./data/energy_type.csv", function (d, i, columns) {
    return {
        year: +d.year,
        energy: columns.slice(1).map(function (key) {
            if (key == "bio") {//生殖能有乘上50
                return {
                    name: key,
                    percent: (+d[key]) * 50
                }
            } else {
                return {
                    name: key,
                    percent: +d[key]
                }
            }

        })
    };
}, function (error, data) {
    console.log(data)

    for (i = 0; i < data[1].energy.length; i++) {
        if (data[1].energy[i].name == "bio") {
            cate_total = cate_total + data[1].energy[i].percent / 50;
        } else if (data[1].energy[i].name == "solar") {
            cate_total = cate_total + data[1].energy[i].percent / 10;
        } else {
            cate_total = cate_total + data[1].energy[i].percent;
        }
    }

    cate_data = data;
    cate = cate_svg.selectAll(".arc")
        .data(function (d) {
            console.log(cate_pie(data[1].energy))//solar 前三年有乘上10
            return cate_pie(data[1].energy);
        })
        .enter().append("g")
        .attr("class", "arc");
    var cate_circle = cate.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("r", cate_radius * 0.54)
        .attr("fill", "white");

    var cate_text = cate.append("text")
        .attr("dy", "0.7em")
        .attr("font-size", "3em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")
    var cate_text_year = cate.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "0em")
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("滑上以顯示更多")
    var cate_text_name = cate.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "-1.0em")
        .attr("font-size", "1.0em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")

    var cate_donut = cate.append("path")
        .attr("d", cate_arc)
        .style("fill", function (d) {
            console.log(cate_color(d.data.name))
            return cate_color(d.data.name)
        })
        .on("mouseenter", function (d) {
            console.log(d3.select(this).data())
            var select_name = d3.select(this).data()[0].data.name;
            cate_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    // console.log("------------------")
                    if (select_name == "wind") { return cate_color.range()[0]; }
                    else if (select_name == "solar") { return cate_color.range()[1] }
                    else if (select_name == "water") { return cate_color.range()[2] }
                    else if (select_name == "bio") { return cate_color.range()[3] }
                    else if (select_name == "gar") { return cate_color.range()[4] }
                })
            var temp_cate_arc = d3.arc()
                .outerRadius(cate_radius * 0.85)
                .innerRadius(cate_radius * 0.55);

            cate_donut.attr("d", cate_arc)
            d3.select(this)
                .attr("d", temp_cate_arc)
            var select_value = d3.select(this).data()[0].value;
            var cate_value_per;
            if (select_name == "bio") {
                cate_value_per = +((select_value / 50 / cate_total) * 100);
            }
            else if (select_cir_year == 97 || select_cir_year == 98 || select_cir_year == 99) {
                if (select_name == "solar") {
                    cate_value_per = +((select_value / 10 / cate_total) * 100);
                } else {
                    cate_value_per = +((select_value / cate_total) * 100);
                }
            } else {
                cate_value_per = +((select_value / cate_total) * 100);
            }
            console.log(select_value)
            console.log(cate_total)
            if (select_name == "wind") { cate_text_name.text("風力發電比例") }
            else if (select_name == "solar") { cate_text_name.text("太陽能發電比例") }
            else if (select_name == "water") { cate_text_name.text("水力發電比例") }
            else if (select_name == "bio") { cate_text_name.text("生質能發電比例") }
            else if (select_name == "gar") { cate_text_name.text("垃圾沼氣發電比例") }
            cate_text_year.attr("dy", "-2em")
                .text("民國" + select_cir_year + "年");
            cate_text.text(cate_value_per.toFixed(2) + "%")

        })
})