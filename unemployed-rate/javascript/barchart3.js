d3.csv("./data/prejob.csv", function (error, prejobData) {

    var prejobSvg = d3.select("#prejobSvg");

    function prejobSvgDraw() {
        var whichYear = 0; //2017
        var prejobChartMargin = {
                top: 35,
                right: 20,
                bottom: 250,
                left: 70
            },
            prejobContainerWidth = document.getElementById("prejobSvg-container").clientWidth,
            prejobChartWidth = prejobContainerWidth - prejobChartMargin.left - prejobChartMargin.right,
            prejobChartHeight = 600 - prejobChartMargin.top - prejobChartMargin.bottom;


        var axisTextSize5 = 20;
        // console.log(prejobContainerWidth);

        if (prejobContainerWidth >= 1200) {
            axisTextSize5 = 20;
        } else if (prejobContainerWidth >= 960 && prejobContainerWidth < 1200) {
            axisTextSize5 = 18;
        } else if (prejobContainerWidth >= 440 && prejobContainerWidth < 960) {
            axisTextSize5 = 15;
        } else if (prejobContainerWidth >= 390 && prejobContainerWidth < 440) {
            axisTextSize5 = 10;
        } else if (prejobContainerWidth < 390 && prejobContainerWidth >= 330) {
            axisTextSize5 = 7;
            // prejobChartMargin.bottom = 50;
        } else if (prejobContainerWidth < 330 && prejobContainerWidth >= 300) {
            axisTextSize5 = 6;
            // prejobChartMargin.bottom = 100;
            // prejobChartHeight = 500 - prejobChartMargin.top - prejobChartMargin.bottom;
        } else {
            axisTextSize5 = 4;
        }

        prejobChartMargin.bottom = axisTextSize5 * 18;

        var textColor5 = '#6E6E6E';
        var prejobScaleX = d3.scale.ordinal()
            .rangeRoundBands([0, prejobChartWidth], .25);

        var prejobScaleY = d3.scale.linear()
            .range([prejobChartHeight, 0]);

        var prejobChartAxisX = d3.svg.axis()
            .scale(prejobScaleX)
            .orient("bottom")
            .ticks(10);

        var prejobChartAxisY = d3.svg.axis()
            .scale(prejobScaleY)
            .orient("left")
            .ticks(5);

        prejobSvg
            .attr("width", prejobChartWidth + prejobChartMargin.left + prejobChartMargin.right)
            .attr("height", prejobChartHeight + prejobChartMargin.top + prejobChartMargin.bottom)
            .append("g");

        prejobData.forEach(function (d) {
            d.py = +d.py;
            d.p_rate = +d.p_rate;
        });


        var entirePrejobData = [];
        var yearlyPrejobData = [];
        var wholeYear = [2017, 2016, 2015, 2014, 2013, 2012, 2011];

        for (var i = 0; i < wholeYear.length; ++i) {
            yearlyPrejobData[i] = [];
        }

        for (var i = 0; i < prejobData.length; i++) {
            entirePrejobData.push(prejobData[i]);
            for (var j = 0; j < wholeYear.length; ++j) {
                if (entirePrejobData[i].py == wholeYear[j]) {
                    yearlyPrejobData[j].push(entirePrejobData[i]);
                }

            }
        }

        var sortedData = yearlyPrejobData.slice(0);

        sortedData[whichYear].sort(function (x, y) {
            return d3.descending(x.p_rate, y.p_rate);
        });


        prejobScaleX.domain(yearlyPrejobData[whichYear].map(function (d) {
            return d['prejob'];
        }));
        prejobScaleY.domain([0, d3.max(yearlyPrejobData[whichYear], function (d) {
            return d.p_rate;
        })]);

        // 繪出x軸
        prejobSvg.append("g")
            .attr("transform", "translate(" + prejobChartMargin.left + "," + (prejobChartHeight + prejobChartMargin.top) + ")")
            .attr("class", "prejobXaxis")
            .call(prejobChartAxisX)
            .attr("fill", 'none')
            .attr("stroke", textColor5)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.1em")
            .attr("dy", "0.7em")
            .attr("transform", "rotate(-45)")
            .attr("stroke", textColor5)
            .attr({
                'fill': textColor5, //x軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize5
            })
            .attr('font-family', 'Noto Sans TC');

        // 繪出y軸
        prejobSvg.append("g")
            .attr("transform", "translate(" + prejobChartMargin.left + "," + prejobChartMargin.top + ")")
            .attr("class", "prejobYaxis")
            .call(prejobChartAxisY)
            .attr("fill", 'none')
            .attr("stroke", textColor5)
            .selectAll("text")
            .attr("stroke", textColor5)
            .attr({
                'fill': textColor5, //y軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize5
            })
            .attr('font-family', 'Noto Sans TC');


        //繪出Y軸單位
        prejobSvg.append("text")
            .attr("transform", "translate(" + prejobChartMargin.left + "," + prejobChartMargin.top + ")")
            .attr("x", 15)
            .attr("y", -33)
            .attr("dy", "1em")
            .attr({
                'fill': textColor5, // y軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize5
            })
            .attr('font-family', 'Noto Sans TC')
            .style("text-anchor", "end")
            .text("人數(%)");

        var prejobTip = d3.tip()
            .attr('class', 'prejob-d3-tip')
            .offset([-10, 0])
            .html(function (d) {
                if (d.prejob == "批發及零售業" || d.prejob == "製造業") return d.prejob + " : <span style='color:#FF7777'>" + d.p_rate + "</span> %";
                else return d.prejob + " : <span style='color:#fff'>" + d.p_rate + "</span> %";
            })

        prejobSvg.call(prejobTip);

        // 繪出柱狀圖
        var prejobBarRect = prejobSvg.selectAll(".prejobBarRect")
            .data(yearlyPrejobData[whichYear]);

        prejobBarRect.enter().append("rect")
            .attr("transform", "translate(" + prejobChartMargin.left + "," + prejobChartMargin.top + ")")
            .attr("class", "prejobBarRect")
            .style("fill", function (d) {
                if (d.prejob == "批發及零售業" || d.prejob == "製造業") return "#FF7777";
                else return "steelblue";
            })
            .attr("x", function (d) {
                return prejobScaleX(d.prejob);
            })
            .attr("width", prejobScaleX.rangeBand())
            .attr("y", function (d) {
                return prejobScaleY(d.p_rate);
            })
            .attr("height", function (d) {
                return prejobChartHeight - prejobScaleY(d.p_rate);
            })
            .on('mouseover', prejobTip.show)
            .on('mouseout', prejobTip.hide);

        var titleSize3 = 20;
        if (prejobContainerWidth / 35 > 20)
            titleSize3 = 20;
        else titleSize3 = prejobContainerWidth / 35 - 1;

        // console.log(prejobChartHeight);
        // console.log(prejobChartMargin.bottom);
        // console.log(prejobChartMargin.top);
        // console.log(titleSize3);
        // 此svg的標題
        prejobSvg.append("text")
            .attr("transform", "translate(" + prejobChartMargin.left + "," + prejobChartMargin.top + ")")
            .attr("x", prejobContainerWidth / 2 - prejobChartMargin.left)
            .attr("y", prejobChartHeight + prejobChartMargin.bottom - titleSize3)
            .attr("text-anchor", "middle")
            .text("學歷為大學以上之原有工作之失業者失業前行業(2011年-2017年)")
            .attr("fill", textColor5)
            .attr("font-size", titleSize3)
            .attr('font-family', 'Noto Sans TC');

        var prejobDropdown = d3.select("#prejob-select")
            .on("change", prejobDropdownChange);

        var dataChangingTime2 = 750;

        function prejobDropdownChange() {
            whichYear = parseInt(d3.select("#prejob-select").property('value'));
            //重新定義一些資料

            sortedData[whichYear].sort(function (x, y) {
                return d3.descending(x.p_rate, y.p_rate);
            })

            prejobScaleX.domain(yearlyPrejobData[whichYear].map(function (d) {
                return d['prejob'];
            }));
            prejobScaleY.domain([0, d3.max(yearlyPrejobData[whichYear], function (d) {
                return d.p_rate;
            })]);

            prejobChartAxisX = d3.svg.axis()
                .scale(prejobScaleX)
                .orient("bottom")
                .ticks(10);

            prejobChartAxisY = d3.svg.axis()
                .scale(prejobScaleY)
                .orient("left")
                .ticks(5);

            // 給新的資料
            prejobBarRect = prejobSvg.selectAll(".prejobBarRect")
                .data(yearlyPrejobData[whichYear]);

            // 繪出新的bar
            prejobBarRect.transition()
                .duration(dataChangingTime2)
                .attr("y", function (d) {
                    return prejobScaleY(d.p_rate);
                })
                .attr("height", function (d) {
                    return prejobChartHeight - prejobScaleY(d.p_rate);
                });

            // 繪出x軸
            d3.select("body")
                .transition()
                .select(".prejobXaxis") // change the x axis
                .duration(dataChangingTime2)
                .call(prejobChartAxisX)
                .attr("fill", 'none')
                .attr("stroke", textColor5)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-0.1em")
                .attr("dy", "0.7em")
                .attr("transform", "rotate(-45)")
                .attr("stroke", textColor5)
                .attr({
                    'fill': textColor5, //y軸文字顏色
                    'stroke': 'none',
                }).style({
                    'font-size': axisTextSize5
                })
                .attr('font-family', 'Noto Sans TC');

            // 繪出y軸
            d3.select("body")
                .transition()
                .select(".prejobYaxis") // change the y axis
                .duration(dataChangingTime2)
                .call(prejobChartAxisY)
                .attr("fill", 'none')
                .attr("stroke", textColor5)
                .selectAll("text")
                .attr("stroke", textColor5)
                .attr({
                    'fill': textColor5, //y軸文字顏色
                    'stroke': 'none',
                }).style({
                    'font-size': axisTextSize5
                })
                .attr('font-family', 'Noto Sans TC');


        }
    }


    prejobSvgDraw();

    window.addEventListener("resize", function () {
        prejobSvg.selectAll("g").remove();
        prejobSvg.selectAll("text").remove();
        prejobSvg.selectAll("rect").remove();

        prejobSvgDraw();
    });

});