var margin = {top: 20, right: 230, bottom: 60, left: 70}, 
	height = 500 - margin.top - margin.bottom, 
	width = 1200 - margin.left - margin.right; 

var xScale = d3.scale.ordinal() 
	.rangeRoundBands([0, width], 0.1); 

var yScale = d3.scale.linear() 
	.range([height, 0]); 

var xAxis = d3.svg.axis() 
	.scale(xScale)
	.orient("bottom"); 

var yAxis = d3.svg.axis() 
	.scale(yScale)
	.orient("left")
	.tickFormat(function(d) { return d/100000000 + "億"; }); 

var color = d3.scale.ordinal()
    .range([ "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]); 

var svg = d3.select("#chart").append("svg") 
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g") 
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")"); 

var currency_tip = d3.tip() 
	.attr("class", "d3-tip")
	.offset([-10, 0])
	.html(function(d) { 
		var str = ""; 
		for (var i in color.domain()) { 
			str += ("<span style = font-size: 30px;>" + color.domain()[i] + ": " + parseInt(d[color.domain()[i]]) + "</span>" + "<br>"); 
		}
		return str;
	}); 

svg.call(currency_tip);

d3.csv("currency.csv", function(data) { 
	d3.json("test.json", function(testData) { 
	var yearList = [];

	d3.map(data, function(d) {  
		yearList.push(parseInt(d["日期"])); 
	});

	color.domain(d3.keys(data[0]).filter(function(d) { return d != "日期"; })); 
	
	data.forEach(function(d) { 
		var y0 = 0; 
		d.amount = color.domain().map(function(name) { return { name: name, y0: y0, y1: y0 += +d[name]}; })
		d.total = d.amount[d.amount.length - 1].y1; 
	});

	xScale.domain(data.map(function(d) { return d.日期.replace(/\s/g, ''); })); 
	yScale.domain([0, d3.max(data, function(d) { return d.total; })]);

	svg.append("g").attr("class", "xAxis").attr("transform", "translate(0, " + height + ")").call(xAxis);
		
	svg.append("g").attr("class", "yAxis").call(yAxis)
		.append("text").attr("y", -15).attr("dy", ".71em").attr("transform", "rotate(90)").text("台幣(元)"); 

	d3.selectAll(".xAxis text")
		.attr("dx", -20)
		.attr("transform", "rotate(-30)"); 

	var region = svg.selectAll("g.region")
		.data(data) 
		.enter().append("g") 
		.attr("class", "region")
		.attr("transform", function(d) { return "translate(" + xScale(d.日期.replace(/\s/g, '')) + ", 0)"; })
		.on('mouseover', currency_tip.show)
      	.on('mouseout', currency_tip.hide);

	region.selectAll(".dataRect")
		.data(function(d) { return d.amount; })
		.enter().append("rect")
		.attr("width", xScale.rangeBand())
		.attr("y", function(d) { return yScale(d.y1); })
		.attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); })
		.style("fill", function(d) { return color(d.name); });
	 
	var legendGroups = svg.selectAll(".legendGroup")
		.data(color.domain())
		.enter() 
		.append("g") 
		.attr("class", "legendGroup")
		.attr("transform", function(d, i) { 
			return "translate(900, " +  (50 + 30 * i) + ")"; }); 

	legendGroups.append("rect")
		.attr("width", 10)
		.attr("height", 10)
		.attr("fill", function(d, i) { return color(d); }); 

	legendGroups.append("text") 
		.attr("y", 10)
		.attr("x", 20)
		.text(function(d) { return d; }); 

	$("input").on("change", change);

	var modeTimeout = setTimeout(function() { 
		d3.select("input[value=\"grouped\"]")
		.property("checked", true).each(change); 
	}, 2000); 

	function change() { 
		console.log('eh');
	}



		
		

	});
});


