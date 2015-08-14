var margin = {top: 20, right: 30, bottom: 20, left: 50}, 
	height = 500 - margin.top - margin.bottom, 
	width = 900 - margin.right - margin.left; 

var parser = d3.time.format("%Y/%m").parse; 
var colorScale = d3.scale.category20(); 

var xScale = d3.scale.linear() 
	.range([0, width]); 

var yScale = d3.scale.linear() 
	.range([height, 0]);

var xAxis = d3.svg.axis() 
	.scale(xScale)
	.orient("bottom")
	.ticks(0);

var yAxis = d3.svg.axis() 
	.scale(yScale)
	.orient("left"); 

var svg = d3.select("#chart").append("svg") 
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g") 
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 

var g = svg.append("g"); 

var info_box_width = 265; 
var info_box_height = 500; 

var info_box = d3.select("#info_box").append("svg") 
	.attr("width", info_box_width)
	.attr("height", info_box_height); 

var globalData;
var dataType = "集中市場股票交易-總成交值"; 
var domain = [0, 4950]; 

d3.csv("taiwan_invest.csv", function(data) { 
	
	var yearList = d3.range(2003, 2016);

	data = organize(data); 
	globalData = data; 

	var xScaleMin = new Date(2000, 0, 1); 
	var xScaleMax = new Date(2000, 11, 1); 
	xScale.domain([xScaleMin, xScaleMax]); 

	yScale.domain([0, d3.max(data, function(year) { 
		return d3.max(year, function(month) { 
			return parseInt(month["集中市場股票交易-總成交值"]); }); })]);

	g.append("rect") 
		.attr("class", "interactiveRect")
		.attr("width", width)
		.attr("height", height);

	svg.append("g") 
		.attr("class", "xAxis")
		.attr("transform", "translate(0, " + height + ")")
		.call(xAxis); 

	svg.append("g") 
		.attr("class", "yAxis")
		.call(yAxis);

	var line = d3.svg.line() 
	.interpolate("basis")
	.x(function(d) { return xScale(d["年月"]); })
    .y(function(d) { return yScale(d["集中市場股票交易-總成交值"]); }); 

	var lineGroups = svg.selectAll("g.lineGroup")
		.data(data) 
		.enter() 
		.append("g") 
		.attr("class", "lineGroup"); 

	lineGroups.append("path")
		.attr("class", "line")
		.attr("id", function(d, i) { return "a" + (2003 + i); })
		.attr("d", line)
		.style("stroke", function(d, i) { return colorScale(i); });

	var yearListLabels = info_box.selectAll("g.yearLabel")
		.data(yearList) 
		.enter() 
		.append("g") 
		.attr("class", "yearLabel")
		.attr("x", 10)
		.attr("y", function(d, i) { return 60 + i * 30; });
		
	yearListLabels.append("rect") 
		.attr("class", "yearRect")
		.attr("id", function(d) { return d; })
		.attr("x", 10)
		.attr("y", function(d, i) { return 50 + i * 30; })
		.attr("width", 25)
		.attr("height", 10)
		.attr("fill", function(d, i) { return colorScale(i); })
		.style("stroke", function(d, i) { return colorScale(i); })
		.on("click", function() { 
			var that = this;
			removePath(that); 
		});

	yearListLabels.append("text")
		.attr("class", "yearText")
		.attr("x", 50)
		.attr("y", function(d, i) { return 60 + i * 30; })
		.text(function(d) { return d; });

	var info_boxScale = d3.scale.linear() 
		.domain([0, 4000])
		.range([0, 120]); 

	var info_boxAxis = d3.svg.axis() 
		.scale(info_boxScale)
		.orient("top")
		.ticks(3);

	info_box.append("g") 
		.attr("class", "info_xAxis")
		.attr("transform", "translate(" + 100 + ", " + 40 + ")")
		.call(info_boxAxis);

	var rects = info_box.selectAll(".dataRect")
		.data(yearList) 
		.enter() 
		.append("rect") 
		.attr("class", "dataRect")
		.attr("x", 100)
		.attr("y", function(d, i) { return 50 + i * 30; })
		.attr("width", 0)
		.attr("height", 10)
		.attr("fill", function(d, i) { return colorScale(i); }); 

	g.append("line") 
		.attr("class", "xTracer")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 0)
		.attr("y2", height); 

	var monthList = d3.range(1, 13); 

	svg.selectAll(".yearLabel")
		.data(monthList)
		.enter() 
		.append("text") 
		.attr("class", "yearLabel")
		.attr("x", function(d, i) { return 75 * i; })
		.attr("y", 470)
		.text(function(d) { return d; }); 

	var monthIndex = 0; 
	window.focus(); 
	d3.select(window).on("keydown", function() { 
	switch (d3.event.keyCode) {
		case 37: 
			if (monthIndex <= 0) { break; }
			else {
				monthIndex -= 1; break; 
			}
		case 39: 
			if (monthIndex >= 11) { break; }
			else {
				monthIndex += 1; break; 
			} 
		}
		keyDown(monthIndex, globalData);
	}); 

	function keyDown(monthIndex, globalData) {

	var yearList = d3.range(2003, 2016);
	var dataArray = [];

	for (var i = 0; i < globalData.length; i++) { 

		var year = yearList[i]; 

		for (var m = 0; m < globalData[i].length; m++) { 
				
			// globalData[i][m].年月 = new Date(year, globalData[i][m].年月.getMonth(), 1);
			if (monthIndex == globalData[i][m].年月.getMonth()) { 
				dataArray.push(globalData[i][m]);
			}
		}
	}

	var rectScale = d3.scale.linear() 
		.domain(domain)
		.range([0, 120]); 

	d3.selectAll(".dataRect")
		.data(dataArray)
		.transition()
		.duration(1000)
		.attr("width", function(d) { return rectScale(d[dataType]); })
		.attr("fill", function(d, i) { return colorScale(i); }); 
	 
	d3.select(".xTracer")
		.transition() 
		.duration(1000)
		.attr("x1", width/11 * monthIndex)
		.attr("x2", width/11 * monthIndex); 
	}
})

