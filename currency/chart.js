var margin = {top: 20, right: 30, bottom: 20, left: 30}, 
	height = 500 - margin.top - margin.bottom, 
	width = 960 - margin.left - margin.right; 

var xScale = d3.scale.ordinal() 
	.rangeRoundBands([0, width]); 

var yScale = d3.scale.linear() 
	.range([height, 0]); 

var xAxis = d3.svg.axis() 
	.scale(xScale)
	.orient("bottom"); 

var yAxis = d3.svg.axis() 
	.scale(yScale)
	.orient("left"); 

var svg = d3.select("#chart").append("svg") 
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g") 
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")"); 

d3.csv("currency.csv", function(data) { 
	d3.json("test.json", function(testData) { 
	var yearList = []; 
	for (var i = 0; i < data.length; i++) { 
		data[i].日期 = data[i].日期.replace(/\s/g, '');
		yearList.push(data[i].日期); 
	}
	var m = d3.map(data, function(d) { return d.日期; }); 

	xScale.domain(yearList); 
	yScale.domain([
		d3.min(data, function(d) { return parseInt(d["新臺幣券、輔幣券及外島地名券發行數額"]); }), 
		d3.max(data, function(d) { return parseInt(d["新臺幣券、輔幣券及外島地名券發行數額"]); })
	]);

	svg.append("g").attr("class", "xAxis").attr("transform", "translate(0, " + height + ")").call(xAxis); 
	svg.append("g").attr("class", "yAxis").call(yAxis);

	var m = d3.nest().key(function(d) {return d.日期; }).entries(data); 
	
	console.log(m);
	// var m = d3.map(data, function(d) { return d["日期"]; });
	// console.log(m)
	// console.log(data); 

	// var stack = d3.layout.stack()
	// 	.values(function(d) { return d; })
	// 	.x(function(d) { return xScale(d["日期"]); })
	// 	.y(function(d) { return parseInt(d["新臺幣券、輔幣券及外島地名券發行數額"]); }); 

	// stack(data); 
	// console.log(data);  



	// var stack = d3.layout.stack()
 //    .offset("wiggle")
 //    .values(function(d) { return d.values; });

 //    stack(testData); 
 //    console.log(testData); 

	});
});


