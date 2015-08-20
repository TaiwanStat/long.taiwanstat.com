var graph_width = 500, 
	graph_height = 600; 

var graph = d3.select("#graph").append("svg")
	.attr("width", graph_width)
	.attr("height", graph_height); 

var color = d3.scale.ordinal() 
	.range(["rgb(237,248,233)", "rgb(186,228,179)", "rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"]);

var colorScale = d3.scale.ordinal()
	.domain([0, 50])
	.range(["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896"
 ,"#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22"
 ,"#dbdb8d","#17becf","#9edae5","#393b79","#5254a3","#6b6ecf","#9c9ede","#637939","#8ca252"
 ,"#cedb9c","#8c6d31","#bd9e39","#e7ba52","#e7cb94","#843c39","#ad494a","#d6616b","#e7969c"
 ,"#7b4173","#a55194","#ce6dbd","#de9ed6","#3182bd","#6baed6","#9ecae1","#c6dbef","#e6550d"
 ,"#fd8d3c","#fdae6b","#fdd0a2","#31a354","#74c476", "#b5cf6b"]);

var chart_margin = {top: 10, right: 10, bottom: 50, left: 70}, 
	chart_height = 500 - chart_margin.top - chart_margin.bottom, 
	chart_width = 700 - chart_margin.right - chart_margin.left; 

var zoom = d3.behavior.zoom()
    .on("zoom", draw).scaleExtent([1,100]).center([chart_margin.left, chart_height - chart_margin.bottom]);

var chart = d3.select("#chart").append("svg") 
	.attr("width", chart_width + chart_margin.left + chart_margin.right)
	.attr("height", chart_height + chart_margin.top + chart_margin.bottom)
	.call(zoom)
	.append("g")
	.attr("transform", "translate(" + chart_margin.left + ", " + chart_margin.top + ")");
	

var projection = d3.geo.mercator().center([121.675531, 24.41000]).scale(9000).translate([graph_width/1.25, graph_height/4]);
var path = d3.geo.path() .projection(projection); 

var monthList = ["1月 Jan.","2月 Feb.","3月 Mar.","4月 Apr.","5月 May","6月 Jun.","7月 Jul.","8月 Aug.","9月 Sep.","10月 Oct.","11月 Nov.","12月 Dec."]; 
var line = d3.svg.line() 
				.interpolate("linear")
				.x(function(d, i) { return xScale(monthList[i]); })
				.y(function(d, i) { return yScale(parseInt(d.split(",").join(""))); });

var xScale = d3.scale.ordinal().rangeRoundBands([0, chart_width]); 
var yScale = d3.scale.linear().range([chart_height, 0]); 
var xAxis = d3.svg.axis().scale(xScale).orient("bottom"); 
var yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(function(d) { return d/10000 + "萬"; });
var domainMax = 600000; 

zoom.y(yScale);

var cityName = "新北市";

