var margin = {top : 20, right: 30, bottom: 20, left: 30}, 
	width = 450 - margin.left - margin.right, 
	height = 400 - margin.top - margin.bottom; 

var svg_width = 380; 
var svg_height = 360; 

var outerRadius = height / 2; 
var innerRadius = 0; 

var pie = d3.layout.pie(); 

var colorScale = d3.scale.category10(); 

var arc = d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius); 

var svg = d3.select("#chart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g") 
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 

var pieChartSVG = d3.select("#pieChart").append("svg") 
	.attr("width", svg_width)
	.attr("height", svg_height);

var yearBoard = d3.select(".forceGraphSection").append("text") 
	.attr("class", "yearBoard")
	.attr("x", "100px")
	.attr("y", "500px")
	.text("民國95年");

	drawEmploymentGraph(0); 

$("#button1").on("click", function() { 	
	d3.selectAll("circle").remove();
	drawExportGraph(0);
	d3.selectAll(".units").text("(新台幣百萬元)"); 
});
$("#button2").on("click", function() { 
	d3.selectAll("circle").remove();
	drawAmountGraph(0);
	d3.selectAll(".units").text("(家)"); 
});
$("#button3").on("click", function() {  
	d3.selectAll("circle").remove();
	drawGrossGraph(0); 
	d3.selectAll(".units").text("(新台幣百萬元)"); 
});
$("#button4").on("click", function() { 
	d3.selectAll("circle").remove(); 
	drawEmploymentGraph(0); 
	d3.selectAll(".units").text("(千人)"); 
});

var index = 0; 
var yearArray = ["民國95年", "民國100年", "民國102年", "民國103年"]

$(".controlButton").click(change);

function change() { 
	d3.selectAll(".node").remove(); 
	if (this.id == "backwardButton") {
		index--; 	
		if (index < 0) {}
		else {
			renewIndex(index);
			d3.select(".yearBoard").text(yearArray[index]); 
		}
	}
	else {
		index++; 
		if (index >= 4) {}
		else {
			renewIndex(index); 
			d3.select(".yearBoard").text(yearArray[index]);
		}
	}
}

function drawExportGraph(index) { 
		
	d3.json("中小企業出口額－按行業別分95.json", function(error, data95) { 
		d3.json("中小企業出口額－按行業別分100.json", function(data100) { 
			d3.json("中小企業出口額－按行業別分101.json", function(data101) { 
				d3.json("中小企業出口額－按行業別分102.json", function(data102) { 
					d3.json("中小企業出口額－按行業別分103.json", function(data103) {


		var dataType = "dataExport"; 

		var content = d3.map([
			cleanUpData(data95), 
			cleanUpData(data100),
			cleanUpData(data102),
			cleanUpData(data103)
			]); 

		drawPieChart(content["_"][index][1]); //draw initial Pie Chart   //////error-prone
		renewList(content, 0); 
		sortData(content, index, dataType);

					}); 
				});
			});
		});
	}); 

}

function drawAmountGraph(index) { 

	d3.json("中小企業家數－按行業別分95.json", function(data95) { 
		d3.json("中小企業家數－按行業別分100.json", function(data100) { 
			d3.json("中小企業家數－按行業別分102.json", function(data102) { 
				d3.json("中小企業家數－按行業別分103.json", function(data103) {


		var dataType = "dataAmount"; 

		var content = d3.map([
			cleanUpData(data95), 
			cleanUpData(data100),
			cleanUpData(data102),
			cleanUpData(data103)
			]);  

		drawPieChart(content["_"][index][1]); //draw initial Pie Chart
		renewList(content, 0); 
		sortData(content, index, dataType);

				}); 

			});
		}); 

	});

}

function drawGrossGraph(index) { 

	d3.json("中小企業銷售額－按行業別分95.json", function(data95) { 
		d3.json("中小企業銷售額－按行業別分100.json", function(data100) { 
			d3.json("中小企業銷售額－按行業別分102.json", function(data102) { 
				d3.json("中小企業銷售額－按行業別分103.json", function(data103) { 

			var dataType = "dataGross";

			var content = d3.map([
			cleanUpData(data95), 
			cleanUpData(data100),
			cleanUpData(data102),
			cleanUpData(data103)
			]);  

			drawPieChart(content["_"][index][1]); //draw initial Pie Chart
			renewList(content, 0); 
			sortData(content, index, dataType);
					
				}); 
			}); 
		}); 
	}); 
}

