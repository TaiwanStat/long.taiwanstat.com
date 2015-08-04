var margin = {top:20, right: 30, bottom: 20, left: 30}, 	
	width = 960 - margin.right - margin.left, 
	height = 500 - margin.top - margin.bottom; 

var colorScale = d3.scale.category20(); 

var xScale = d3.scale.linear()
	.range([0, width]); 

var yScale = d3.scale.linear() 
	.range([height, 0]); 

var xAxis = d3.svg.axis() 
	.scale(xScale)
	.orient("bottom")
	.ticks(42); 

var yAxis = d3.svg.axis() 
	.scale(yScale)
	.orient("left"); 

var svg = d3.select("#chart").append("svg") 
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g") 
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 


d3.csv("taxation.csv", function(data) { 

	var taxationList = d3.keys(data[0]); 	

	for (var i = 0; i < data.length; i ++) { 					//// setting up yAxis domain
		 for (var m = 0; m < taxationList.length; m++) { 
		 	if (data[i][taxationList[m]] == "          －" ) {
		 	}
		 	else {
		 		if (typeof(data[i][taxationList[m]]) == 'undefined' || taxationList[m] == '年') {}
		 		else {	
		 		data[i][taxationList[m]] = parseInt(data[i][taxationList[m]].split(",").join(""));
		 		} 
		 	}
		 }
	}

	yScale.domain(d3.extent(data, function(d) { return d3.values(d); })); 

	var nestedData = d3.nest().key(function(d) { return d.年; }).entries(data);
	var parseYearMonth = d3.time.format("%Y年%m月").parse;

	for (var i = 0; i < nestedData.length; i++) { 
		nestedData[i].key = nestedData[i].key.replace(" ", "");
		nestedData[i].key = parseYearMonth(nestedData[i].key); 
	}

	xScale.domain(d3.extent(nestedData, function(d) { return d.key; }));  ///setting up xAxis domain

	svg.append("g")
		.attr("class", "xAxis")
		.attr("transform", "translate(0, " + height + ")")
		.call(xAxis); 

	svg.append("g") 
		.attr("class", "yAxis")
		.call(yAxis);

	var annualData = []; 

	for (var i = 0; i < nestedData.length; i++) { 

		if (nestedData[i].key == null) { 
			annualData.push(nestedData[i]); 
			nestedData.splice(i, 1); 
		}
	}

	drawLineGraph(nestedData); 
});


function drawLineGraph(nestedData) {

	console.log(nestedData);







}


