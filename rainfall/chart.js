var projection = d3.geo.mercator()
	.center([120.979531, 23.978567])
	.scale(10000);

var path = d3.geo.path()
	.projection(projection);

var chart_margin = {top: 20, right: 30, bottom: 20, left: 30}, 
	chart_height = 500 - chart_margin.top - chart_margin.bottom, 
	chart_width = 960 - chart_margin.left - chart_margin.right;

var chart = d3.select("#chart").append("svg")
	.attr("width", chart_width + chart_margin.left + chart_margin.right)
	.attr("height", chart_height + chart_margin.top + chart_margin.bottom)
	.append("g") 
	.attr("transform", "translate(" + chart_margin.left + ", " + chart_margin.top + ")"); 

console.log('ehll');
d3.json('../../data/taiwan-map/twTown1982.topo.json', function(err, data) {

		var topo = topojson.feature(data, data.objects["twTown1982.geo"]);

		var topomesh = topojson.mesh(data, data.objects["twTown1982.geo"], function(a, b){
			return a !== b;
		});

		topo.features.forEach(function(d, i) {
			if(d.properties.TOWNID === "1605" || d.properties.TOWNID === "1603" ||  d.properties.TOWNID=== "1000128") {
				topo.features.splice(i, 1);
			}
		})

		chart.selectAll('path.town')
			.data(topo.features)
			.enter()
			.append('path')
			.attr('id', function(d) { return d.properties.TOWNNAME; })
			.attr('d', path)
			.attr("class", function(d) {
				var count_district = districtName.indexOf(d.properties.COUNTYNAME.trim() + d.properties.TOWNNAME.trim());
				var color_class = color(color_scale(townValue[count_district]));
				if(count_district >= 0){
					return ("town " + color_class);
				}else {
					return "town RdYlGn";
				}
			})
			.attr("fill", "#000");


		// g.selectAll("rect")
		// 	.data(d3.range(11).map(function(d) { return "q" + d + "-11"; }))
		// 	.enter().append("rect")
		// 	.attr("height", 10)
		// 	.attr("x", function(d, i) { return 30 * i; })
		// 	.attr("y", -3)
		// 	.attr("width", "30")
		// 	.attr("class", function(d) { return d; });

		// g.call(xAxis).append("text")
		// 	.attr("class", "caption")
		// 	.attr("y", -10)
		// 	.text("人口數");

		svg.append('path')
			.attr('class', 'boundary')
			.datum(topomesh)
			.attr('d', path)
			.style('fill', 'none')
			.style('stroke', "rgba(255,255,255,0.5)")
			.style('stroke-width', '2px');

});