d3.json("taiwan_topo.json", function(error, tw_topo_data) {
	d3.csv("rest_station.csv", function(data) { 

	    var topo = topojson.feature(tw_topo_data, tw_topo_data.objects["layer1"]);

	    var topomesh = topojson.mesh(tw_topo_data, tw_topo_data.objects["layer1"], function(a, b){
	        return a !== b;
	    });	

	    data = organize(data); 

		function organize(data) { 
			var cityList = []; 
			for (var i = 0; i < topo.features.length; i++) { 
				cityList.push(topo.features[i].properties.name); 
		}

		var dataArray = []; 
			for (var i = 0; i < cityList.length; i++) { 
				var result = []; 
				for (var m = 0; m < data.length; m++) { 
					if (cityList[i] == data[m].縣市別.slice(0, 3)) { 
						result.push(data[m]); 
					}
				}
				dataArray.push(result); 
			}
			return dataArray; 
		}		

		var averageValues = average(data); 

		function average(data) { 

			var averageList = []; 
			for (var i = 0; i < data.length; i++) { 
				var average = 0; 
				for (var m = 0; m < data[i].length; m++) { 
					if (typeof(data[i][m].合計) != 'undefined') { 
						data[i][m].合計 = data[i][m].合計.replace(/,/g, '');
						average += parseInt(data[i][m].合計); 
					}
					else {}
				}
				averageList.push(Math.floor(average/data[i].length)); 
			}
			return averageList; 
		}

		color.domain(d3.extent(averageValues, function(d) { return d; })); 

		var blocks = graph.selectAll("path")
		 	.data(topo.features)
			.enter()
			.append("path")
			.attr("class", function(d) { return d.properties.name; })
			.attr("d",path)
			.attr("opacity", 0.8)
			.style("stroke", "gray")
			.attr("stroke-width", "1px")
			.attr("fill", function(d, i) { 
				if (!isNaN(averageValues[i])) { return color(averageValues[i]); }
				else { return "#ccc"; } 
				});

		d3.select("." + cityName).style("stroke", "red").attr("stroke-width", "3px");

		xScale.domain(["1月 Jan.","2月 Feb.","3月 Mar.","4月 Apr.","5月 May","6月 Jun.","7月 Jul.","8月 Aug.","9月 Sep.","10月 Oct.","11月 Nov.","12月 Dec."]); 
		domainMax = 600000; 
		yScale.domain([0, domainMax]);

		graph.append('path').attr('class', "borders").datum(topomesh).attr('d', path).style('fill', 'none');
		chart.append("g").attr("class", "xAxis").attr("transform", "translate(0, " + chart_height + ")").call(xAxis); 
		chart.append("g").attr("class", "yAxis").call(yAxis); 

		d3.selectAll(".xAxis text")
			.attr("dy", 20)
			.attr("dx", -10)
			.attr("transform", "rotate(-30)"); 

		var theItem; 
		for (var i = 0; i < data.length; i++) { 
			if(data[i][0].縣市別.slice(0, 3) == cityName) { 
				theItem = data[i]; 
			}
		}
	
		drawGraph(theItem); 

		function drawGraph(item) { 

			var map = item.map(function(d) { 
				return {
					date: d3.keys(d).slice(3, 15),
					values: d3.values(d).slice(3, 15),
					total: d3.entries(d).slice(15, 16),
					county: d3.entries(d).slice(2, 3), 
					siteName: d3.entries(d).slice(1, 2),
				}
			}); 	

			domainMax = d3.max(map, function(individual) { 
					return d3.max(individual.values, function(d) { 
						return parseInt(d.split(",").join("")); }); })

			var yScale = d3.scale.linear() 
				.domain([0, domainMax])
				.range([chart_height, 0]); 

			var yAxis = d3.svg.axis() 
				.scale(yScale) 
				.orient("left")
				.tickFormat(function(d) { return d/10000 + "萬"; }); 

			d3.select(".yAxis")
				.transition() 
				.duration(1000)
				.call(yAxis); 

			var dataGroups = chart.selectAll("g.dataGroup").data(map)
				.enter().append("g").attr("class", "dataGroup")
				.attr("transform", "translate(" + xScale.rangeBand()/2 + ")");
				
			dataGroups.append("path")
				.datum(function(d, i) { return d.values; }) 
				.attr("class", "line").attr("d", line)
				.attr("id", function(d, i) { return "a" + i; })
				.style("stroke", function(d, i) { return colorScale(i); })
				.attr("stroke-width", "2px")
				.on("mouseover", showInfo); 

			function showInfo() {

			var id = d3.select(this).attr("id").slice(1); 
			var item = map[id].siteName[0].value; 

			d3.select("#description").html(item); 
			}
		}

		$("#options").on("change", change)

		function change() { 

			d3.selectAll("path").style("stroke", "gray").attr("stroke-width", "1px");
			var sel = this.value; 
			cityName = sel; 

			d3.select("." + sel).style("stroke", "red").attr("stroke-width", "3px"); 

			d3.select("#location").text(sel); 

			var theItem; 
			for (var i = 0; i < data.length; i++) { 
				if(data[i][0].縣市別.slice(0, 3) == cityName) { 
				theItem = data[i]; 
				}
			}

			d3.selectAll("g.dataGroup").remove() 

			drawGraph(theItem) ; 
		}
 	});
}); 

function draw(){
    d3.select(yScale.domain([0,domainMax/zoom.scale()/zoom.scale()]))
    d3.select("g.yAxis").transition().duration(500).call(yAxis);
  	d3.selectAll(".line").transition().duration(500).attr("d",line);
}



