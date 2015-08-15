var margin = {top: 20, right:30, bottom:40, left: 70}, //////////units: 千億    data x 100
	width = 880 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var parser = d3.time.format("%Y").parse;

var xScale = d3.scale.linear()
	.range([0, width]);

var yScale = d3.scale.linear()
	.range([height, 0]);

var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom")
	.ticks(14);

var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left")
	.tickFormat(function(d) { return d/1000000000 + "兆"; });

var line = d3.svg.area()
	.interpolate("basis")
	.x(function(d) { return xScale(d.年度); })
	.y(function(d) { return yScale(d["歲入淨額"]); });

var area = d3.svg.area()
	.interpolate("basis")
	.x(function(d) { return xScale(d.年度); })
	.y1(function(d) { return yScale(d["歲入淨額"]); });

var svg = d3.select("#chart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var info_box = d3.select("#info_box").append("svg")
	.attr("width", 325)
	.attr("height", 500);

var g = svg.append("g");

var yearIndex = svg.selectAll(".yearIndex")
	.data(d3.range(65, 107, 3))
	.enter()
	.append("text")
	.attr("class", "yearIndex")
	.attr("x", function(d, i) { return -13 + i * 61; })
	.attr("y", 470)
	.text(function(d) { return d; });

var colorScale = ["#3182bd", "#31a354", "#9467bd"];


d3.csv("revenue.csv", function(data) {

	data.pop();

	var nestedData = d3.nest().key(function(d) { return d.年度; }).entries(data);

	var keys = d3.keys(nestedData[0].values[0]).filter(function(d) { return d != "年度"; });

	var hintBox = info_box.selectAll("g.hintBox")
		.data(["之比例為 1 px: 一百六十億", "之比例為 1 px: 0.12", "之比例為 1 px: 二點四億"])
		.enter()
		.append("g")
		.attr("class", "hintBox")
		.attr("x", function(d, i) { return i * 50; })
		.attr("y", 10);

	hintBox.append("rect")
		.attr("class", "hintRect")
		.attr("x", 30)
		.attr("y", function(d, i) { return 10 + i * 25; })
		.attr("width", 10)
		.attr("height", 10)
		.attr("fill", function(d, i) { return colorScale[i]; });

	hintBox.append("text")
		.text(function(d) { return d; })
		.attr("x", 50)
		.attr("y", function(d, i) { return 20 + i * 25; });

	var info_children = info_box.selectAll("g.infoChild")
		.data(keys)
		.enter()
		.append("g")
		.attr("class", "infoChild")
		.attr("x", 50)
		.attr("y", function(d, i) { return 100 + 40 * i; });

	info_children.append("text")
		.attr("class", "childText")
		.text(function(d) { return d; })
		.attr("x", 30)
		.attr("y", function(d, i) { return 100 + 40 * i; });

	cleanUpData(nestedData);
	drawDifferenceGraph(nestedData);

});

function cleanUpData(data) {

	var itemList = d3.keys(data[0].values[0]).filter(function(d) { return d != "年度"; });

	for (var i = 0; i < data.length; i++) {
		data[i].key = parseInt(data[i].key.split("年度")[0]) + 1911;
		data[i].values[0].年度 = parseInt(data[i].values[0].年度.split("年度")[0]) + 1911;
		for (var m = 0; m < itemList.length; m++) {

			if (typeof(data[i].values[0][itemList[m]]) == 'undefined') {}
			else {
				data[i].values[0][itemList[m]] = data[i].values[0][itemList[m]].split(",").join("");
			}
		}
	}
}

function drawDifferenceGraph(data) {

	var area_mask_width = width,
		area_mask_height = height;

	g.append("rect")
		.attr("class", "area_mask")
		.attr("width", area_mask_width)
		.attr("height", area_mask_height)
		.on("mousemove", function() {
			var that = this;
			rectInteract(that, data);
		});

	for (var i = 0; i < data.length; i++) {
		data[i].key = parser(data[i].key.toString());
	}

	var xScaleMin = new Date(1974, 0, 1);
	var xScaleMax = new Date(2014, 0, 1);
	xScale.domain([xScaleMin, xScaleMax]);
	yScale.domain([0, 5000000000]);

	svg.append("g")
		.attr("class", "xAxis")
		.attr("transform", "translate(0, " + height + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "yAxis")
		.call(yAxis);

	console.log(data);
	var dataArray = [];

	for (var i = 0; i < data.length; i++) {
		data[i].values[0].年度 = parser(data[i].values[0].年度.toString());
		dataArray.push(data[i].values[0]);
	}

	svg.datum(dataArray);

	svg.append("clipPath")
		.attr("id", "clip-below")
		.append("path")
		.attr("d", area.y0(height));

	svg.append("clipPath")
		.attr("id", "clip-above")
		.append("path")
		.attr("d", area.y0(0));

	svg.append("path")
		.attr("class", "area above")
		.attr("clip-path", "url(#clip-above)")
		.attr("d", area.y0(function(d) {
			return yScale(d["歲出淨額"]); }));

	svg.append("path")
		.attr("class", "area below")
		.attr("clip-path", "url(#clip-below)")
		.attr("d", area);

	svg.append("path")
		.attr("class", "line")
		.attr("d", line);
}

function rectInteract(that, data) {

	var theItem;

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

	for (var i = 0; i < data.length; i++) {

		if(Math.floor(xCoordinate) == Math.floor(xScale(data[i].key))) {
			theItem = data[i];

			console.log(theItem);
		}

	}
	update(theItem);
}

function update(data) {

	var scale1 = d3.scale.linear()  /// scale for 歲入,歲出
		.domain([0, 4000000000])
		.range([0, 250]);

	var scale2 = d3.scale.linear()  /// scale for 歲入,歲出
		.domain([0, 600000000])
		.range([0, 250]);

	var scale3 = d3.scale.linear() //// scale for 歲入淨值,歲出淨值
		.domain([0, 30])
		.range([0, 250]);

	var scale4 = d3.scale.linear() /////scale for 餘絀
		.domain([0, 8])
		.range([0, 250]);

	if (typeof(data) != 'undefined') {
		d3.selectAll(".dataRect").remove();
		d3.selectAll(".dataText").remove();

		var	dataArray = d3.entries(data.values[0]).filter(function(d) { return d.key != "年度"; });

		function numberFormat(number, decimals, decPoint, thousandsSep) {
	    decimals = isNaN(decimals) ? 2 : Math.abs(decimals);
	    decPoint = (decPoint === undefined) ? '.' : decPoint;
	    thousandsSep = (thousandsSep === undefined) ? ',' : thousandsSep;

	    var sign = number < 0 ? '-' : '';
	    number = Math.abs(+number || 0);

	    var intPart = parseInt(number.toFixed(decimals), 10) + '';
	    var j = intPart.length > 3 ? intPart.length % 3 : 0;

	    return sign + (j ? intPart.substr(0, j) + thousandsSep : '') + intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep) + (decimals ? decPoint + Math.abs(number - intPart).toFixed(decimals).slice(2) : '');
	  };

		var rects = info_box.selectAll(".dataText")
			.data(dataArray)
			.enter()
			.append("text")
			.attr("class", "dataText")
			.attr("x", 180)
			.attr("y", function(d, i) { return 100 + 40 * i; })
			.text(function(d, i) {
				if (isNaN(d.value)) {
					return "";
				}
				else {
					if ( i == 1 || i == 3 || i == 5)
						return parseFloat(d.value).toFixed(1) + ' %';
					else
						return numberFormat(parseInt(d.value * 10000));
				}
			});

		console.log(dataArray);

		var rects = info_box.selectAll(".dataRect")
			.data(dataArray)
			.enter()
			.append("rect")
			.attr("class", "dataRect")
			.attr("x", 30)
			.attr("y", function(d, i) { return 110 + 40 * i; })
			.attr("width", function(d) {
				if (d.key == "歲入淨額" || d.key == "歲出淨額") {
					return scale1(Math.abs(d.value));
				}
				else if (d.key == "餘絀") {
					return scale1(Math.abs(d.value));
				}
				else if (d.key == "歲入淨額占GDP比率" || d.key == "歲出淨額占GDP比率") {
					return scale3(Math.abs(d.value));
				}
				else if (d.key == "餘絀占GDP比率") {
					return scale4(Math.abs(d.value));
				}
				else {
					return scale2(Math.abs(d.value));
				}
			})
			.attr("height", 15)
			.attr("fill", function(d, i) {
				if (i < 6) {
					if (i % 2 == 0 && i != 2 && i != 4) {
						return "#3182bd";
					}
					else {
						if (i == 2) {
							return "red";
						}
						else if (i == 4) {
							if (dataArray[i].value > 0) {
								return "#3182bd";
							}
							else {
								return "red";
							}
						}
						return "#31a354";
					}
				}
				else {
					return "#9467bd";
				}
			});
	}
	else {}
}


// function update(xCoordinate, data) {

// 	var theItem;

// 	for (var i = 0; i < data.length; i++) {

// 		if (xCoordinate == Math.floor(xScale(data[i].key))) {
// 			theItem = data[i];
// 		}
// 	}

// 	if (typeof(theItem) == 'undefined') {}
// 	else {
// 		var values = theItem.values[0];
// 		$("#yearText").text(values.年度.getFullYear());
// 		$("#incomeText").text(values["<b>歲入淨額</b> "].toLocaleString());
// 		$("#incomePercentage").text(values["歲入淨額占GDP比率 "].toFixed(1) + "%");
// 		$("#expenseText").text(values["<b>歲出淨額</b> "].toLocaleString());
// 		$("#expensePercentage").text(values["歲出淨額占GDP比率 "].toFixed(1) + "%");
// 		$("#leftoverText").text(values["<b>餘絀</b> "].toLocaleString());
// 		$("#leftoverPercentage").text(values["餘絀占GDP比率 "].toFixed(1) + "%");
// 	}


// }

