d3.csv("./data/salary.csv", function (error, salaryData) {

    var salarySvg = d3.select("#salarySvg");

    function salarySvgDraw() {
        var whichYear = 0; //2016
        var salaryChartMargin = {
                top: 35,
                right: 20,
                bottom: 160,
                left: 90
            },
            salaryContainerWidth = document.getElementById("salarySvg-container").clientWidth,
            salaryChartWidth = salaryContainerWidth - salaryChartMargin.left - salaryChartMargin.right,
            salaryChartHeight = 450 - salaryChartMargin.top - salaryChartMargin.bottom;

        // if (salaryChartHeight > window.innerHeight * 0.9 - 76)
        //     salaryChartHeight = window.innerHeight * 0.9 - salaryChartMargin.top - salaryChartMargin.bottom - 76;

        var axisTextSize6 = 20;
        if (salaryContainerWidth > 600) axisTextSize6 = 20;
        else axisTextSize6 = 16;

        salaryChartMargin.bottom = axisTextSize6 * 8;
        
        var textColor6 = '#6E6E6E';
        var salaryScaleX = d3.scale.ordinal()
            .rangeRoundBands([0, salaryChartWidth], .45);

        var salaryScaleY = d3.scale.linear()
            .range([salaryChartHeight, 0]);

        var salaryChartAxisX = d3.svg.axis()
            .scale(salaryScaleX)
            .orient("bottom")
            .ticks(10);

        var salaryChartAxisY = d3.svg.axis()
            .scale(salaryScaleY)
            .orient("left")
            .ticks(5);


        salarySvg.attr("width", salaryChartWidth + salaryChartMargin.left + salaryChartMargin.right)
            .attr("height", salaryChartHeight + salaryChartMargin.top + salaryChartMargin.bottom)
            .append("g");

        salaryData.forEach(function (d) {
            d.sy = +d.sy;
            d.pay = +d.pay;
        });

        var entireSalaryData = [];
        var yearlySalaryData = [];
        var allYear = [2016, 2015, 2014, 2013, 2012, 2011];

        for (var i = 0; i < allYear.length; ++i) {
            yearlySalaryData[i] = [];
        }

        for (var i = 0; i < salaryData.length; i++) {
            entireSalaryData.push(salaryData[i]);
            for (var j = 0; j < allYear.length; ++j) {
                if (entireSalaryData[i].sy == allYear[j]) {
                    yearlySalaryData[j].push(entireSalaryData[i]);
                }

            }
        }

        salaryScaleX.domain(yearlySalaryData[whichYear].map(function (d) {
            return d['degree'];
        }));
        salaryScaleY.domain([0, d3.max(yearlySalaryData[whichYear], function (d) {
            return d.pay;
        })]);

        // 繪出x軸
        salarySvg.append("g")
            .attr("transform", "translate(" + salaryChartMargin.left + "," + (salaryChartHeight + salaryChartMargin.top) + ")")
            .call(salaryChartAxisX)
            .attr("fill", 'none')
            .attr("stroke", textColor6)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.1em")
            .attr("dy", "0.7em")
            .attr("transform", "rotate(-45)")
            .attr("stroke", textColor6)
            .attr({
                'fill': textColor6, //x軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize6
            })
            .attr('font-family', 'Noto Sans TC');

        // 繪出y軸
        salarySvg.append("g")
            .attr("transform", "translate(" + salaryChartMargin.left + "," + salaryChartMargin.top + ")")
            .attr("class", "salaryYaxis")
            .call(salaryChartAxisY)
            .attr("fill", 'none')
            .attr("stroke", textColor6)
            .selectAll("text")
            .attr("stroke", textColor6)
            .attr({
                'fill': textColor6, //y軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize6
            })
            .attr('font-family', 'Noto Sans TC');


        //繪出Y軸單位
        salarySvg.append("text")
            .attr("transform", "translate(" + salaryChartMargin.left + "," + salaryChartMargin.top + ")")
            .attr("x", -5)
            .attr("y", -33)
            .attr("dy", "1em")
            .attr({
                'fill': textColor6, // y軸文字顏色
                'stroke': 'none',
            }).style({
                'font-size': axisTextSize6
            })
            .attr('font-family', 'Noto Sans TC')
            .style("text-anchor", "end")
            .text("(元)");

        var salaryTip = d3.tip()
            .attr('class', 'salary-d3-tip')
            .offset([-10, 0])
            .html(function (d) {
                if (d.degree == "大學") return d.degree + " : <span style='color:#FF7777'>" + d.pay + "</span> 元";
                else return d.degree + " : <span style='color:#fff'>" + d.pay + "</span> 元";
            })

        salarySvg.call(salaryTip);

        // 繪出柱狀圖
        var salaryBarRect = salarySvg.selectAll(".salaryBarRect")
            .data(yearlySalaryData[whichYear]);

        salaryBarRect.enter().append("rect")
            .attr("transform", "translate(" + salaryChartMargin.left + "," + salaryChartMargin.top + ")")
            .attr("class", "salaryBarRect")
            .style("fill", function (d) {
                if (d.degree == "大學") return "#FF7777";
                else return "steelblue";
            })
            .attr("x", function (d) {
                return salaryScaleX(d.degree);
            })
            .attr("width", salaryScaleX.rangeBand())
            .attr("y", function (d) {
                return salaryScaleY(d.pay);
            })
            .attr("height", function (d) {
                return salaryChartHeight - salaryScaleY(d.pay);
            })
            .on('mouseover', salaryTip.show)
            .on('mouseout', salaryTip.hide);


        var titleSize4;
        if (salaryContainerWidth / 35 > 20) titleSize4 =  20;
        else titleSize4 = salaryContainerWidth / 35;
        // 此svg的標題
        salarySvg.append("text")
            .attr("transform", "translate(" + salaryChartMargin.left + "," + salaryChartMargin.top + ")")
            .attr("x", salaryContainerWidth / 2 - salaryChartMargin.left)
            .attr("y", salaryChartHeight + salaryChartMargin.bottom - titleSize4)
            .attr("text-anchor", "middle")
            .text("初任人員每人每月經常性薪資－按教育程度分 (2011年-2016年)")
            .attr("fill", textColor6)
            .attr("font-size", titleSize4)
            .attr('font-family', 'Noto Sans TC');

        var salaryDropdown = d3.select("#salary-select")
            .on("change", salaryDropdownChange);

        var dataChangingTime2 = 750;

        function salaryDropdownChange() {
            whichYear = parseInt(d3.select("#salary-select").property('value'));
            //重新定義一些資料

            salaryScaleX.domain(yearlySalaryData[whichYear].map(function (d) {
                return d['degree'];
            }));
            salaryScaleY.domain([0, d3.max(yearlySalaryData[whichYear], function (d) {
                return d.pay;
            })]);

            salaryChartAxisX = d3.svg.axis()
                .scale(salaryScaleX)
                .orient("bottom")
                .ticks(10);

            salaryChartAxisY = d3.svg.axis()
                .scale(salaryScaleY)
                .orient("left")
                .ticks(5);

            // 給新的資料
            salaryBarRect = salarySvg.selectAll(".salaryBarRect")
                .data(yearlySalaryData[whichYear]);

            // 繪出新的bar
            salaryBarRect.transition()
                .duration(dataChangingTime2)
                .attr("y", function (d) {
                    return salaryScaleY(d.pay);
                })
                .attr("height", function (d) {
                    return salaryChartHeight - salaryScaleY(d.pay);
                });

            // 繪出y軸
            d3.select("body")
                .transition()
                .select(".salaryYaxis") // change the y axis
                .duration(dataChangingTime2)
                .call(salaryChartAxisY)
                .attr("fill", 'none')
                .attr("stroke", textColor6)
                .selectAll("text")
                .attr("stroke", textColor6)
                .attr({
                    'fill': textColor6, //y軸文字顏色
                    'stroke': 'none',
                }).style({
                    'font-size': axisTextSize6
                })
                .attr('font-family', 'Noto Sans TC');


        }
    }

    salarySvgDraw();

    window.addEventListener("resize", function () {
        salarySvg.selectAll("g").remove();
        salarySvg.selectAll("text").remove();
        salarySvg.selectAll("rect").remove();

        salarySvgDraw();
    });

});