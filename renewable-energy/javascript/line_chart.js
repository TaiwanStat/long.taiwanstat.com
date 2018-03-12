var margin = { top: 20, right: 80, bottom: 30, left: 50 },
    line_width = line_get_screen_width() - margin.left - margin.right,
    line_height = 400 - margin.top - margin.bottom;

function line_get_screen_width() {
    console.log(innerWidth)
    if (innerWidth < 800) {
        if (innerWidth < 350 && innerWidth > 270) { document.body.style.fontSize = "8px"; }
        else if (innerWidth > 350) {
            document.body.style.fontSize = "12px";
        } else {
            document.body.style.fontSize = "4.5px";
        }
        return innerWidth;
    }
    document.body.style.fontSize = "18px";
    return 800;
}



var line_svg = d3.select("#line_chart")
    .append("svg")
    .attr("width", line_width + margin.left + margin.right)
    .attr("height", line_height + margin.top + margin.bottom)
    .attr("transform", "translate(0,0)");

var line_g = line_svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime().range([0, line_width]),
    y = d3.scaleLinear().range([line_height, 0]);

var fire_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.fire); });

var nuclear_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.nuclear); });

var scale_water_line = d3.line()
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.water); });

var renewable_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.renewable); });



var bisectDate = d3.bisector(function (d) { return d.year; }).left;

var cir_move = line_g.append("circle")
    .attr("cx", 100)
    .attr("cy", 0)
    .attr("r", 0)
    .attr("fill", "steelblue")


var line_move_line = line_g.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", line_height)
    .attr("stroke", "black")
    .attr("fill","black")
    .attr("stroke-width", 1);

function line_defaultsetting() {
    return {
        nuclear_color: "#354872",
        fire_color: "#A51C1E",
        scale_water_color: "#EBAD30",
        renewable_color: "#568D4B",
        circle_r: 4,
        axis_y_unit: "億度",
        axis_x_unit: "年",
        check_range: 20,
        init_year: 97

    };
}
var line_circle;
var temp;


d3.csv("./data/his_ele_cate.csv", function (d) {
    d.year = +d.year;
    d.fire = +d.fire;
    d.nuclear = +d.nuclear;
    d.water = +d.water;
    d.renewable = +d.renewable;
    return d;
}, function (error, data) {
    var line_config = line_defaultsetting();
    line_chart_create(line_g, data, line_config,line_circle);

    var touch_rect = line_g.append('rect')
        .attr('width', line_width) // can't catch mouse events on a g element
        .attr('height', line_height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on("mouseover", function (d) {
            mouse_event(data, d3.mouse(this)[0])
        })
        .on("mousemove", function (d) {
            mouse_event(data, d3.mouse(this)[0])
        })


})

function mouse_event(data, mouse) {
    date_x = bisectDate(data, x.invert(mouse), 0);
    for (i = 0; i < scale_stack_data.length; i++) {
        if (mouse < x(97 + i) + 20 && mouse > x(97 + i) - 20) {
            scale_stack_change(i)
        }
    }
    line_move(line_move_line, mouse)
}

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

function line_chart_create(create_g, data, config,circle) {

    x.domain(d3.extent(data, function (d) { return d.year; }));
    y.domain([0, d3.max(data, function (d) {
        return Math.max(d.fire, d.nuclear, d.water, d.renewable);
    })]);

    // create_x_axis(create_g, x, line_height);
    // create_y_axis(create_g, y);
    create_g.append("g")
        .attr("transform", "translate(0," + line_height + ")")
        .call(d3.axisBottom(x))
        .select(".domain");

    create_g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .select(".domain")
        .remove();

    create_g.append("text")
        .attr("transform", "translate(-15,354)")
        .attr("dy", "0")
        .attr("font-size", "60%")
        .attr("text-anchor", "end")
        .text(config.axis_y_unit);
    create_g.append("text")
        .attr("transform", "translate(-10,365)")
        .attr("dy", 0)
        .attr("font-size", "60%")
        .attr("text-anchor", "end")
        .text(config.axis_x_unit);

    create_chart_line(create_g, nuclear_line, config.nuclear_color, data);
    create_chart_line(create_g, fire_line, config.fire_color, data);
    create_chart_line(create_g, scale_water_line, config.scale_water_color, data);
    create_chart_line(create_g, renewable_line, config.renewable_color, data);



    circle = create_g.selectAll("line-circle")
        .attr("class", "circle_line")
        .data(data)
        .enter();

    create_circle(circle, scale_water_line.x(), scale_water_line.y(), config.circle_r,config.scale_water_color);
    create_circle(circle, fire_line.x(), fire_line.y(), config.circle_r, config.fire_color);
    create_circle(circle, nuclear_line.x(), nuclear_line.y(), config.circle_r,config.nuclear_color);
    create_circle(circle, renewable_line.x(), renewable_line.y(), config.circle_r,config.renewable_color);



}


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
function create_circle(create_g, create_cx, create_cy, create_r,create_fill) {
    create_g.append("circle")
        .attr("r", create_r)
        .attr("cx", create_cx)
        .attr("cy", create_cy)
        .attr("fill",create_fill);
}

function line_move(line_g, line_mouse) {
    line_g
        .attr("x1", line_mouse)
        .attr("x2", line_mouse)
}