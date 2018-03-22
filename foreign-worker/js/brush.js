var appendBrush = function(){
    var margin = {
        top: 20,
        right: 20,
        bottom: 110,
        left: 20
    },
        margin2 = {
            top: 480,
            right: 20,
            bottom: 30,
            left: 20
        },
        width_pop = parseInt(d3.select("#population").style("width"), 10) - margin.right - margin.left,
        height_pop = parseInt(d3.select("#population").style("height"), 10) - margin.top - margin.bottom,
        height2 = parseInt(d3.select("#population").style("height"), 10) - margin2.top - margin2.bottom;
    // width_pop = 960 - margin.left - margin.right,
    // height_pop = 500 - margin.top - margin.bottom,
    // height2 = 500 - margin2.top - margin2.bottom;

    var svg_pop = d3.select("#population").append("svg")
        .attr("width", width_pop + margin.left + margin.right)
        .attr("height", height_pop + margin.top + margin.bottom + 50);

    var x = d3.time.scale().range([0, width_pop]),
        x2 = d3.time.scale().range([0, width_pop]),
        y = d3.scale.linear().range([height_pop, 0]),
        y2 = d3.scale.linear().range([height2, 0]);


    var xAxis = d3.svg.axis().scale(x).orient("Bottom").tickFormat(d3.format("d")),
        xAxis2 = d3.svg.axis().scale(x2).orient("Bottom").tickFormat(d3.format("d")),
        yAxis = d3.svg.axis().scale(y).orient("left");
    var brush = d3.svg.brush().x(x2)
        .on("brush", brushed);


    svg_pop.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width_pop)
        .attr("height", height_pop);
    var focus = svg_pop.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var context = svg_pop.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
    d3.csv("./database/brushdata.csv", type, function (error, data) {
        if (error) throw error;
        x.domain([2001, 2019]);
        y.domain([d3.min(data, function (d) {

            return d.growth_rate;
        }) - 3, d3.max(data, function (d) {
            return d.growth_rate;
        }) + 3]);
        x2.domain(x.domain());
        y2.domain(y.domain());
        // append scatter plot to main chart area 
        var dots = focus.append("g"),
            dots_tw = focus.append("g"),
            dots_info = focus.append("g"),
            ratio = focus.append("g");

        var Gradient = d3.scale.linear().domain([300150, 663234]).range(['#A5DEE4', '#26453D']);
        var Gradient1 = d3.scale.linear().domain([9454000, 11382000]).range(['#DAC9A6', '#E8B647']);
        dots.attr("clip-path", "url(#clip)");
        dots_tw.attr("clip-path", "url(#clip)");
        dots_info.attr("clip-path", "url(#clip)");
        ratio.attr("clip-path", "url(#clip)");
        dots.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr('class', 'dot')
            .attr("r", function (d) {
                return (d.移工總計 / 25000) * (parseInt(d3.select("#population").style("width"), 10) / 1000);
            })
            .attr("cx", function (d) {
                return x(d.年分);
            })
            .attr("cy", function (d) {
                return y(d.growth_rate);
            })
            .attr("fill", function (d) {
                return Gradient(d.移工總計);
            })
            .attr('id', function (d, i) {
                return 'dots' + i;
            });
        dots_tw.selectAll(".dot_tw")
            .data(data)
            .enter().append("circle")
            .attr('class', 'dot_tw')
            .attr("r", function (d) {
                return (d.台勞 / 120000) * (parseInt(d3.select("#population").style("width"), 10) / 1000);
            })
            .style("opacity", .4)
            .attr("cx", function (d) {
                return x(d.年分);
            })
            .attr("cy", function (d) {
                if (d.growth_rate > 6)
                    return y(d.growth_rate) + (d.台勞 / 130000) * (parseInt(d3.select("#population").style("width"), 10) / 1000);
                else
                    return y(d.growth_rate) - (d.台勞 / 130000) * (parseInt(d3.select("#population").style("width"), 10) / 1000);
            })
            .attr("fill", function (d) {
                return Gradient1(d.台勞);
            })
            .attr("visibility", "hidden")
            .attr('id', function (d, i) {
                return 'dots_tw' + i;
            });
        dots_info.selectAll(".dot_info")
            .data(data)
            .enter().append("text")
            .attr('class', 'dot_info')
            .attr('id', function (d, i) {
                return 'dots_info' + i;
            }).text(function (d, i) {
                return d.growth_rate;
            })
            .attr("x", function (d) {
                return x(d.年分) - 15;
            })
            .attr("y", function (d) {
                return y(d.growth_rate) - 10;
            })
            .attr("visibility", "hidden")
            .call(textstyle);
        var _f = d3.format(".0f");
        ratio.selectAll(".ratio")
            .data(data)
            .enter().append("text")
            .attr('class', 'ratio')
            .attr('id', function (d, i) {
                return 'ratio' + i;
            }).text(function (d, i) {
                return "移工 : 台勞 = 1 : " + _f(d.台勞 / d.移工總計);
            })
            .attr("x", function (d) {
                return x(d.年分) - 75;
            })
            .attr("y", function (d) {
                if (d.growth_rate > 6)
                    return y(d.growth_rate) + 80;
                else
                    return y(d.growth_rate) - 80;
            })
            .attr("visibility", "hidden")
            .attr('font-size', 18)
            .attr('font-weight', 800)
            .attr('font-family', "'Noto Sans TC', sans-serif")
            .attr('fill', '#6E552F');

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height_pop + ")")
            .call(xAxis)
            .attr({
                'fill': 'black',
                'stroke': 'none',
                'font-weight': 500,
                'font-family': "'Inconsolata', monospace"
            });
        focus.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(0,0)")
            .call(yAxis)
            .attr({
                'fill': 'black',
                'stroke': 'none',
                'font-weight': 500,
                'font-family': "'Inconsolata', monospace"
            });

        focus.append("text")
            .attr("transform",
                "translate(" + margin.left * 4 + " ," +
                0 + ")")
            .style("text-anchor", "middle")
            .text("移工較去年增減率(%)/")
            .call(textstyle1);
        focus.append("text")
            .attr("transform",
                "translate(" + (margin.right * 8) + " ," +
                0 + ")")
            .style("text-anchor", "middle")
            .text("西元年")
            .call(textstyle1);

        // append scatter plot to brush chart area      
        var dots_b = context.append("g");
        dots_b.attr("clip-path", "url(#clip)");
        dots_b.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr('class', 'dotContext')
            .attr("r", 3)
            .style("opacity", .9)
            .attr("cx", function (d) {
                return x2(d.年分);
            })
            .attr("cy", function (d) {
                return y2(d.growth_rate);
            }).attr("fill", function (d) {
                return Gradient(d.移工總計);
            })
            .attr("id", function (d, i) {
                return "dots_b" + i;
            });
        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2)
            .attr({
                'fill': 'black',
                'stroke': 'none',
                'font-weight': 500,
                'font-family': "'Inconsolata', monospace"
            });
        context.append("g")
            .attr("class", "brush")
            .call(brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", height2 + 7);

        svg_pop.append('circle').attr({
            'transform': 'translate(' + (margin.left + margin.right) + ',' + (margin.top + 15) + ')',
            'r': 5,
            'fill': '#26453D',
        })
        svg_pop.append("text").text('外籍移工人數').attr('transform', 'translate(' + (margin.left + margin.right * 2 - 15) + ',' + (margin.top + 20) + ')').call(textstyle1);
        svg_pop.append('circle').attr({
            'transform': 'translate(' + (margin.left * 7) + ',' + (margin.top + 15) + ')',
            'r': 5,
            'fill': '#E8B647',
        })
        svg_pop.append("text").text('台灣就業人數').attr('transform', 'translate(' + (margin.right * 7 + 5) + ',' + (margin.top + 20) + ')').call(textstyle1);

        //event
        var last = 0;
        var flag = 0;
        dots.selectAll(".dot").on('mouseover', function (d, i) {
            if (flag = 0) {
                last = i;
                flag = 1;
            }
            if (last != i) {
                //total text
                $("#year").text(d.年分);
                $("#total").text(d.移工總計);
                if (Number(d.移工總計) < Number(d.原住民)) {
                    $("#aboriginal").text(" ");
                } else {
                    $("#aboriginal").html("已超越原住民人數 " + d.原住民);
                }
                d3.select('#dots' + last).transition().duration(300).ease('poly', 2).attr({
                    r: function (d) {
                        return (d.移工總計 / 25000) * (parseInt(d3.select("#population").style("width"), 10) / 1000);
                    },
                    fill: function (d) {
                        return Gradient(d.移工總計);
                    },
                    opacity: 1
                });
                d3.select('#dots_b' + last).transition().duration(300).ease('poly', 2).attr({

                    fill: function (d) {
                        return Gradient(d.移工總計);
                    },
                    opacity: 1
                });
                d3.select('#dots_tw' + last).transition().duration(300).ease('poly', 2).attr({
                    visibility: 'hidden'

                });
                d3.select('#dots_info' + last).transition().duration(300).ease('poly', 2).attr({
                    visibility: 'hidden'
                });
                d3.select('#ratio' + last).transition().duration(300).ease('poly', 2).attr({
                    visibility: 'hidden'
                });
                flag = 0;
            }
            //(litter circle)
            d3.select(this).transition().duration(300).ease('poly', 2).attr({
                r: function (d) {
                    return (d.移工總計 / 120000) * (parseInt(d3.select("#population").style("width"), 10) / 1000);
                },

                opacity: 1
            })
            d3.select('#dots_b' + i).transition().duration(300).ease('poly', 2).attr({
                fill: '#8E354A'

            })
            last = i;
            //labor of taiwan(big circle)
            d3.select('#dots_tw' + i).transition().duration(600).ease('poly', 2).attr({
                visibility: 'visible',
                opacity: 0.7
            })
            d3.select('#dots_info' + i).transition().duration(600).ease('poly', 2).attr({
                visibility: 'visible'
            })
            d3.select('#ratio' + i).transition().duration(600).ease('poly', 2).attr({
                visibility: 'visible'
            })
        });

    });
    //create brush function redraw scatterplot with selection
    function brushed() {
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.selectAll(".dot")
            .attr("cx", function (d) {
                return x(d.年分);
            })
            .attr("cy", function (d) {
                return y(d.growth_rate);
            });
        focus.selectAll(".dot_tw")
            .attr("cx", function (d) {
                return x(d.年分);
            })
            .attr("cy", function (d) {
                if (d.growth_rate > 6)
                    return y(d.growth_rate) + (d.台勞 / 130000) * (parseInt(d3.select("#population").style("width"), 10) / 1000);
                else
                    return y(d.growth_rate) - (d.台勞 / 130000) * (parseInt(d3.select("#population").style("width"), 10) / 1000);
            });
        focus.selectAll(".dot_info")
            .attr("x", function (d) {
                return x(d.年分) - 15;
            })
            .attr("y", function (d) {
                return y(d.growth_rate) - 10;
            });
        focus.selectAll(".ratio")
            .attr("x", function (d) {
                return x(d.年分) - 75;
            })
            .attr("y", function (d) {
                if (d.growth_rate > 6)
                    return y(d.growth_rate) + 80;
                else
                    return y(d.growth_rate) - 80;
            });
        focus.select(".axis--x").call(xAxis);
    };

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
            'font-size': '16',
            'font-weight': 'border',
            'font-family': "'Inconsolata', monospace"
        });
    }

    function type(d) {
        d.年分 = d.年分;
        d.growth_rate = +d.growth_rate;

        return d;
    };
}