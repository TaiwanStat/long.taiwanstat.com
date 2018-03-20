var margin = {
        top: 30,
        right: 20,
        bottom: 40,
        left: 10
    },
    w = parseInt(d3.select("#stack-chart").style("width"), 10) - margin.left - margin.right,
    w1 = parseInt(d3.select("#stack-chart").style("width"), 10) - 2*margin.left,
    h = parseInt(d3.select("#stack-chart").style("height"), 10) - margin.top ;
var parse = d3.time.format("%Y").parse;
var _f = d3.format(".0f");

d3.csv("database/stackchart.csv", function (error, dataset) {
    if (error) throw error;

    var svg = d3.select("#stack-chart").append('svg')
        .attr("width", w)
        .attr("height", h)
        .append("g")
        .attr("transform", "translate(" + (margin.left + margin.right) + "," + (margin.top) + ")");
    //transpose data into layers
    var data = d3.layout.stack()(["印尼", "菲律賓", "泰國", "越南"].map(function (workers) {
        return dataset.map(function (d) {
            return {
                x: d.年分,
                y: +d[workers] / 10000
            };
        });
    }));
    
    var colors = ["#64363C", '#BEC23F', "#FFB11B", "#F596AA"];

    var x = d3.scale.ordinal()
        .domain(data[0].map(function (d) {
            return d.x;
        }))
        .rangeRoundBands([0, w - 50], 0.18);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function (d) {
            return d3.max(d, function (d) {
                return d.y0 + d.y;
            });
        })])
        .range([h - 70, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickValues([2002,2004,2006,2008,2010,2012,2014,2016]),//.tickFormat(d3.time.format("%Y")),
        yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(function (d) {
            return d
        });
    svg.append('g').attr("class", "x axis").call(xAxis).attr('transform', 'translate(' + 0 + ',' + (h - margin.bottom - margin.top) + ')').attr({
        'fill': 'black',
        'stroke': 'none',
        'font-weight': 500,
        'font-family': "'Inconsolata', monospace"
    });;
    svg.append('g').attr("class", "y axis").call(yAxis).attr({
        'fill': 'black',
        'stroke': 'none',
        'font-weight': 500,
        'font-family': "'Inconsolata', monospace"
    });;

    var group_by_year = svg.selectAll(".num_of_people")
        .data(data)
        .enter()
        .append("g")
        .attr("fill", function (d, i) {
            return colors[i];
        })
        .attr("stroke", "#fff")
        .attr("class", "num_of_people");



    var rect = group_by_year.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x(d.x);
        })
        .attr("y", function (d) {
            return y(d.y0 + d.y);
        })
        .attr("width", x.rangeBand())
        .attr("height", function (d) {
            return y(d.y0) - y(d.y0 + d.y);
        })
        .attr("class", "rect_country");

    var text = group_by_year.selectAll("text")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("text")
        .attr("x", function (d) {
            return x(d.x);
        })
        .attr("y", function (d) {
            return y(d.y0 + d.y);
        })
        .text(function (d, i) {
            return _f(d.y * 10000);
        })
        .attr({
            'fill': "#000",
            'stroke': "none",
            'font-size': '14',
            'font-weight': 'border',
            'font-family': "'Inconsolata', monospace",
        })
        .attr("visibility", "hidden")
        .attr("class", "desc_country")
        .attr("id", function (d, i, j) {
            return "desc_country" + j + i;
        })
    var label = ["印尼", "菲律賓", "泰國", "越南"];
    var legend = svg.selectAll(".legend")
        .data(colors)
        .enter()
        .append("g")
        .attr("class", "legend")

    legend.append("rect")
        .attr('x', function (d, i) {
            return 10 + i * 70
        })
        .attr('y', ( h-margin.bottom))
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function (d, i) {
            return colors[i];
        })

    legend.append("text")
        .attr('x', function (d, i) {
            return 25 + i * 70
        })
        .attr('y', ( h-margin.top))
        .text(function (d, i) {
            return label[i];
        })
        .call(textstyle1)
    svg.append("text")
        .attr("transform",
            "translate(" + margin.left * 2 + " ," +
            0 + ")")
        .style("text-anchor", "middle")
        .text("萬人 /")
        .call(textstyle1);
    svg.append("text")
        .attr("transform",
            "translate(" + (margin.left * 3 + margin.right) + " ," +
            0 + ")")
        .style("text-anchor", "middle")
        .text("年")
        .call(textstyle1);
    var religion = [];
    religion.push("<font class=country size=22>印尼</font><br>伊斯蘭教<br>可能每日要求祈禱數次<br>不吃豬肉、齋戒月白天禁水禁食", "<font class=country size=22>菲律賓</font><br>天主教<br>星期日可能要求去教堂", "<font class=country size=22>泰國</font><br>佛教", "<font class=country size=22>越南</font><br>佛教");
    group_by_year.selectAll("rect")
        .on("mouseover", function (d, i, j) {

            d3.selectAll(".num_of_people").selectAll("rect").attr("opacity", 0.5);
            d3.select("#desc_country" + j + i).attr("visibility", "visible");
            d3.select(this).attr("opacity", 1);
            $("#religion").html(religion[j]);
        })
        .on("mouseout", function (d, i, j) {
            d3.selectAll("rect").attr("opacity", 1);
            d3.select("#desc_country" + j + i).attr("visibility", "hidden");
        })

})
d3.csv("database/stackchart.csv", function (error, dataset) {
    if (error) throw error;

    var svg = d3.select("#donut_threek").append('svg')
        .attr("width", w1)
        .attr("height", h)
        .append("g")
        .attr("transform", "translate(" +(margin.left+margin.right) + "," + margin.top + ")");
    //transpose data into layers
    var data = d3.layout.stack()(["製造業外勞", "製造業缺工"].map(function (workers) {
        return dataset.map(function (d) {
            return {
                x: d.年分,
                y: +d[workers] / 10000
            };
        });
    }));
    var colors = ['#BEC23F', "#FFB11B"];

    var x = d3.scale.ordinal()
        .domain(data[0].map(function (d) {
            return d.x;
        }))
        .rangeRoundBands([0, w - 30], 0.18);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function (d) {
            return d3.max(d, function (d) {
                return d.y0 + d.y;
            });
        })])
        .range([h - 70, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickValues([2002,2004,2006,2008,2010,2012,2014,2016]),//.tickFormat(d3.time.format("%Y")),
        yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(function (d) {
            return d
        });
    svg.append('g').attr("class", "x axis").call(xAxis).attr('transform', 'translate(' + 0 + ',' + (h - margin.bottom - margin.top) + ')').attr({
        'fill': 'black',
        'stroke': 'none',
        'font-weight': 500,
        'font-family': "'Inconsolata', monospace"
    });
    svg.append('g').attr("class", "y axis").call(yAxis).attr({
        'fill': 'black',
        'stroke': 'none',
        'font-weight': 500,
        'font-family': "'Inconsolata', monospace"
    });

    var group_by_year = svg.selectAll(".num_of_people")
        .data(data)
        .enter()
        .append("g")
        .attr("fill", function (d, i) {
            return colors[i];
        })
        .attr("stroke", "#fff")
        .attr("class", "num_of_people1");
    var text = group_by_year.selectAll("text")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("text")
        .attr("x", function (d) {
            return x(d.x);
        })
        .attr("y", function (d) {
            return y(d.y0 + d.y);
        })
        .text(function (d, i) {
            return _f(d.y * 10000);
        })
        .attr({
            'fill': "#000",
            'stroke': "none",
            'font-size': '14',
            'font-weight': 'border',
            'font-family': "'Inconsolata', monospace",
        })
        .attr("visibility", "hidden")
        .attr("class", "desc_indus")
        .attr("id", function (d, i, j) {
            return "desc_indus" + j + i;
        })
    var rect = group_by_year.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x(d.x);
        })
        .attr("y", function (d) {
            return y(d.y0 + d.y);
        })
        .attr("width", x.rangeBand())
        .attr("height", function (d) {
            return y(d.y0) - y(d.y0 + d.y);
        });

    var label = ["製造業外勞人數", "製造業缺工人數"];
    var legend = svg.selectAll(".legend")
        .data(colors)
        .enter()
        .append("g")
        .attr("class", "legend")

    legend.append("rect")
        .attr('x', function (d, i) {
            return 10 + i * 120
        })
        .attr('y',( h-margin.bottom))
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function (d, i) {
            return colors[i];
        })

    legend.append("text")
        .attr('x', function (d, i) {
            return 25 + i * 120
        })
        .attr('y',  h-margin.top)
        .text(function (d, i) {
            return label[i];
        })
        .call(textstyle1)
    svg.append("text")
        .attr("transform",
            "translate(" + margin.left * 2 + " ," +
            0 + ")")
        .style("text-anchor", "middle")
        .text("萬人 /")
        .call(textstyle1);
    svg.append("text")
        .attr("transform",
            "translate(" + (margin.left * 3 + margin.right) + " ," +
            0 + ")")
        .style("text-anchor", "middle")
        .text("年")
        .call(textstyle1);

    group_by_year.selectAll("rect")
        .on("mouseover", function (d, i, j) {
            d3.selectAll(".num_of_people1").selectAll("rect").attr("opacity", 0.7);
            d3.select(this).attr("opacity", 1);
            $("#religion").html(religion[j]);
            d3.select("#desc_indus" + j + i).attr("visibility", "visible");
        })
        .on("mouseout", function (d, i, j) {
            d3.selectAll("rect").attr("opacity", 1);
            d3.select("#desc_indus" + j + i).attr("visibility", "hidden");
        })

})

function textstyle1(t) {
    t.attr({
        'fill': "#373C38",
        'font-size': '12',
        'font-weight': '500',
        'font-family': "'Noto Sans TC', sans-serif"
    });
}

function textstyle(t) {
    t.attr({
        'fill': "#6E552F",
        'font-size': '12',
        'font-weight': 'border',
        'font-family': "'Inconsolata', monospace"
    });
}