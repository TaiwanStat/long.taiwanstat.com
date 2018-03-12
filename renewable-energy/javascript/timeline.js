var time_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    time_width = time_get_screen_width() - time_margin.left - time_margin.right,
    time_height = 100 - time_margin.top - time_margin.bottom;

    function time_get_screen_width(){
        console.log(innerWidth)
        if(innerWidth<1200){
           return innerWidth;
        }
        return 1200;
    }
    
var time_svg = d3.select("#timeline")
    .append("svg")
    .attr("width", time_width + time_margin.left + time_margin.right)
    .attr("height", time_height + time_margin.top + time_margin.bottom)
    .attr("transform", "translate(0,0)")

var time_g = time_svg.append("g").attr("transform", "translate(" + time_margin.left + "," + time_margin.top + ")");
var time_x = d3.scaleTime().range([0, time_width]);

var time_line = time_g.append("line")
    .attr("x1", 0)
    .attr("y1", time_height / 1.5)
    .attr("x2", time_width)
    .attr("y2", time_height / 1.5)
    .attr("stroke", "black")
    .attr("opacity",0.3)
    .attr("stroke-width", 3).on("mouseenter", function (d) {
        d3.select(this).style("cursor", "pointer");
    });;

var choose_circle = 0;
var time_circle_append;

d3.csv("./data/his_ele_cate.csv", function (d) {
    d.year = +d.year;
    return d;
}, function (error, data) {

    time_x.domain(d3.extent(data, function (d) { return d.year; }))//extent 可以獲得最小值和最大值

    var time_circle = time_g.selectAll("time-circle")
        .data(data)
        .enter();

    var time_text = time_g.selectAll("time-text")
        .data(data)
        .enter();

    time_text.append("text")
        .attr("x", function (d) { return time_x(d.year) - 11; })
        .attr("y", time_height / 1.5 + 30)
        .text(function (d) { return d.year; })

    time_circle_append = time_circle.append("circle")
        .attr("r", 10)
        .attr("cy", time_height / 1.5)
        .attr("fill","#3c3c3c")
        .attr("cx", function (d) { return time_x(d.year); })
        .on("mouseenter", function (d) {
            d3.select(this).style("cursor", "pointer");
            var select_cir = d3.select(this)
            select_cir_year = d3.select(this).data()[0].year;
            check_circle_choose(select_cir)
            chart_change(select_cir_year);
        }).on("click", function (d) {
            d3.select(this).style("cursor", "pointer");
            var select_cir = d3.select(this)
            select_cir_year = d3.select(this).data()[0].year;
            check_circle_choose(select_cir)
            chart_change(select_cir_year);
        });
})
function check_circle_choose(select_cir) {
    if (choose_circle == 0) {
        choose_circle = select_cir.data()[0].year;
        select_cir
            .attr("r", 15)
            .attr("opacity",1)
    } else if (choose_circle != 0 && choose_circle != select_cir) {
        choose_circle = select_cir.data()[0].year;
        time_circle_append.attr("r", 10)
        select_cir
            .attr("r", 15)
    }
}

function chart_change(index) {

    for (i = 0; i < wind_data.length; i++) {
        if (wind_data[i].year) {
            if (index === wind_data[i].year) {
                wind.select(".text_remove_wind").remove();
                wind.data(function (d) { return pie(wind_data[i].pers); })
                    .enter()
                wind.select("path")
                    .attr("d", init_arc)

                wind.append("text")
                    .attr("class", "text_remove_wind")
                    .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")
                    .text(function (d) { return d.data.name; });
                text_update(wind_text_year, "民國" + index+ "年")
                text_update(wind_text_type, "台電發電量達")
                text_update(wind_text, Math.round(wind_data[i].pers["0"].percent)  + "百萬度")
            }
        }
    }
    for (i = 0; i < water_data.length; i++) {
        if (water_data[i].year) {
            if (index === water_data[i].year) {
                water.select(".text_remove_water").remove();
                water.data(function (d) { return pie(water_data[i].pers); })
                    .enter()
                water.select("path")
                    .attr("d", init_arc)
                water.append("text")
                    .attr("class", "text_remove_water")
                    .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")
                    .text(function (d) { return d.data.name; });


                text_update(water_text_year, "民國" + index + "年")
                text_update(water_text_type, "台電發電量達")
                text_update(water_text, Math.round(water_data[i].pers["0"].percent) + "百萬度")
            }
        }
    }
    for (i = 0; i < sun_data.length; i++) {
        if (sun_data[i].year) {
            if (index === sun_data[i].year) {
                sun.select(".text_remove_sun").remove();
                sun.data(function (d) { return pie(sun_data[i].pers); })
                    .enter()
                sun.select("path")
                    .attr("d", init_arc)
                sun.append("text")
                    .attr("class", "text_remove_sun")
                    .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")
                    .text(function (d) { return d.data.name; });

                text_update(sun_text_year, "民國" + index + "年")
                text_update(sun_text_type, "台電發電量達")
                text_update(sun_text, sun_data[i].pers["0"].percent+ "百萬度")
            }
        }
    }

}