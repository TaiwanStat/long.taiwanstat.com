d3.csv("./data/reason.csv", function (error, reasonData) {

    reasonData.forEach(function (d) {
        d.reasonRate = +d.reasonRate;
        d.ry = +d.ry;
    });

    var reasonSvg = d3.select("#reasonSvg");

    function reasonSvgDraw() {
        var currentYear = 0; //2016
        var barchartMargin = {
                top: 35,
                right: 20,
                bottom: 160,
                left: 70
            },
            barchartContainerWidth = document.getElementById("reasonSvg-container").clientWidth,
            barchartWidth = barchartContainerWidth - barchartMargin.left - barchartMargin.right,
            barchartHeight = 450 - barchartMargin.top - barchartMargin.bottom;

        // if (barchartHeight > window.innerHeight * 0.9 - 76)
        //     barchartHeight = window.innerHeight * 0.9 - barchartMargin.top - barchartMargin.bottom - 76;

        var axisTextSize3 = 20;
        // console.log(barchartContainerWidth);
        // console.log(barchartWidth / 15);
        axisTextSize3 = (barchartWidth / 15) > 20 ? 20 : (barchartWidth / 15);

        barchartMargin.bottom = axisTextSize3 * 10;

        var textColor3 = '#6E6E6E';
        var reasonScaleX = d3.scale.ordinal()
            .rangeRoundBands([0, barchartWidth], .25);

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
            .attr("width", barchartWidth + barchartMargin.left + barchartMargin.right)
            .attr("height", barchartHeight + barchartMargin.top + barchartMargin.bottom)
            .append("g");



        var entireReasonData = [];
        var yearlyReasonData = [];
        var entireYear = [2017, 2016, 2015, 2014, 2013, 2012, 2011];

        for (var i = 0; i < entireYear.length; ++i) {
            yearlyReasonData[i] = [];
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
            return d['reasons'];
        }));
        reasonScaleY.domain([0, d3.max(yearlyReasonData[currentYear], function (d) {
            return d.reasonRate;
        })]);

        // 繪出x軸
        reasonSvg.append("g")
            .attr("transform", "translate(" + barchartMargin.left + "," + (barchartHeight + barchartMargin.top) + ")")
            .call(barchartAxisX)
            .attr("fill", 'none')
            .attr("stroke", textColor3)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.1em")
            .attr("dy", "0.7em")
            .attr("transform", "rotate(-45)")
            .attr("stroke", textColor3)
            .attr({
                'fill': textColor3, //x軸文字顏色
                'stroke': 'none',
            })
            .style({
                'font-size': axisTextSize3 - 2
            })
            .attr('font-family', 'Noto Sans TC');

        // 繪出y軸
        reasonSvg.append("g")
            .attr("transform", "translate(" + barchartMargin.left + "," + barchartMargin.top + ")")
            .attr("class", "reasonYaxis")
            .call(barchartAxisY)
            .attr("fill", 'none')
            .attr("stroke", textColor3)
            .selectAll("text")
            .attr("stroke", textColor3)
            .attr({
                'fill': textColor3, //y軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize3
            })
            .attr('font-family', 'Noto Sans TC');

        //繪出Y軸單位
        reasonSvg.append("text")
            .attr("transform", "translate(" + barchartMargin.left + "," + barchartMargin.top + ")")
            .attr("x", 20)
            .attr("y", -33)
            .attr("dy", "1em")
            .attr({
                'fill': textColor3, // y軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize3
            })
            .attr('font-family', 'Noto Sans TC')
            .style("text-anchor", "end")
            .text("人數(%)");

        var reasonTip = d3.tip()
            .attr('class', 'reason-d3-tip')
            .offset([-10, 0])
            .html(function (d) {
                if (d.reasons == "待遇太低" || d.reasons == "沒有工作機會") return d.reasons + " : <span style='color:#FF7777'>" + d.reasonRate + "</span> %";
                else if (d.reasons == "學非所用") return d.reasons + " : <span style='color:#76A665'>" + d.reasonRate + "</span> %";
                else return d.reasons + " : <span style='color:#fff'>" + d.reasonRate + "</span> %";

            })

        reasonSvg.call(reasonTip);

        // 繪出柱狀圖
        var barRect = reasonSvg.selectAll(".barRect")
            .data(yearlyReasonData[currentYear]);

        barRect.enter().append("rect")
            .attr("transform", "translate(" + barchartMargin.left + "," + barchartMargin.top + ")")
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

        var titleSize1;
        if (barchartContainerWidth / 30 < 20)
            titleSize1 = barchartContainerWidth / 30 - 1;
        else titleSize1 = 20;

        // 此svg的標題
        reasonSvg.append("text")
            .attr("transform", "translate(" + barchartMargin.left + "," + barchartMargin.top + ")")
            .attr("x", barchartContainerWidth / 2 - barchartMargin.left)
            .attr("y", barchartHeight + barchartMargin.bottom - titleSize1)
            .attr("text-anchor", "middle")
            .text("學歷為大學以上之失業者未就業之原因調查 (2011年-2017年)")
            .attr("fill", textColor3)
            .attr("font-size", titleSize1)
            .attr('font-family', 'Noto Sans TC');

        var dropdown = d3.select("#reason-select")
            .on("change", reasonDropdownChange);

        var dataChangingTime = 750;

        function reasonDropdownChange() {
            currentYear = parseInt(d3.select("#reason-select").property('value'));
            //重新定義一些資料

            reasonScaleX.domain(yearlyReasonData[currentYear].map(function (d) {
                return d['reasons'];
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
                .attr("stroke", textColor3)
                .selectAll("text")
                .attr("stroke", textColor3)
                .attr({
                    'fill': textColor3, //y軸文字顏色
                    'stroke': 'none',
                }).style({
                    'font-size': axisTextSize3
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