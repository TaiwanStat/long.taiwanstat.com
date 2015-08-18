var w = 800,
	h = 600;

var projection = d3.geo.mercator()
	.center([120.979531, 23.978567])
	.scale(10000);

var color = d3.scale.quantize()
	.domain([0, 1])
	.range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

var path = d3.geo.path()
	.projection(projection);

var tip = d3.tip()
  	.attr('class', 'd3-tip')
  	.offset([-10, 0])
  	.html(function(d) {
		var count_district = districtName.indexOf(d.properties.TOWNNAME.trim());
    	return d.properties.TOWNNAME.trim() + ' : ' + zhutil.annotate(+townValue[count_district]);
  	});

var svg = d3.select('#content')
	.append('svg')
	.attr('width', w)
	.attr('height', h)
	.attr('viewBox', "0 0 800 600")
	.attr('preserveAspectRatio', 'xMidYMid');

svg.call(tip);

var g = svg.append("g")
	.attr("class", "key")
	.attr("transform", "translate(40,40)");

var year = [];
var district = [];
var districtName =  [];
var townValue = [];

d3.json("population.json", function(error, population_data) {

	for(_key in population_data) {
	 	// year
		year.push(_key);
	}

	var year_data = population_data[year[0]];

	for(_key_year in year_data) {
		district.push(_key_year);
		// district
		for(_district in year_data[_key_year]) {
			districtName.push(_district);
			townValue.push(+year_data[_key_year][_district]);
		}
	}

	d3.select("#year_population").html(+year[0] + 1911)

	d3.json('../../data/taiwan-map/twTown1982.topo.json', function(err, data) {

		var color_scale = d3.scale.linear()
			.domain([0, d3.max(townValue)])

		var x = d3.scale.linear()
			.domain([0, d3.max(townValue)])
			.range([0, 330]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.tickValues(x.domain())
			.orient("bottom");

		var topo = topojson.feature(data, data.objects["twTown1982.geo"]);

		var topomesh = topojson.mesh(data, data.objects["twTown1982.geo"], function(a, b){
			return a !== b;
		});

		topo.features.forEach(function(d, i) {
			if(d.properties.TOWNID === "1605" || d.properties.TOWNID === "1603" ||  d.properties.TOWNID=== "1000128") {
				topo.features.splice(i, 1);
			}
		})

		svg.selectAll('path.town')
			.data(topo.features)
			.enter()
			.append('path')
			.attr('id', function(d) { return d.properties.TOWNNAME; })
			.attr('d', path)
			.attr("class", function(d) {
				var count_district = districtName.indexOf(d.properties.TOWNNAME.trim());
				var color_class = color(color_scale(townValue[count_district]));
				if(count_district >= 0){
					return ("town " + color_class);
				}else {
					console.log(d.properties.TOWNNAME);
					return "town RdYlGn";
				}
			})
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

		g.selectAll("rect")
			.data(d3.range(11).map(function(d) { return "q" + d + "-11"; }))
			.enter().append("rect")
			.attr("height", 10)
			.attr("x", function(d, i) { return 30 * i; })
			.attr("y", -3)
			.attr("width", "30")
			.attr("class", function(d) { return d; });

		g.call(xAxis).append("text")
			.attr("class", "caption")
			.attr("y", -10)
			.text("人口數");

		svg.append('path')
			.attr('class', 'boundary')
			.datum(topomesh)
			.attr('d', path)
			.style('fill', 'none')
			.style('stroke', "rgba(255,255,255,0.5)")
			.style('stroke-width', '2px');


		var count_year = 0;
		var set_switch_year;

		function set_loop() {
			clearTimeout(set_switch_year);
			set_switch_year = setInterval(function() {
				addYear(count_year);
				count_year++;
			}, 1000)
		}

		set_loop();

		document.getElementById("restart").onclick = function() {
			count_year = 0;
			set_loop();
		}

		document.getElementById("start").onclick = function() {
            if (count_year == 23){
            	count_year = 0; //prevent for NaN
            }
			set_loop()
		}

		document.getElementById("stop").onclick = function() {
			clearTimeout(set_switch_year);
		}

        document.getElementById("next").onclick = function() {
            if (count_year == 22){
                count_year = 0;
            }else {
                count_year++;
            }
            addYear(count_year);
        }

        document.getElementById("prev").onclick = function () {
            if (count_year == 0){
                count_year = 22;
            }else {
                count_year--;
            }
            addYear(count_year);
        }

		function addYear(count) {

			if(year[count] === "102") {
				clearInterval(set_switch_year);
			}

			var year_data = population_data[year[count]];
			var district = [];
			var districtName = [];
			var townValue = [];

			for(_key_year in year_data) {
				district.push(_key_year);
				// district
				for(_district in year_data[_key_year]) {
					districtName.push(_district);
					townValue.push(+year_data[_key_year][_district]);
				}
			}

			var color_scale = d3.scale.linear()
				.domain([0, d3.max(townValue)]);
			var x = d3.scale.linear()
				.domain([0, d3.max(townValue)])
				.range([0, 330]);

			var xAxis = d3.svg.axis()
				.scale(x)
				.tickValues(x.domain())
				.orient("bottom");

			d3.selectAll(".year_population").html(+year[count] + 1911);

			svg.selectAll('path.town')
				.data(topo.features)
				.attr("class", function(d) {
				    var count_district = districtName.indexOf(d.properties.TOWNNAME.trim());
				    var color_class = color(color_scale(townValue[count_district]))
    				if(count_district >= 0){
	    				return ("town " + color_class);
		    		}else {
			    		console.log(d.properties.TOWNNAME)
				    	return "town RdYlGn"
				    }
			    })

			g.call(xAxis)

		}
	})

})