function drawEmploymentGraph() { 

	d3.json("台灣地區中小企業就業人數95.json", function(data95) { 
		d3.json("臺灣地區中小企業就業人數100.json", function(data100) { 
			d3.json("臺灣地區中小企業就業人數102.json", function(data102) { 
				d3.json("臺灣地區中小企業就業人數103.json", function(data103) { 

					console.log(cleanUpData(data103)); 

					var dataType = "dataEmployment"; 
					
					var content = d3.map([
					cleanUpData(data95), 
					cleanUpData(data100),
					cleanUpData(data102),
					cleanUpData(data103)
					]);  

					drawPieChart(content["_"][index][1]); //draw initial Pie Chart
					renewList(content, 0); 
					sortData(content, index, dataType);
				}); 

			});

		});

	}); 
}

function cleanUpData(data) {

	if (!data["TaggedPDF-doc"].Workbook) {

		data = data["TaggedPDF-doc"].Table[0].TR;


		var occupationList = data[2].TH.split(",");

	for (var i = 0; i < data[2].TD.length; i++) { 
		data[2].TD[i] = data[2].TD[i].split(" "); 
	}	
	return data; 
	}

	else {
		data = data["TaggedPDF-doc"].Workbook.Worksheet.Table.TR;  

		for (var i = 0; i < data.length; i++) { 
			if(data[i] == "") { 
				data[i] = "none"; 
			}
		}

		for (var i = 0; i < data.length; i++) { 
			if (data[i].TD[0].P && typeof(data[i].TD[0].P) == 'string') {
				for (var m = 0; m < data[i].TD.length; m++) {
					if (isNaN(parseInt(data[i].TD[m].P))) {
						data[i].TD[m] = data[i].TD[m].P;
					}
					else {
					data[i].TD[m].P = parseFloat(data[i].TD[m].P.split(",").join("")); 
					}
				}
			}

			else {
				for (var m = 0; m < data[i].TD.length; m++) {
					if(!isNaN(parseInt(data[i].TD[m]))) {
						data[i].TD[m] = parseFloat(data[i].TD[m].split(",").join("")); 
					}
					else {
					}
				}
				var sliceData = data[i].TD.slice(0, 1); 
				data[i].TD.push(sliceData[0]);
				data[i].TD.shift(); 
			}
		} 
			return data; 
	}
}

function renewIndex(index) {   /// when yearIndex is changed but dataType stays the same

	var dataType = d3.selectAll("circle").attr("class");
	d3.selectAll("circle").remove();
	if (dataType == "dataExport") { 
		drawExportGraph(index); 
	}
	else if (dataType == "dataAmount") { 
		drawAmountGraph(index); 
	}
	else { 
		drawGrossGraph(index); 
	}
}

function sortData(content, i, dataType) {

	content = content["_"][i]; 
	
	drawForceGraph(content, dataType);
}

// function writeOccupationList(content) { 

// 	content.shift(); 

// 	for (var i = 0; i < content.length; i++) {
// 		content[i].TD[3] = content[i].TD[3].replace(" ", "");
// 	}

// 	console.log(content);

// 	d3.select("#occupationList").selectAll(".occupationItem")
// 		.data(content)
// 		.enter().append("div") 
// 		.attr("class", "occupationItem"); 

	// d3.selectAll(".occupationItem")
	// 	.data(content)
	// 	.append("circle") 
	// 	.attr("class", "occupationCircle")
	// 	.attr("cx", 5)
	// 	.attr("cy", 5)
	// 	.attr("r", 5)
	// 	.attr("fill", function(d) { return colorScale(d); }); 

// 	d3.selectAll(".occupationItem")
// 		.data(content)	
// 		.append("text") 
// 		.attr("class", "occupationItemName")
// 		.text(function(d) { 
// 				return d.TD[3]; 
// 		});

// }


function renewList(content, index) {  

	d3.select("#occupationList").selectAll(".occupationItem")
		.data(content["_"][index])
		.enter().append("div") 
		.attr("class", "occupationItem")
		.append("text") 
		.attr("class", "occupationItemName")
		.text(function(d) { 
				return d.TD[3]; 
		});

}

