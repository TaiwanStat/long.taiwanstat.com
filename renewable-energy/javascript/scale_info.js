var scale_stack_info_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    scale_stack_info_width = 250 - scale_stack_info_margin.left - scale_stack_info_margin.right,
    scale_stack_info_height = 200 - scale_stack_info_margin.top - scale_stack_info_margin.bottom;

var scale_stack_info_svg = d3.select("#scale_stack_info")
    .append("svg")
    .attr("width", scale_stack_info_width + scale_stack_info_margin.left + scale_stack_info_margin.right)
    .attr("height", scale_stack_info_height + scale_stack_info_margin.top + scale_stack_info_margin.bottom)
    //.attr("transform", "translate（1000,0)")
    .append("g").attr("transform", "translate(" + scale_stack_margin.left + ",0)");


var scale_stack_info = scale_stack_info_svg.append("rect")
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
d3.csv("./data/his_ele_cate.csv", function (d, i, columns) {
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
    scale_stack_text_fire = create_stack_text(scale_stack_info_svg, "3.0em", 90, "火力：" + Math.round(data[0].energy[0].percent) + "億度")
    scale_stack_text_nuclear = create_stack_text(scale_stack_info_svg, "5.0em", 90, "核能：" + Math.round(data[0].energy[1].percent) + "億度")
    scale_stack_text_water = create_stack_text(scale_stack_info_svg, "7.0em", 90, "抽蓄水力：" + Math.round(data[0].energy[2].percent) + "億度")
    scale_stack_text_renewable = create_stack_text(scale_stack_info_svg, "9.0em", 90, "再生能源：" + Math.round(data[0].energy[3].percent) + "億度")

})