var margin = {top: 20, right:30, bottom:20, left: 30}, 	
	height = 500 - margin.top - margin.bottom, 
	width = 880 - margin.right - margin.left; 

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

var info_box_width = 250; 
var info_box_height = 500;

var info_box = d3.select("#info_box").append("svg") 
	.attr("width", info_box_width)
	.attr("height", info_box_height); 

var globalData; 
var dataType = "境外外國機構投資人(FINI)-申請登記件數(件)"; 
var domain = [0, 171]; 

d3.csv("foreign_invest.csv", function(data) { 

	data = organize(data); 
	globalData = data; 	

	var monthList = d3.range(1, 13); 

	var yearList = d3.range(2003, 2016);
	var xScaleMin = new Date(2000, 0, 1); 
	var xScaleMax = new Date(2000, 11, 1); 
	xScale.domain([xScaleMin, xScaleMax]); 

	yScale.domain([0, d3.max(data, function(year) { 
		return d3.max(year, function(month) { 
			return parseInt(month["境外外國機構投資人(FINI)-申請登記件數(件)"]); }); })]); 

	svg.append("g") 
		.attr("class", "xAxis")
		.attr("transform", "translate(0, " + height + ")")
		.call(xAxis); 

	svg.append("g") 
		.attr("class", "yAxis")
		.call(yAxis)
		.append("text") 
		.attr("class", "yAxisLabel")
		.attr("x", -20)
		.attr("y", -15)
		.attr("dy", ".71em")
		.attr("transform", "rotate(90)")
		.text("集中市場股票交易-總成交值(十億股)");

	var xAxisLabel = svg.append("g") 
		.attr("class", "xAxisLabel")
		.attr("transform", "translate(" + 800 + "," + 455 + ")")
		
	xAxisLabel.append("text") 
		.text("月份");

	var itemList = d3.keys(data[0][0]).filter(function(d) { return d != "年月"; }); 

	var lineGroups = svg.selectAll(".lineGroup")
		.data(data)
		.enter() 
		.append("g") 
		.attr("class", "lineGroup"); 

	var line = d3.svg.line() 
		.interpolate("basis")
		.x(function(d) { return xScale(d["年月"]); })
		.y(function(d) { return yScale(d[dataType]); }); 

	lineGroups.append("path")
		.attr("class", "line")
		.attr("id", function(d, i) { return "a" + (2003 + i); })
		.attr("d", line)
		.style("stroke", function(d, i) { return colorScale(i); });

	var info_boxScale = d3.scale.linear() 
		.domain(yScale.domain())
		.range([0, 120]); 

	var info_boxAxis = d3.svg.axis() 
		.scale(info_boxScale)
		.orient("top")
		.ticks(3); 

	info_box.append("g") 
		.attr("class", "info_boxAxis")
		.attr("transform", "translate(" + 100 + ", " + 40 + ")")
		.call(info_boxAxis);

	var info_groups = info_box.selectAll("g.info_child")
		.data(yearList) 
		.enter() 
		.append("g")
		.attr("class", "info_child")
		.attr("transform", function(d, i) { 
			return "translate(" + 10 + ", " + (50 + 30 * i) + ")"; }); 

	info_groups.append("rect")
		.attr("class", "itemRect")
		.attr("width", 25)
		.attr("height", 10)
		.attr("id", function(d) { return d; })
		.attr("fill", function(d, i) { return colorScale(i); })
		.style("stroke", function(d, i) { return colorScale(i); })
		.on("click", function() { 
			var that = this; 
			removePath(that); 
		});

	info_groups.append("text") 	
		.attr("class", "itemText")
		.attr("x", 40)
		.attr("y", 10)
		.text(function(d, i) { return 2003 + i; }); 

	info_groups.append("rect")
		.attr("class", "dataRect")
		.attr("x", 80)
		.attr("width", 0)
		.attr("height", 10)
		.attr("fill", function(d, i) { return colorScale(i); });
	
	g.append("line") 
		.attr("class", "xTracer")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 0)
		.attr("y2", height); 

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
				monthIndex -= 1;  
				break;
			}
		case 39: 
			if (monthIndex >= 11) { break; }
			else { 
				monthIndex += 1;
				break; 
			}
		}
		keyDown(monthIndex, globalData);
	});

	function keyDown(monthIndex, data) { 

	var yearList = d3.range(2003, 2016); 
	var dataArray = []; 

	for (var i = 0; i < data.length; i++) { 
		for (var m = 0; m < data[i].length; m++) { 
			if (monthIndex == data[i][m].年月.getMonth()) { 
			dataArray.push(data[i][m]);
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
		.attr("width", function(d) { return rectScale(d[dataType]); });
	

	d3.select(".xTracer")
		.transition() 
		.duration(1000)
		.attr("x1", width / 11 * monthIndex)
		.attr("x2", width / 11 * monthIndex); 
	}

});


function organize(data) { 

	var yearMonthData = data.slice(18);

	
	for (var i = 0; i < yearMonthData.length; i++) {
		if (yearMonthData[i].年月.length == 4) { 
			yearMonthData[i].年月 = parser(splitDate(yearMonthData[i].年月, 2)); 
		}
		else { 
			yearMonthData[i].年月 = parser(splitDate(yearMonthData[i].年月, 3)); 
		}
	}

	var yearList = d3.range(2003, 2016); 
	var dataArray = []; 

	for (var i = 0; i < yearList.length; i++) { 

		var result = []; 

		for (var m = 0; m < yearMonthData.length; m++) { 

			if (yearList[i] == yearMonthData[m].年月.getFullYear()) { 
				result.push(yearMonthData[m]); 
			}
		}
		dataArray.push(result)
	}

	for (var i = 0; i < dataArray.length; i++) { 

		for (var m = 0; m < dataArray[i].length; m++) { 

			dataArray[i][m].年月 = new Date(2000, dataArray[i][m].年月.getMonth(), 1); 
		}
	}
	
	return dataArray; 
}

function splitDate(item, index) { 
	return (parseInt(item.substring(0, index)) + 1911) + "/" + item.substring(index); 
}

function removePath(that) { 

	var color = d3.select(that).style("stroke"); 
	var id = d3.select(that).attr("id"); 

	console.log(id);

	if (d3.select(that).attr("fill") != "#fff") { 
		d3.select(that).attr("fill", "#fff"); 
		d3.select("#a" + id).attr("visibility", "hidden"); 
	}
	else { 
		d3.select(that).attr("fill", color);
		d3.select("#a" + id).attr("visibility", true); 
	}

}

function specifyYear(sel) { 

	var value = sel.value; 
	dataType = value; 

	d3.select(".yAxisLabel").text(value); 

	d3.selectAll(".itemRect")
		.attr("fill", function(d, i) { return colorScale(i); }); 

	d3.selectAll(".dataRect")
		.transition()
		.duration(1000)
		.attr("width", 0);

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
		.range([0, 120]); 

	var info_boxAxis = d3.svg.axis() 
		.scale(info_boxScale)
		.orient("top")
		.ticks(3); 

	d3.select(".info_boxAxis")
		.transition() 
		.duration(1000)
		.call(info_boxAxis);

	d3.selectAll(".line").remove(); 

	var line = d3.svg.line() 
		.interpolate("basis")
		.x(function(d) { return xScale(d.年月); })
		.y(function(d) { return yScale(d[value]); }); 

	d3.selectAll(".lineGroup").append("path")
		.attr("class", "line") 
		.attr("id", function(d, i) { return "a" + (2003 + i); })
		.attr("d", line)
		.style("stroke", function(d, i) { return colorScale(i); });

	domain = yScale.domain(); 
}