function drawForceGraph(content, dataType) { 

	var width = 450, 
		height = 400; 

	var totalEnterpriseScale = d3.scale.pow().exponent(1/2) 
		.domain([0, 10000000])
		.range([10, 50]); 

	var nodes = content.map(function(d) { 

		if (isNaN(d.TD[0].P)) {
			return { 
				totalEnterprise: d.TD[0], 
				midSmallEnterprise: d.TD[1], 
				percentage: d.TD[2], 
				name: d.TD[3]
			};
		}
		else { 
			return { 
			totalEnterprise: d.TD[0].P, 
			midSmallEnterprise: d.TD[1].P, 
			percentage: d.TD[2].P, 
			name: d.TD[3]
		};
	}
	}); 

	nodes.shift(); 

	var force = d3.layout.force() 
		.charge(-120)
		.size([width, height]); 

	force
		.nodes(nodes)
		.start(); 

	var node = svg.selectAll("circle") 
		.data(nodes)
		.enter().append("circle")
		.attr("id", function(d) { return d.name })
		.attr("class", dataType)
		.attr("stroke", "none")
		.attr("r", function(d) { return totalEnterpriseScale(d.totalEnterprise); })
		.style("fill", function(d) { return colorScale(d.name); })
		.call(force.drag)
		.on("mouseover", function() { 
			
			d3.select(this) 
				.attr("stroke-width", "2px")
				.attr("stroke", "#000");
		
			var identification = d3.select(this).attr("id");
			transitionPieChart(content, identification);
			update(identification); 
		})
		.on("mouseleave", function() { 
			d3.selectAll("circle")
				.attr("stroke", "none"); 
		});
		

	force.on("tick", function() { 

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });

	});

	function update(id) { 

	var theItem; 

		console.log(content); 
		console.log(theItem); 

		for (var i = 0; i < content.length; i++) { 
			if (isNaN(content[i].TD.P)) { 
				if (content[i].TD[3] == id) { 	
					theItem = content[i].TD; 
				}
				else {} 
			}

			else { 	
				if (content[i].TD[3].P == id) { 
					theItem = content[i].TD; 
				}
			}
		}

		$("#occupationName").text( function() { 
			if (isNaN(theItem[1].P)) { 
				$("#totalEnterpriseInfo").text(theItem[0].toLocaleString()); 
				$("#midSmallEnterpriseInfo").text(theItem[1].toLocaleString()); 
				$("#midSmallPercentage").text(theItem[2]); 
				return theItem[3]; 
			}
		
			else { 
				$("#totalEnterpriseInfo").text(theItem[0].P.toLocaleString()); 
				$("#midSmallEnterpriseInfo").text(theItem[1].P.toLocaleString()); 
				$("#midSmallPercentage").text(theItem[2].P); 
				return theItem[3]; 
			}
		}); 
		
	}

}

function drawPieChart(content) { 

	d3.selectAll("g.arc").remove(); 

	var ratio = []; 

	if (isNaN(content.TD[0])) { 
		ratio.push(content.TD[0]["P"] - content.TD[1]["P"]); 
		ratio.push(content.TD[1]["P"]); 
	}
	else { 
		ratio.push(content.TD[0] - content.TD[1]); 
		ratio.push(content.TD[1]); 
	}
	
	var innerRadius = 0; 
	var outerRadius = (svg_width - 20) / 2; 

	var arc = d3.svg.arc() 
		.innerRadius(0)
		.outerRadius(outerRadius); 

	var pie = d3.layout.pie() 
		.value(function(d) { return d; });
	
	var arcs = pieChartSVG.selectAll("g.arc")
		.data(pie(ratio))
		.enter()
		.append("g") 
		.attr("class", "arc")
		.attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")"); 

	var path = arcs.append("path") 
		.attr("fill", function(d, i) { 
			return colorScale(i); 
		})
		.each(function(d) { this._current = d; })
		.attr("d", arc);
} 

function transitionPieChart(content, identification) { 

	var theItem; 
	var ratio = []; 

	for (var i = 0; i < content.length; i++) { 
		if (isNaN(content[i].TD[0])) { 
			if (content[i].TD[3] == identification) { 
				theItem = content[i].TD;
				ratio.push(theItem[0].P - theItem[1].P); 
				ratio.push(theItem[1].P); 
			}
			else {}
		}
		else { 
			if (content[i].TD[3] == identification) {
				theItem = content[i].TD;
				ratio.push(theItem[0] - theItem[1]); 
				ratio.push(theItem[1]); 
			}
			else {}
		}
	}

	console.log(ratio); 
	
	pieChartSVG.selectAll("path").data(pie(ratio)).transition().duration(500) 
		.attrTween("d", arcTween); 

	function arcTween(a) {
	        var i = d3.interpolate(this._current, a);
	        this._current = i(0);
	        return function(t) { return arc(i(t));    };
	    }     

}
