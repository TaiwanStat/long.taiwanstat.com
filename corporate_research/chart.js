// 表04_企業部門研發經費_依企業員工數分層(單位:百萬元),,,,,,,,,,,
// ,,,,員工數分層區分,,,,,,,

var margin = {top: 20, right: 30, bottom: 20, left: 80}, 
	width = 850 - margin.left - margin.right, 
	height = 500 - margin.top - margin.bottom; 

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

var color = d3.scale.ordinal() 
	.domain(d3.range(0, 9))
	.range(["#7f7f7f", "#e377c2", "#8c564b", "#9467bd", "#d62728", "#2ca02c", "#ff7f0e", "#1f77b4"]); 

var svg = d3.select("#chart").append("svg") 
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g") 
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var g = svg.append("g") 

var infoBox_width = 350;
var infoBox_height = 500;

var infoBox = d3.select("#info_box").append("svg") 
	.attr("width", infoBox_width)
	.attr("height", infoBox_height); 

d3.csv("corporate-data.csv", function(data) { 

	xScale.domain(data.map(function(d) { return parseInt(d.年); })); 
	yScale.domain([0, d3.max(data, function(d) { 
		return parseInt(d.研發經費.split(",").join("")); })]); 

	svg.append("g").attr("class", "xAxis").attr("transform", "translate(0, " + height + ")").call(xAxis); 
	svg.append("g").attr("class", "yAxis").call(yAxis); 

	color.domain(d3.keys(data[0]).filter(function(d) { return d != "年" && d != "執行部門代號" && d != "執行部門" && d!= "研發經費"; })); 

	var title = infoBox.append("text").attr("class", "title").attr("x", 0).attr("y", 50).text("研究經費"); 

	infoBox.selectAll(".dataText")
		.data(color.domain())
		.enter().append("text") 
		.attr("class", "dataText")
		.attr("x", 30)
		.attr("y", function(d, i) { return 470 - 50 * i; })
		.style("fill", function(d) { return color(d); });

	var datamap = organize(data); 	

	function organize(data) { 
	
		var result = color.domain().map(function(individual) { 
			return individual; 
		}); 

		var dataArray = []; 
		for (var i = 0; i < result.length; i++) { 
			var datum = {};
			datum.name = result[i];
			datum.values = []; 
			for (var m = 0; m < data.length; m++) { 
				var object = {}; 
				object.x = m; 
				object.y = data[m][result[i]].split(",").join("");
				datum.values.push(object)
			}	
			dataArray.push(datum); 
			}
			return dataArray; 
		}

	var stack = d3.layout.stack()
		.values(function(d) { return d.values; })
		.x(function(d) { return d.x; })
		.y(function(d) { return parseInt(d.y); });  

	stack(datamap); 

	var area = d3.svg.area()
		.interpolate("cardinal")
	    .x(function(d) { return xScale(d.x + 2001) + xScale.rangeBand()/2; })
	    .y0(function(d) { return yScale(d.y0); })
	    .y1(function(d) { return yScale(d.y0 + d.y); });

    svg.selectAll(".datapath")
	    .data(datamap)
		.enter().append("path")
		.attr("class", "datapath")
		.attr("d", function(d) { return area(d.values); })
		.attr("stroke", function(d, i) { 
			return color(d.name);
		})
		.attr("fill", function(d, i) { 
			return color(d.name); 
		});

	g.append("rect")
		.attr("class", "area_mask")
		.attr("width", width)
		.attr("height", height)
		.on("mousemove", rectInteract); 

	var dataGroups = infoBox.selectAll("g.dataGroup")
		.data(datamap)
		.enter().append("g")
		.attr("class", "dataGroup")
		.attr("x", 0)
		.attr("y", function(d, i) { return 50 + 30 * i; }); 

	function rectInteract() { 

		d3.select(".xTracer").remove(); 
		
		xCoordinate = d3.mouse(this)[0]; 

		g.append("line").attr("stroke", "#000")
			.attr("class", "xTracer")
			.attr("x1", xCoordinate)
			.attr("y1", 0)
			.attr("x2", xCoordinate)
			.attr("y2", height); 

		var targets = xScale.range().map(function(d) { return d + xScale.rangeBand(); }); 

		var index; 
		for (var i = 0; i < targets.length; i++) { 
			if (xCoordinate == targets[i]) { 
				index = i 
				index ? update(index) : console.log('false');			
			}
		}

		function update(index) { 
			var itemList = []; 

			for (var i = 0; i < datamap.length; i++) { 
				itemList.push(datamap[i].values[index]); 
			}

			d3.selectAll(".dataText")
				.data(itemList)
				.text(function(d, i) { 
					return color.domain()[i] + ": " + d.y; 
				}); 

		}

	}

});
