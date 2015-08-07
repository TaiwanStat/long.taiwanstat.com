var margin = {top: 20, right:30, bottom:30, left: 70}, //////////units: 千億    data x 100
	width = 900 - margin.left - margin.right, 
	height = 500 - margin.top - margin.bottom; 

var parser = d3.time.format("%Y").parse; 

var xScale = d3.scale.linear() 
	.range([0, width]); 

var yScale = d3.scale.linear() 
	.range([height, 0]); 

var xAxis = d3.svg.axis() 
	.scale(xScale) 
	.orient("bottom")
	.ticks(14);
	
var yAxis = d3.svg.axis() 
	.scale(yScale) 
	.orient("left")
	.tickFormat(function(d) { return d/1000000000 + "兆"; }); 

var line = d3.svg.area() 
	.interpolate("basis") 
	.x(function(d) { return xScale(d.年度); })
	.y(function(d) { return yScale(d["<b>歲入淨額</b> "]); }); 

var area = d3.svg.area() 
	.interpolate("basis")
	.x(function(d) { return xScale(d.年度); })
	.y1(function(d) { return yScale(d["<b>歲入淨額</b> "]); });

var svg = d3.select("#chart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var g = svg.append("g");


console.log(d3.range(65, 104, 3));
var yearIndex = svg.selectAll(".yearIndex")
	.data(d3.range(65, 107, 3))
	.enter() 
	.append("text") 
	.attr("class", "yearIndex")
	.attr("x", function(d, i) { return -13 + i * 61; })
	.attr("y", 470)
	.text(function(d) { return d; });


d3.csv("revenue.csv", function(data) { 

	data.pop(); 

	var nestedData = d3.nest().key(function(d) { return d.年度; }).entries(data); 

	cleanUpData(nestedData); 
	drawDifferenceGraph(nestedData); 

});

function cleanUpData(data) { 

	var itemList = d3.keys(data[0].values[0]).filter(function(d) { return d != "年度"; });

	for (var i = 0; i < data.length; i++) { 
		data[i].key = parseInt(data[i].key.split("年度")[0]) + 1911; 
		data[i].values[0].年度 = parseInt(data[i].values[0].年度.split("年度")[0]) + 1911;
		for (var m = 0; m < itemList.length; m++) { 

			if (typeof(data[i].values[0][itemList[m]]) == 'undefined') {}
			else { 
				data[i].values[0][itemList[m]] = parseInt(data[i].values[0][itemList[m]].split(",").join(""));
			}
		}
	}	
}

function drawDifferenceGraph(data) { 

	var area_mask_width = width, 
		area_mask_height = height; 

	g.append("rect") 
		.attr("class", "area_mask") 
		.attr("width", area_mask_width)
		.attr("height", area_mask_height)
		.on("mousemove", function() { 
			var that = this; 

			rectInteract(that, data); 
		});

	for (var i = 0; i < data.length; i++) { 
		data[i].key = parser(data[i].key.toString()); 
	}

	var xScaleMin = new Date(1974, 0, 1); 
	var xScaleMax = new Date(2014, 0, 1);
	xScale.domain([xScaleMin, xScaleMax]); 
	yScale.domain([0, 5000000000]);

	svg.append("g") 
		.attr("class", "xAxis")
		.attr("transform", "translate(0, " + height + ")")
		.call(xAxis); 

	svg.append("g") 	
		.attr("class", "yAxis") 
		.call(yAxis);

	var dataArray = []; 

	for (var i = 0; i < data.length; i++) { 
		data[i].values[0].年度 = parser(data[i].values[0].年度.toString());
		dataArray.push(data[i].values[0]); 
	}

	svg.datum(dataArray); 
	
	svg.append("clipPath")
		.attr("id", "clip-below")
		.append("path") 
		.attr("d", area.y0(height));

	svg.append("clipPath")
		.attr("id", "clip-above")
		.append("path") 
		.attr("d", area.y0(0));

	svg.append("path") 
		.attr("class", "area above")
		.attr("clip-path", "url(#clip-above)")
		.attr("d", area.y0(function(d) { 
			return yScale(d["<b>歲出淨額</b> "]); })); 

	svg.append("path") 
		.attr("class", "area below") 
		.attr("clip-path", "url(#clip-below)")
		.attr("d", area); 

	svg.append("path") 
		.attr("class", "line")
		.attr("d", line); 
}

function rectInteract(that, data) {

	d3.select(".yearPath").remove(); 

	var location = d3.mouse(that); 

	var xCoordinate = location[0]; 
	var year = xScale.invert(xCoordinate); 
	
	g.append("line").attr("stroke","gray")
		.attr("class", "yearPath")
		.attr("x1", xScale(year))
		.attr("y1", 0)
		.attr("x2", xScale(year)) 
		.attr("y2", height);

	update(xCoordinate, data); 
}

function update(xCoordinate, data) { 
	
	var theItem; 
	
	for (var i = 0; i < data.length; i++) { 

		if (xCoordinate == Math.floor(xScale(data[i].key))) { 
			theItem = data[i]; 
		}
	}

	if (typeof(theItem) == 'undefined') {}
	else { 
		var values = theItem.values[0];
		$("#yearText").text(values.年度.getFullYear());
		$("#incomeText").text(values["<b>歲入淨額</b> "].toLocaleString());
		$("#incomePercentage").text(values["歲入淨額占GDP比率 "].toFixed(1) + "%");
		$("#expenseText").text(values["<b>歲出淨額</b> "].toLocaleString());
		$("#expensePercentage").text(values["歲出淨額占GDP比率 "].toFixed(1) + "%");
		$("#leftoverText").text(values["<b>餘絀</b> "].toLocaleString());
		$("#leftoverPercentage").text(values["餘絀占GDP比率 "].toFixed(1) + "%");
	}


}

