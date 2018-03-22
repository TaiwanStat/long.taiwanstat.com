/*LineChart*/
//append svg ,g and set position
var appendLinechart = function(){
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
    var margin = {
        top: 30,
        right: 20,
        bottom: 40,
        left: 10
    };
    var padding = {
        top: 50,
        right: 40,
        bottom: 30,
        left: 30
    };
    var width_Line = parseInt(d3.select("#threek").style("width"), 10) - padding.left - padding.right,
        height_Line = parseInt(d3.select("#threek").style("height"), 10) - padding.top - padding.bottom;
    d3.csv("./database/Linedata.csv", function (error, csvdata) {
        if (error) throw error;

        var svgLineChart = d3.select("#linechart").append('svg').attr({
            'width': width_Line,
            'height': height_Line
        });
        var LineChart = svgLineChart.append('g');
        LineChart.attr('transform', "translate(" + padding.top + "," + padding.left + ')');

        //x,y軸比例尺
        var xScale = d3.scale.linear().domain(d3.extent(csvdata, function (d) {
            return d.年分;
        })).range([0, width_Line - padding.left - padding.right]);
        var Ymax = d3.max(csvdata, function (d) {
            if (parseInt(d.國內) > parseInt(d.外勞)) {
                return d.國內;
            } else {
                return d.外勞;
            }
        });
        var yScale = d3.scale.linear().domain([0, Ymax]).range([height_Line - padding.top - padding.bottom, 0]);

        //創建x,y軸
        var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(4).tickFormat(d3.format("d"));
        var yAxis = d3.svg.axis().scale(yScale).tickFormat(function (d) {
            return d + '‰';
        }).orient('left');

        //call axis
        LineChart.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + (height_Line - padding.top - padding.bottom) + ')')
            .call(xAxis).attr({
                'stroke': '#000',
                'stroke-width': '2px',
                'fill': 'none'
            })
            .selectAll('text')
            .attr({
                'fill': 'black',
                'stroke': 'none',
                'font-weight': 500,
                'font-family': "'Inconsolata', monospace"
            });
        LineChart.append('g').attr('class', 'axis').call(yAxis)
            .attr({
                'stroke': '#000',
                'stroke-width': '2px',
                'fill': 'none'
            })
            .selectAll('text')
            .attr({
                'fill': 'black',
                'stroke': 'none',
                'font-weight': 500,
                'font-family': "'Inconsolata', monospace"
            });

        LineChart.append("text")
            .attr("transform",
                "translate(" + (margin.left * 2 + 5) + " ," +
                0 + ")")
            .style("text-anchor", "middle")
            .text("職災千人率 /")
            .call(textstyle1);
        LineChart.append("text")
            .attr("transform",
                "translate(" + (margin.left * 3 + margin.right + 15) + " ," +
                0 + ")")
            .style("text-anchor", "middle")
            .text("年")
            .call(textstyle1);
        //折線(產業移工&社福移工)
        var Line = [];
        Line[0] = d3.svg.line().x(function (d) {
            return xScale(d.年分);
        }).y(function (d) {
            return yScale(d.國內);
        }).interpolate('linear');
        LineChart.append('path').attr('class', 'line').attr('d', Line[0](csvdata))
            .attr({
                'stroke': '#E8B647',
                'stroke-width': '1px',
                'fill': 'none'
            });
        Line[1] = d3.svg.line().x(function (d) {
            return xScale(d.年分);
        }).y(function (d) {
            return yScale(d.外勞);
        }).interpolate('linear');
        LineChart.append('path').attr('class', 'line').attr('d', Line[1](csvdata))
            .attr({
                'stroke': '#26453D',
                'stroke-width': '1px',
                'fill': 'none'
            });

        //標記點
        LineChart.append('g').selectAll('circle')
            .data(csvdata)
            .enter()
            .append('circle')
            .attr('cx', function (d) {

                return xScale(d.年分);
            })
            .attr('cy', function (d) {

                return yScale(d.國內);
            })
            .attr('r', 3)
            .attr('fill', '#E8B647')
            .attr('opacity', function (d, i) {
                return 1;
                // if(i!=0)
                //     return 0;
            })
            .attr('id', function (d, i) {
                return 'dot' + i;
            });
        LineChart.append('g').selectAll('circle')
            .data(csvdata)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return xScale(d.年分);
            })
            .attr('cy', function (d) {
                return yScale(d.外勞);
            })
            .attr('r', 3)
            .attr('fill', '#26453D')
            .attr('opacity', function (d, i) {
                return 1;
                // if(i!=0)
                //     return 0;
            })
            .attr('id', function (d, i) {
                return 'dot' + i;
            });
        LineChart.append("text").text('台灣勞工職災千人率').attr('transform', 'translate(' + (padding.left / 2) + ',' + (height_Line - padding.bottom - 5) + ')').call(textstyle1);
        LineChart.append("text").text('外籍勞工職災千人率').attr('transform', 'translate(' + (padding.left * 2 + padding.right * 2.5) + ',' + (height_Line - padding.bottom - 5) + ')').call(textstyle1);
        LineChart.append('circle').attr({
            'transform': 'translate(' + 0 + ',' + (height_Line - padding.bottom - 10) + ')',
            'r': 5,
            'fill': '#E8B647',
        })
        LineChart.append('circle').attr({
            'transform': 'translate(' + (padding.left * 2 + padding.right * 2) + ',' + (height_Line - padding.bottom - 10) + ')',
            'r': 5,
            'fill': '#26453D',
        })
        //標記文字
        var offsetY = 1;
        LineChart.append('g').attr('class', 'mark1');
        LineChart.append('g').attr('class', 'mark2');
        for (var i = 1; i < 3; i++) {
            LineChart.select('.mark' + i).selectAll('text')
                .data(csvdata)
                .enter()
                .append('text')
                .attr({
                    'x': function (d) {
                        return xScale(d.年分);
                    },
                    'fill': "black",
                    'font-size': '1vw',
                    'font-weight': 'bold',
                    'font-family': "'Inconsolata', monospace",
                    'visibility': 'hidden',
                    'id': function (d, i) {
                        return 'mark' + i;
                    }
                });
        }
        LineChart.select('.mark1').selectAll('text').text(function (d) {
            return d.國內
        }).attr('y', function (d) {
            if (Math.floor(d.國內, 0) == Math.floor(d.外勞, 0)) {
                return yScale(offsetY + d.國內);
            } else
                return yScale(d.國內);
        })
        LineChart.select('.mark2').selectAll('text').text(function (d) {
            return d.外勞
        }).attr('y', function (d) {
            if (Math.floor(d.國內, 0) == Math.floor(d.外勞, 0)) {
                return yScale(d.外勞 - offsetY);
            } else
                return yScale(d.外勞);
        })
    });
    d3.csv("./database/long_term_care.csv", function (error, csvdata) {
        if (error) throw error;


        var svgLineChart = d3.select("#donut_care").append('svg').attr({
            'width': width_Line,
            'height': height_Line + padding.top + padding.bottom
        });
        var LineChart = svgLineChart.append('g');
        LineChart.attr('transform', "translate(" + padding.top + "," + padding.left + ')');

        //x,y軸比例尺
        var xScale = d3.scale.linear().domain(d3.extent(csvdata, function (d) {
            return +d.年分;
        })).range([0, width_Line - padding.left - padding.right]);
        var Ymax = d3.max(csvdata, function (d) {
            return d.外籍看護工;
        });
        var yScale = d3.scale.linear().domain([0, Ymax]).range([height_Line - padding.top * 2 - padding.bottom * 2, 0]);

        //創建x,y軸
        var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(4).tickFormat(d3.format("d"));
        var yAxis = d3.svg.axis().scale(yScale).tickFormat(function (d) {
            return d / 10000;
        }).orient('left');

        //call axis
        LineChart.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + (height_Line - padding.top * 2 - padding.bottom * 2) + ')')
            .call(xAxis).attr({
                'stroke': '#000',
                'stroke-width': '2px',
                'fill': 'none'
            })
            .selectAll('text')
            .attr({
                'fill': 'black',
                'stroke': 'none',
                'font-weight': 500,
                'font-family': "'Inconsolata', monospace"
            });
        LineChart.append('g').attr('class', 'axis').call(yAxis)
            .attr({
                'stroke': '#000',
                'stroke-width': '2px',
                'fill': 'none'
            })
            .selectAll('text')
            .attr({
                'fill': 'black',
                'stroke': 'none',
                'font-weight': 500,
                'font-family': "'Inconsolata', monospace"
            });

        LineChart.append("text")
            .attr("transform",
                "translate(" + margin.left * 2 + " ," +
                0 + ")")
            .style("text-anchor", "middle")
            .text("萬人 /")
            .call(textstyle1);
        LineChart.append("text")
            .attr("transform",
                "translate(" + (margin.left * 3 + margin.right) + " ," +
                0 + ")")
            .style("text-anchor", "middle")
            .text("年")
            .call(textstyle1);
        //折線
        var Line = [];
        Line[0] = d3.svg.line().x(function (d) {
            return xScale(d.年分);
        }).y(function (d) {
            return yScale(d.外籍看護工);
        }).interpolate('linear');
        LineChart.append('path').attr('class', 'line').attr('d', Line[0](csvdata))
            .attr({
                'stroke': '#E8B647',
                'stroke-width': '1px',
                'fill': 'none'
            });
        Line[1] = d3.svg.line().x(function (d) {
            return xScale(d.年分);
        }).y(function (d) {
            return yScale(d.居家照顧服務員);
        }).interpolate('linear');
        LineChart.append('path').attr('class', 'line').attr('d', Line[1](csvdata))
            .attr({
                'stroke': '#26453D',
                'stroke-width': '1px',
                'fill': 'none'
            });
        Line[2] = d3.svg.line().x(function (d) {
            return xScale(d.年分);
        }).y(function (d) {
            return yScale(d.居家照顧服務人數);
        }).interpolate('linear');
        LineChart.append('path').attr('class', 'line').attr('d', Line[2](csvdata))
            .attr({
                'stroke': '#264587',
                'stroke-width': '1px',
                'fill': 'none'
            });

        //標記點
        LineChart.append('g').selectAll('circle')
            .data(csvdata)
            .enter()
            .append('circle')
            .attr('cx', function (d) {

                return xScale(d.年分);
            })
            .attr('cy', function (d) {

                return yScale(d.外籍看護工);
            })
            .attr('r', 3)
            .attr('fill', '#E8B647')
            .attr('opacity', function (d, i) {
                return 1;
                // if(i!=0)
                //     return 0;
            })
            .attr('id', function (d, i) {
                return 'dot' + i;
            });
        LineChart.append('g').selectAll('circle')
            .data(csvdata)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return xScale(d.年分);
            })
            .attr('cy', function (d) {
                return yScale(d.居家照顧服務員);
            })
            .attr('r', 3)
            .attr('fill', '#26453D')
            .attr('opacity', function (d, i) {
                return 1;
                // if(i!=0)
                //     return 0;
            })
            .attr('id', function (d, i) {
                return 'dot' + i;
            });
        LineChart.append('g').selectAll('circle')
            .data(csvdata)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return xScale(d.年分);
            })
            .attr('cy', function (d) {
                return yScale(d.居家照顧服務人數);
            })
            .attr('r', 3)
            .attr('fill', '#264587')
            .attr('opacity', function (d, i) {
                return 1;
                // if(i!=0)
                //     return 0;
            })
            .attr('id', function (d, i) {
                return 'dot' + i;
            });

        LineChart.append("text").text('外籍看護工人數 / 照顧人數(註:一人申請一看護)').attr('transform', 'translate(' + (padding.left / 2) + ',' + (height_Line - padding.bottom * 2 - padding.top + 5) + ')').call(textstyle1);
        LineChart.append("text").text('居家照顧服務員人數').attr('transform', 'translate(' + (padding.left / 2) + ',' + (height_Line - padding.bottom * 2 - padding.top + 25) + ')').call(textstyle1);
        LineChart.append("text").text('居家照顧服務人數').attr('transform', 'translate(' + (padding.left / 2) + ',' + (height_Line - padding.bottom * 2 - padding.top + 45) + ')').call(textstyle1);
        LineChart.append('circle').attr({
            'transform': 'translate(0' + ',' + (height_Line - padding.bottom * 2 - padding.top) + ')',
            'r': 5,
            'fill': '#E8B647',
        })
        LineChart.append('circle').attr({
            'transform': 'translate(0' + ',' + (height_Line - padding.bottom * 2 - padding.top + 20) + ')',
            'r': 5,
            'fill': '#26453D',
        })
        LineChart.append('circle').attr({
            'transform': 'translate(0,' + (height_Line - padding.bottom * 2 - padding.top + 40) + ')',
            'r': 5,
            'fill': '#264587',
        })
        //標記文字
        var offsetY = 1;
        LineChart.append('g').attr('class', 'mark1');
        LineChart.append('g').attr('class', 'mark2');
        LineChart.append('g').attr('class', 'mark3');
        for (var i = 1; i < 4; i++) {
            LineChart.select('.mark' + i).selectAll('text')
                .data(csvdata)
                .enter()
                .append('text')
                .attr({
                    'x': function (d) {
                        return xScale(d.年分);
                    },
                    'fill': "black",
                    'font-size': '1vw',
                    'font-weight': 'bold',
                    'font-family': "'Inconsolata', monospace",
                    'visibility': 'hidden',
                    'id': function (d, i) {
                        return 'mark' + i;
                    }
                });
        }
        LineChart.select('.mark1').selectAll('text').text(function (d) {
            return d.外籍看護工
        }).attr('y', function (d) {
            if (Math.floor(d.外籍看護工, 0) == Math.floor(d.居家照顧服務員, 0)) {
                return yScale(offsetY + d.外籍看護工);
            } else
                return yScale(d.外籍看護工);
        })
        LineChart.select('.mark2').selectAll('text').text(function (d) {
            return d.居家照顧服務員
        }).attr('y', function (d) {
            if (Math.floor(d.外籍看護工, 0) == Math.floor(d.居家照顧服務員, 0)) {
                return yScale(d.居家照顧服務員 - offsetY);
            } else
                return yScale(d.居家照顧服務員);
        })
        LineChart.select('.mark3').selectAll('text').text(function (d) {
            return d.居家照顧服務人數
        }).attr('y', function (d) {
            if (Math.floor(d.居家照顧服務人數, 0) == Math.floor(d.居家照顧服務員, 0)) {
                return yScale(d.居家照顧服務人數 - offsetY);
            } else
                return yScale(d.居家照顧服務人數);
        })
    });
    d3.csv("./database/3k.csv", function (error, csvdata) {
        if (error) throw error;


        var svgLineChart = d3.select("#threek").append('svg').attr({
            'width': width_Line,
            'height': height_Line
        });
        var LineChart = svgLineChart.append('g');
        LineChart.attr('transform', "translate(" + padding.top + "," + padding.left + ')');

        //x,y軸比例尺
        var xScale = d3.scale.linear().domain(d3.extent(csvdata, function (d) {
            return d.年分;
        })).range([0, width_Line - padding.left - padding.right]);
        // var Ymax = d3.max(csvdata, function (d,i) {
        //     return d.threek;
        // });
        var yScale = d3.scale.linear().domain([0, 300720]).range([height_Line - padding.top - padding.bottom, 0]);

        //創建x,y軸
        var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(4).tickFormat(d3.format("d"));
        var yAxis = d3.svg.axis().scale(yScale).tickFormat(function (d) {
            return d / 10000;
        }).orient('left');

        //call axis
        LineChart.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + (height_Line - padding.top - padding.bottom) + ')')
            .call(xAxis).attr({
                'stroke': '#000',
                'stroke-width': '2px',
                'fill': 'none'
            })
            .selectAll('text')
            .attr({
                'fill': 'black',
                'stroke': 'none',
                'font-weight': 500,
                'font-family': "'Inconsolata', monospace"
            });
        LineChart.append('g').attr('class', 'axis').call(yAxis)
            .attr({
                'stroke': '#000',
                'stroke-width': '2px',
                'fill': 'none'
            })
            .selectAll('text')
            .attr({
                'fill': 'black',
                'stroke': 'none',
                'font-weight': 500,
                'font-family': "'Inconsolata', monospace"
            });
        LineChart.append("text")
            .attr("transform",
                "translate(" + margin.left * 2 + " ," +
                0 + ")")
            .style("text-anchor", "middle")
            .text("萬人 /")
            .call(textstyle1);
        LineChart.append("text")
            .attr("transform",
                "translate(" + (margin.left * 3 + margin.right) + " ," +
                0 + ")")
            .style("text-anchor", "middle")
            .text("年")
            .call(textstyle1);

        //折線
        var Line = [];
        Line[0] = d3.svg.line().x(function (d) {
            return xScale(d.年分);
        }).y(function (d) {
            return yScale(d.threek);
        }).interpolate('linear');
        LineChart.append('path').attr('class', 'line').attr('d', Line[0](csvdata))
            .attr({
                'stroke': '#E8B647',
                'stroke-width': '1px',
                'fill': 'none'
            });
        Line[1] = d3.svg.line().x(function (d) {
            return xScale(d.年分);
        }).y(function (d) {
            return yScale(d.附加);
        }).interpolate('linear');
        LineChart.append('path').attr('class', 'line').attr('d', Line[1](csvdata))
            .attr({
                'stroke': '#26453D',
                'stroke-width': '1px',
                'fill': 'none'
            });


        //標記點
        LineChart.append('g').selectAll('circle')
            .data(csvdata)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return xScale(d.年分);
            })
            .attr('cy', function (d) {

                return yScale(d.threek);
            })
            .attr('r', 3)
            .attr('fill', '#E8B647')
            .attr('opacity', function (d, i) {
                return 1;
                // if(i!=0)
                //     return 0;
            })
            .attr('id', function (d, i) {
                return 'dot' + i;
            });
        LineChart.append('g').selectAll('circle')
            .data(csvdata)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return xScale(d.年分);
            })
            .attr('cy', function (d) {
                return yScale(d.附加);
            })
            .attr('r', function (d, i) {
                if (d.附加 == 0) return 0;
                else return 3;
            })
            .attr('fill', '#26453D')
            .attr('opacity', function (d, i) {
                return 1;
                // if(i!=0)
                //     return 0;
            })
            .attr('id', function (d, i) {
                return 'dot' + i;
            });

        LineChart.append("text").text('外勞從事3k產業人數').attr('transform', 'translate(' + (padding.left / 2) + ',' + (height_Line - padding.bottom - 5) + ')').call(textstyle1);
        LineChart.append("text").text('附加外勞人數').attr('transform', 'translate(' + (padding.left * 2 + padding.right * 2 + 5) + ',' + (height_Line - padding.bottom - 5) + ')').call(textstyle1);

        LineChart.append('circle').attr({
            'transform': 'translate(' + 0 + ',' + (height_Line - padding.bottom - 10) + ')',
            'r': 5,
            'fill': '#E8B647',
        })
        LineChart.append('circle').attr({
            'transform': 'translate(' + (padding.left * 2 + padding.right * 2) + ',' + (height_Line - padding.bottom - 10) + ')',
            'r': 5,
            'fill': '#26453D',
        })

        //標記文字
        var offsetY = 1;
        LineChart.append('g').attr('class', 'mark1');
        LineChart.append('g').attr('class', 'mark2');

        for (var i = 1; i < 3; i++) {
            LineChart.select('.mark' + i).selectAll('text')
                .data(csvdata)
                .enter()
                .append('text')
                .attr({
                    'x': function (d) {
                        return xScale(d.年分);
                    },
                    'fill': "black",
                    'font-size': '1vw',
                    'font-weight': 'bold',
                    'font-family': "'Inconsolata', monospace",
                    'visibility': 'hidden',
                    'id': function (d, i) {
                        return 'mark' + i;
                    }
                });
        }
        LineChart.select('.mark1').selectAll('text').text(function (d) {
            return d.threek
        }).attr('y', function (d) {
            if (Math.floor(d.threek, 0) == Math.floor(d.附加, 0)) {
                return yScale(offsetY + d.threek);
            } else
                return yScale(d.threek);
        })
        LineChart.select('.mark2').selectAll('text').text(function (d) {
            return d.附加
        }).attr('y', function (d) {
            if (Math.floor(d.threek, 0) == Math.floor(d.附加, 0)) {
                return yScale(d.附加 - offsetY);
            } else
                return yScale(d.附加);
        })
    });
}