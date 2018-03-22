//顯示各項二氧化碳資訊的框


var co_line_info_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    co_line_info_width = 250 - co_line_info_margin.left - co_line_info_margin.right,
    co_line_info_height = 250 - co_line_info_margin.top - co_line_info_margin.bottom;

var co_line_info_svg = d3.select("#co_info")
    .append("svg")
    .attr("width", co_line_info_width + co_line_info_margin.left + co_line_info_margin.right)
    .attr("height", co_line_info_height + co_line_info_margin.top + co_line_info_margin.bottom)
    .attr("transform", "translate(0,0)");

var co_line_info_g = co_line_info_svg.append("g").attr("transform", "translate(" + co_line_info_margin.left + "," + co_line_info_margin.top + ")");


d3.csv("./data/energy_type.csv", function (d) {
    d.year = +d.year;
    if (d.year == 97) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.557 / 1000 / 100000;
    } else if (d.year == 98) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.543 / 1000 / 100000;
    } else if (d.year == 99) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.535 / 1000 / 100000;
    } else if (d.year == 100) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.536 / 1000 / 100000;
    } else if (d.year == 101) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.532 / 1000 / 100000;
    } else if (d.year == 102) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.522 / 1000 / 100000;
    } else if (d.year == 103) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.521 / 1000 / 100000;
    } else if (d.year == 104) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.528 / 1000 / 100000;
    } else if (d.year == 105) {
        d.co = +((+d.solar) + (+d.water) + (+ d.wind)) * 0.529 / 1000 / 100000;
    }

    return d;
}, function (error, data) {
    var co_info = co_line_info_g.append("rect")
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
    function create_text(create_g, create_dy, create_size, create_trans, create_content) {
        return_text = create_g.append("text")
            .attr("transform", create_trans)
            .attr("dy", create_dy)
            .attr("font-size", create_size)
            .style("text-anchor", "middle")
            .style("fill", "black")
            .text(create_content);
        return return_text
    }
    co_text_year = create_text(co_line_info_g, "2em", "20px", "translate(90,0)", "民國97年")
    co_text_save_1 = create_text(co_line_info_g, "2em", "14px", "translate(90,35)", "節省的CO2達")
    co_text_save = create_text(co_line_info_g, "2em", "18px", "translate(90,55)", data[0].co.toFixed(2) + "十萬公噸")
    co_text_tree = create_text(co_line_info_g, "2em", "16px", "translate(90,80)", "造林效益相當於")

    var park = data[0].co * 100000 / 25.894;
    co_text_tree_1 = create_text(co_line_info_g, "2em", "20px", "translate(90,100)", park.toFixed(2) + "座")
    co_text_tree_2 = create_text(co_line_info_g, "2em", "16px", "translate(90,135)", "大安森林公園")
})    