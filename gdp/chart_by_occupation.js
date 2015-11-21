var n = 15, // number of layers
	m = 8; // number of sample per layer

var margin = {top:30, right:40, bottom:30, left:60}, 
	height = 600 - margin.top - margin.bottom, 
	width = 680 - margin.left - margin.right; 

var xScale = d3.scale.ordinal() 
	.domain(d3.range(2007, 2015))
	.rangeRoundBands([0, width-100], 0.08); 

var yScale = d3.scale.linear() 
	.domain([0, 30000000])
	.range([height, 0]); 

var rScale = d3.scale.pow() 
	.exponent(1/4)
	.domain([0, 2000000])
	.range([0, 18]);

var colorScale = d3.scale.category10();

var xAxis = d3.svg.axis() 
	.scale(xScale)
	.orient("bottom"); 

var yAxis = d3.svg.axis() 
	.scale(yScale)
	.orient("left")
	.ticks(12)
	.tickFormat(function(d) { return parseInt(d)/1000000 + "百萬"; }); 

var svg = d3.select("#chart").append("svg") 
	.attr("width", width + margin.left + margin.right + 400)
	.attr("height", height + margin.bottom + margin.top)
	.append("g") 
	.attr("transform", "translate(" + margin.left +", " + margin.top + ")"); 

var g = svg.append("g") 
	.attr("width", 300)
	.attr("transform", "translate(" + 590 +", 0)"); 

var xLabels = g.selectAll(".xLabel")
	.data(["第一季", "第二季", "第三季", "第四季"])
	.enter().append("text") 
	.attr("class", "xLabel")
	.attr("x", function(d, i) { return 100 * i - 75; })
	.attr("y", 20)
	.text(function(d) { return d; }); 

var yLabels = g.selectAll(".yLabel")
	.data(["農業","工業", "服務業", "礦業及土石採取業", "製造業", "電力及燃氣供應業", "用水供應及污染整治業",
			 "批發及零售業", "運輸及倉儲業", "資訊及通訊傳輸業", "金融及保險業", "不動產及住宅服務業", "公共行政及國防",
			  "其他"])
	.enter().append("text")
	.attr("class", "yLabels") 
	.attr("x", 330)
	.style("font-size", "12px")
	.attr("y", function(d, i) { return i * 38 + 50; })
	.text(function(d) { return d; });

d3.json("gdp_by_occupation_amount.json", function(data) { 
	// console.log(data); 

	svg.append("g") 
		.attr("class", "xAxis") 
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text"); 

	svg.append("g") 
		.attr("class", "yAxis") 
		.call(yAxis)
		.append("text")
		.attr("x", -5) 
		.attr("y", -20) 
		.attr("dy", "0.71em")
		.attr("transform", "rotate(90)")
		.text("單位(百萬)");

	cleanUpData(data); 

}); 

function cleanUpData(data) { 

	var dataByOccupation = []; 
	var dataByQuarter = [];

	data = data.GenericData.DataSet.Series;
	// console.log(data); 

	for (var i = 0; i < data.length/2; i++) {
		dataByOccupation[i] = data[i*2]; 
		dataByQuarter[i] = data[i*2+1];
	}

	var OccupationList = [],
		OccupationContent = [],
		QuarterList = [], 
		QuarterContent =[];
	for(var m = 0; m < dataByOccupation.length; m++) { 
		OccupationList[m] = dataByOccupation[m]["-ITEM"];
		OccupationContent[m] = dataByOccupation[m]["SeriesProperty"]["Obs"]; 
		QuarterList[m] = dataByQuarter[m]["-ITEM"];
		QuarterContent[m] = dataByQuarter[m]["SeriesProperty"]["Obs"]; 
	}

	for(var i = 0; i < OccupationList.length; i++) {
		OccupationContent[i].name = OccupationList[i];
	}
	
	drawInitialRects(OccupationContent); 
	drawInitialCircles(QuarterList, QuarterContent, 0); 

	var yearLabels = svg.selectAll("yearLabel")
	.data(d3.range(2007, 2015))
	.enter().append("text") 
	.attr("class", "yearLabel")
	.attr("id", function(d) { return "year-" + d })
	.attr("x", function(d, i) { return i * 62; })
	.attr("y", height + margin.top)
	.text(function(d) { return d; })
	.on("click", function(d) { 
		d3.selectAll(".yearLabel").style("fill", "#000").style("font-size", "16px").style("font-weight", "normal");
		d3.select(this).style("fill", "red").style("font-size", "25px").style("font-weight", "bold");
		adjustCircles(QuarterList, QuarterContent, d); 
	});

	adjustCircles(QuarterList, QuarterContent, 2014);

}

