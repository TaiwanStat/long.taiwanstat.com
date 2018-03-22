//台灣近年再生能源長條堆疊圖
var stack_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    stack_width = stack_get_screen_width() - stack_margin.left - stack_margin.right,
    stack_height = 200 - stack_margin.top - stack_margin.bottom;

function stack_get_screen_width() {
    if (innerWidth < 1000) {
        return innerWidth;
    }
    return 1000;
}


var stack_svg = d3.select("#stack_bar")
    .append("svg")
    .attr("width", stack_width + stack_margin.left + stack_margin.right)
    .attr("height", stack_height + stack_margin.top + stack_margin.bottom)
    .append("g").attr("transform", "translate(" + stack_margin.left + ",0)");


var stack_x = d3.scaleLinear()
    .rangeRound([0, stack_width]);

var stack_y = d3.scaleLinear()
    .rangeRound([0, stack_height]);

var stack_z = d3.scaleOrdinal()
    .range(["#1D65A6", "#72A2C0", "#00743F", "#192E5B", "#F2A104"]);
var pre_percent = 0;
var pre_total = 0;
var stack_data;
var stack_rect;
var stack_now_index = 0;
var stack_text_water;
var stack_text_wind;
var stack_text_solar;
var stack_text_gar;
var stack_text_bio;
var stack_title;
var stack_text_total;
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
    stack_data = data;
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

    stack_x.domain([0, max_percent])
    stack_y.domain([0, max_percent])

    stack_title = stack_svg.append("text")
        .attr("transform", "translate(60,0)")
        .attr("dy", "2.0em")
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("民國97年")

    stack_rect = stack_svg.append("g")
        .selectAll("g")
        .attr("class", "stack")
        .data(data[0].energy)
        .enter().append("g")
        .style("fill", function (d) { return stack_z(d.name); })
    prompt = stack_svg.append("text")
        .attr("transform", "translate(250,0)")
        .attr("dy", "3.6em")
        .attr("font-size", ".8em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("用鼠標滑上折線圖可以切換年份資料 ")

    var stack_bar = stack_rect.append("rect")
        .style("opacity", 0.7)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("x", function (d) { return stack_x(d.pre_per); })
        .attr("y", 100)
        .attr("height", 50)
        .attr("width", function (d) { return stack_x(d.percent); })
        .on("mouseenter", function (data) {
            stack_bar.style("opacity", 0.7)
            d3.select(this)
                .style("opacity", 1)
        }).on("click", function (data) {
            stack_bar.style("opacity", 0.7)
            d3.select(this)
                .style("opacity", 1)
        });
    ;

    var stack_intro = stack_svg.append("g")
        .selectAll("g")
        .attr("class", "stack")
        .data(data[0].energy)
        .enter().append("g")
        .style("fill", function (d) { return stack_z(d.name); })

    stack_intro.append("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("x", stack_width * 0.75)
        .attr("y", function (d, i) { return i * 16; })
        .attr("height", 15)
        .attr("width", 15)
        ;
    stack_intro.append("text")
        .attr("x", stack_width * 0.75 + 20)
        .attr("y", function (d, i) { return i * 16; })
        .attr("dy", ".85em")
        .attr("fill", "black")
        .attr("font-size", "0.8em")
        .style("text-anchor", "start")
        .text(function (d, i) {
            switch (i) {
                case 0: return "風力";
                case 1: return "太陽能";
                case 2: return "水力";
                case 3: return "生質能";
                case 4: return "垃圾沼氣";
            }
        });
})
