var stack_info_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    stack_info_width = 250 - stack_info_margin.left - stack_info_margin.right,
    stack_info_height = 250 - stack_info_margin.top - stack_info_margin.bottom;


var stack_info_svg = d3.select("#stack_info")
    .append("svg")
    .attr("width", stack_info_width + stack_info_margin.left + stack_info_margin.right)
    .attr("height", stack_info_height + stack_info_margin.top + stack_info_margin.bottom)
    //.attr("transform", "translate（1000,0)")
    .append("g").attr("transform", "translate(" + stack_info_margin.left + ",0)");

d3.csv("./data/energy_type.csv", function (d, i, columns) {
    pre_percent = 0;
    pre_total = 0;
    return {
        year: +d.year,
        energy: columns.slice(1).map(function (key) {
            var temp = pre_percent;
            pre_total = pre_total + pre_percent;
            pre_percent = +d[key];
            return {
                name: key,
                percent: +d[key],
                pre_per: pre_total
            }
        })
    };
}, function (error, data) {
    stack_info_data = data;
    var max_percent = 0;
    var year_total_percent = 0;
    for (i = 0; i < data.length; i++) {

        for (j = 0; j < data[i].energy.length; j++) {
            year_total_percent = year_total_percent + data[i].energy[j].percent;
        }
        if (year_total_percent > max_percent) {
            max_percent = year_total_percent;
        }
        year_total_percent = 0;
    }

    var stack_info_info = stack_info_svg.append("rect")
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", "160")
        .attr("height", "180")
        .attr("opacity", 0.3)
        .attr("fill", "lightgray")
        .style("stroke", "black")
        .style("stroke-width", "5px")

    stack_text_water = stack_info_svg.append("text")
        .attr("transform", "translate(90,0)")
        .attr("dy", "2.0em")
        .attr("font-size", "15px")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "水力：" + Math.round(data[0].energy[2].percent / 1000000) + "百萬度"
        })
    stack_text_wind = stack_info_svg.append("text")
        .attr("transform", "translate(90,0)")
        .attr("dy", "4.0em")
        .attr("font-size", "15px")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "風力：" + Math.round(data[0].energy[0].percent / 1000000) + "百萬度"
        })
    stack_text_solar = stack_info_svg.append("text")
        .attr("transform", "translate(90,0)")
        .attr("dy", "6.0em")
        .attr("font-size", "15px")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "太陽能：" + Math.round(data[0].energy[1].percent / 1000000) + "百萬度"
        })
    stack_text_gar = stack_info_svg.append("text")
        .attr("transform", "translate(90,0)")
        .attr("dy", "8.0em")
        .attr("font-size", "15px")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "垃圾沼氣：" + Math.round(data[0].energy[4].percent / 1000000) + "百萬度"
        })
    stack_text_bio = stack_info_svg.append("text")
        .attr("transform", "translate(90,0)")
        .attr("dy", "10.0em")
        .attr("font-size", "15px")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "生質能：" + Math.round(data[0].energy[3].percent / 1000000) + "百萬度"
        })

    var total_renew = 0;
    for (i = 0; i < data[0].energy.length; i++) {
        total_renew = total_renew + Math.round(data[0].energy[i].percent / 1000000);
    }
    stack_text_total = stack_info_svg.append("text")
        .attr("transform", "translate(90,0)")
        .attr("dy", "12.0em")
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "再生能源：" + total_renew / 100 + "億度"
        })
})