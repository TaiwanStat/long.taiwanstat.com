var margin = {top: 20, right: 30, bottom: 30, left: 50}, 
	width = 900 - margin.right - margin.left, 
	height = 530 - margin.top - margin.bottom; 

var xScale = d3.scale.linear() 
	.domain([0, 18])
	.range([0, width]); 

var yScale = d3.scale.linear() 
	.domain([0, 600000])
	.range([height, 0]); 

var rScale = d3.scale.linear() 
	.domain([0, 3500000])
	.range([0, 80]); 

var colorScale = d3.scale.category20(); 

var xAxis = d3.svg.axis() 
	.scale(xScale)
	.orient("bottom"); 

var yAxis = d3.svg.axis() 
	.scale(yScale) 
	.orient("left")
	.tickFormat(function(d) { return d / 10000 + "萬"; }); 

var svg = d3.select("#chart").append("svg") 
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom) 
	.attr("transform", "translate(" + margin.left +", " + margin.top + ")"); 

var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + ", 0)");

d3.csv("taiwan_population-csv.csv", function(data) { 
	// console.log(data); 
	

	data.forEach(function(d) { 
		d.year = parseInt(d.year) + 1911; 
	});

	svg.append("g") 
		.attr("class", "xAxis") 
		.attr("transform", "translate(" + margin.left + ", " + height + ")")
		.call(xAxis)
		.append("text") 
		.attr("x", width - 150)
		.attr("y", -10)
		.text("高齡化程度(%)");  

	svg.append("g") 
		.attr("class", "yAxis") 
		.attr("transform", "translate(" + margin.left + ", 5)")
		.call(yAxis)
		.append("text") 
		.attr("y", -20)
		.attr("dy", "0.71em")
		.attr("transform", "rotate(90)")
		.text("老年人口數(65歲以上)");


	CleanUpData(); 

});


