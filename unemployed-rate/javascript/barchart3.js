d3.csv("./data/prejob.csv", function (error, prejobData) {

    var prejobSvg = d3.select("#prejobSvg");

    function prejobSvgDraw() {
        var textColor = '#6E6E6E';
        var currentYear = 0;
        var margin = {
            top: 35,
            right: 20,
            bottom: 250,
            left: 70
        };

        var prejobContainerWidth = document.getElementById("prejobSvg-container").clientWidth;
        var prejobChartWidth = prejobContainerWidth - margin.left - margin.right;
        var prejobChartHeight = 600 - margin.top - margin.bottom;
        var axisTextSize = 20;

        // Set text size
        if (prejobContainerWidth >= 1200) {
            axisTextSize = 20;
        } else if (prejobContainerWidth >= 960 && prejobContainerWidth < 1200) {
            axisTextSize = 18;
        } else if (prejobContainerWidth >= 440 && prejobContainerWidth < 960) {
            axisTextSize = 14;
        } else if (prejobContainerWidth >= 390 && prejobContainerWidth < 440) {
            axisTextSize = 10;
        } else if (prejobContainerWidth < 390 && prejobContainerWidth >= 330) {
            axisTextSize = 7;
        } else if (prejobContainerWidth < 330 && prejobContainerWidth >= 300) {
            axisTextSize = 6;
        } else {
            axisTextSize = 4;
        }

        // 設定margin.bottom大概為18個字的size
        margin.bottom = axisTextSize * 18;

        // Scale
        var prejobScaleX = d3.scale.ordinal()
            .rangeRoundBands([0, prejobChartWidth], 0.25);

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

        // 設定svg大小
        prejobSvg
            .attr("width", prejobChartWidth + margin.left + margin.right)
            .attr("height", prejobChartHeight + margin.top + margin.bottom)
            .append("g");

        prejobData.forEach(function (d) {
            d.py = parseInt(d.py,10);
            d.p_rate = parseFloat(d.p_rate);
        });

        // entirePrejobData存放全部的資料
        var entirePrejobData = [];

        // yearlyPrejobData存放當年的資料
        var yearlyPrejobData = [];
        var wholeYear = [2017, 2016, 2015, 2014, 2013, 2012, 2011];

        for (var k = 0; k < wholeYear.length; ++k) {
            yearlyPrejobData[k] = [];
        }

        for (var i = 0; i < prejobData.length; i++) {
            entirePrejobData.push(prejobData[i]);
            for (var j = 0; j < wholeYear.length; ++j)
                if (entirePrejobData[i].py == wholeYear[j])
                    yearlyPrejobData[j].push(entirePrejobData[i]);
        }

        // sort the data
        var sortedData = yearlyPrejobData.slice(0);

        sortedData[currentYear].sort(function (x, y) {
            return d3.descending(x.p_rate, y.p_rate);
        });

        prejobScaleX.domain(yearlyPrejobData[currentYear].map(function (d) {
            return d.prejob;
        }));
        prejobScaleY.domain([0, d3.max(yearlyPrejobData[currentYear], function (d) {
            return d.p_rate;
        })]);

        // 繪出x軸
        prejobSvg.append("g")
            .attr("transform", "translate(" + margin.left + "," + (prejobChartHeight + margin.top) + ")")
            .attr("class", "prejobXaxis")
            .call(prejobChartAxisX)
            .attr("fill", 'none')
            .attr("stroke", textColor)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.1em")
            .attr("dy", "0.7em")
            .attr("transform", "rotate(-45)")
            .attr("stroke", textColor)
            .attr({
                'fill': textColor, //x軸文字顏色
                'stroke': 'none'
            }).style({
                'font-size': axisTextSize
            })
            .attr('font-family', 'Noto Sans TC');

        // 繪出y軸
        prejobSvg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "prejobYaxis")
            .call(prejobChartAxisY)
            .attr("fill", 'none')
            .attr("stroke", textColor)
            .selectAll("text")
            .attr("stroke", textColor)
            .attr({
                'fill': textColor, //y軸文字顏色
                'stroke': 'none'
            }).style({
                'font-size': axisTextSize
            })
            .attr('font-family', 'Noto Sans TC');


        //繪出Y軸單位
        prejobSvg.append("text")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("x", 15)
            .attr("y", -33)
            .attr("dy", "1em")
            .attr({
                'fill': textColor, // y軸文字顏色
                'stroke': 'none'
            }).style({
                'font-size': axisTextSize
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
            });

        prejobSvg.call(prejobTip);

        // 繪出柱狀圖
        var prejobBarRect = prejobSvg.selectAll(".prejobBarRect")
            .data(yearlyPrejobData[currentYear]);

        prejobBarRect.enter().append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
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

        var titleSize = 20;
        if (prejobContainerWidth / 35 > 20)
            titleSize = 20;
        else titleSize = prejobContainerWidth / 35 - 1;

        // 此svg的標題
        prejobSvg.append("text")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("x", prejobContainerWidth / 2 - margin.left)
            .attr("y", prejobChartHeight + margin.bottom - titleSize)
            .attr("text-anchor", "middle")
            .text("學歷為大學以上之原有工作之失業者失業前行業(2011年-2017年)")
            .attr("fill", textColor)
            .attr("font-size", titleSize)
            .attr('font-family', 'Noto Sans TC');

        d3.select("#prejob-select")
            .on("change", prejobDropdownChange);

        var dataChangingTime = 750;

        function prejobDropdownChange() {
            //重新定義一些資料

            currentYear = parseInt(d3.select("#prejob-select").property('value'));

            sortedData[currentYear].sort(function (x, y) {
                return d3.descending(x.p_rate, y.p_rate);
            });

            prejobScaleX.domain(yearlyPrejobData[currentYear].map(function (d) {
                return d.prejob;
            }));
            prejobScaleY.domain([0, d3.max(yearlyPrejobData[currentYear], function (d) {
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
                .data(yearlyPrejobData[currentYear]);

            // 繪出新的bar
            prejobBarRect.transition()
                .duration(dataChangingTime)
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
                .duration(dataChangingTime)
                .call(prejobChartAxisX)
                .attr("fill", 'none')
                .attr("stroke", textColor)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-0.1em")
                .attr("dy", "0.7em")
                .attr("transform", "rotate(-45)")
                .attr("stroke", textColor)
                .attr({
                    'fill': textColor, //y軸文字顏色
                    'stroke': 'none'
                }).style({
                    'font-size': axisTextSize
                })
                .attr('font-family', 'Noto Sans TC');

            // 繪出y軸
            d3.select("body")
                .transition()
                .select(".prejobYaxis") // change the y axis
                .duration(dataChangingTime)
                .call(prejobChartAxisY)
                .attr("fill", 'none')
                .attr("stroke", textColor)
                .selectAll("text")
                .attr("stroke", textColor)
                .attr({
                    'fill': textColor, //y軸文字顏色
                    'stroke': 'none'
                }).style({
                    'font-size': axisTextSize
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