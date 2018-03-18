var maxPeople = 0;
var minDate = new Date();
var maxDate = new Date();
var textColor = '#6E6E6E';

d3.csv("./data/college.csv")
    .row(function (d) {
        return {
            year: new Date(d.year),
            people:  parseInt(d.people,10)
        };
    })
    .get(function (error, peopleData) {
        maxPeople = d3.max(peopleData, function (d) {
            return d.people;
        });
        minDate = d3.min(peopleData, function (d) {
            return d.year;
        });
        maxDate = d3.max(peopleData, function (d) {
            return d.year;
        });

        var peoplechartSvg = d3.select("#collegeSvg");

        function drawPeopleChart() {

            var margin = {
                left: 100,
                right: 20,
                top: 20,
                bottom: 80
            };

            var containerWidth = document.getElementById('collegeSvg-container').clientWidth;
            var linechartWidth = containerWidth - margin.left - margin.right;
            var linechartHeight = 400 - margin.top - margin.bottom;

            // x,y軸上的文字大小
            var axisTextSize = 20;

            // set text size depend on containerWidth
            if (containerWidth > 350) axisTextSize = 20;
            else if (containerWidth < 350 && containerWidth > 300) axisTextSize = 18;
            else axisTextSize = 16;

            // Scale
            var yScale = d3.scale.linear()
                .domain([0, maxPeople])
                .range([linechartHeight, 0]);

            var xScale = d3.time.scale()
                .domain([minDate, maxDate])
                .range([0, linechartWidth]);

            var yAxis = d3.svg.axis()
                .orient("left")
                .scale(yScale)
                .ticks(10);

            var xAxis = d3.svg.axis()
                .orient("bottom")
                .scale(xScale)
                .ticks(5);

            // 設定折線的位置
            var peopleLine = d3.svg.line()
                .x(function (d) {
                    return xScale(d.year);
                })
                .y(function (d) {
                    return yScale(d.people);
                });

            // 設定svg大小
            peoplechartSvg
                .attr({
                    'width': linechartWidth + margin.left + margin.right,
                    'height': linechartHeight + margin.top + margin.bottom
                });

            // 繪出折線
            peoplechartSvg.append("path")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", "3px")
                .attr("d", function (d) {
                    return peopleLine(peopleData);
                });

            // 繪出x軸
            peoplechartSvg.append("g")
                .call(xAxis)
                .attr("transform", "translate(" + margin.left + "," + (linechartHeight + margin.top) + ")")
                .attr("fill", 'none')
                .attr("stroke", textColor)
                .selectAll('text')
                .attr({
                    'fill': textColor,
                    'stroke': 'none'
                }).style({
                    'font-size': axisTextSize
                })
                .attr('font-family', 'Noto Sans TC');

            // 繪出y軸                
            peoplechartSvg.append("g")
                .call(yAxis)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("fill", 'none')
                .attr("stroke", textColor)
                .selectAll('text')
                .attr({
                    'fill': textColor,
                    'stroke': 'none'
                }).style({
                    'font-size': axisTextSize
                })
                .attr('font-family', 'Noto Sans TC');

            //繪出X軸單位
            peoplechartSvg.append("text")
                // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("x", 0 + margin.left + linechartWidth + margin.right)
                .attr("y", 0 + margin.top + linechartHeight)
                .attr("dy", "1em")
                .attr({
                    'fill': textColor, // x軸文字顏色
                    'stroke': 'none'
                }).style({
                    'font-size': axisTextSize
                })
                .attr('font-family', 'Noto Sans TC')
                .style("text-anchor", "start")
                .text("(年)");

            //繪出Y軸單位
            peoplechartSvg.append("text")
                .attr("x", 0 + margin.left - 10)
                .attr("y", 0)
                .attr("dy", "1em")
                .attr({
                    'fill': textColor,
                    'stroke': 'none'
                }).style({
                    'font-size': axisTextSize
                })
                .attr('font-family', 'Noto Sans TC')
                .style("text-anchor", "end")
                .text("(人)");

            // 此svg的標題
            peoplechartSvg.append("text")
                .attr("x", containerWidth / 2)
                .attr("y", linechartHeight + margin.bottom)
                .attr("text-anchor", "middle")
                .text("歷年大學畢業生人數 (1994年-2016年)")
                .attr("fill", textColor)
                .attr("font-size", axisTextSize)
                .attr('font-family', 'Noto Sans TC');
        }

        drawPeopleChart();

        window.addEventListener("resize", function () {
            peoplechartSvg.selectAll("g").remove();
            peoplechartSvg.selectAll("path").remove();
            peoplechartSvg.selectAll("text").remove();
            peoplechartSvg.selectAll("line").remove();

            drawPeopleChart();
        });

    });