var margin = {top: 30, right:40, bottom: 20, left:50}, 
    width = 930 - margin.left - margin.right, 
    height = 450 - margin.top - margin.bottom; 

var colorScale1 = ["#1f77b4", "#ff7f0e", "#2ca02c", 
    "#d62728", "#9467bd"]; 

var colorScale2 = ["#bcbd22", "#ff9896", "#9467bd", 
    "#e377c2", "#17becf"]; 

var colorScale3 = ["#7b4173", "#ce6dbd"];

var colorScale = d3.scale.ordinal()
    .domain(["上市公司家數(家)","上市公司資本額(十億元)","上市公司資本額成長率(％)",
      "上市公司面值(十億元)","上市公司市值(十億元)","上櫃公司家數(家)","上櫃公司資本額(十億元)",
      "上櫃公司資本額成長率(％)","上櫃公司面值(十億元)","上櫃公司市值(十億元)","未上市未上櫃公司家數(家)",
      "未上市未上櫃公司資本額(十億元)"])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#bcbd22", "#ff9896", "#9467bd", 
    "#e377c2", "#17becf", "#7b4173", "#ce6dbd"]);

var xScale = d3.scale.linear() 
    .range([0, width]); 

var yScale = d3.scale.linear() 
    .range([height, 0]); 

var xAxis = d3.svg.axis() 
    .scale(xScale) 
    .orient("bottom");

var yAxis = d3.svg.axis() 
    .scale(yScale) 
    .orient("left");

var duration = 5000; 
var globalData; 

var line = d3.svg.line() 
    .interpolate("basis") 
    .x(function(d) { return xScale(d["年月"]); })
    .y(function(d) { return yScale(d["集中市場股票交易-總成交值"]); }); 

var yearParser = d3.time.format("%Y").parse; 

var yearMonthParser = d3.time.format("%Y/%m").parse; 

var svg = d3.select("#chart").append("svg") 
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom) 
    .append("g") 
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")"); 

var interactiveRect = svg.append("g"); 

var g = svg.append("g") 
    .attr("class", "lineGroup");

var lineTrace = svg.append("g");

var detailSVG_width = 250; 
var detailSVG_height = 150;

var stockCompanySVG = d3.select("#stockCompany").append("svg") 
    .attr("width", detailSVG_width) 
    .attr("height", detailSVG_height);

var listCompanySVG = d3.select("#listCompany").append("svg") 
    .attr("width", detailSVG_width) 
    .attr("height", detailSVG_height);

var prelistCompanySVG = d3.select("#pre-list").append("svg") 
    .attr("width", detailSVG_width) 
    .attr("height", detailSVG_height);

var dataType; 
var traceOption = false; 
var yScaleDomain = []; 
var globalData; 

d3.csv("stock.csv", function(data) { 

  //////////////////////////////construct slider /////////////////////

    var x = d3.scale.linear()
        .domain([1, 100])
        .range([0, width])
        .clamp(true);

    var dispatch = d3.dispatch("sliderChange");

    var slider = d3.select(".slider")
        .style("width", width + "px");

    var sliderTray = slider.append("div")
        .attr("class", "slider-tray");

    var sliderHandle = slider.append("div")
        .attr("class", "slider-handle");

    sliderHandle.append("div")
        .attr("class", "slider-handle-icon")

    slider.call(d3.behavior.drag()
        .on("dragstart", function() {
          dispatch.sliderChange(x.invert(d3.mouse(sliderTray.node())[0]));
          d3.event.sourceEvent.preventDefault();

        })
        .on("drag", function() {
          dispatch.sliderChange(x.invert(d3.mouse(sliderTray.node())[0]));
        }));

    dispatch.on("sliderChange.slider", function(value) {
      sliderHandle.style("left", x(value) + "px")
    });

    ////////////////////////////////////////////////////////////
    var keys = d3.keys(data[0]);

    for (var i = 0; i < data.length; i++) { 

        if (data[i].年月.length == 2 || data[i].年月.length == 3) {
            data[i].年月 = yearParser((parseInt(data[i].年月) + 1911).toString());
        }
        else if (data[i].年月.length == 4) { 
            data[i].年月 = yearMonthParser(splitValue(data[i].年月, 2));
        }
        else { 
            data[i].年月 = yearMonthParser(splitValue(data[i].年月, 3)); 
        }
    }

    yScale.domain([0, d3.max(data, function(d) { return d["上市公司家數"]; })]);
    var xScaleMin = new Date(1998, 0, 1); 
    var xScaleMax = new Date(2015, 0, 1); 
    xScale.domain([xScaleMin, xScaleMax]); 

    svg.append("g") 
      .attr("class", "xAxis") 
      .attr("transform", "translate(0, " + height + ")")
      .call(xAxis); 

    svg.append("g") 
      .attr("class", "yAxis") 
      .call(yAxis);  

    if($("input[name='mode']").prop("checked")) { 
        // traceOption = true;
        console.log('hello')
    }
    else { 
        traceOption = false; 
    }

    interactiveRect.append("rect")
      .attr("class", "interactiveRect")
      .attr("width", width)
      .attr("height", height)
      .on("mousemove", function() { 
          var that = this; 
          rectInteraction(that, data, dataType, traceOption); 
          d3.select(".lineTracer").attr("visibility", "true")
      })

    var yearData = data.slice(0, 18);  
    var yearMonthData = data.slice(18); 

    globalData = yearMonthData;

    drawLineGraph(yearData); 
    drawRects(keys, yearMonthData); 
}); 

