var margin = {top: 40, right: 200, bottom: 20, left: 30},
	height = 1200 - margin.top - margin.bottom,
	width = 600 - margin.right - margin.left;

var svg = d3.select("#chart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var colorScale = d3.scale.category10();

var barChart_margin = {top: 20, right: 60, bottom: 20, left: 20},
	barChart_width = 510 - barChart_margin.left - barChart_margin.right,
	barChart_height = 1200 - barChart_margin.top - barChart_margin.bottom;

var barChart = d3.select("#barChart").append("svg")
	.attr("width", barChart_width + barChart_margin.left + barChart_margin.right)
	.attr("height", barChart_height + barChart_margin.top + barChart_margin.bottom)
	.append("g")
	.attr("transform", "translate(" + barChart_margin.left + ", " + barChart_margin.top + ")");

var cluster = d3.layout.cluster()
	.size([height, width]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.y, d.x]; });

var tip = d3.tip()
	.attr('class', 'd3-tip')
	.html(function(d) { return zhutil.annotate((d.本年度預算數收入).toLocaleString()); });

d3.json("fund102.json", function(data) {

	function separation(a, b) {
 		 return a.parent == b.parent ? 2 : 4;
	}

	cluster.separation(separation);

	var nodes = cluster.nodes(data),
	 	links = cluster.links(nodes);

	var link = svg.selectAll(".link")
		.data(links)
		.enter().append("path")
		.attr("class", "link")
		.attr("d", diagonal);

	var node = svg.selectAll(".node")
		.data(nodes)
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

	node.append("circle")
		.attr("r", 4.5);

	node.append("text")
		.attr("dx", function(d) { return d.children ? -8 : 8; })
		.attr("dy", 3)
		.style("text-anchor", function(d) { return d.children ? "end" : "start"; })
		.text(function(d) { return d.基金別; });

	var dataArray = [];
	var result = [];

	for (var i = 0; i < nodes.length; i++) {
		if(nodes[i].depth == 1) {
			dataArray.push(nodes[i]);
		}
	}

	var xScale = d3.scale.pow().exponent(1/3)
		.domain([
			d3.min(dataArray, function(foo) {
				return d3.min(foo.children, function(bar) {
					return parseInt(bar.本年度預算數收入); }); })
			, d3.max(dataArray, function(foo) {
				return d3.max(foo.children, function(bar) {
					return parseInt(bar.本年度預算數收入); }); })])
		.range([0, barChart_width]);

	var xAxis = d3.svg.axis().scale(xScale).orient("top").tickFormat(function(d) { return d/100000000; });

	var xAxisUnits = barChart.append("text")
		.attr("class", "xAxisUnits")
		.attr("x", 500)
		.attr("y", 30)
		.text("(單位: 億)");

	var dataGraphs = barChart.selectAll(".g.dataGraph")
		.data(dataArray)
		.enter()
		.append("g")
		.attr("class", "dataGraph")
		.attr("transform", function(d, i) {
			return "translate(0, " + dataArray[i].children[0].x + ")"; })
		.attr("fill", function(d, i) { return colorScale(i); });

	d3.select(".dataGraph").append("g")
		.attr("class", "xAxis")
		.call(xAxis);

	svg.call(tip);

	d3.selectAll(".dataGraph").selectAll(".dataRect")
		.data(function(d) { return d.children; })
		.enter()
		.append("rect")
		.attr("class", "dataRect")
		.attr("x", 0)
		.attr("y", function(d, i) { return 12 + i * 15; })
		.attr("width", function(d) { return xScale(parseInt(d.本年度預算數收入)); })
		.attr("height", 10)
		.on('mouseover', tip.show)
  		.on('mouseout', tip.hide);

	$("button").on("click", change)

	function change() {

		var sel = this.value;

		d3.select("#mode").text(sel);

		var tip = d3.tip()
			.attr('class', 'd3-tip')
			.html(function(d) { return zhutil.annotate((d[sel]).toLocaleString()); });

		svg.call(tip);

		var xScale = d3.scale.pow().exponent(1/3)
			.domain([
				d3.min(dataArray, function(foo) {
					return d3.min(foo.children, function(bar) {
						return Math.abs(bar[sel]); }); })
				,d3.max(dataArray, function(foo) {
					return d3.max(foo.children, function(bar) {
						return Math.abs(bar[sel]); }); })
			])
			.range([0, barChart_width]);

		var xAxis = d3.svg.axis().scale(xScale).orient("top").tickFormat(function(d) { return d/100000000; });
		d3.select(".xAxis").transition().duration(1000).call(xAxis);

		setTimeout(function() {
	  		d3.selectAll(".dataRect")
			.transition()
			.duration(2000)
			.delay(function(d, i) { return i * 50; })
			.attr("width", function(d) { return xScale(Math.abs(parseInt(d[sel]))); })
			.on('mouseover', tip.show)
  		.on('mouseout', tip.hide);
  		}, 1000);
	}
});


