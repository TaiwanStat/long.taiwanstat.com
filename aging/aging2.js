var margin = {top: 20, right: 30, bottom: 30, left: 80}, 
	width = 900 - margin.right - margin.left, 
	height = 530 - margin.top - margin.bottom; 

var xScale = d3.scale.linear() 
	.domain([0, 30])
	.range([0, width]); 

var yScale = d3.scale.linear() 
	.domain([0, 1000000])
	.range([height, 0]); 

var rScale = d3.scale.linear() 
	.domain([0, 3500000])
	.range([0, 80]); 

var colorScale = d3.scale.category20(); 

var xAxis = d3.svg.axis() 
	.scale(xScale)
	.orient("bottom")
	.ticks(10); 

var yAxis = d3.svg.axis() 
	.scale(yScale) 
	.orient("left")
	.tickFormat(function(d) { return d / 10000; }); 

var svg = d3.select("#chart").append("svg") 
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom) 
	.append("g") 
	.attr("transform", "translate(" + margin.left +", " + margin.top + ")"); 

var g = svg.append("g");

d3.csv("taiwan_population-csv.csv", function(data) { 

	data.forEach(function(d) { 
		d.year = parseInt(d.year) + 1911; 
	});

	svg.append("g") 
		.attr("class", "xAxis") 
		.attr("transform", "translate(0, " + height + ")")
		.call(xAxis)
		.append("text") 
		.attr("x", width - 150)
		.attr("y", -10)
		.text("百分比(%)");

	svg.append("g") 
		.attr("class", "yAxis") 
		.call(yAxis)
		.append("text") 
		.attr("class", "yAxisText")
		.attr("y", -20)
		.attr("dy", "0.71em")
		.attr("transform", "rotate(90)")
		.text("人數(萬)");

	CleanUpData(); 

});

function CleanUpData() { 
	
	var dateData = []; 
	var totalPopData = []; 
	var youngPopData = []; 
	var middlePopData = []; 
	var oldPopData = [];
	var yearIndex = 0; 
	
	d3.csv("taiwan_population-csv.csv", function(data) { 

	var cityNames = d3.keys(data[0]).slice(2);  

	for (var i = 0; i < cityNames.length; i++) { 
		var cityName = cityNames[i]; 

		data.forEach(function(d) { 
			d[cityName] = parseInt(d[cityName].split(",").join(""));
		});
	}

	data.forEach(function(d) { 
		d.year = parseInt(d.year) + 1911; 
		d.month = parseInt(d.month); 
		
	});

	var allKeys = d3.keys(data[0]);
	var dateList = allKeys.slice(0, 2); 
	var totalPopList = allKeys.slice(2, 33); 
	var youngPopList = allKeys.slice(33, 64); 
	var middlePopList = allKeys.slice(64, 95); 
	var oldPopList = allKeys.slice(95, 126);

	for (var i = 0; i < data.length; i++) { 
		var totalResult = [],
			youngResult = [],
			middleResult = [],
			oldResult =[]; 
		for( var w = 0; w < totalPopList.length; w++) {
			totalResult.push(data[i][totalPopList[w]]); 
			youngResult.push(data[i][youngPopList[w]]); 
			middleResult.push(data[i][middlePopList[w]]); 
			oldResult.push(data[i][oldPopList[w]]); 
		}
		totalPopData.push(totalResult); 
		youngPopData.push(youngResult); 
		middlePopData.push(middleResult); 
		oldPopData.push(oldResult); 
	}

	for (var i = 0; i < data.length; i++) { 
		var dateResult = [];

		for (var m = 0; m < dateList.length; m++) { 
			dateResult.push(data[i][dateList[m]]);
		}

		dateData.push(dateResult); 
	}

	var content = d3.map([
		totalPopData, 
		youngPopData, 
		middlePopData, 
		oldPopData
	]); 

	drawInitialCircles(content, dateData, cityNames, totalPopList, 1)
}); 


}