function drawLineGraph(data) { 

  g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "#1f77b4"); 

  g.append("circle")
    .attr("class", "lineTracer") 
    .attr("cx", 0)
    .attr("cy", yScale(data[0]["上市公司家數"]))
    .attr("r", 5)
    .style("fill", function(d) { 
        return "red"; 
    })
    .style("stroke", "#000")
    .style("stroke-width", "2px"); 
}


function drawRects(keys, data) { 

    var stockKeys = keys.slice(1, 6); 
    var listKeys = keys.slice(6, 11); 
    var preKeys = keys.slice(11); 

      var stockSection = stockCompanySVG.selectAll("g.stockSection")
        .data(stockKeys)
        .enter() 
        .append("g") 
        .attr("class", "stockSection")
        .attr("x", 0)
        .attr("y", function(d, i) { return 15 + 30 * i; }); 

      stockSection.append("rect") 
        .attr("class", "stockRect")
        .attr("id", function(d) { return d; })
        .attr("x", 0)
        .attr("y", function(d, i) { return 30 * i; })
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", "#fff")
        .style("stroke", function(d) { return colorScale(d); })
        .on("click", function() {   
            $("#year_options").attr("disabled", false);
            var id = d3.select(this).attr("id"); 
            d3.select(".lineTracer").attr("visibility", "hidden")
            d3.select(".horizontalLineTrace").remove();
            transitionLine(id, data, 0) 
            fillRect(this, id); 
        });

      stockSection.append("text")
        .attr("class", "stockValue")
        .attr("id", function(d) { return d + "Value"; })
        .attr("x", 40)
        .attr("y", function(d, i) { return 15 + 30 * i; })
        .text("");

      stockSection.append("text")
        .attr("class", "stockCompText")
        .attr("id", function(d) { return d + "Text"; })
        .attr("x", 100)
        .attr("y", function(d, i) { return 15 + 30 * i; })
        .text(function(d) { return d; });

       var listSection = listCompanySVG.selectAll("g.listSection")
        .data(listKeys)
        .enter() 
        .append("g") 
        .attr("class", "listSection")
        .attr("x", 0)
        .attr("y", function(d, i) { return 15 + 30 * i; }); 

      listSection.append("rect") 
        .attr("class", "listRect")
        .attr("id", function(d) { return d; })
        .attr("x", 0)
        .attr("y", function(d, i) { return 30 * i; })
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", "#fff")
        .style("stroke", function(d, i) { return colorScale(d); })
        .on("click", function() { 
            var id = d3.select(this).attr("id"); 
            transitionLine(id, data, 0);
            fillRect(this); 
        });

       listSection.append("text") 
        .attr("class", "listValue")
        .attr("id", function(d) { return d + "Value"; })
        .attr("x", 40)
        .attr("y", function(d, i) { return 15 + 30 * i; })
        .text("");  

        listSection.append("text") 
            .attr("class", "listCompText")
            .attr("id", function(d) { return d + "Text"; })
            .attr("x", 100)
            .attr("y", function(d, i) { return 15 + 30 * i; })
            .text(function(d) { return d; });

      var prelistSection = prelistCompanySVG.selectAll("g.prelistSection")
        .data(preKeys)
        .enter() 
        .append("g") 
        .attr("class", "prelistSection")
        .attr("x", 0)
        .attr("y", function(d, i) { return 15 + 30 * i; }); 

      prelistSection.append("rect") 
          .attr("class", "prelistRect")
          .attr("id", function(d) { return d; })
          .attr("x", 0)
          .attr("y", function(d, i) { return 30 * i; })
          .attr("width", 30)
          .attr("height", 20)
          .attr("fill", "#fff")
          .style("stroke", function(d, i) { return colorScale(d); })
          .on("click", function() {
              var id = d3.select(this).attr("id"); 
              transitionLine(id, data, 0);
              fillRect(this); 
          });

       prelistSection.append("text") 
        .attr("class", "prelistValue")
        .attr("id", function(d) { return d + "Value"; })
        .attr("x", 40)
        .attr("y", function(d, i) { return 15 + 30 * i; })
        .text("");

      prelistSection.append("text") 
        .attr("class", "prelistCompText")
        .attr("id", function(d) { return d + "Text"; })
        .attr("x", 100)
        .attr("y", function(d, i) { return 15 + 30 * i; })
        .text(function(d) { return d; });

}

