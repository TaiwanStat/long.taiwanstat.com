d3.csv("./data/yearGroup.csv", function (error, yearGroupData) {

    var yearGroupSvg = d3.select("#yearGroupSvg");

    function yearGroupSvgDraw() {
        var currentYear = 0;
        var textColor = '#6E6E6E';
        var margin = {
            top: 35,
            right: 20,
            bottom: 160,
            left: 70
        };
        var yearGroupContainerWidth = document.getElementById("yearGroupSvg-container").clientWidth;
        var yearGroupChartWidth = yearGroupContainerWidth - margin.left - margin.right;
        var yearGroupChartHeight = 450 - margin.top - margin.bottom;
        var axisTextSize = 20;

        // 設定字體大小
        axisTextSize = (yearGroupChartWidth / 22) > 20 ? 20 : (yearGroupChartWidth / 22);
        if ((yearGroupChartWidth / 22) > 13 && (yearGroupChartWidth / 22) <= 17)
            axisTextSize = 13;

        // 設定margin.bottom大概為9個字的size
        margin.bottom = axisTextSize * 9;

        // Scale
        var yearGroupScaleX = d3.scale.ordinal()
            .rangeRoundBands([0, yearGroupChartWidth], 0.25);

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

        // 設定svg大小
        yearGroupSvg
            .attr("width", yearGroupChartWidth + margin.left + margin.right)
            .attr("height", yearGroupChartHeight + margin.top + margin.bottom)
            .append("g");

        yearGroupData.forEach(function (d) {
            d.years = parseInt(d.years, 10);
            d.u_rate = parseFloat(d.u_rate);
        });

        // entireyearGroupData存放全部的資料
        var entireyearGroupData = [];

        // yearlyYearGroupData存放當年的資料
        var yearlyYearGroupData = [];
        var allYears = [2016, 2015, 2014, 2013, 2012, 2011];

        for (var k = 0; k < allYears.length; ++k) {
            yearlyYearGroupData[k] = [];
        }

        for (var i = 0; i < yearGroupData.length; i++) {
            entireyearGroupData.push(yearGroupData[i]);
            for (var j = 0; j < allYears.length; ++j)
                if (entireyearGroupData[i].years == allYears[j])
                    yearlyYearGroupData[j].push(entireyearGroupData[i]);
        }

        yearGroupScaleX.domain(yearlyYearGroupData[currentYear].map(function (d) {
            return d.year_group;
        }));
        yearGroupScaleY.domain([0, d3.max(yearlyYearGroupData[currentYear], function (d) {
            return d.u_rate;
        })]);

        // 繪出x軸
        yearGroupSvg.append("g")
            .attr("transform", "translate(" + margin.left + "," + (yearGroupChartHeight + margin.top) + ")")
            .call(yearGroupChartAxisX)
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
        yearGroupSvg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "yearGroupYaxis")
            .call(yearGroupChartAxisY)
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
        yearGroupSvg.append("text")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("x", 30)
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
            .text("失業率(%)");

        // 設定tip的資料
        var yearGroupTip = d3.tip()
            .attr('class', 'yearGroup-d3-tip')
            .offset([-10, 0])
            .html(function (d) {
                if (d.year_group == "20-24歲") 
                    return d.year_group + " : <span style='color:#FF7777'>" + d.u_rate + "</span> %";
                else 
                    return d.year_group + " : <span style='color:#fff'>" + d.u_rate + "</span> %";
            });

        yearGroupSvg.call(yearGroupTip);

        // 繪出柱狀圖
        var yearGroupBarRect = yearGroupSvg.selectAll(".yearGroupBarRect")
            .data(yearlyYearGroupData[currentYear]);

        yearGroupBarRect.enter().append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
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
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("x", yearGroupContainerWidth / 2 - margin.left)
            .attr("y", yearGroupChartHeight + margin.bottom - axisTextSize)
            .attr("text-anchor", "middle")
            .text("最高學歷為大學之失業率-按年齡分 (2011年-2016年)")
            .attr("fill", textColor)
            .attr("font-size", axisTextSize)
            .attr('font-family', 'Noto Sans TC');

        d3.select("#yearGroup-select")
            .on("change", yearGroupDropdownChange);

        var dataChangingTime = 750;

        function yearGroupDropdownChange() {
            currentYear = parseInt(d3.select("#yearGroup-select").property('value'));
            //重新定義一些資料

            yearGroupScaleX.domain(yearlyYearGroupData[currentYear].map(function (d) {
                return d.year_group;
            }));
            yearGroupScaleY.domain([0, d3.max(yearlyYearGroupData[currentYear], function (d) {
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
                .data(yearlyYearGroupData[currentYear]);

            // 繪出新的bar
            yearGroupBarRect.transition()
                .duration(dataChangingTime)
                .attr("y", function (d) {
                    return yearGroupScaleY(d.u_rate);
                })
                .attr("height", function (d) {
                    return yearGroupChartHeight - yearGroupScaleY(d.u_rate);
                });

            // 繪出y軸
            d3.select("body")
                .transition()
                .select(".yearGroupYaxis")
                .duration(dataChangingTime)
                .call(yearGroupChartAxisY)
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

    yearGroupSvgDraw();

    window.addEventListener("resize", function () {
        yearGroupSvg.selectAll("g").remove();
        yearGroupSvg.selectAll("text").remove();
        yearGroupSvg.selectAll("rect").remove();

        yearGroupSvgDraw();
    });

});