function drawInitialCircles(content, dateData, cityNames, totalPopList, index) { 
	
	var percentage = getPercentageData(content, index);

	var yearIndex = 0; 

	var formattedDateList = []; 
	 for( var i = 0; i < dateData.length; i++ ) { 
		formattedDateList.push(dateData[i][0] + "-" + dateData[i][1]);
	}

	var title = svg.append("text") 
		.attr("class", "title")
		.attr("dy", ".71em")
		.attr("x", 300)
		.attr("y", 30)
		.text("1992-1"); 

	var interval = 100; 

	function makeCallBack(percentage, identification) {  
		set_switch_year = setInterval(function() { 
			showAnimation(content, identification, yearIndex, percentage);
			update(yearIndex);
			yearIndex++;  
			$(".mode").attr("disabled", true);
			if (yearIndex < 193) {}
			else {
				clearTimeout(set_switch_year);
				$(".mode").attr("disabled", false);
			}
		}, interval);
	}

	$("#start_demo").click(function() {
		var dataType = d3.selectAll("circle").attr("class");
		var identification = +dataType.slice(1); 
		var percentage = getPercentageData(content, identification); 
		makeCallBack(percentage, identification);
	});

	$("#reset_demo").click(function() { 
		var dataType = d3.selectAll("circle").attr("class");
		var identification = +dataType.slice(1); 
		var percentage = getPercentageData(content, identification); 
		clearTimeout(set_switch_year); 
		yearIndex = 0; 
		update(yearIndex);
		showAnimation(content, identification, 0, percentage);
	});

	$("#stop_demo").click(function() { 
		$(".mode").attr("disabled", false);
		clearTimeout(set_switch_year); 
	})

	g.selectAll("circle") 
	.data(content["_"][index][yearIndex])
	.enter() 
	.append("circle") 
	.attr("stroke", "none")
	.attr("opacity", 0.8)
	.attr("class", function(d) { return "d" + index; })
	.attr("id", function(d, i) { 
		return "a" + i; 
	})
	.attr("cx", function(d, i) { 
		return xScale(percentage[0][i]); })
	.attr("cy", function(d, i) { 
		return yScale(d); 
	})
	.attr("r", function(d, i) { 
		return rScale(content["_"][0][0][i]); 
	})
	.attr("fill", function(d, i) { 
		return colorScale(totalPopList[i]);
	})
	.on("mousemove", computeValue)
	.on("mouseout", removePath);


	d3.selectAll("input").on("click", change);
	function change() { 
		if (this.value == "old_population") {
			var index = 3; 

	xScale.domain([0, 18]); 
	xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(10); 
	d3.select(".xAxis").transition().duration(1000).call(xAxis); 
	yScale.domain([0, 500000]); 
	yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10); 
	d3.select(".yAxis").transition().duration(1000).call(yAxis); 
	var percentage = getPercentageData(content, index); 
	update(index); 
	showAnimation(content, index, 0, percentage);

		var percentageData = getPercentageData(content, index); 
		transitionCircles(content, percentageData, index, 3); 
		}
		else if (this.value == "middle_population") {
			var index = 2; 

	xScale.domain([0, 80]); 
	xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(10); 
	d3.select(".xAxis").transition().duration(1000).call(xAxis); 
	yScale.domain([0, 3000000]); 
	yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10); 
	d3.select(".yAxis").transition().duration(1000).call(yAxis); 
	var percentage = getPercentageData(content, index); 
	update(index); 
	showAnimation(content, index, 0, percentage);

		var percentageData = getPercentageData(content, index); 
		transitionCircles(content, percentageData, index, 2); 
		}
		else {
			var index = 1; 	

	xScale.domain([0, 30]); 
	xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(10); 
	d3.select(".xAxis").transition().duration(1000).call(xAxis); 
	yScale.domain([0, 1000000]); 
	yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10); 
	d3.select(".yAxis").transition().duration(1000).call(yAxis); 
	var percentage = getPercentageData(content, index); 
	update(index); 
	showAnimation(content, index, 0, percentage);

		var percentageData = getPercentageData(content, index); 
		transitionCircles(content, percentageData, index, 1); 
		}
	}

	function computeValue() { 

	d3.select(this)
		.attr("stroke-width", "2px")
		.attr("stroke", "black");

	var xCoordinate = d3.select(this).attr("cx"); 
	var yCoordinate = d3.select(this).attr("cy"); 
	var radius = d3.select(this).attr("r"); 
	var identification = d3.select(this).attr("id"); 
	identification = identification.slice(1);

	$("#cityName").text(cityNames[identification]);
	$("#total_population").text(Math.floor(rScale.invert(radius)).toLocaleString());
	$("#young_population").text(content["_"][1][yearIndex][identification].toLocaleString()); 
	$("#middle_population").text(content["_"][2][yearIndex][identification].toLocaleString());
	$("#old_population").text(Math.floor(yScale.invert(yCoordinate)).toLocaleString());
	$("#old_percentage").text(parseFloat(xScale.invert(xCoordinate)).toFixed(2) + "%");
}

	function update(yearIndex) {
	d3.select(".title").text(formattedDateList[yearIndex]); 
	}
}

function getPercentageData(content, index) { 

	var percentage = [];

		total_content = content["_"][0]; 
		spec_content = content["_"][index]; 

		for (var m = 0; m < total_content.length; m++) {
			var result = []; 
			for (var n = 0; n < total_content[m].length; n++) {
				result.push(+parseFloat(spec_content[m][n]/total_content[m][n] * 100).toFixed(2)); 
			}
			percentage.push(result); 
		}

	return percentage; 
}


function transitionCircles(content, percentageData, index, dataType) { 

	d3.selectAll("circle") 
		.data(content["_"][index][0])
		.attr("class", function(){ return "d" + dataType; })
		.transition() 
		.duration(2000)
		.attr("cx", function(d, i) { 
			return xScale(percentageData[0][i]); })
		.attr("cy", function(d) { 
			return yScale(d); });
}

function showAnimation(content, identification, yearIndex, percentage) {

	d3.selectAll("circle")
		.data(content["_"][identification][yearIndex])
		.transition() 
		.duration(500)
		.attr("cx", function(d, i) { 
			return xScale(percentage[yearIndex][i]); 
		})
		.attr("cy", function(d, i) { 
				return yScale(d); 
		})
		.attr("r", function(d, i) { 
			return rScale(content["_"][0][yearIndex][i]); 
		});
}

function removePath() { 
	d3.selectAll(".xyTrace").remove() 
	d3.selectAll("circle").attr("stroke-width", "0px"); 
}