function specifyYear() { 

    var e = document.getElementById("year_options"); 
    var year = e.options[e.selectedIndex].value; 
    var identification = d3.select(".line").attr("id");
    var xScaleMin = new Date(year, 0, 1); 
    var xScaleMax = new Date(year, 11, 1); 

    var xScale = d3.scale.linear() 
        .domain([xScaleMin, xScaleMax])
        .range([0, width]); 

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom"); 

    d3.select(".xAxis")
        .transition() 
        .duration(1000)
        .call(xAxis); 

    var yearData = []; 
     
    if (year.length == 4) { 
        for (var i = 0; i < globalData.length; i++) { 
        if (globalData[i].年月.getFullYear() == year) { 
          yearData.push(globalData[i]); 
        }
    }

    d3.select(".line").remove(); 

    var yDomain = getDomain(identification);

    var yScale = d3.scale.linear() 
        .domain([0, yDomain])
        .range([height, 0]); 

    var line = d3.svg.line() 
        .interpolate("basis")
        .x(function(d) { return xScale(d["年月"]); })
        .y(function(d) { return yScale(d[identification]); }); 

    g.append("path")
        .datum(yearData)
        .attr("class", "line")
        .attr("id", identification)
        .attr("d", line)
        .style("stroke", colorScale(identification));
    }
    else { 
        d3.select(".line").remove(); 

        var yearList = d3.range(1998, 2016);
        var dataArray = []; 
        
        var xScaleMin = new Date(2000, 0, 1); 
        var xScaleMax = new Date(2000, 11, 1); 

        for (var i = 0; i < yearList.length; i++) { 
            var result = []; 
            for (var m = 0; m < globalData.length; m++) { 
              if (globalData[m].年月.getFullYear() == yearList[i]) { 
                  result.push(globalData[m]);
              }
            }
            dataArray.push(result);
        }
        
        for (var i = 0; i < dataArray.length; i++) { 
            for( var m = 0; m < dataArray[i].length; m++) { 
                dataArray[i][m].年月 = new Date(2000, dataArray[i][m].年月.getMonth(), 1); 

            }
        }

        console.log(dataArray);

       var line = d3.svg.line() 
              .interpolate("basis")
              .x(function(d) { return xScale(d["年月"]); })
              .y(function(d) { return yScale(d[identification]); }); 

        var lineGroups = svg.selectAll(".lineSVG")
            .data(dataArray)
            .enter()
            .append("g")
            .attr("class", "lineSVG"); 

        lineGroups.append("path")
            .attr("class", "line")
            .attr("id", identification)
            .attr("d", line)
            .style("stroke", colorScale(identification));

    }
}

function transitionLine(id, data, year) { 
    d3.select(".line").remove(); 

    var yScale; 
    var yAxis;
    var xScale; 
    var xAxis; 

    function rescale(yRange) { 
    yScale = d3.scale.linear() 
        .domain([0, yRange])
        .range([height, 0]); 

    yAxis = d3.svg.axis() 
        .scale(yScale)
        .orient("left"); 

    d3.select(".yAxis")
        .transition() 
        .duration(1000)
        .call(yAxis);

    yScaleDomain = [0, yRange]; 

    var xScaleMin = new Date(1998, 7, 1); 
    var xScaleMax = new Date(2015, 6, 1); 
    xScale = d3.scale.linear()
        .domain([xScaleMin, xScaleMax])
        .range([0, width]); 

    xAxis = d3.svg.axis() 
        .scale(xScale)
        .orient("bottom")
        .ticks(20); 

     d3.select(".xAxis")
        .transition() 
        .duration(1000)
        .call(xAxis);
    }

    switch (id) { 
      case "上市公司家數": 
        dataType = "上市公司家數"; 
        rescale(900); 
        break; 
      case "上櫃公司家數": 
        dataType = "上櫃公司家數"; 
        rescale(900); 
        break; 
      case "上市公司資本額": 
        dataType = "上市公司資本額"; 
        rescale(7000); 
        break; 
      case "上櫃公司資本額": 
        dataType = "上櫃公司資本額"; 
        rescale(1000);
        break; 
      case "上市公司資本額成長率": 
        dataType = "上市公司資本額成長率"; 
        rescale(5); 
        break; 
      case "上櫃公司資本額成長率": 
        dataType = "上櫃公司資本額成長率"; 
        rescale(5); 
        break; 
      case "上市公司市值": 
        dataType = "上市公司市值"; 
        rescale(27000);
        break; 
      case "上市公司面值": 
        dataType = "上市公司面值"; 
        rescale(7000);
        break; 
      case "上櫃公司面值": 
        dataType = "上櫃公司面值"; 
        rescale(1000);
        break; 
      case "上櫃公司市值": 
        dataType = "上櫃公司市值"; 
        rescale(3000);
        break; 
      case "未上市未上櫃公司家數": 
        dataType = "未上市未上櫃公司家數"; 
        rescale(3000);
        break; 
      case "未上市未上櫃公司資本額": 
        dataType = "未上市未上櫃公司資本額"; 
        rescale(3000);
        break; 
    }
  
    var line = d3.svg.line() 
        .interpolate("basis")
        .x(function(d) { return xScale(d["年月"]); })
        .y(function(d) { return yScale(d[id]); }); 

    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("id", id)
        .attr("d", line)
        .style("stroke", colorScale(id)); 
}

