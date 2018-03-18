d3.csv("./data/salary.csv", function (error, salaryData) {

    var salarySvg = d3.select("#salarySvg");

    function salarySvgDraw() {
        var textColor = '#6E6E6E';
        var currentYear = 0;
        var margin = {
            top: 35,
            right: 20,
            bottom: 160,
            left: 90
        };
        var salaryContainerWidth = document.getElementById("salarySvg-container").clientWidth;
        var salaryChartWidth = salaryContainerWidth - margin.left - margin.right;
        var salaryChartHeight = 450 - margin.top - margin.bottom;
        var axisTextSize = 20;

        // Set text size
        if (salaryContainerWidth > 600) axisTextSize = 20;
        else axisTextSize = 16;

        // 設定margin.bottom大概為8個字的size
        margin.bottom = axisTextSize * 8;

        // Scale
        var salaryScaleX = d3.scale.ordinal()
            .rangeRoundBands([0, salaryChartWidth], 0.45);

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

        // 設定svg大小
        salarySvg.attr("width", salaryChartWidth + margin.left + margin.right)
            .attr("height", salaryChartHeight + margin.top + margin.bottom)
            .append("g");

        salaryData.forEach(function (d) {
            d.sy = parseInt(d.sy, 10);
            d.pay = parseInt(d.pay, 10);
        });

        // entireSalaryData存放全部的資料
        var entireSalaryData = [];

        // yearlySalaryData存放當年的資料
        var yearlySalaryData = [];
        var allYear = [2016, 2015, 2014, 2013, 2012, 2011];

        for (var k = 0; k < allYear.length; ++k) {
            yearlySalaryData[k] = [];
        }

        for (var i = 0; i < salaryData.length; i++) {
            entireSalaryData.push(salaryData[i]);
            for (var j = 0; j < allYear.length; ++j)
                if (entireSalaryData[i].sy == allYear[j])
                    yearlySalaryData[j].push(entireSalaryData[i]);
        }

        salaryScaleX.domain(yearlySalaryData[currentYear].map(function (d) {
            return d.degree;
        }));
        salaryScaleY.domain([0, d3.max(yearlySalaryData[currentYear], function (d) {
            return d.pay;
        })]);

        // 繪出x軸
        salarySvg.append("g")
            .attr("transform", "translate(" + margin.left + "," + (salaryChartHeight + margin.top) + ")")
            .call(salaryChartAxisX)
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
        salarySvg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "salaryYaxis")
            .call(salaryChartAxisY)
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
        salarySvg.append("text")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("x", -5)
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
            .text("(元)");

        var salaryTip = d3.tip()
            .attr('class', 'salary-d3-tip')
            .offset([-10, 0])
            .html(function (d) {
                if (d.degree == "大學") return d.degree + " : <span style='color:#FF7777'>" + d.pay + "</span> 元";
                else return d.degree + " : <span style='color:#fff'>" + d.pay + "</span> 元";
            });

        salarySvg.call(salaryTip);

        // 繪出柱狀圖
        var salaryBarRect = salarySvg.selectAll(".salaryBarRect")
            .data(yearlySalaryData[currentYear]);

        salaryBarRect.enter().append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
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

        var titleSize;
        if (salaryContainerWidth / 35 > 20) titleSize = 20;
        else titleSize = salaryContainerWidth / 35;

        // 此svg的標題
        salarySvg.append("text")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("x", salaryContainerWidth / 2 - margin.left)
            .attr("y", salaryChartHeight + margin.bottom - titleSize)
            .attr("text-anchor", "middle")
            .text("初任人員每人每月經常性薪資－按教育程度分 (2011年-2016年)")
            .attr("fill", textColor)
            .attr("font-size", titleSize)
            .attr('font-family', 'Noto Sans TC');

        d3.select("#salary-select")
            .on("change", salaryDropdownChange);

        var dataChangingTime = 750;

        function salaryDropdownChange() {
            //重新定義一些資料
            
            currentYear = parseInt(d3.select("#salary-select").property('value'));

            salaryScaleX.domain(yearlySalaryData[currentYear].map(function (d) {
                return d.degree;
            }));
            salaryScaleY.domain([0, d3.max(yearlySalaryData[currentYear], function (d) {
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
                .data(yearlySalaryData[currentYear]);

            // 繪出新的bar
            salaryBarRect.transition()
                .duration(dataChangingTime)
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
                .duration(dataChangingTime)
                .call(salaryChartAxisY)
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

    salarySvgDraw();

    window.addEventListener("resize", function () {
        salarySvg.selectAll("g").remove();
        salarySvg.selectAll("text").remove();
        salarySvg.selectAll("rect").remove();

        salarySvgDraw();
    });

});