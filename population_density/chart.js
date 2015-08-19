var graph_margin = {top: 20, right: 10, bottom: 20, left: 50},
	graph_width = 500 - graph_margin.right - graph_margin.left,
	graph_height = 700 - graph_margin.top - graph_margin.bottom;

var graph = d3.select("#graph").append("svg")
	.attr("width", graph_width + graph_margin.left + graph_margin.right)
	.attr("height", graph_height + graph_margin.top + graph_margin.bottom)
	.append("g")
	.attr("transform", "translate(" + graph_margin.left + ", " + graph_margin.top + ")");

var chart_margin = {top: 20, right: 30, bottom: 10, left: 70},
	chart_width = 650 - chart_margin.right - chart_margin.left,
	chart_height = 650 - chart_margin.top - chart_margin.bottom;

var chart = d3.select("#chart").append("svg")
	.attr("width", chart_width + chart_margin.left + chart_margin.right)
	.attr("height", chart_height + chart_margin.top + chart_margin.bottom)
	.append("g")
	.attr("transform", "translate(" + chart_margin.left + ", " + chart_margin.top + ")");

var color = d3.scale.quantize()
                    .range(["rgb(237,248,233)", "rgb(186,228,179)", "rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"]);

var colorScale = d3.scale.ordinal()
	.domain(["臺東縣", "宜蘭縣", "臺北市", "雲林縣", "桃園縣",  "屏東縣", "臺中市", "臺南市",
	  "基隆市","南投縣", "澎湖縣", "苗栗縣","嘉義市", "新竹縣", "新北市", "花蓮縣", "高雄市",
	  "彰化縣", "嘉義縣", "新竹市"])
	.range(["#9edae5", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728",
			 "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2",
			 "#1f77b4", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#7f7f7f"]);

var xScale = d3.scale.linear()
	.range([0, chart_width]);

var yScale = d3.scale.ordinal()
	.rangeRoundBands([0, chart_height], 0.01);

var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("top");

var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left");

var projection = d3.geo.mercator().center([121.675531, 24.41000]).scale(9000)
	.translate([graph_width/1.25, graph_height/4]);

var path = d3.geo.path()
            .projection(projection);

var dataType = "新北市";

d3.json("taiwan_topo.json", function(error, tw_topo_data) {
	d3.csv("density.csv", function(data) {

    var topo = topojson.feature(tw_topo_data, tw_topo_data.objects["layer1"]);

    var topomesh = topojson.mesh(tw_topo_data, tw_topo_data.objects["layer1"], function(a, b){
        return a !== b;
    });

    var theItem;
   	topo.features[4].properties.name = "桃園縣";

    data = organize(data);
    console.log(data);

    for (var i = 0; i < data.length; i++) {
   		if (typeof(data[i][0]) == 'undefined') {}
   		else {
	    	if(data[i][0].區域別.slice(0, 3) == dataType) {
	    		theItem = data[i];
    		}
    	}
    }

    var listItems = [];
    d3.map(theItem, function(d) { listItems.push(d.區域別.slice(3)); });
    yScale.domain(listItems);
    xScale.domain([0, d3.max(theItem, function(area) { return parseInt(area.人口密度); })]);

   	chart.append("g").attr("class", "xAxis").call(xAxis);
   	chart.append("g").attr("class", "yAxis").call(yAxis);

   	d3.selectAll(".yAxis text")
   		.attr("transform", "rotate(15)");

    var averageValues = [];
   	for (var i = 0; i < data.length; i++) {
   		var value = 0;
   		for (var m = 0; m < data[i].length; m++) {
   			value += parseInt(data[i][m].人口密度);
   		}
   		averageValues.push(value/data[i].length);
   	}

   	color.domain([0, 5000]);
   	var rectColor = colorScale(dataType);

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
        	if (!isNaN(averageValues[i])) { return color(parseInt(averageValues[i])); }
        	else { return "#ccc"; }
       	})
       	.on("mouseover", function() {
       		d3.select("." + d3.select(this).attr("class")).style("stroke", "#000").attr("stroke-width", "2px");
       	})
       	.on("mouseout", function() {
       		d3.select("." + d3.select(this).attr("class")).style("stroke", "gray").attr("stroke-width", "1px");
       	});

    graph.append('path')
        .attr('class', "borders")
        .datum(topomesh)
        .attr('d', path)
        .style('fill', 'none');


    function organize(data) {
	    var dataArray = [];
		for( var i = 0; i < topo.features.length; i++ ) {
	        var County_Name = topo.features[i].properties.name;
	        console.log(County_Name);
	        var result = [];
	        for ( var m = 0; m < data.length; m++ ) {
	        	if (County_Name == data[m].區域別.slice(0, 3)) {
	        		result.push(data[m]);
	        	}
	        }
	        dataArray.push(result);
	    }
	    return dataArray;
	}

	chart.selectAll(".dataRect")
		.data(theItem)
		.enter()
		.append("rect")
		.attr("class", "dataRect")
		.attr("data-name", function(d) { return d.區域別.slice(0, 3); })
		.attr("x", 0)
		.attr("y", function(d, i) { return (i + 1/2) * yScale.rangeBand(); })
		.attr("width", function(d) { return xScale(d.人口密度); })
		.attr("height", 10)
		.attr("fill", rectColor);

	$("#options").on("change", changeGraph);

	 function changeGraph() {

    d3.select("input").property("checked", false);

		var value = this.value;
		var rectColor = colorScale(value);

    d3.select("#mode").text(value);

		for (var i = 0; i < data.length; i++) {
   			if (typeof(data[i][0]) == 'undefined') {}
	   		else {
		    	if(data[i][0].區域別.slice(0, 3) == value) {
		    		theItem = data[i];
	    		}
	    	}
  		}

  		var itemList = [];
  		for (var i = 0; i < theItem.length; i++) {
  			itemList.push(theItem[i].區域別.slice(3));
  		}

      console.log(theItem)

      console.log(theItem[0].區域別)

  		d3.selectAll("path").style("stroke", "gray").attr("stroke-width", "1px");
  		d3.selectAll(".borders").style("stroke", "gray").attr("stroke-width", "1px");
  		d3.select("." + theItem[0].區域別.slice(0, 3)).style("stroke", "red").attr("stroke-width", "4px");
  		d3.selectAll(".dataRect").remove();

  		var xScale = d3.scale.linear().domain([0, d3.max(theItem, function(area) { return parseInt(area.人口密度); })]).range([0, chart_width]);
  		var xAxis = d3.svg.axis().scale(xScale).orient("top");
  		d3.select(".xAxis").transition() .duration(1000).call(xAxis);

  		var yScale = d3.scale.ordinal().domain(itemList).rangeRoundBands([0, chart_height], .08);
  		var yAxis = d3.svg.axis().scale(yScale).orient("left");
  		d3.select(".yAxis").transition().delay(function(d, i) { return i * 100; }).duration(1000).call(yAxis);
  		d3.selectAll(".yAxis text").attr("transform", "rotate(15)");

  		setTimeout(function() {
	  		chart.selectAll(".dataRect").data(theItem).enter().append("rect")
	  			.attr("class", "dataRect").attr("x", 0)
	  			.attr("y", function(d, i) { return yScale(d.區域別.slice(3)); })
	  			.attr("width", function(d) { return xScale(d.人口密度); }).attr("height", yScale.rangeBand())
	  			.attr("fill", rectColor);
	  		}, 1000);
  		}

      d3.select("input").on("change", change);

      var sortTimeout = setTimeout(function() {
        d3.select("input").property("checked", true).each(change);
      }, 2000);

      function change() {
        var x0 = yScale.domain(theItem.sort(this.checked
            ? function(a, b) { return b.人口密度 - a.人口密度; }
            : function(a, b) { return d3.ascending(a.人口密度, b.人口密度); })
            .map(function(d) { return d.人口密度; }))
            .copy();

        var transition = chart.transition().duration(750),
            delay = function(d, i) { return i * 50; };

        transition.selectAll(".dataRect")
            .delay(delay)
            .attr("y", function(d) { return x0(d.人口密度); });

        d3.selectAll(".yAxis text")
          .datum(theItem)
          .attr("transform", "rotate(15)")
          .text(function(d, i) { return theItem[i].區域別.slice(3); });
      }
    });
 });














