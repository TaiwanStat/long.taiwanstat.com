var margin = {top:20, right: 20, bottom: 250, left: 70}, 	//////units: 十億 ---> 兆
	width = 900 - margin.right - margin.left, 
	height = 700 - margin.top - margin.bottom; 

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
	.orient("left")
	.tickFormat(function(d) { return d/100000000 + "千億"; }); 

var line = d3.svg.line() 
	.interpolate("basis")
	.x(function(d) { return xScale(d.date); })
	.y(function(d) { 
		if (0 > d.values) { 
			return height; 
		}
		else if (d.values == '          －') { 
			return height; 
		}
		else {
			return yScale(d.values)
		}
	});

var svg = d3.select("#chart").append("svg") 
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g") 
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 

var pie_width = 300; 
var pie_height = 300; 

var pieChartSVG = d3.select("#pieChart").append("svg")
	.attr("class", "pieChart")
	.attr("width", pie_width)
	.attr("height", pie_height);

var g = svg.append("g");

d3.csv("taxation.csv", function(data) { 

	var taxationList = d3.keys(data[0]); 	

	var nestedData = d3.nest().key(function(d) { return d.年; }).entries(data);
	var parseYearMonth = d3.time.format("%Y年%m月").parse;
	var annualData = []; 

	for (var i = 0; i < nestedData.length; i++) { 
		nestedData[i].key = nestedData[i].key.replace(" ", "");
		var remnant1 = parseInt(nestedData[i].key.split("年")[0]) + 1911;
		var remnant2 = nestedData[i].key.split("年")[1];
		if (remnant2 == "") { 
			annualData.push(nestedData[i]); 
		}
		nestedData[i].key = parseYearMonth(remnant1 + "年" + remnant2); 
	} 

	for ( var i = 0; i < nestedData.length; i++) { 
		if (nestedData[i].key == null) { 
			nestedData.splice(i, 1);
		}
	}

	for (var i = 0; i < data.length; i ++) { 					//// setting up yAxis domain
		 for (var m = 0; m < taxationList.length; m++) { 
		 	if (data[i][taxationList[m]] == "          －" ) {
		 	}
		 	else {
		 		if (typeof(data[i][taxationList[m]]) == 'undefined') {}
		 		else if (taxationList[m] == '年') { 
		 			delete data[i][taxationList[m]]; 
				}
		 		else {	
		 		data[i][taxationList[m]] = parseInt(data[i][taxationList[m]].split(",").join(""));
		 		} 
		 	}
		 }
	}

	var dateList = []; 
	for (var i = 0; i < nestedData.length; i++) { 
		dateList.push(nestedData[i].key); 
	}

	var xScaleMin = new Date(1974, 0, 1); 
	var xScaleMax = new Date(2015, 6, 1); 
	xScale.domain([xScaleMin, xScaleMax]);
	yScale.domain([0, 100000000]); 

	svg.append("g")
		.attr("class", "xAxis")
		.attr("transform", "translate(0, " + height + ")")
		.call(xAxis);

	svg.append("text") 
		.attr("x", 750)
		.attr("y", 450)
		.text("民國(年)");

	svg.append("text") 
		.attr("class", "yearLabel")
		.attr("x", 50)
		.attr("y", 60)
		.text("民國63年");
		
	svg.append("g") 
		.attr("class", "yAxis")
		.call(yAxis);

	drawInitialPieChart(nestedData, dateList, taxationList); 
	drawLineGraph(nestedData, taxationList); 
	writeList(nestedData); 
});

function writeList(nestedData) { 
	for (var i = 0; i < nestedData.length; i++) { 
		nestedData[i].values[0]=d3.entries(nestedData[i].values[0]);
	}

	var itemText = svg.selectAll("g.itemText")
		.data(nestedData[0].values[0]) /////index
		.enter() 
		.append("g")
		.attr("class", "itemText")
		.attr("id", function(d) { return d.key + "Text"; })
		.attr("transform", function(d, i) { return "translate("
			 + (Math.floor(i/9) * 227 - 55) + ", " + (480 + i%9 * 25) + ")"; })
		.on("click", function() { 
			var textIdentification = d3.select(this).attr('id');
			var identification = textIdentification.slice(0, textIdentification.length - 4); 
			lineInteract(identification, textIdentification); 
		});

	itemText.append("circle")
		.attr("class", "itemCircle")
		.attr("cx", -10)
		.attr("cy", -5)
		.attr("r", 5)
		.attr("fill", function(d) { return colorScale(d.key); }); 

	itemText.append("text") 
		.attr("class", "itemName")
		.data(nestedData[0].values[0])
		.text(function(d) { return d.key; });

	itemText.append("text") 
		.attr("class", "itemValue")
		.attr("x", 130); 
}

