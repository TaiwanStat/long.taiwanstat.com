d3.csv("./data/unemployment_rate.csv", function (data) {
    data.forEach(function (d) {
        d.x = parseInt(d.x, 10);
        d.year = parseInt(d.year, 10);
        d.total = parseFloat(d.total);
        d.primary = parseFloat(d.primary);
        d.junior = parseFloat(d.junior);
        d.senior = parseFloat(d.senior);
        d.vocational = parseFloat(d.vocational);
        d.specialist = parseFloat(d.specialist);
        d.college = parseFloat(d.college);
        d.graduate = parseFloat(d.graduate);
    });

    var minYear = d3.extent(data, function (d) {
        return d.year;
    })[0];
    var maxYear = d3.extent(data, function (d) {
        return d.year;
    })[1];
    var minTotal = d3.extent(data, function (d) {
        return d.total;
    })[0];
    var maxTotal = d3.extent(data, function (d) {
        return d.total;
    })[1];
    var minX = d3.min(data, function (d) {
        return d.x;
    });
    var maxX = d3.max(data, function (d) {
        return d.x;
    });
    var minY = 1.5;
    var maxY = 6;
    var unemployedSvg = d3.select('#unemployedSvg');
    var infoSvg = d3.select("#infoSvg");

    // 進入頁面的次數
    var times = 0;

    /**
     * draw() have no return value
     * it is called when the screen is resized
     * it creates all elements of line chart
     */
    function draw() {

        // first time resize the screen
        times++;

        // detect the size of screen
        var sizeIsXL = 0;
        var sizeIsL = 0;
        var sizeIsM = 0;
        var sizeIsS = 0;
        var sizeIsXS = 0;
        var sizeIsXSS = 0;
        var fontSize1 = 20;
        var fontSize2 = 30;

        // set the size of yearly infomation div
        var infoWidth = 200;
        var infoHeight = 190;
        var margin = {
            top: 10,
            right: 80,
            bottom: 150,
            left: 50
        };

        // set the radius of dots
        var originR = 7;
        var bigR = 10;

        // get container width
        var containerWidth = document.getElementById('unemployedSvg-container').clientWidth;

        /**
         * setSize() have no return value
         * it define some size infomation based on current container width
         */
        function setSize() {
            if (containerWidth >= 1600) {
                sizeIsXL = 1;
                infoWidth = 250;
            } else if (containerWidth < 1600 && containerWidth >= 1250) {
                sizeIsL = 1;
                infoWidth = 250;
            } else if ((containerWidth < 1250) && (containerWidth >= 768)) {
                sizeIsM = 1;
                fontSize1 = 16;
                fontSize2 = 24;
            } else if ((containerWidth < 768) && (containerWidth >= 375)) {
                sizeIsS = 1;
                fontSize1 = 15;
                fontSize2 = 22;
                originR = 5;
                bigR = 8;
            } else if (containerWidth < 375 && containerWidth >= 330) {
                sizeIsXS = 1;
                infoWidth = 160;
                fontSize1 = 13;
                fontSize2 = 20;
                originR = 4;
                bigR = 6;
                margin.left = 40;
            } else if (containerWidth < 330) {
                sizeIsXSS = 1;
                infoWidth = 160;
                fontSize1 = 10;
                fontSize2 = 12;
            }
        }

        setSize();

        var linechartWidth = containerWidth - margin.left - margin.right;
        var linechartHeight = 0.88 * window.innerHeight - 64 - 250 - margin.top - margin.bottom;

        // ensure linechartHeight has min-heght : 300
        if (linechartHeight < 300) linechartHeight = 300;

        // Scale
        var scaleX = d3.scale.linear()
            .range([0, linechartWidth])
            .domain([minX, maxX]);

        var scaleX2 = d3.scale.linear()
            .rangeRound([0, linechartWidth])
            .domain([minYear, maxYear]);

        var scaleY = d3.scale.linear()
            .range([linechartHeight, 0])
            .domain([minY, maxY]);

        unemployedSvg.data(data)
            .attr({
                'width': linechartWidth + margin.left + margin.right,
                'height': linechartHeight + margin.top + margin.bottom
            })
            .style('background', "#f7f7f7")
            .on("mousemove", linechartMove)
            .on("touchmove", linechartMove);

        // 8種教育程度縮放後的資料
        var lines = [8];
        for (var i = 0; i < 8; ++i) {
            lines[i] = d3.svg.line()
                .x(function (d) {
                    return scaleX(d.x);
                })
                .y(function (d) {
                    if (i == 0) return scaleY(d.total);
                    else if (i == 1) return scaleY(d.primary);
                    else if (i == 2) return scaleY(d.junior);
                    else if (i == 3) return scaleY(d.senior);
                    else if (i == 4) return scaleY(d.vocational);
                    else if (i == 5) return scaleY(d.specialist);
                    else if (i == 6) return scaleY(d.college);
                    else if (i == 7) return scaleY(d.graduate);
                });
        }

        // 設定座標系
        var gridInterval = 5;
        var axisX = d3.svg.axis()
            .scale(scaleX2)
            .orient("bottom")
            .ticks(gridInterval)
            .tickFormat(function (d) {
                return d + '年';
            });

        var axisY = d3.svg.axis()
            .scale(scaleY)
            .orient("left")
            .ticks(gridInterval)
            .tickFormat(function (d) {
                return d + '%';
            });

        // 繪出8條折線
        var lineColor1 = '#FF0000'; // 平均 5
        var lineColor2 = '#BC5148'; // 國小 8
        var lineColor3 = '#CA82FF'; // 國中 4
        var lineColor4 = '#00B7C2'; // 高中 2
        var lineColor5 = 'green'; // 高職 3
        var lineColor6 = '#111F4D'; // 專科 6
        var lineColor7 = '#FFA600'; // 大學 1
        var lineColor8 = 'blue'; // 研究所 7
        var textColor = '#6E6E6E';
        var lineColors = [lineColor1, lineColor2, lineColor3, lineColor4, lineColor5, lineColor6, lineColor7, lineColor8, ];

        for (var i = 0; i < 8; ++i) {
            unemployedSvg.append('path')
                .attr("class", "historylines" + i)
                .attr({
                    'd': lines[i](data),
                    'stroke': function (d) {
                        return lineColors[i];
                    },
                    'stroke-width': 2,
                    'transform': 'translate(' + (margin.left) + ', ' + (margin.top) + ')', // 用translate挑整axisX,axisY的位置
                    'fill': 'none'
                })
                .attr("opacity", function () {
                    return (i == 6) ? 1 : 0.2;
                });
        }

        // 繪出X軸
        unemployedSvg.append('g')
            .call(axisX) // call axisX
            .attr({
                'class': 'axisX',
                'fill': 'none',
                'stroke': 'rgba(170,170,170,1)',
                'transform': 'translate(' + (margin.left) + ', ' + (linechartHeight + margin.top) + ')' // 用translate挑整axisX,axisY的位置
            })
            .selectAll('text')
            .attr({
                'fill': textColor, // x軸文字顏色
                'stroke': 'none'
            }).style({
                'font-size': fontSize1
            })
            .attr('font-family', 'Noto Sans TC')

        // 繪出Y軸
        unemployedSvg.append('g')
            .call(axisY) // call axisY
            .attr({
                'class': 'axisY',
                'fill': 'none',
                'stroke': 'rgba(170,170,170,1)',
                'transform': 'translate(' + (margin.left) + ',' + (margin.top) + ')' // 用translate挑整axisX,axisY的位置
            })
            .selectAll("text")
            .attr({
                'class': 'linechartYtext',
                'fill': textColor, // y軸文字顏色
                'stroke': 'none'
            }).style({
                'font-size': fontSize1
            })
            .attr('font-family', 'Noto Sans TC');

        // 繪出Y軸單位
        unemployedSvg.append("text")
            .attr("x", 0 + margin.left + 38)
            .attr("y", 0)
            .attr("dy", "1em")
            .attr({
                'class': 'linechartYtext',
                'fill': textColor,
                'stroke': 'none'
            })
            .attr('font-family', 'Noto Sans TC')
            .style("text-anchor", "middle")
            .text("失業率(%)")
            .attr('font-size', function () {
                if (sizeIsS || sizeIsXS) return fontSize1 - 2;
                else return fontSize1;
            });

        // 繪出跟著滑鼠跑的線
        var flexibleLineColor = '#6465A5';
        unemployedSvg.append('line')
            .attr('id', 'flexibleLine')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0)
            .style('stroke', flexibleLineColor)
            .style('stroke-width', 5)
            .style('opacity', 0);

        // 創造資料的圓點並繪出
        var dots = [8];
        var dotName = ['dots1', 'dots2', 'dots3', 'dots4', 'dots5', 'dots6', 'dots7', 'dots8']
        for (var j = 0; j < 8; ++j) {
            dots[j] = unemployedSvg.selectAll(dotName[j])
                .data(data)
                .enter()
                .append('g')
                .append('circle')
                .attr('class', function (d, i) {
                    return "dots" + i + " onLine" + j;
                })
                .attr('cx', function (d) {
                    return scaleX(d.x) + margin.left;
                })
                .attr('cy', function (d, i) {
                    if (j == 0) return scaleY(d.total) + margin.top;
                    else if (j == 1) return scaleY(d.primary) + margin.top;
                    else if (j == 2) return scaleY(d.junior) + margin.top;
                    else if (j == 3) return scaleY(d.senior) + margin.top;
                    else if (j == 4) return scaleY(d.vocational) + margin.top;
                    else if (j == 5) return scaleY(d.specialist) + margin.top;
                    else if (j == 6) return scaleY(d.college) + margin.top;
                    else if (j == 7) return scaleY(d.graduate) + margin.top;
                })
                .attr('fill', function (d) {
                    return lineColors[j];
                })
                .attr('r', originR)
                .attr("opacity", function () {
                    return (j == 6) ? 1 : 0.2;
                });
        }

        // 設定information的長寬
        infoSvg.attr('width', containerWidth)
            .attr("height", "250");

        // 繪出圓點資訊
        var shineDuration = 400;
        var dotTextOffsetX = 60;
        var dotTextOffsetY = 40;
        var infoTextOffsetX = 10;
        var tipText = [];
        var tips = infoSvg.append('g')
            .attr('class', 'tips');

        tips.append('rect')
            .attr('class', 'tips-border')
            .attr('width', infoWidth)
            .attr('height', infoHeight)
            .attr('rx', 10)
            .attr('ry', 10)
            .attr("stroke", flexibleLineColor)
            .attr("stroke-width", '2px')
            .attr('fill', '#CCCCFF')
            .attr('opacity', 0);

        // store class name in tipText[]
        for (var i = 0; i < 9; ++i) {
            tipText.push("tips-text" + i);
        }

        // 繪出information的文字
        for (var j = 0; j < 9; ++j) {
            tips.append('text')
                .attr('class', tipText[j])
                .attr('dx', infoTextOffsetX)
                .attr('dy', function () {
                    return 20 * (j + 1);
                })
                .text("")
                .attr('font-family', 'Noto Sans TC');
        }

        // 顯示資料塊
        d3.select('.tips-border')
            .transition()
            .attr('opacity', 0.4)
            .attr("x", function () {
                return (sizeIsL || sizeIsM) ? margin.left : 5;
            })
            .attr("y", function () {
                return margin.top;
            });

        // 顯示資料塊裡的文字
        for (var j = 0; j < 9; ++j) {
            d3.select('.' + tipText[j])
                .transition()
                .attr("opacity", 1)
                .attr("x", function () {
                    return (sizeIsL || sizeIsM) ? margin.left : 5;
                })
                .attr("y", function () {
                    return margin.top;
                })
                .text(function () {
                    if (j == 0) return data[5].year + " 年 各教育程度失業率";
                    else if (j == 1) return "平均 : " + data[5].total + "%";
                    else if (j == 2) return "小學及以下 : " + data[5].primary + "%";
                    else if (j == 3) return "國中 : " + data[5].junior + "%";
                    else if (j == 4) return "高中 : " + data[5].senior + "%";
                    else if (j == 5) return "高職 : " + data[5].vocational + "%";
                    else if (j == 6) return "專科 : " + data[5].specialist + "%";
                    else if (j == 7) return "大學 : " + data[5].college + "%";
                    else if (j == 8) return "研究所及以上 : " + data[5].graduate + "%";
                })
                .attr("font-size", function () {
                    if (sizeIsXSS) return fontSize1 + 1;
                    else if (sizeIsXS) return fontSize1 - 2;
                    else return fontSize1;
                });
        }

        // 跟著滑鼠跑的那條線的Function
        var dotIsShining = 0; // 判斷是否有某資料點正在閃爍
        var shineRange = 10;

        // 輔助文字
        var usageText = unemployedSvg.append("text")
            .attr("x", containerWidth / 2)
            .attr("y", function () {
                return (0.5 * (scaleY(data[2].senior) - scaleY(data[2].college))) + scaleY(data[2].college) + margin.top;
            })
            .attr("text-anchor", "middle")
            .text(function () {
                if (containerWidth > 1366)
                    return "將滑鼠移至折線圖之圓點，可在左上角方框觀看其他年份資訊！";
                else return "點選圓點可觀看該年資訊！";
            })
            .attr("fill", textColor)
            .attr("font-size", fontSize1)
            .attr('font-family', 'Noto Sans TC')
            .attr("opacity", 0.2);

        // 讓輔助文字閃一次就好
        if (times == 1) {
            usageText.transition()
                .duration(3 * shineDuration)
                .attr("font-size", fontSize1 + 2)
                .transition()
                .duration(3 * shineDuration)
                .attr("font-size", fontSize1);
        }

        /**
         * linechartMove() have no return value
         * it deals with mouseevent such as let dot shining ...etc.
         * 
         */
        function linechartMove(d, i) {

            mousePosOnLinechart = d3.mouse(this);

            // show data
            for (var i = 0; i < data.length; ++i) {
                var currentX = Math.abs(mousePosOnLinechart[0] - (scaleX(data[i].x) + margin.left));
                if (currentX < shineRange) {
                    dotIsShining++;

                    // 讓點反覆閃爍
                    d3.selectAll(".dots" + i)
                        .attr({
                            'fill': flexibleLineColor
                        })
                        .transition()
                        .duration(shineDuration)
                        .attr("r", bigR)
                        .each("start", function repeat() {
                            d3.select(this)
                                .attr('r', originR)
                                .transition()
                                .duration(shineDuration)
                                .attr("r", bigR)
                                .transition()
                                .duration(shineDuration)
                                .attr("r", originR)
                                .transition()
                                .each("start", repeat);
                        });

                    // 顯示資料塊裡的文字
                    for (var j = 0; j < 9; ++j) {
                        d3.select('.' + tipText[j])
                            .transition()
                            .attr("opacity", 1)
                            .attr("x", function () {
                                return (sizeIsL || sizeIsM) ? margin.left : 5;
                            })
                            .attr("y", function () {
                                return margin.top;
                            })
                            .text(function (d) {
                                if (j == 0) return data[i].year + " 年 各教育程度失業率";
                                else if (j == 1) return "平均 : " + data[i].total + "%";
                                else if (j == 2) return "小學及以下 : " + data[i].primary + "%";
                                else if (j == 3) return "國中 : " + data[i].junior + "%";
                                else if (j == 4) return "高中 : " + data[i].senior + "%";
                                else if (j == 5) return "高職 : " + data[i].vocational + "%";
                                else if (j == 6) return "專科 : " + data[i].specialist + "%";
                                else if (j == 7) return "大學 : " + data[i].college + "%";
                                else if (j == 8) return "研究所及以上 : " + data[i].graduate + "%";
                            })
                            .attr("font-size", function () {
                                if (sizeIsXSS) return fontSize1 + 1;
                                else if (sizeIsXS) return fontSize1 - 2;
                                else return fontSize1;
                            });
                    }
                } else if (dotIsShining != 0) {
                    /*
                     * 當有某資料點正在閃爍且滑鼠離該資料點的x軸距離大於shineRange的時候
                     * 讓閃爍的點恢復成原來的樣子
                     * 透過filter篩選class裡的class，還原正確的顏色
                     */
                    for (var a = 0; a < 8; a++) {
                        d3.selectAll(".dots" + i)
                            .filter(".onLine" + a)
                            .attr('fill', function (d) {
                                return lineColors[a];
                            });
                    }
                    d3.selectAll('.dots' + i)
                        .transition()
                        .duration(shineDuration)
                        .attr('r', originR);
                }
            }

            // 繪出跟著滑鼠跑的那條線
            d3.select('#flexibleLine')
                .style('opacity', function () {
                    var leftBound = scaleX(data[0].x) + margin.left;
                    var rightBound = scaleX(data[data.length - 1].x) + margin.left + 10;

                    if (mousePosOnLinechart[0] < leftBound) return 0;
                    else if (mousePosOnLinechart[0] > rightBound) return 0;
                    else return 1;
                })
                .transition()
                .duration(10)
                .attr('x1', mousePosOnLinechart[0])
                .attr('y1', 0 + margin.top)
                .attr('x2', mousePosOnLinechart[0])
                .attr('y2', mousePosOnLinechart[1] + (linechartHeight - mousePosOnLinechart[1] + margin.top));

        }

        var all_type = ["\"total\"", "\"primary\"", "\"junior\"", "\"senior\"", "\"vocational\"", "\"specialist\"", "\"college\"", "\"graduate\""];
        var all_type2 = ["平均", "國小及以下", "國中", "高中", "高職", "專科", "大學", "研究所及以上"];
        var all_type3 = ["total", "primary", "junior", "senior", "vocational", "specialist", "college", "graduate"];

        // 此svg的標題
        unemployedSvg.append("text")
            .attr("x", containerWidth / 2)
            .attr("y", linechartHeight + margin.bottom - 60)
            .attr("text-anchor", "middle")
            .text("失業率按教育程度（2011年-2016年）")
            .attr("fill", textColor)
            .attr("font-size", fontSize2)
            .attr('font-family', 'Noto Sans TC');

        // legend
        var legendX = infoWidth + 120;
        var legendY = 150;
        var legendWidth = ((containerWidth - legendX) / 9) * 0.5;
        var legendHeight = 10;
        var legendOffset = (containerWidth - legendX) / 9;

        // checkbox
        var checkboxWidth = 130;
        var checkboxHeight = 30;
        var checkboxOffset = (containerWidth - legendX) / 9;

        // offset between legend and checkbox
        var elementOffsetX = 10;
        var elementOffsetY = 60;

        var n = data.length - 1;

        // 每條線後面的文字
        for (var i = 0; i < 8; i++) {
            unemployedSvg.append("text")
                .attr("transform", function () {
                    var valY;
                    var moveLeft = 0;
                    var moveRight = 0;
                    var moveUp = 0;
                    var moveDown = 0;

                    if (i == 0) {
                        valY = parseInt(scaleY(data[n].total)) + margin.top;
                        if (sizeIsL || sizeIsXL) moveRight = 60;
                        else if (sizeIsM) moveRight = 55;
                        else if (sizeIsS) moveRight = 45;
                        else moveRight = 35;
                        moveDown = 5;
                    } else if (i == 1) {
                        valY = parseInt(scaleY(data[n].primary)) + margin.top;
                    } else if (i == 2) {
                        valY = parseInt(scaleY(data[n].junior)) + margin.top;
                        moveDown = 22;
                    } else if (i == 3) {
                        valY = parseInt(scaleY(data[n].senior)) + margin.top;
                        moveUp = 15;
                    } else if (i == 4) {
                        valY = parseInt(scaleY(data[n].vocational)) + margin.top;
                        moveDown = 23;
                    } else if (i == 5) {
                        valY = parseInt(scaleY(data[n].specialist)) + margin.top;
                        moveDown = 25;
                    } else if (i == 6) {
                        valY = parseInt(scaleY(data[n].college)) + margin.top;
                        moveUp = 10;
                    } else if (i == 7) {
                        valY = parseInt(scaleY(data[n].graduate)) + margin.top;
                        moveUp = 3;
                    }
                    return "translate(" + (linechartWidth + moveRight - moveLeft + 45) + "," + (valY + moveDown - moveUp) + ")";
                })
                .attr("id", function () {
                    return "labeltext" + i;
                })
                .attr("text-anchor", "end")
                .style("fill", function () {
                    return lineColors[i];
                })
                .style("opacity", function () {
                    return i == 6 ? 1 : 0.2;
                })
                .text(function () {
                    return all_type2[i];
                })
                .attr("font-size", fontSize1)
                .attr('font-family', 'Noto Sans TC');
        }

        /**
         * drawCheckbox() have no return value
         * it results in different layout of checkboxs
         * based on the passed in isCol integer
         *
         * @param {Integer} isCol
         */
        function drawCheckbox(isCol) {
            if (isCol) {
                // 螢幕不夠寬就直行排放
                if (sizeIsM) legendX = infoWidth + 11 + margin.left;
                else legendX = infoWidth + 11;

                legendY = 10;
                legendWidth = ((containerWidth - legendX) / 9) * 0.5;
                legendHeight = 10;
                legendOffset = 30;
                checkboxWidth = 140;
                checkboxHeight = 25;
                checkboxOffset = 30;
                elementOffsetX = 10;
                elementOffsetY = 6;
            }

            // checkbox 旁邊的色條
            var legend = infoSvg.selectAll('.legend')
                .data(all_type2)
                .enter().append('g')
                .attr("class", "legends")
                .attr("transform", function (d, i) {
                    {
                        return isCol ? "translate(0," + i * legendOffset + ")" :
                            "translate(" + i * legendOffset + ",0)";
                    }
                });

            legend.append('rect')
                .attr("x", legendX)
                .attr("y", function () {
                    return isCol ? legendY + elementOffsetY : legendY;
                })
                .attr("id", function (d, i) {
                    return "legend" + i;
                })
                .attr("width", legendWidth)
                .attr("height", legendHeight)
                .style("fill", function (d, i) {
                    return lineColors[i];
                })
                .style("opacity", function (d, i) {
                    return i == 6 ? 1 : 0.2;
                });

            // checkbox
            for (var k = 0; k < 8; k++) {
                infoSvg.append("foreignObject")
                    .attr("x", function () {
                        return isCol ? legendX + legendWidth + 5 : legendX + checkboxOffset * k;
                    })
                    .attr("y", function () {
                        return isCol ? legendY + checkboxOffset * k : legendY - elementOffsetY;
                    })
                    .attr("width", checkboxWidth)
                    .attr("height", checkboxHeight)
                    .append("xhtml:body")
                    .html(function () {
                        return (k == 6) ? "<form><input type=checkbox id=" + all_type[k] + "name=education value=" + all_type[k] + " checked><label for=" + all_type[k] + ">" + "<span class=\"checkboxtext\">" + all_type2[k] + "</span>" + "</label></form>" :
                            "<form><input type=checkbox id=" + all_type[k] + "name=education value=" + all_type[k] + "><label for=" + all_type[k] + ">" + "<span class=\"checkboxtext\">" + all_type2[k] + "</span>" + "</label></form>";
                    })
                    .on("click", updateLine);
            }
        }

        /**
         * checkboxTextSizing() have no return value
         * it adjusts font-size of checkboxes' text
         * 
         */
        function checkboxTextSizing() {
            var checkboxText = document.getElementsByClassName('checkboxtext');

            if (sizeIsXL)
                for (var i = 0; i < checkboxText.length; i++)
                    checkboxText[i].style.fontSize = 20;
            else if (sizeIsL)
                for (var i = 0; i < checkboxText.length; i++)
                    checkboxText[i].style.fontSize = 15;
            else
                for (var i = 0; i < checkboxText.length; i++)
                    checkboxText[i].style.fontSize = 14;
        }

        // draw checkbox depend on screen size
        if (sizeIsXL || sizeIsL) {
            drawCheckbox(0);
            checkboxTextSizing();
        } else {
            if (sizeIsM) {
                legendX = infoWidth + 11 + margin.left;
            } else {
                legendX = infoWidth + 11;
            }
            drawCheckbox(1);
            checkboxTextSizing();
        }

        /**
         * updateLine() have no return value
         * it adjusts font-size of checkboxes' text
         * 
         */
        function updateLine() {
            for (var i = 0; i < 8; i++) {
                if (d3.select("#" + all_type3[i]).property("checked")) {
                    d3.select(".historylines" + i).style("opacity", 1);
                    d3.select("#legend" + i).style("opacity", 1);
                    d3.select("#labeltext" + i).style("opacity", 1);
                    for (var j = 0; j < data.length; ++j) {
                        d3.selectAll(".dots" + j)
                            .filter(".onLine" + i)
                            .style("opacity", 1);
                    }
                } else {
                    d3.select(".historylines" + i).style("opacity", 0.2);
                    d3.select("#legend" + i).style("opacity", 0.2);
                    d3.select("#labeltext" + i).style("opacity", 0.2);
                    for (var j = 0; j < data.length; ++j) {
                        d3.selectAll(".dots" + j)
                            .filter(".onLine" + i)
                            .style("opacity", 0.2);
                    }
                }
            }

        }
    }

    draw();

    window.addEventListener("resize", function () {
        unemployedSvg.selectAll("g").remove();
        unemployedSvg.selectAll("path").remove();
        unemployedSvg.selectAll("text").remove();
        unemployedSvg.selectAll("line").remove();
        infoSvg.selectAll("g").remove();
        infoSvg.selectAll("rect").remove();
        infoSvg.selectAll("foreignObject").remove();

        draw();
    });

});