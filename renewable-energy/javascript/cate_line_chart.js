var cate_line_propor = 1000000;//將y軸的數字縮小


var cate_line_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    cate_line_width = 800 - cate_line_margin.left - cate_line_margin.right,
    cate_line_height = 300 - cate_line_margin.top - cate_line_margin.bottom;

var cate_line_svg = d3.select("#cate")
    .append("svg")
    .attr("width", cate_line_width + cate_line_margin.left + cate_line_margin.right)
    .attr("height", cate_line_height + cate_line_margin.top + cate_line_margin.bottom)
    .attr("transform", "translate(0,0)");

var cate_line_g = cate_line_svg.append("g").attr("transform", "translate(" + cate_line_margin.left + "," + cate_line_margin.top + ")");

var cate_line_x = d3.scaleTime().range([0, cate_line_width]),
    cate_line_y = d3.scaleLinear().range([cate_line_height, 0]);

var wind_line = d3.line()
    .x(function (d) { return cate_line_x(d.year); })
    .y(function (d) { return cate_line_y(d.wind / cate_line_propor); });

var solar_line = d3.line()
    .x(function (d) { return cate_line_x(d.year); })
    .y(function (d) { return cate_line_y(d.solar / cate_line_propor); });

var water_line = d3.line()
    .x(function (d) { return cate_line_x(d.year); })
    .y(function (d) { return cate_line_y(d.water / cate_line_propor); });

var bio_line = d3.line()
    .x(function (d) { return cate_line_x(d.year); })
    .y(function (d) { return cate_line_y(d.bio / cate_line_propor + 30); });

var gar_line = d3.line()
    .x(function (d) { return cate_line_x(d.year); })
    .y(function (d) { return cate_line_y(d.gar / cate_line_propor); });