function drawLineGraph(nestedData, taxationList) {

	var area_mask_width = width, 
	area_mask_height = height; 

	var area_mask = svg.append("rect").attr("class", "area_mask") 
		.attr("width", width)
		.attr("height", height)
		.on("mousemove", function() {
			var that = this;
			rectInteract(that, nestedData); ////including changing year label
		}); 

		taxationList.shift(); 

	var taxationData = [];  ////// organizat data by taxation type. 

	var taxations = taxationList.map(function(name) { 
		return { 
			name: name, 
			values: nestedData.map(function(d) { 
				return {
					date: d.key,
					values: d.values[0][name] 
				};
			})
		};
	});

	var taxationItem = svg.selectAll(".taxationType")
		.data(taxations)
		.enter().append("g"); 

	taxationItem.append("path")
		.attr("class", "line") 
		.attr("id", function(d) { return d.name; })
		.attr("d", function(d) { 
			return line(d.values);
		})
		.style("stroke", function(d) { return colorScale(d.name); }); 
}	

function drawInitialPieChart(nestedData, dateList, taxationList) { 

	var taxationData = []; 

	for (var m = 0; m < dateList.length; m++) { 
		var taxationType = []; 
		for (var i = 0; i < taxationList.length; i++) {
			taxationType.push(nestedData[m].values[0][taxationList[i]]); 	
		}
		taxationData.push(d3.map([taxationType, nestedData[m].key]));  
	}

	for (var i = 0; i < taxationData[0]["_"][0].length; i++) { 
		if (taxationData[0]["_"][0][i] == "          －" || 
			typeof(taxationData[0]["_"][0][i]) == 'undefined') { 
			taxationData[0]["_"][0][i] = 0; 
		} 
	}

	var pie_width = 300; 
	var pie_height = 300; 

	var innerRadius = 0, 
		outerRadius = (pie_width - 20) / 2;

	var pie = d3.layout.pie()
		.value(function(d) { return d; }); 

	var arc = d3.svg.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius); 

	taxationData[0]["_"][0].shift(); 

	var arcs = d3.select(".pieChart").selectAll("g.arc")
		.data(pie(taxationData[0]["_"][0]))
		.enter() 
		.append("g") 
		.attr("class", "arc")
		.attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");

	var path = arcs.append("path")
		.attr("fill", function(d, i) { return colorScale(i); })
		.each( function(d) { this._current = d; })
		.attr("d", arc); 
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

	var theItem; 

	for (var i = 0; i < data.length; i++) { 
		if (xCoordinate == Math.floor(xScale(data[i].key))) { 
			theItem = data[i]; 
		}
	} 

	if (typeof(theItem) == 'undefined') {}
	else {
		$(".yearLabel").text("民國" + (theItem.key.getFullYear() - 1911) + "年" + (theItem.key.getMonth() + 1) + "月"); 
		transitionPieChart(theItem); 

		console.log(theItem);
		d3.selectAll(".itemValue")
			.data(theItem.values[0])
			.text(function(d) { return parseFloat(d.value/10000000).toFixed(3) + "百億"; }); 
	}	
}

function transitionPieChart(theItem) { 

	var arc = d3.svg.arc() 
		.innerRadius(0)
		.outerRadius(140); 

	var pie = d3.layout.pie() 
		.value(function(d) { return d; });

	var ratioValues = []; 

	if (typeof(theItem) == 'undefined') {}
	else { 
		var ratio = theItem.values[0]; //// list of taxations and ratios
		for (var i = 0; i < ratio.length; i++) { 
			if (ratio[i].value == "          －") { 
				ratio[i].value = 0; 
			}
			ratioValues.push(ratio[i].value);
		}

	pieChartSVG.selectAll("path").data(pie(ratioValues))
		.transition()
		.duration(10) 
		.attrTween("d", arcTween); 

	function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) { return arc(i(t));};
	    }     
	}
}

function lineInteract(identification, textIdentification) { 

	if($("#" + identification + "").attr("display") != 'none') { 
		$("#" + identification + "").attr("display", 'none'); 
		$("#" + textIdentification + ".itemName" + "").attr("opacity", 0);
	} 
	else { 
		$("#" + identification + "").attr("display", true);
	}
}