function organize(data) { 

	var yearData = []; 	
	var yearMonthData = data.slice(18); 

	for (var i = 0; i < yearMonthData.length; i++) { 
		if (yearMonthData[i].年月.length == 4) { 
			yearMonthData[i].年月 = parser(splitDate(yearMonthData[i].年月, 2));
		}
		else { 
			yearMonthData[i].年月 = parser(splitDate(yearMonthData[i].年月, 3));
		}
	}

	var dataByYear = []; 
	var yearList = d3.range(2003, 2016);

	for (var m = 0; m < yearList.length; m++) { 

		var result = []; 

		for (var n = 0; n < yearMonthData.length; n++) { 

			if (yearMonthData[n].年月.getFullYear() == yearList[m]) { 

				result.push(yearMonthData[n]); 
			}
		}

		dataByYear.push(result);

	}

	for (var i = 0; i < dataByYear.length; i++) { 

		for (var m = 0; m < dataByYear[i].length; m++) { 

			dataByYear[i][m].年月 = new Date(2000, dataByYear[i][m].年月.getMonth(), 1);
		}
	}
	
	return dataByYear;

}

function splitDate(date, index) { 
	return (parseInt(date.substring(0, index)) + 1911) + "/" + date.substring(index); 
}

function removePath(that) { 

	
	var id = d3.select(that).attr("id");
	var color = d3.select(that).style("stroke"); 

    if (d3.select(that).attr("fill") == "#fff") { 
         d3.select(that).attr("fill", color);
         d3.select("#a" + id).attr("visibility", false);
    }
    else {
         d3.select(that).attr("fill", "#fff");
         d3.select("#a" + id).attr("visibility", "hidden"); 
    }           

}

function specifyYear(sel) { 

	var value = sel.value; 

	var yScaleMax = d3.max(globalData, function(year) { 
		return d3.max(year, function(month) { 
			return parseInt(month[value]); }); });

	switch (yScaleMax.toString().length) {
		case 2: 
			yScaleMax = Math.ceil(yScaleMax/10) * 10; 
			break; 
		case 3: 
			yScaleMax = Math.ceil(yScaleMax/100) * 100; 
			break; 
		case 4: 
			yScaleMax = Math.ceil(yScaleMax/1000) * 1000; 
			break; 
		case 7: 
			yScaleMax = Math.ceil(yScaleMax/1000000) * 1000000; 
			break; 
	}

	var yScale = d3.scale.linear()
		.domain([0, yScaleMax])
		.range([height, 0]);

	var yAxis = d3.svg.axis() 
		.scale(yScale) 
		.orient("left"); 

	d3.select(".yAxis")
		.transition() 
		.duration(1000)
		.call(yAxis);

	var info_boxScale = d3.scale.linear() 
		.domain([0, yScaleMax])
		.range([0, 130]); 

	var info_boxAxis = d3.svg.axis() 
		.scale(info_boxScale)
		.orient("top")
		.ticks(3);

	d3.select(".info_xAxis")
		.transition() 
		.duration(1000)
		.call(info_boxAxis);

	d3.selectAll(".line").remove(); 

	var line = d3.svg.line()
		.interpolate("basis")
		.x(function(d) { return xScale(d["年月"]); })
		.y(function(d) { return yScale(d[value]); });

	d3.selectAll(".lineGroup").append("path")
		.attr("class", "line") 
		.attr("id", function(d, i) { return "a" + (2003 + i); })
		.attr("d", line)
		.style("stroke", function(d, i) { return colorScale(i); });

	d3.selectAll(".yearRect")
		.attr("fill", function(d, i) { return colorScale(i); });

	d3.selectAll(".dataRect")
		.transition()
		.duration(1000)
		.attr("width", 0);
	
	dataType = value;
	domain = yScale.domain(); 
}



	