var energy_type_data;
var cate_line_move;
d3.csv("./data/energy_type.csv", function (d) {
    d.year = +d.year;
    d.wind = +d.wind;
    d.solar = +d.solar;
    d.water = +d.water;
    d.bio = +d.bio;
    d.gar = +d.gar;
    return d;
}, function (error, data) {
    energy_type_data = data;
    cate_line_x.domain(d3.extent(data, function (d) { return d.year; }));
    cate_line_y.domain([0, d3.max(data, function (d) {
        return Math.max(d.water, d.solar, d.wind, d.bio, d.gar) / cate_line_propor;
    })])


    create_x_axis(cate_line_g, cate_line_x, cate_line_height);
    create_y_axis(cate_line_g, cate_line_y);



    cate_line_g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", "0.7em")
        .attr("font-size", "90%")
        .attr("text-anchor", "end")
        .text("單位(百萬度)");
    cate_line_g.append("text")
        .attr("transform", "translate(-10,2)")
        .attr("dy", "27.5em")
        .attr("font-size", "60%")
        .attr("text-anchor", "end")
        .text("年");


    create_chart_line(cate_line_g, wind_line, "#FF5511", data);
    create_chart_line(cate_line_g, water_line, "#5599FF", data);
    create_chart_line(cate_line_g, solar_line, "#FFFF33", data);
    create_chart_line(cate_line_g, bio_line, "#00AA00", data);
    create_chart_line(cate_line_g, gar_line, "#AAFFEE", data);


    cate_circle = cate_line_g.selectAll("cate-line-circle")
        .data(data)
        .enter();

    create_circle(cate_circle, gar_line.x(), gar_line.y(), 4)
    create_circle(cate_circle, bio_line.x(), bio_line.y(), 4)
    create_circle(cate_circle, wind_line.x(), wind_line.y(), 4)
    create_circle(cate_circle, water_line.x(), water_line.y(), 4)
    create_circle(cate_circle, solar_line.x(), solar_line.y(), 4)





    cate_line_move = cate_line_g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", cate_line_height)
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    var cate_touch_rect = cate_line_g.append('rect')
        .attr('width', cate_line_width) // can't catch mouse events on a g element
        .attr('height', cate_line_height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on("mouseover", function (d) {
            for (i = 0; i < stack_data.length; i++) {
                if (d3.mouse(this)[0] < cate_line_x(97 + i) + 10 && d3.mouse(this)[0] > cate_line_x(97 + i) - 10) {
                    stack_bar_change(i)
                }
            }
            date_x = bisectDate(data, x.invert(d3.mouse(this)[0]), 0);
            line_move(cate_line_move, d3.mouse(this)[0]);
            line_move(co_line_move, d3.mouse(this)[0]);
        })
        .on("mousemove", function (d) {
            for (i = 0; i < stack_data.length; i++) {
                if (d3.mouse(this)[0] < cate_line_x(97 + i) + 10 && d3.mouse(this)[0] > cate_line_x(97 + i) - 10) {
                    stack_bar_change(i)
                }
            }
            for (i = 0; i < stack_data.length; i++) {
                if (d3.mouse(this)[0] < co_line_x(97 + i) + 10 && d3.mouse(this)[0] > co_line_x(97 + i) - 10) {
                    var year = 97 + i
                    park = co_data[i].co * 100000 / 25.894;
                    co_text_year.text("民國" + year + "年")
                    co_text_save.text(co_data[i].co.toFixed(2) + "十萬公噸")
                    co_text_tree_1.text(park.toFixed(2) + "座")
                }
            }
            date_x = bisectDate(data, x.invert(d3.mouse(this)[0]), 0);
            if (date_x > 3) {
            } else {
            }
            line_move(cate_line_move, d3.mouse(this)[0]);
            line_move(co_line_move, d3.mouse(this)[0]);
        }
        )


})

function stack_bar_change(index) {
    if (index != stack_now_index) {
        stack_rect.data(stack_data[index].energy).enter()

        stack_rect.select("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("x", function (d) { return stack_x(d.pre_per); })
            .attr("y", 100)
            .attr("height", 50)
            .attr("width", function (d) { return stack_x(d.percent); })
            ;
        stack_text_water.text(function (d) {

            return "水力：" + Math.round(stack_data[index].energy[2].percent / 1000000) + "百萬度"
        })
        stack_text_wind.text(function (d) {

            return "風力：" + Math.round(stack_data[index].energy[0].percent / 1000000) + "百萬度"
        })
        stack_text_solar.text(function (d) {

            return "太陽能：" + Math.round(stack_data[index].energy[1].percent / 1000000) + "百萬度"
        })
        stack_text_gar.text(function (d) {

            return "垃圾沼氣：" + Math.round(stack_data[index].energy[4].percent / 1000000) + "百萬度"
        })
        stack_text_bio.text(function (d) {

            return "生質能：" + Math.round(stack_data[index].energy[3].percent / 1000000) + "百萬度"
        })
        var total_renew = 0;
        for (i = 0; i < stack_data[index].energy.length; i++) {
            total_renew = total_renew + Math.round(stack_data[index].energy[i].percent / 1000000);
        }
        stack_text_total.text(function (d) {

            return "再生能源：" + total_renew / 100 + "億度"
        })
        var year_stack = index + 97
        stack_title.text("民國" + year_stack + "年")
        stack_now_index = index;
    }
}

function create_x_axis(create_g, create_x, create_height) {
    create_g.append("g")
        .attr("transform", "translate(0," + create_height + ")")
        .call(d3.axisBottom(create_x))
        .select(".domain");

}
function create_y_axis(create_g, create_y) {
    create_g.append("g")
        .call(d3.axisLeft(create_y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .select(".domain")
        .remove();
}
function create_chart_line(create_g, create_line, create_color, create_data) {
    create_g.append("path")
        .datum(create_data)
        .attr("fill", "none")
        .attr("class", "cate_line")
        .attr("stroke", create_color)
        .attr("stroke-width", 2.5)
        .attr("d", create_line);
}
function create_circle(create_g, create_cx, create_cy, create_r) {
    create_g.append("circle")
        .attr("r", create_r)
        .attr("cx", create_cx)
        .attr("cy", create_cy);
}

function line_move(line_g, line_mouse) {
    line_g
        .attr("x1", line_mouse)
        .attr("x2", line_mouse)
}