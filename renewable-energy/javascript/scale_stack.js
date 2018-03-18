//台灣近年各項能源的長條堆疊圖
var scale_stack_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    scale_stack_width = scale_stack_get_screen_width() - scale_stack_margin.left - scale_stack_margin.right,
    scale_stack_height = 200 - scale_stack_margin.top - scale_stack_margin.bottom;

function scale_stack_get_screen_width() {
    if (innerWidth < 1000) {
        return innerWidth;
    }
    return 1000;
}

var scale_stack_svg = d3.select("#scale_stack")
    .append("svg")
    .attr("width", scale_stack_width + scale_stack_margin.left + scale_stack_margin.right)
    .attr("height", scale_stack_height + scale_stack_margin.top + scale_stack_margin.bottom)
    .append("g").attr("transform", "translate(" + scale_stack_margin.left + ",0)");

var scale_stack_x = d3.scaleLinear()
    .rangeRound([0, scale_stack_width]);

var scale_stack_y = d3.scaleLinear()
    .rangeRound([0, scale_stack_height]);

var scale_stack_z = d3.scaleOrdinal()
    .range(["#A51C1E", "#354872", "#EBAD30", "	#568D4B"]);
var pre_percent = 0;
var pre_total = 0;
var scale_stack_data;
var scale_stack_rect;
var scale_stack_now_index = 0;
var scale_stack_text_fire;
var scale_stack_text_nuclear;
var scale_stack_text_water;
var scale_stack_text_renewable;
var scale_stack_text_bio;
var scale_stack_title;
var choose_ener = 3;

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
    scale_stack_data = data;
    var max_percent = find_max_value(data);



    scale_stack_x.domain([0, max_percent])
    scale_stack_y.domain([0, max_percent])
    function stack_rect_info_width() {
        if(innerWidth<1200){
            return innerWidth*160/1200;
        }
        return 160;
    }
    scale_stack_title = scale_stack_svg.append("text")
        .attr("transform", "translate(60,0)")
        .attr("dy", "2.0em")
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("民國97年")
    
    scale_stack_rect = scale_stack_svg.append("g")
        .selectAll("g")
        .attr("class", "scale_stack")
        .data(data[0].energy)
        .enter().append("g")
        .style("fill", function (d) { return scale_stack_z(d.name); })

    scale_stack_rect.append("rect")
        .style("opacity", function (d) {
            if (d.name == "renewable") {
                return 1;
            } else {
                return 0.6;
            }
        })
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("x", function (d) { return scale_stack_x(d.pre_per); })
        .attr("y", 100)
        .attr("height", 50)
        .attr("width", function (d) { return scale_stack_x(d.percent) - 2; })
        .on("mouseenter", function (data) {
            var select_name = d3.select(this).data()[0].name;
            scale_circle
                .attr("opacity", 0.2)
                .style("fill", set_scale_color(select_name))

            scale_donut
                .attr("d", scale_arc)
                .style("opacity", function (d) {
                    if (d.data.name == "renewable" || d.data.name == select_name) {
                        return 1;
                    } else {
                        return 0.6;
                    }
                })
            d3.select(this)
                .style("opacity", 1)

            var select_value = d3.select(this).data()[0].percent;
            var select_value_per = calculate_percent(select_value, scale_total);

            select_scale_name(select_name)
            scale_text_name.text(select_scale_name(select_name) + "發電比例達");

            var year_now = scale_stack_now_index + 97
            scale_text_year.text("民國" + year_now + "年");
            scale_text.text(Math.round(select_value_per) + "%")
            scale_stack_rect.select("rect")
                .style("opacity", function (d) {
                    if (d.name == select_name || d.name == "renewable") {
                        return 1;
                    } else {
                        return 0.6;
                    }
                })

        }).on("click", function (data) {
            var select_name = d3.select(this).data()[0].name;
            scale_circle
                .attr("opacity", 0.2)
                .style("fill", set_scale_color(select_name))

            scale_donut
                .attr("d", scale_arc)
                .style("opacity", function (d) {
                    if (d.data.name == "renewable" || d.data.name == select_name) {
                        return 1;
                    } else {
                        return 0.6;
                    }
                })
            d3.select(this)
                .style("opacity", 1)

            var select_value = d3.select(this).data()[0].percent;
            var select_value_per = calculate_percent(select_value, scale_total);

            select_scale_name(select_name)
            scale_text_name.text(select_scale_name(select_name) + "發電比例達");

            var year_now = scale_stack_now_index + 97
            scale_text_year.text("民國" + year_now + "年");
            scale_text.text(Math.round(select_value_per) + "%")
            scale_stack_rect.select("rect")
                .style("opacity", function (d) {
                    if (d.name == select_name || d.name == "renewable") {
                        return 1;
                    } else {
                        return 0.6;
                    }
                })

        });

    var scale_stack_intro = scale_stack_svg.append("g")
        .selectAll("g")
        .attr("class", "scale_stack")
        .data(data[0].energy)
        .enter().append("g")
        .style("fill", function (d) { return scale_stack_z(d.name); })

    scale_stack_intro.append("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("x", scale_stack_width * 0.75)
        .attr("y", function (d, i) { return i * 16; })
        .attr("height", 15)
        .attr("width", 15)
        ;
    scale_stack_intro.append("text")
        .attr("x", scale_stack_width * 0.75 + 20)
        .attr("y", function (d, i) { return i * 16; })
        .attr("dy", ".85em")
        .attr("fill", "black")
        .attr("font-size", "0.8em")
        .style("text-anchor", "start")
        .text(function (d, i) {
            switch (i) {
                case 0: return "火力";
                case 1: return "核能";
                case 2: return "抽蓄水力";
                case 3: return "再生能源";
            }
        });
})