function rectInteraction(that, data, dataType, traceOption) { 

    console.log(traceOption);

    d3.select(".horizontalLineTrace").remove();

    var lineTracerScale = d3.scale.linear() 
        .domain(yScaleDomain)
        .range([height, 0]); 

    d3.selectAll(".prelistValue").text(""); 
    d3.selectAll(".listValue").text(""); 
    d3.selectAll(".stockValue").text(""); 

    var pathValues = d3.select(".line").node();
    var pathLength = pathValues.getTotalLength(); 
    var BBox = pathValues.getBBox(); 
    var scale = pathLength/BBox.width; 

    var x = d3.event.pageX - (margin.left + 20); 
    var beginning = x, end = pathLength, target;
    while (true) {
      target = Math.floor((beginning + end) / 2);
      pos = pathValues.getPointAtLength(target);
      if ((target === end || target === beginning) && pos.x !== x) {
          break;
      }
      if (pos.x > x)      end = target;
      else if (pos.x < x) beginning = target;
      else                break; //position found
    }
   
  var value = parseFloat(lineTracerScale.invert(pos.y)).toFixed(2);
  d3.select("#" + dataType + "Value").text(value); 

  d3.select(".lineTracer")
      .attr("opacity", 1)
      .attr("cx", x)
      .attr("cy", pos.y);

  if (traceOption) { 
    lineTrace.append("line") 
        .attr("class", "horizontalLineTrace")   
        .attr("x1", 0)
        .attr("y1", pos.y)
        .attr("x2", width)
        .attr("y2", pos.y)
        .style("stroke", "#9EA4AD");
  }
}



function splitValue(value, index) { 
    return (parseInt(value.substring(0, index)) + 1911) + "/" + value.substring(index); 
}

function fillRect(object, id) {   

    d3.selectAll(".prelistValue").text(""); 
    d3.selectAll(".listValue").text(""); 
    d3.selectAll(".stockValue").text(""); 

    d3.selectAll(".stockRect").attr("fill", "#fff"); 
    d3.selectAll(".listRect").attr("fill", "#fff"); 
    d3.selectAll(".prelistRect").attr("fill", "#fff"); 
    var color = d3.select(object).style("stroke"); 

    if (d3.select(object).attr("fill") == "#fff") { 
         d3.select(object).attr("fill", color);
    }
    else {
         d3.select(object).attr("fill", "#fff");
    }           
}


function getDomain(key) { 

  var yDomain; 

  switch (key) { 
       case "上市公司家數": 
        yDomain = 900;
        break; 
      case "上櫃公司家數": 
        yDomain = 900;
        break; 
      case "上市公司資本額": 
        yDomain = 7000;
        break; 
      case "上櫃公司資本額": 
         yDomain = 1000;
        break; 
      case "上市公司資本額成長率": 
         yDomain = 5;
        break; 
      case "上櫃公司資本額成長率": 
         yDomain = 5;
        break; 
      case "上市公司市值": 
         yDomain = 27000;
        break; 
      case "上市公司面值": 
         yDomain = 7000;
        break; 
      case "上櫃公司面值": 
         yDomain = 1000;
        break; 
      case "上櫃公司市值": 
         yDomain = 3000;
        break; 
      case "未上市未上櫃公司家數": 
        yDomain = 3000;
        break; 
      case "未上市未上櫃公司資本額": 
         yDomain = 3009;
        break; 
    }

    return yDomain;

}