function CleanUpData() { 
	
	var totalPopData = []; 
	var youngPopData = []; 
	var middlePopData = []; 
	var oldPopData = [];
	
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

	// var dateList = []; 
	// for( var i = 0; i < data.length; i++ ) { 
	// 	dateList.push(data[i].year + data[i].month / 12);
	// }
	
	var allKeys = d3.keys(data[0]); 
	
	var totalPopList = allKeys.slice(2, 33); 
	var youngPopList = allKeys.slice(33, 64); 
	var middlePopList = allKeys.slice(64, 95); 
	var oldPopList = allKeys.slice(95, 126);
	
	for (var i = 0; i < data.length; i++ ) {

		var dateResult = [],
			 totalResult = [],
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

	var content = d3.map([
		{totalPopulation: totalPopData}, 
		{youngPopulation: youngPopData}, 
		{middlePopulation: middlePopData}, 
		{oldPopulation: oldPopData}]); 

	
	drawCircles(totalPopData, oldPopData, middlePopData, totalPopList, data, youngPopData, content);



function drawCircles(totalPopData, oldPopData, middlePopData, totalPopList, data, youngPopData, content) {


	var yearIndex = 0; 
	var oldPercentageData = [] 

	for (var m = 0; m < totalPopData.length; m++) {

		var result = []; 

		for (var n = 0; n < totalPopData[m].length; n++) {

			result.push(oldPopData[m][n]/totalPopData[m][n] * 100); 

		}

		oldPercentageData.push(result); 

	}

	var formattedDateList = []; 
	for( var i = 0; i < data.length; i++ ) { 
		formattedDateList.push(data[i].year + "-" + data[i].month);
	}

	window.focus(); 
	d3.select(window).on("keydown", function() { 
	switch (d3.event.keyCode) {
		case 37: if (yearIndex > 0) {
			yearIndex -= 1; break; 
		}
			else { break; }
		case 39: if (yearIndex < 194) {
			yearIndex += 1; break; 
		} 
			else { break; }
	}
		update();
	}); 

	var interval = 100; 

	function makeCallBack() {  
		set_switch_year = setInterval(function() { 
			showAnimation(yearIndex, totalPopData, oldPopData, oldPercentageData, data);
			update();
			yearIndex++;  
			if (yearIndex < 194) {}
			else{clearTimeout(set_switch_year);}
		}, interval);
	

	}
			

	$("#start_demo").click(function() {
		if (yearIndex == 194) { 
			yearIndex = 0; 
		}
		makeCallBack();
	});

	$("#reset_demo").click(function() { 
		// clearTimeout(set_switch_year); 
		// makeCallBack(0);
		yearIndex = 0; 
		showAnimation(yearIndex, totalPopData, oldPopData, oldPercentageData, data);
			update();
	});

	$("#stop_demo").click(function() { 
		clearTimeout(set_switch_year); 
	})
	
	g.selectAll("circle") 
		.data(totalPopData[yearIndex])
		.enter() 
		.append("circle") 
		.attr("stroke", "none")
		.attr("opacity", 0.8)
		.attr("class", function(d, i) { 
			return "a" + i; 
		})
		.attr("cx", function(d, i) { 
			return xScale(oldPercentageData[0][i]); })
		.attr("cy", function(d, i) { 
			return yScale(oldPopData[0][i]); 
		})
		.attr("r", function(d, i) { 
			return rScale(totalPopData[0][i]); 
		})
		.attr("fill", function(d, i) { 
			return colorScale(totalPopList[i]);
		})
		.on("mousemove", computeValue)
		.on("mouseout", removePath)
		.on("keydown", computeValue);

	var title = svg.append("text") 
		.attr("class", "title")
		.attr("dy", ".71em")
		.attr("x", 350)
		.attr("y", 30)
		.text("1992-1"); 

	function update() {

	// $(".title").text(""); 

		d3.select(".title").text(formattedDateList[yearIndex]); 
	// $("#total_population").text(Math.floor(rScale.invert(radius)).toLocaleString());
	// $("#young_population").text(youngPopData[yearIndex][identification].toLocaleString()); 
	// $("#middle_population").text(middlePopData[yearIndex][identification].toLocaleString());
	// $("#old_population").text(Math.floor(yScale.invert(yCoordinate)).toLocaleString());
	// $("#old_percentage").text(parseFloat(xScale.invert(xCoordinate)).toFixed(2) + "%");
		showAnimation(yearIndex, totalPopData, oldPopData, oldPercentageData, data); 

	}



	function computeValue() { 

	d3.select(this)
		.attr("stroke-width", "2px")
		.attr("stroke", "black");

	var xCoordinate = d3.select(this).attr("cx"); 
	var yCoordinate = d3.select(this).attr("cy"); 
	var radius = d3.select(this).attr("r"); 
	var identification = d3.select(this).attr("class"); 
	identification = identification.slice(1);
	console.log(identification);

	$("#cityName").text(cityNames[identification]);
	$("#total_population").text(Math.floor(rScale.invert(radius)).toLocaleString());
	$("#young_population").text(youngPopData[yearIndex][identification].toLocaleString()); 
	$("#middle_population").text(middlePopData[yearIndex][identification].toLocaleString());
	$("#old_population").text(Math.floor(yScale.invert(yCoordinate)).toLocaleString());
	$("#old_percentage").text(parseFloat(xScale.invert(xCoordinate)).toFixed(2) + "%");

}

}
	});
}


function showAnimation(yearIndex, totalPopData, oldPopData, oldPercentageData, data) {

	d3.selectAll("circle")
		.transition() 
		.duration(500)
		.attr("cx", function(d, i) { 
			return xScale(oldPercentageData[yearIndex][i]); 
		})
		.attr("cy", function(d, i) { 
			return yScale(oldPopData[yearIndex][i]); 
		})
		.attr("r", function(d, i) { 
			return rScale(totalPopData[yearIndex][i]); 
		});
}


function removePath() { 
	d3.selectAll(".xyTrace").remove() 
	d3.selectAll("circle").attr("stroke-width", "0px"); 
}








