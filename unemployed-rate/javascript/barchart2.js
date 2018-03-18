d3.csv("./data/yearGroup.csv", function (error, yearGroupData) {

    var yearGroupSvg = d3.select("#yearGroupSvg");

    function yearGroupSvgDraw() {
        var thisYear = 0; //2016
        var yearGroupChartMargin = {
                top: 35,
                right: 20,
                bottom: 160,
                left: 70
            },
            yearGroupContainerWidth = document.getElementById("yearGroupSvg-container").clientWidth,
            yearGroupChartWidth = yearGroupContainerWidth - yearGroupChartMargin.left - yearGroupChartMargin.right,
            yearGroupChartHeight = 450 - yearGroupChartMargin.top - yearGroupChartMargin.bottom;

        // if (yearGroupChartHeight > window.innerHeight * 0.9 -76)
        //     yearGroupChartHeight = window.innerHeight * 0.9 - yearGroupChartMargin.top - yearGroupChartMargin.bottom-76;

        var axisTextSize4 = 20;
        // console.log(yearGroupContainerWidth);
        // console.log(yearGroupChartWidth/24);
        axisTextSize4 = (yearGroupChartWidth / 22) > 20 ? 20 : (yearGroupChartWidth / 22);
        if ((yearGroupChartWidth / 22) > 13 && (yearGroupChartWidth / 22) <= 17) {
            axisTextSize4 = 13;
        }
        // console.log(axisTextSize4);

        if (yearGroupContainerWidth < 450) yearGroupChartMargin.bottom = 100;

        yearGroupChartMargin.bottom = axisTextSize4 * 9;

        var textColor4 = '#6E6E6E';
        var yearGroupScaleX = d3.scale.ordinal()
            .rangeRoundBands([0, yearGroupChartWidth], .25);

        var yearGroupScaleY = d3.scale.linear()
            .range([yearGroupChartHeight, 0]);

        var yearGroupChartAxisX = d3.svg.axis()
            .scale(yearGroupScaleX)
            .orient("bottom")
            .ticks(10);

        var yearGroupChartAxisY = d3.svg.axis()
            .scale(yearGroupScaleY)
            .orient("left")
            .ticks(8);

        yearGroupSvg
            .attr("width", yearGroupChartWidth + yearGroupChartMargin.left + yearGroupChartMargin.right)
            .attr("height", yearGroupChartHeight + yearGroupChartMargin.top + yearGroupChartMargin.bottom)
            .append("g");

        yearGroupData.forEach(function (d) {
            d.years = +d.years;
            d.u_rate = +d.u_rate;
        });

        var entireyearGroupData = [];
        var yearlyYearGroupData = [];
        var allYears = [2016, 2015, 2014, 2013, 2012, 2011];

        for (var i = 0; i < allYears.length; ++i) {
            yearlyYearGroupData[i] = [];
        }

        for (var i = 0; i < yearGroupData.length; i++) {
            entireyearGroupData.push(yearGroupData[i]);
            for (var j = 0; j < allYears.length; ++j) {
                if (entireyearGroupData[i].years == allYears[j]) {
                    yearlyYearGroupData[j].push(entireyearGroupData[i]);
                }

            }
        }

        yearGroupScaleX.domain(yearlyYearGroupData[thisYear].map(function (d) {
            return d['year_group'];
        }));
        yearGroupScaleY.domain([0, d3.max(yearlyYearGroupData[thisYear], function (d) {
            return d.u_rate;
        })]);

        // 繪出x軸
        yearGroupSvg.append("g")
            .attr("transform", "translate(" + yearGroupChartMargin.left + "," + (yearGroupChartHeight + yearGroupChartMargin.top) + ")")
            .call(yearGroupChartAxisX)
            .attr("fill", 'none')
            .attr("stroke", textColor4)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.1em")
            .attr("dy", "0.7em")
            .attr("transform", "rotate(-45)")
            .attr("stroke", textColor4)
            .attr({
                'fill': textColor4, //x軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize4
            })
            .attr('font-family', 'Noto Sans TC');

        // 繪出y軸
        yearGroupSvg.append("g")
            .attr("transform", "translate(" + yearGroupChartMargin.left + "," + yearGroupChartMargin.top + ")")
            .attr("class", "yearGroupYaxis")
            .call(yearGroupChartAxisY)
            .attr("fill", 'none')
            .attr("stroke", textColor4)
            .selectAll("text")
            .attr("stroke", textColor4)
            .attr({
                'fill': textColor4, //y軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize4
            })
            .attr('font-family', 'Noto Sans TC');


        //繪出Y軸單位
        yearGroupSvg.append("text")
            .attr("transform", "translate(" + yearGroupChartMargin.left + "," + yearGroupChartMargin.top + ")")
            .attr("x", 30)
            .attr("y", -33)
            .attr("dy", "1em")
            .attr({
                'fill': textColor4, // y軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize4
            })
            .attr('font-family', 'Noto Sans TC')
            .style("text-anchor", "end")
            .text("失業率(%)");

        var yearGroupTip = d3.tip()
            .attr('class', 'yearGroup-d3-tip')
            .offset([-10, 0])
            .html(function (d) {
                if (d.year_group == "20-24歲") return d.year_group + " : <span style='color:#FF7777'>" + d.u_rate + "</span> %";
                else return d.year_group + " : <span style='color:#fff'>" + d.u_rate + "</span> %";
            })

        yearGroupSvg.call(yearGroupTip);

        // 繪出柱狀圖
        var yearGroupBarRect = yearGroupSvg.selectAll(".yearGroupBarRect")
            .data(yearlyYearGroupData[thisYear]);

        yearGroupBarRect.enter().append("rect")
            .attr("transform", "translate(" + yearGroupChartMargin.left + "," + yearGroupChartMargin.top + ")")
            .attr("class", "yearGroupBarRect")
            .style("fill", function (d) {
                if (d.year_group == "20-24歲") return "#FF7777";
                else return "steelblue";
            })
            .attr("x", function (d) {
                return yearGroupScaleX(d.year_group);
            })
            .attr("width", yearGroupScaleX.rangeBand())
            .attr("y", function (d) {
                return yearGroupScaleY(d.u_rate);
            })
            .attr("height", function (d) {
                return yearGroupChartHeight - yearGroupScaleY(d.u_rate);
            })
            .on('mouseover', yearGroupTip.show)
            .on('mouseout', yearGroupTip.hide);

        // 此svg的標題
        yearGroupSvg.append("text")
            .attr("transform", "translate(" + yearGroupChartMargin.left + "," + yearGroupChartMargin.top + ")")
            .attr("x", yearGroupContainerWidth / 2 - yearGroupChartMargin.left)
            .attr("y", yearGroupChartHeight + yearGroupChartMargin.bottom - axisTextSize4)
            .attr("text-anchor", "middle")
            .text("最高學歷為大學之失業率-按年齡分 (2011年-2016年)")
            .attr("fill", textColor4)
            .attr("font-size", axisTextSize4)
            .attr('font-family', 'Noto Sans TC');

        var yearGroupDropdown = d3.select("#yearGroup-select")
            .on("change", yearGroupDropdownChange);

        var dataChangingTime2 = 750;

        function yearGroupDropdownChange() {
            thisYear = parseInt(d3.select("#yearGroup-select").property('value'));
            //重新定義一些資料

            yearGroupScaleX.domain(yearlyYearGroupData[thisYear].map(function (d) {
                return d['year_group'];
            }));
            yearGroupScaleY.domain([0, d3.max(yearlyYearGroupData[thisYear], function (d) {
                return d.u_rate;
            })]);

            yearGroupChartAxisX = d3.svg.axis()
                .scale(yearGroupScaleX)
                .orient("bottom")
                .ticks(10);

            yearGroupChartAxisY = d3.svg.axis()
                .scale(yearGroupScaleY)
                .orient("left")
                .ticks(8);

            // 給新的資料
            yearGroupBarRect = yearGroupSvg.selectAll(".yearGroupBarRect")
                .data(yearlyYearGroupData[thisYear]);

            // 繪出新的bar
            yearGroupBarRect.transition()
                .duration(dataChangingTime2)
                .attr("y", function (d) {
                    return yearGroupScaleY(d.u_rate);
                })
                .attr("height", function (d) {
                    return yearGroupChartHeight - yearGroupScaleY(d.u_rate);
                });

            // 繪出y軸
            d3.select("body")
                .transition()
                .select(".yearGroupYaxis") // change the y axis
                .duration(dataChangingTime2)
                .call(yearGroupChartAxisY)
                .attr("fill", 'none')
                .attr("stroke", textColor4)
                .selectAll("text")
                .attr("stroke", textColor4)
                .attr({
                    'fill': textColor4, //y軸文字顏色
                    'stroke': 'none',
                }).style({
                    'font-size': axisTextSize4
                })
                .attr('font-family', 'Noto Sans TC');


        }
    }

    yearGroupSvgDraw();

    window.addEventListener("resize", function () {
        yearGroupSvg.selectAll("g").remove();
        yearGroupSvg.selectAll("text").remove();
        yearGroupSvg.selectAll("rect").remove();

        yearGroupSvgDraw();
    });

});