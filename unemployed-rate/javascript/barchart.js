d3.csv("./data/reason.csv", function (error, reasonData) {

    reasonData.forEach(function (d) {
        d.reasonRate = parseFloat(d.reasonRate);
        d.ry = parseInt(d.ry, 10);
    });

    var reasonSvg = d3.select("#reasonSvg");

    /**
     * reasonSvgDraw() have no return value
     * it is called when the screen is resized
     * it creates all elements of bar chart
     */
    function reasonSvgDraw() {
        var currentYear = 0;
        var margin = {
            top: 35,
            right: 20,
            bottom: 160,
            left: 70
        };

        var textColor = '#6E6E6E';
        var barchartContainerWidth = document.getElementById("reasonSvg-container").clientWidth;
        var barchartWidth = barchartContainerWidth - margin.left - margin.right;
        var barchartHeight = 450 - margin.top - margin.bottom;
        var axisTextSize = (barchartWidth / 15) > 20 ? 20 : (barchartWidth / 15);

        // 設定margin.bottom大概為10個字的size
        margin.bottom = axisTextSize * 10;

        // Scale
        var reasonScaleX = d3.scale.ordinal()
            .rangeRoundBands([0, barchartWidth], 0.25);

        var reasonScaleY = d3.scale.linear()
            .range([barchartHeight, 0]);

        var barchartAxisX = d3.svg.axis()
            .scale(reasonScaleX)
            .orient("bottom")
            .ticks(10);

        var barchartAxisY = d3.svg.axis()
            .scale(reasonScaleY)
            .orient("left")
            .ticks(5)
            .tickFormat(function (d) {
                return d + '%';
            });

        reasonSvg
            .attr("width", barchartWidth + margin.left + margin.right)
            .attr("height", barchartHeight + margin.top + margin.bottom)
            .append("g");

        // entireReasonData存放全部的資料
        var entireReasonData = [];

        // yearlyReasonData存放當年的資料
        var yearlyReasonData = [];

        var entireYear = [2017, 2016, 2015, 2014, 2013, 2012, 2011];

        for (var k = 0; k < entireYear.length; ++k) {
            yearlyReasonData[k] = [];
        }

        for (var i = 0; i < reasonData.length; i++) {
            entireReasonData.push(reasonData[i]);
            for (var j = 0; j < entireYear.length; ++j) {
                if (entireReasonData[i].ry == entireYear[j]) {
                    yearlyReasonData[j].push(entireReasonData[i]);
                }

            }
        }

        reasonScaleX.domain(yearlyReasonData[currentYear].map(function (d) {
            return d.reasons;
        }));
        reasonScaleY.domain([0, d3.max(yearlyReasonData[currentYear], function (d) {
            return d.reasonRate;
        })]);

        // 繪出x軸
        reasonSvg.append("g")
            .attr("transform", "translate(" + margin.left + "," + (barchartHeight + margin.top) + ")")
            .call(barchartAxisX)
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
            })
            .style({
                'font-size': axisTextSize - 2
            })
            .attr('font-family', 'Noto Sans TC');

        // 繪出y軸
        reasonSvg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "reasonYaxis")
            .call(barchartAxisY)
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
        reasonSvg.append("text")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("x", 20)
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

        // 設定tip的資料
        var reasonTip = d3.tip()
            .attr('class', 'reason-d3-tip')
            .offset([-10, 0])
            .html(function (d) {
                if (d.reasons == "待遇太低" || d.reasons == "沒有工作機會") return d.reasons + " : <span style='color:#FF7777'>" + d.reasonRate + "</span> %";
                else if (d.reasons == "學非所用") return d.reasons + " : <span style='color:#76A665'>" + d.reasonRate + "</span> %";
                else return d.reasons + " : <span style='color:#fff'>" + d.reasonRate + "</span> %";

            });

        reasonSvg.call(reasonTip);

        // 繪出柱狀圖
        var barRect = reasonSvg.selectAll(".barRect")
            .data(yearlyReasonData[currentYear]);

        barRect.enter().append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "barRect")
            .style("fill", function (d, i) {
                if (d.reasons == "待遇太低" || d.reasons == "沒有工作機會") return "#FF7777";
                else if (d.reasons == "學非所用") return "#76A665";
                else return "steelblue";
            })
            .attr("x", function (d) {
                return reasonScaleX(d.reasons);
            })
            .attr("width", reasonScaleX.rangeBand())
            .attr("y", function (d) {
                return reasonScaleY(d.reasonRate);
            })
            .attr("height", function (d) {
                return barchartHeight - reasonScaleY(d.reasonRate);
            })
            .on('mouseover', reasonTip.show)
            .on('mouseout', reasonTip.hide);

        var titleSize;
        if (barchartContainerWidth / 30 < 20)
            titleSize = barchartContainerWidth / 30 - 1;
        else titleSize = 20;

        // 此svg的標題
        reasonSvg.append("text")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("x", barchartContainerWidth / 2 - margin.left)
            .attr("y", barchartHeight + margin.bottom - titleSize)
            .attr("text-anchor", "middle")
            .text("學歷為大學以上之失業者未就業之原因調查 (2011年-2017年)")
            .attr("fill", textColor)
            .attr("font-size", titleSize)
            .attr('font-family', 'Noto Sans TC');

        d3.select("#reason-select")
            .on("change", reasonDropdownChange);

        // data changing duration
        var dataChangingTime = 750;

        function reasonDropdownChange() {
            //重新定義一些資料

            currentYear = parseInt(d3.select("#reason-select").property('value'));

            reasonScaleX.domain(yearlyReasonData[currentYear].map(function (d) {
                return d.reasons;
            }));
            reasonScaleY.domain([0, d3.max(yearlyReasonData[currentYear], function (d) {
                return d.reasonRate;
            })]);

            barchartAxisX = d3.svg.axis()
                .scale(reasonScaleX)
                .orient("bottom")
                .ticks(10);

            barchartAxisY = d3.svg.axis()
                .scale(reasonScaleY)
                .orient("left")
                .ticks(5)
                .tickFormat(function (d) {
                    return d + '%';
                });

            // 給新的資料
            barRect = reasonSvg.selectAll(".barRect")
                .data(yearlyReasonData[currentYear]);

            // 繪出新的bar
            barRect.transition()
                .duration(dataChangingTime)
                .attr("y", function (d) {
                    return reasonScaleY(d.reasonRate);
                })
                .attr("height", function (d) {
                    return barchartHeight - reasonScaleY(d.reasonRate);
                });

            // 繪出y軸
            d3.select("body")
                .transition()
                .select(".reasonYaxis") // change the y axis
                .duration(dataChangingTime)
                .call(barchartAxisY)
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

    reasonSvgDraw();

    window.addEventListener("resize", function () {
        reasonSvg.selectAll("g").remove();
        reasonSvg.selectAll("text").remove();
        reasonSvg.selectAll("rect").remove();

        reasonSvgDraw();
    });

});