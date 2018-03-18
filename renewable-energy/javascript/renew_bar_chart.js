//台灣近年再生能源長條堆疊圖
var renew_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    renew_width = screen.availWidth*0.5 - renew_margin.left - renew_margin.right,
    renew_height = 200 - renew_margin.top - renew_margin.bottom;

var renew_bar_svg = d3.select("#renew_bar")
    .append("svg")
    .attr("transform", "translate(400," + renew_margin.top + ")")
    .attr("width", renew_width + renew_margin.left + renew_margin.right)
    .attr("height", renew_height + renew_margin.top + renew_margin.bottom)
    .append("g").attr("transform", "translate(" + renew_margin.left + "," + renew_margin.top + ")");

var renew_color = d3.scaleOrdinal()
    .range(["#3CB371", "#4169E1", "#FFBB00"]);

var renew_x = d3.scaleLinear().range([0, renew_width]),
    renew_y = d3.scaleBand().range([renew_height, 0]);

var sun_tot_da;
var wind_tot_da;
var water_tot_da;
var tota_arr = new Array();
d3.csv("./data/sun.csv", function (d, i, columns) {
    return {
        year: +d.year,
        pers: columns.slice(1).map(function (key) {
            return {
                name: key,
                percent: +d[key]
            };
        })
    };
}, function (error, data) {
    sun_tot_da = data;
})
d3.csv("./data/wind.csv", function (d, i, columns) {
    return {
        year: +d.year,
        pers: columns.slice(1).map(function (key) {
            return {
                name: key,
                percent: +d[key]
            };
        })
    };
}, function (error, data) { wind_tot_da = data; })

d3.csv("./data/water.csv", function (d, i, columns) {
    return {
        year: +d.year,
        pers: columns.slice(1).map(function (key) {
            return {
                name: key,
                percent: +d[key]
            };
        })
    };
}, function (error, data) {
    water_tot_da = data;
    data_anyl();
    var max = 0;

    for (i = 0; i < tota_arr.length; i++) {
        if (tota_arr[i].values[1].total > max) {
            max = tota_arr[i].values[1].total;
        }
    }

    renew_y.domain(tota_arr[0].values.map(function (d) { return d.name }));
    renew_x.domain([0, max]);

    renew_color.domain(tota_arr[0].values.map(function (d) { return d.name }));
    renew = renew_bar_svg.selectAll("rect")
        .data(tota_arr[0].values)
        .enter();

    renew_bar_svg.append("g")
        .attr("transform", "translate(0," + renew_height + ")")
        .call(d3.axisBottom(renew_x))
        .append("text")
        .attr("y", 30)
        .attr("x", renew_width)
        .attr("dy", "-0.1em")
        .style("fill", "black")
        .text("百萬度");


    renew_bar_svg.append("g")
        .attr("transform", "translate(-1,0)")
        .call(d3.axisLeft(renew_y));

    renew.append("rect")
        .attr("x", function (d) { return /*renew_x(d.name)*/0; })
        .attr("y", function (d) {  return renew_y(d.name) + 10; })
        .attr("width",/*"30"*/function (d) { return renew_x(d.total); })
        .attr("height", function (d) { return /*renew_height-renew_y(d.total)*/30; })
        .attr("fill", function (d) { return renew_color(d.name) });

})


function data_anyl() {
    var temp_sun = 0;
    var temp_water = 0;
    var temp_wind = 0;
    var j = 0;
    var arr_value = new Array;
    for (i = 0; i < wind_tot_da.length - 1; i++) {

        for (k = 0; k < water_tot_da[j].pers.length; k++) {
            temp_sun = temp_sun + sun_tot_da[j].pers[k].percent;
            temp_water = temp_water + water_tot_da[j].pers[k].percent;
            temp_wind = temp_wind + wind_tot_da[i].pers[k].percent;
        }

        arr_value[0] = {
            name: "sun",
            total: temp_sun
        }
        arr_value[1] = {
            name: "water",
            total: temp_water
        }
        arr_value[2] = {
            name: "wind",
            total: temp_wind
        }
        tota_arr[j] = {
            year: water_tot_da[j].year,
            values: arr_value
        }

        temp_sun = 0;
        temp_water = 0;
        temp_wind = 0;
        j++;
    }
}