function drawInitialRects(itemContent) {

 	for(var m = 0; m < itemContent.length; m++) {
		for(var n = 0; n < itemContent[0].length; n++) {
			itemContent[m][n].x = parseInt(itemContent[m][n]["-TIME_PERIOD"]) - 2007;
			itemContent[m][n].y = parseInt(itemContent[m][n]["-OBS_VALUE"].split(",").join(""));
			delete itemContent[m][n]["-OBS_VALUE"];
			delete itemContent[m][n]["-TIME_PERIOD"]; 
		}
	}

	itemContent.shift(); 

	var stack = d3.layout.stack(); 
	stack(itemContent); 
	
	var layer = svg.selectAll(".layer")
		.data(itemContent)
		.enter().append("g") 
		.attr("class", "layer") 
		.style("fill", function(d, i) {
			return colorScale(i); 
		}); 

	var rect = layer.selectAll("rect")
		.data(function(d) { return d; })
		.enter().append("rect") 
		.attr("x", function(d) { return xScale(d.x + 2007)})
		.attr("y", height)
		.attr("width", xScale.rangeBand())
		.attr("height", 0); 

	rect.transition() 
		.delay(function(d, i) {return i * 10; })
		.attr("y", function(d) { return yScale(d.y0 + d.y); 
		})
		.attr("height", function(d) { return yScale(d.y0) - 
				yScale(d.y0 + d.y); }); 


	d3.selectAll("input").on("change", change); 

	var timeout = setTimeout(function() { 
		d3.select("input[value=\"grouped\"]")
			.property("checked", true).each(change); 
		}, 2000); 

		function change() { 
			clearTimeout(timeout); 
			if (this.value === "grouped")
				transitionGrouped(); 
			else transitionStacked(); 
		}

	function transitionGrouped() { 

		rect.transition() 
			.duration(500)
			.delay(function(d, i) { return  i * 20; })
			.attr("x", function(d, i, j) { 
				return (xScale(d.x + 2007) + xScale.rangeBand()/ (2 *n) * j)
			})
			.attr("width", xScale.rangeBand() / 15)
			.transition() 
			.duration(500)	
			.attr("y", function(d) { return yScale(d.y); })
			.attr("height", function(d) { return height - yScale(d.y); });
			
		redraw(10000000);

		rect.transition() 
			.delay(1000)
			.attr("y", function(d) { return yScale(d.y); })
			.attr("height", function(d) { return height - yScale(d.y); }); 
	}

	function transitionStacked() { 

		redraw(30000000);
		rect.transition() 
			.duration(500)
			.delay(function(d, i) { return i * 20; })
			.attr("y", function(d) { return yScale(d.y + d.y0); })
			.attr("height", function(d) { return yScale(d.y0) - (yScale(d.y + d.y0)); })
			.transition() 
			.delay(1000)
			.attr("x", function(d) { return xScale(d.x + 2007); })
			.attr("width", function(d) { return xScale.rangeBand(); }); 

	}

	function redraw(max) { 

		yScale = d3.scale.linear().range([height, 0]).domain([0, max]); 
		yAxis = d3.svg.axis() 
			.scale(yScale)
			.orient("left") 
			.ticks(10)
			.tickFormat(function(d) { return d/1000000 + "百萬"; })
		svg.select(".yAxis").transition().duration(500).call(yAxis); 

	}

}

function drawInitialCircles(QuarterList, QuarterContent, yearIndex) { 

	console.log(yearIndex); 
	
	var initialData = [];
	var minItemIndex = yearIndex * 4; 
	var maxItemIndex = yearIndex * 4 + 4
	for(var i = 0; i < QuarterContent.length; i++) {
		initialData.push(QuarterContent[i].slice(minItemIndex, maxItemIndex));
	}

	initialData.shift(); 
	console.log(initialData);

	for (var i = 0; i < initialData.length; i++) { 

		for (var m = 0; m < initialData[0].length; m++) {
			initialData[i][m] = parseInt(initialData[i][m]["-OBS_VALUE"].split(",").join("")); 
		} 
	}

	console.log(initialData);

	if (yearIndex == 0) {
		var entity = g.selectAll(".entity")
			.data(initialData)
			.enter().append("g") 
			.attr("class", "entity")
			.style("fill", function(d, i) {
				return colorScale(i); 
			})
			.on("mouseover", function() {
				var entityClass = d3.select(this).attr("class");
				$(".circle").hide();
				$(".circleText").show(); 
			})
			.on("mouseleave", function() { 
				$(".circleText").hide();
				$(".circle").show();
			})
		
		var circle = entity.selectAll("circle")
			.data(function(d) { return d; })
			.enter().append("circle") 
			.attr("class", "circle")
			.attr("cx", function(d, i) { return 100 * i - 50; })
			.attr("cy", function(d, i, j) { return j * 38 + 42; })
			.attr("r", function(d) { return rScale(d); });

		var circleText = entity.selectAll("text")
			.data(function(d) { return d; })
			.enter().append("text") 
			.attr("class", "circleText")
			.attr("x", function(d, i) { return 100 * i - 73; })
			.attr("y", function(d, i, j) { return j * 38 + 47; })
			.text(function(d) { return d + " 百萬"; });

		$(".circleText").hide();
	}
	else { 
		showChange(initialData); 
	}
}

function showChange(data) {

	console.log(data); 

	d3.selectAll(".entity")
		.data(data); 

	var dataArray = []; 
	var dataArrayChild = []; 
	for (var i = 0; i < data.length; i++) { 
		for (var m = 0; m < data[0].length; m++) {
			dataArray.push(data[i][m]);
		}
	}

	d3.selectAll("circle")
		.data(dataArray)
		.transition()
		.duration(1000)
		.attr("r", function(d) { return rScale(d); }); 

	d3.selectAll(".circleText")
		.data(dataArray) 
		.transition() 
		.duration(1000)
		.text(function(d) { return d + " 百萬"; });
}


function adjustCircles(QuarterIndex, QuarterContent, year) { 
	yearIndex = year - 2007; 

	drawInitialCircles(QuarterIndex, QuarterContent, yearIndex);
}
	