function scale_stack_change(index) {
    if (scale_stack_now_index != index) {
        scale_stack_rect.data(scale_stack_data[index].energy).enter()

        scale_stack_rect.select("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("x", function (d) { return scale_stack_x(d.pre_per); })
            .attr("y", 100)
            .attr("height", 50)
            .attr("width", function (d) { return scale_stack_x(d.percent); })
        scale_stack_text_fire.text(function (d) {

            return "火力：" + Math.round(scale_stack_data[index].energy[0].percent) + "億度"
        })
        scale_stack_text_water.text(function (d) {

            return "抽蓄水力：" + Math.round(scale_stack_data[index].energy[2].percent) + "億度"
        })
        scale_stack_text_nuclear.text(function (d) {

            return "核能：" + Math.round(scale_stack_data[index].energy[1].percent) + "億度"
        })
        scale_stack_text_renewable.text(function (d) {

            return "再生能源：" + Math.round(scale_stack_data[index].energy[3].percent) + "億度"
        })
        var year_now = index + 97
        scale_stack_title.text("民國" + year_now + "年")
        scale_stack_now_index = index;

        for (i = 0; i < scale_data.length; i++) {
            if (index + 97 === scale_data[i].year) {
                scale_total = 0;
                for (j = 0; j < scale_data[i].energy.length; j++) {
                    scale_total = scale_data[i].energy[j].percent + scale_total;

                }
                scale.data(function (d) { return scale_pie(scale_data[i].energy); })
                    .enter();
                scale.select("path")
                    .attr("d", scale_arc);
                scale_text_year.text("民國" + year_now + "年")
                var select_value = scale_data[index].energy[choose_ener].percent;
                var select_value_per = +((select_value / scale_total) * 100);
                scale_text.text(Math.round(select_value_per) + "％")
            }
        }

    }
}

function create_stack_text(create_svg, create_dy, create_width, create_content) {
    create_text = create_svg.append("text")
        .attr("transform", "translate(" + create_width + ",0)")
        .attr("dy", create_dy)
        .attr("font-size", "16px")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(create_content)
    return create_text;
}
function find_max_value(data) {
    var year_total_percent = 0;
    var max_percent = 0;
    for (i = 0; i < data.length; i++) {

        for (j = 0; j < data[i].energy.length; j++) {
            year_total_percent = year_total_percent + data[i].energy[j].percent;
        }
        if (year_total_percent > max_percent) {
            max_percent = year_total_percent;
        }
        year_total_percent = 0;
    }
    return max_percent;
}
