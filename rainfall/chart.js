var color = d3.scale.quantize() 
	.domain([0, 50])
	.range(["#D7DADD", "#97B9D0", "#638FAC","#417A9F", "#22638E", "#10517C", "#054A77", "#00436F"]); 

var graph_margin = {top: 20, right: 30, bottom: 30, left: 30}, 
	graph_height = 800 - graph_margin.top - graph_margin.bottom, 
	graph_width = 600 - graph_margin.left - graph_margin.right;

var graph = d3.select("#graph").append("svg")
	.attr("width", graph_width + graph_margin.left + graph_margin.right)
	.attr("height", graph_height + graph_margin.top + graph_margin.bottom)
	.append("g") 
	.attr("transform", "translate(" + graph_margin.left + ", " + graph_margin.top + ")"); 

var projection = d3.geo.mercator()
	.center([120.979531, 23.978567])
	.scale(10000)
	.translate([graph_width/2, graph_height/2.5]);

var path = d3.geo.path()
	.projection(projection);

var chart_margin = {top: 30, right: 30, bottom: 30, left: 50}, 
	chart_height = 500 - chart_margin.top - chart_margin.bottom, 
	chart_width = 600 - chart_margin.left - chart_margin.right;

var chart = d3.select("#chart").append("svg") 
	.attr("width", chart_width + chart_margin.left + chart_margin.right)
	.attr("height", chart_height + chart_margin.top + chart_margin.bottom)
	.append("g") 
	.attr("transform", "translate(" + chart_margin.left + ", " + chart_margin.top + ")"); 

var xScale = d3.scale.linear() 
	.range([0, chart_width]); 

var yScale = d3.scale.ordinal() 
	.rangeRoundBands([0, chart_height], 0.1); 

var xAxis = d3.svg.axis() 
	.scale(xScale) 
	.orient("top"); 

var yAxis = d3.svg.axis() 
	.scale(yScale)
	.orient("left"); 

d3.json('../../data/taiwan-map/twTown1982.topo.json', function(err, topo_data) {
	d3.csv("rainfall.csv", function(data) { 

		var topo = topojson.feature(topo_data, topo_data.objects["twTown1982.geo"]);
		var topomesh = topojson.mesh(topo_data, topo_data.objects["twTown1982.geo"], function(a, b){
			return a !== b;
		});

		topo.features.forEach(function(d, i) {
			if(d.properties.TOWNID === "1605" || d.properties.TOWNID === "1603" ||  d.properties.TOWNID=== "1000128") {
				topo.features.splice(i, 1);
			}
		})

		data = organize(data);  
		console.log(data); 

		function organize(data) { 

			var dataArray = []; 
			for (var i = 0; i < topo.features.length; i++) { 
				var result = []; 
				for (var m = 0; m < data.length; m++) { 
					if (topo.features[i].properties.TOWNNAME == data[m].Township) { 
						result.push(data[m]); 
					}
				}	
				dataArray.push(result);	
			}
			
			dataArray.forEach(function(town) { 
				town.sort(function(a, b) { return parseInt(b["Rainfall24hr"]) - parseInt(a["Rainfall24hr"]); });

				var average = 0; 
				for (var i = 0; i < town.length; i++) { 
					average += parseInt(town[i]["Rainfall24hr"]); 
				}
				town["average"] = average/town.length;
			}); 

			return dataArray; 
		
		}
	
		graph.selectAll('path.town')
			.data(topo.features)
			.enter()
			.append('path')
			.attr('class', function(d) { return d.properties.TOWNNAME; })
			.attr('d', path)
			.style("stroke", "rgba(255,255,255,0.5)")
			.attr("stroke-width", "2px")
			.attr("fill", function(d, i) { 
				if (!isNaN(data[i]["average"])) { 			
					return color(data[i]["average"]); 
				}
				else { 
					return "gray";
				}
			});

		graph.append('path')
			.attr('class', 'boundary')
			.datum(topomesh)
			.attr('d', path)
			.style('fill', 'none')
			.style('stroke', "rgba(255,255,255,0.5)")
			.style('stroke-width', '2px');

		var top15 = data.sort(function(a, b) { 
			return b.average - a.average; }).slice(0, 16); 

		xScale.domain([0, d3.max(top15, function(d) { return d.average; })]); 
		yScale.domain(top15.map(function(d) { return d[0].Township; })); 

		chart.append("g") 
			.attr("class", "xAxis") 
			.call(xAxis); 

		chart.append("g") 
			.attr("class", "yAxis")
			.call(yAxis); 

		chart.selectAll(".dataRect")
			.data(top15)
			.enter() 
			.append("rect") 
			.attr("class", "dataRect")
			.attr("id", function(d) { return d[0].Township; })
			.attr("x", 0)
			.attr("y", function(d) { return yScale(d[0].Township); })
			.attr("width", function(d) { return xScale(d.average); })
			.attr("height", yScale.rangeBand())
			.attr("fill", function(d) { 
				var id = d3.select(this).attr("id");
				return d3.select("." + id).attr("fill"); 
			})


	});
});


