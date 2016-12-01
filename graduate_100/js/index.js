var field_list = ["教育領域","人文及藝術領域","社會科學、商業及法律領域",
					"科學領域","工程、製造及營造領域","農學領域",
					"衛福","服務領域", "其他領域"];
var first = false;
var margin = {top: 10, right: 0, bottom: 140, left: 0};
var height = 450, padding = 30, barMargin = 5, axisPadding = 80 , legendPadding = 120;
var width = 800 + axisPadding + legendPadding;
var changed = false, setChangeNumber = "id14";
function filterJSON(json, key, value) {
    var result = [];
    for (var foo in json) {
        if (json[foo][key] === value) {
            result.push(json[foo]);
        }
    }
    return result;
}
//
function updataDisciplineName(data){
    var temp=[];
    for(var foo in data){
        temp.push(data[foo].discipline);
    }
    return temp;
}
window.onload = function(){
	d3.select("#column").append("initChart")
						.append("svg")
                        .attr("width", width)
	                    .attr("height", height)
	                    .attr("class", "initChart")
    d3.select("#column2").append("changeChart")
    					.append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("class", "changeChart");
    d3.selectAll("#radioBox").on("change", function(){
        if(this.value === "university"){
			first = false;
            pageInitUniversity();
            pageChangeUniversity(setChangeNumber);
        }else if(this.value === "master"){
			first = false;
            pageInitMaster();
            pageChangeMaster(setChangeNumber);
        }
    });
    pageInitUniversity();
    pageChangeUniversity(setChangeNumber);
    d3.select("#backButton").on("click", function(){
    	$(function(){
    		console.log("fuck");
			$("main, #layout-header").stop().animate({scrollTop:$("#scrollTarget").prop("scrollHeight")*2.4}, 700, 'linear');
        })
    })
};
function pageInitUniversity(){
    d3.selectAll(".initChart *").remove();
    //why not d3.selection ...??
    d3.selectAll("#checkAverage").property("checked", false);
    d3.selectAll("#checkSort").property("checked", false);
    d3.csv("data/data.csv", function(error, data){
        if (error){
            console.log(error);
        }

        var yMax = d3.max(data, function(d){return parseInt(d.university_salary);});
        var yMin = d3.min(data, function(d){
            if(d.university_salary != 0){
                return parseInt(d.university_salary);
            }
        });
        var xScale = d3.scale.linear()
                        .domain([0, data.length])
                        .range([padding + axisPadding, width - legendPadding - margin.left - margin.right - padding]);
        //to handle the problem that having only one data
        var yScale = data.length == 1 ?
                        d3.scale.linear()
                            .domain([0, yMax])
                            .range([padding, height - margin.top - margin.bottom - padding]):
                        d3.scale.linear()
                            .domain([yMin, yMax])
                            .range([padding, height - margin.top - margin.bottom - padding]);
        var yScale2 =   d3.scale.linear()
                            .domain([yMin, yMax])
                            .range([height - margin.top - margin.bottom - padding, padding]);

        var svg = d3.select(".initChart");

        //yAxis
        var yAxis = d3.svg.axis()
                            .scale(yScale2)
                            .tickSize(1)
                            .orient('left');
        svg.append("g")
            .attr({
                "class": "yAxis",
                "transform": "translate(" + axisPadding +",0)"
            })
            .call(yAxis)
            .append("text")
            .attr({
                "text-anchor": "start",
            });
        svg.append("text")
            .attr({
                "class": "yLabel",
                "text-anchor": "end",
                "x": axisPadding,
                "y": height - margin.top - margin.bottom - padding,
                "dy": ".75em",
                "opacity": 0.5
//                "transform": "rotate(-90)"
            })
            .text("(新台幣)");
        var last_field_name;
        var new_xScale = [];
        var new_yScale = [];
        //bar chart
        var bar = svg.selectAll(".point")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr('class', 'point');
        var color = d3.scale.category20b();
        bar.attr({
                "fill": function(d, i){
                    if(d.university_salary === 0){
                        return "#202020";
                    }
                    return color(parseInt(d.code / 100));
                },
                "cx": function(d, i){
                	if(d.field != last_field_name){
             			new_xScale.push(xScale(i));
         				new_yScale.push(height - margin.top - margin.bottom - yScale(d.university_salary));
             			last_field_name = d.field;
                	}
                    return xScale(i);
                },
                "cy": height - margin.top - margin.bottom,
                "r": function(d) {
                    if(d.university_salary == 0 ){
                        return 0;
                    }else{
                        return Math.sqrt(yScale(d.university_salary));
                    }
                },
                "opacity": 0.5,
                "id": function(d){
                    return "id" + parseInt(d.code / 100);
                },
                "class": function(d){
                    return  d.subject + "<br><span style=\"font-size:0.7em\">" + d.field + "領域</span>";
                },
                })
            .on("mouseover", function(){
                var setNumber = d3.select(this).property("id");
                var selectClass = d3.select(this).attr("class");
                d3.selectAll("#" + setNumber).attr({
                    "opacity": 0.9,
                    "stroke": "rgba(0, 0, 0, 0.12)",
                    "stroke-width": 2,
					"cursor": "pointer",
                });
                $(".info").empty().html(selectClass);
            })
            .on("mouseout", function(){
                var setNumber = d3.select(this).property("id");
                d3.selectAll("#" + setNumber).attr({
                        "opacity": 0.5,
                        "stroke": "rgba(0, 0, 0, 0.12)",
                        "stroke-width": 0,
                });
            })
            .on("click", function(){
                setChangeNumber = d3.select(this).property("id");
                changed = true;
                pageChangeUniversity(setChangeNumber);
                console.log("fuck");
                $("main, #layout-header").stop().animate({scrollTop:$("#column2").prop("scrollHeight")+height/1.21}, 700, 'linear')
     //            $(function(){
					// $("main. ").stop().animate({scrollTop:document.getElementById('superContainer').scrollHeight}, 700, 'linear');
     //            })
            })
            .transition()
            .duration(1000)
            .attr({
                "cy": function(d){
                    if(d.university_salary != 0){
                        return height - margin.top - margin.bottom - yScale(d.university_salary);
                    }
                },
            });
        //field_text
        svg.selectAll(".field_text")
        	.data(field_list)
        	.enter()
        	.append("text")
        	.attr({
        		"class": "field_text",
        		"x": function(d,i){
        			if(i!=new_xScale.length-1)
        				return (new_xScale[i]+new_xScale[i+1])/2;
        			return new_xScale[i];
        		},
        		"y": function(d,i){
        			return new_yScale[i];
        		},
        		"dy": function(d,i){
        			if(new_yScale[i] - 2*16 >0)
        				return "-3.5em";
        		},
        		"fill": "#666666",
        	})
        	.text(function(d,i){
        		if(new_yScale[i] > (height - margin.top - margin.bottom)){
        			return;
        		}
        		return d.slice(0,2);
        	})
        	.style({
        		"text-anchor": "middle",
        		"letter-spacing": "1px",
        		"cursor": "none",
        	});
        //legend
        var legendData = [];
        var legendText = [];
        var legendField= [];
        var foo = 0;
        for(var foobar in data){
            if(parseInt(data[foobar]["code"] / 100) != foo){
                foo = parseInt(data[foobar]["code"] / 100);
                legendData.push(foo);
                legendText.push(data[foobar]["subject"].slice(0,-2));
                legendField.push(data[foobar]["field"]);
            }
        }
        var legend = svg.selectAll(".legend")
                        .data(legendData)
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function(d, i) { return "translate(" + (width - legendPadding) + "," + i * 18 + ")"; });

        legend.append("rect")
                .attr({
                    "width": 10,
                    "height": 10,
                    "fill": function(d){
                        return color(d);
                    },
                    "id": function(d){
                        return "id" + d;
                    },
                    "opacity": 0.5,
                    "class": function(d, i){
                    	return  legendText[i] + "學門<br><span style=\"font-size:0.7em\">" + legendField[i]  + "領域</span>";
                    },
                })
            .on("mouseover", function(){
                var setNumber = d3.select(this).property("id");
                var selectClass = d3.select(this).attr("class");
                d3.selectAll("#" + setNumber).attr({
                    "opacity": 0.9,
                    "stroke": "rgba(0, 0, 0, 0.12)",
                    "stroke-width": 2,
					"cursor": "pointer",
                });
                $(".info").empty().html(selectClass);
            })
            .on("mouseout", function(){
                var setNumber = d3.select(this).property("id");
                d3.selectAll("#" + setNumber).attr({
                    "opacity": 0.5,
                    "stroke": "rgba(0, 0, 0, 0.12)",
                });
            })
            .on("click", function(){
                setChangeNumber = d3.select(this).property("id");
                changed = true;
                pageChangeUniversity(setChangeNumber);
                $(function(){
					$("main, #layout-header").stop().animate({scrollTop:$("#column2").prop("scrollHeight")+height/1.21}, 700, 'linear');
                })
            });


        legend.append("text")
                .attr({
                    "x": "20",
                    "y": "5",
                    "dy": ".4em",
                })
                .style({
                    "text-anchor": "start",
                    "font-size": "0.7em",
                })
                .text(function(d, i) { return legendText[i]; });
        //line
          svg.append("line")
            .attr({
              "x1": axisPadding,
              "y1": yScale2(47300),
              "x2": width - legendPadding - margin.left - margin.right - padding,
              "y2": yScale2(47300),
              "stroke": "#ee86ba",
              "stroke-width": 2,
              "stroke-dasharray": 10,
              "id": "averageLine",
              "opacity": 0,
            })


        svg.append("text")
            .attr({
                "x": width/2,
                "y": yScale2(yMax),
                "dy": "-.70em",
                "id": "averageText",
                "opacity": 0,
            })
            .text("103年全國平均月薪資：47300(新台幣)")
            .style({
                "fill": "#ee86ba",
                "text-anchor": "middle",
                "font-size": 16,
            })
        d3.select("#checkAverage")//maleAverage(checkbox) <--> on click function
            .on("click", function(){
                if(d3.select("#averageLine").attr("opacity")==0&&
                   d3.select("#averageText").attr("opacity")==0){
                    d3.select("#averageLine").attr("opacity", 1);
                    d3.select("#averageText").attr("opacity", 1);
                }else{
                    d3.select("#averageLine").attr("opacity", 0);
                    d3.select("#averageText").attr("opacity", 0);
                }
            })
//        check if sort?
        var sorted = false;
        d3.select("#checkSort")
            .on("click", function(){
                if(sorted == false){
                    sort();
                    sorted = true;
                    svg.selectAll(".field_text").style("opacity",0);
                }else{
                    sort2();
                    sorted = false;
                    svg.selectAll(".field_text").style("opacity",1);
                }
            });
        var sort = function() {
                        svg.selectAll("circle")
                        .sort(function(a, b){
                            return d3.ascending(a.university_salary, b.university_salary);
                        })
                        .transition()
                        .duration(1000)
				        .attr("cx", function(d, i) {
				   	        return xScale(i);
				        });
                    };
        var sort2 = function() {
                        svg.selectAll("circle")
                        .sort(function(a, b){
                            return d3.ascending(a.code, b.code);
                        })
                        .transition()
                        .duration(1000)
				        .attr("cx", function(d, i) {
				   	        return xScale(i);
				        });
                    };
    });
}
function pageChangeUniversity(selectNumber) {
    selectNumber = selectNumber.slice(2);
// d3 to visualize
    d3.selectAll(".changeChart *").remove();
    d3.csv("data/data_" + selectNumber +  ".csv", function(error, datasheet){
        if (error){
        console.log(error);
    }

        var yMax = d3.max(datasheet, function(d){return parseInt(d.university_salary);});
        var yMin = d3.min(datasheet, function(d){
            if(d.university_salary != 0){
                return parseInt(d.university_salary);
            }
        });
        if(yMax <= 47300){
            yMax = 47300;
        }else if(yMin>=47300){
            yMin = 47300;
        }
        var xScale = d3.scale.linear()
                        .domain([0, datasheet.length])
                        .range([padding , width - margin.left - margin.right - padding]);
        //to handle the problem that having only one data
        var yScale = datasheet.length == 1 ?
                        d3.scale.linear()
                            .domain([0, yMax])
                            .range([padding, height - margin.top - margin.bottom - padding]):
                        d3.scale.linear()
                            .domain([yMin, yMax])
                            .range([padding, height - margin.top - margin.bottom - padding]);
        var yScale2 =   d3.scale.linear()
                            .domain([yMin, yMax])
                            .range([height - margin.top - margin.bottom - padding, padding]);

        var svg = d3.select(".changeChart");
        // var svg = d3.select("#column2").append("changeChart").append("svg")
        //                             .attr("width", width)
        //                             .attr("height", height);
        svg.selectAll(".salary")
            .data(datasheet.sort(function(a, b){
				return d3.ascending(a.university_salary, b.university_salary);
			 }))
            .enter()
            .append("text")
            .attr("class", "salary")
            .text(function(d){
                if(d.university_salary == 0){
                    return "無資料";
                }
                return d.university_salary;
            })
            .attr({
                "x": function(d, i){
                    return xScale(i);
                },
                "y": height - margin.top - margin.bottom,
                "text-anchor": "center",
                "font-size": "1em",
            })
            .transition()
            .duration(1000)
            .attr({
                "y": function(d){
                    if(d.university_salary != 0 ){
                        return height - margin.top - margin.bottom - yScale(d.university_salary)  - 5;
                    }else{
                        return height - margin.top - margin.bottom;
                    }
                }
            });
        var barWidth = ((width - padding * 2) / datasheet.length) - barMargin;
        if(barWidth >= 300){
            barWidth = 241.66666666666666;
        }
    //bar chart
        var bar = svg.selectAll(".barChart")
                    .data(datasheet.sort(function(a, b){
						return d3.ascending(a.university_salary, b.university_salary);
                     }))
                    .enter()
                    .append("rect")
                    .attr('class', 'barChart');
        bar.attr({
            "fill": function(d){
				if(first == false){
					return "#393b79"
				}
                return d3.selectAll("#id" + selectNumber).attr("fill");
            },
            "x": function(d, i){
				first = true;
                return xScale(i);
            },
            "y": height - margin.top - margin.bottom,
            "width": barWidth,
            "height": 0,
            "opacity": function(d, i){
				return (0.9/datasheet.length)*(i+1);
			},
            "id": function(d){
                return "bar_id" + d.code;
            }
            })
        	.on("mouseover", function(){
        		d3.select(this).style("cursor","pointer");
        	})
        	.on("mouseout", function(){
        		d3.select(this).style("cursor", "none");
        	})
            .on("click", function(){
                var setNumber = d3.select(this).property("id").slice(6);
                var setOpa = d3.select(this).attr("opacity");
                if(d3.select(this).attr("opacity") != 1){
                    bar.attr({
                            "fill": function(d, i){
                                if(d.code != setNumber){
                                    return "#000";
                                }
                                return d3.selectAll("#id" + selectNumber).attr("fill");
                            },
                            "opacity": 0.2,
                            });
                    d3.selectAll("#bar_id" + setNumber).attr({
                        "opacity": 1,
                        "stroke": "rgba(0, 0, 0, 0.16)",
                        "stroke-width": 5,
                    });
                }else{
                    d3.selectAll("#bar_id" + setNumber).attr({
                        "stroke-width": 0,
                    });
                    bar.attr({
                        "fill": function(d){
                            return d3.selectAll("#id" + selectNumber).attr("fill");
                        },
                        "opacity": function(d,i){
							return (0.9/datasheet.length)*(i+1);
						}
                    });
                }
            })
            .transition()
            .duration(1000)
            .attr({
                "y": function(d){
                    if(d.university_salary !== 0){
                        return height - margin.top - margin.bottom - yScale(d.university_salary);
                    }
                },
                "height": function(d){
                    if(d.university_salary != 0){
                        return yScale(d.university_salary);
                    }
                }
            });

            //TEXT
            //x axis
        var disciplineName = updataDisciplineName(datasheet)
        var xAxisTick = d3.svg.axis()
                    .scale(xScale)
                    .tickFormat(function(d, i) { return disciplineName[i]; })
                    .tickSize(0)
                    .ticks(datasheet.length)
                    .orient("bottom");

        svg.append("g")
            .attr({
                "class": "xAxis",
                "transform": "translate(" + (barWidth/2) + "," + (height - margin.top - margin.bottom) + ")"
            })
            .call(xAxisTick)
            .selectAll("text")
            .style({
                "font-size": "14px",
                "text-anchor": "start",
                "letter-spacing": "1px",
                "color": "#666666"
            })
            .attr({
                // "writing-mode": "vertical-lr",
                "transform": "rotate(35)",
            });
        //line
        svg.append("line")
            .attr({
              "x1": padding,
              "y1": yScale2(47300),
              "x2": width - margin.left - margin.right - padding,
              "y2": yScale2(47300),
              "stroke": "#ee86ba",
              "stroke-width": 2,
              "stroke-dasharray": 10,
              "id": "averageLine2",
              "opacity": 1,
            })


        svg.append("text")
            .attr({
                "x": width/2,
                "y": yScale2(yMax),
                "dy": "-0.70em",
                "id": "averageText2",
                "opacity": 1,
            })
            .text("103年全國平均月薪資：47300(新台幣)")
            .style({
                "fill": "#ee86ba",
                "text-anchor": "middle",
                "font-size": 16,
            })
		document.getElementById("checkAverage2").checked = true;
        d3.select("#checkAverage2")//maleAverage(checkbox) <--> on click function
            .on("click", function(){
                if(d3.select("#averageLine2").attr("opacity")==0&&
                   d3.select("#averageText2").attr("opacity")==0){
                    d3.select("#averageLine2").attr("opacity", 1);
                    d3.select("#averageText2").attr("opacity", 1);
                }else{
                    d3.select("#averageLine2").attr("opacity", 0);
                    d3.select("#averageText2").attr("opacity", 0);
                }
            })
        //        check if sort?
		var sorted = true;
		document.getElementById("checkSort2").checked = true;
        d3.select("#checkSort2")
            .on("click", function(){
                if(sorted == false){
                    sort();
                    sorted = true;
                }else{
                    sort2();
                    sorted = false;
                }
            });
        var sort = function() {
                        svg.selectAll("rect")
                            .sort(function(a, b){
                                return d3.ascending(a.university_salary, b.university_salary);
                            })
                            .transition()
                            .duration(1000)
				            .attr("x", function(d, i) {
				   	            return xScale(i);
				            });

                        svg.selectAll(".salary")
                            .sort(function(a, b){
                                return d3.ascending(a.university_salary, b.university_salary);
                            })
                            .transition()
                            .duration(1000)
				            .attr("x", function(d, i) {
				   	            return xScale(i);
				            });
                        disciplineName = updataDisciplineName(datasheet.sort(function(a, b){
                            return d3.ascending(a.university_salary, b.university_salary);
                        }))
            //            var disciplineName = updataDisciplineName(datasheet);
                        xAxisTick = d3.svg.axis()
                                    .scale(xScale)
                                    .tickFormat(function(d, i) { return disciplineName[i]; })
                                    .tickSize(0)
                                    .ticks(datasheet.length)
                                    .orient("bottom");
            //            d3.selectAll(".xAxis").remove();
                        svg.selectAll(".xAxis")
                            .transition()
                            .duration(1000)
                            .call(xAxisTick)
                            .selectAll("text")
                            .style({
                                "font-size": "14px",
                                "text-anchor": "start",
                                "letter-spacing": "1px",
                                "color": "#666666"
                            })
                            .attr({
                                // "writing-mode": "vertical-lr",
                                "transform": "rotate(35)",
                            });
                    };
        var sort2 = function() {
                        svg.selectAll("rect")
                            .sort(function(a, b){
                                return d3.ascending(a.code, b.code);
                            })
                            .transition()
                            .duration(1000)
				            .attr("x", function(d, i) {
				   	            return xScale(i);
				            });
                        svg.selectAll(".salary")
                            .sort(function(a, b){
                                return d3.ascending(a.code, b.code);
                            })
                            .transition()
                            .duration(1000)
				            .attr("x", function(d, i) {
				   	            return xScale(i);
				            });
                        disciplineName = updataDisciplineName(datasheet.sort(function(a, b){
                            return d3.ascending(a.code, b.code);
                        }))
                        xAxisTick = d3.svg.axis()
                                    .scale(xScale)
                                    .tickFormat(function(d, i) { return disciplineName[i]; })
                                    .tickSize(0)
                                    .ticks(datasheet.length)
                                    .orient("bottom");
                        svg.selectAll(".xAxis")
                            .transition()
                            .duration(1000)
                            .call(xAxisTick)
                            .selectAll("text")
                            .style({
                                "font-size": "14px",
                                "text-anchor": "start",
                                "letter-spacing": "1px",
                                "color": "#666666"
                            })
                            .attr({
                                // "writing-mode": "vertical-lr",
                                "transform": "rotate(35)",
                            });
                    };

    });
};
function pageInitMaster(){
    d3.selectAll(".initChart *").remove();
    d3.selectAll("#checkAverage").property("checked", false);
    d3.selectAll("#checkSort").property("checked", false);
    d3.csv("data/data.csv", function(error, data){
        if (error){
            console.log(error);
        }

        var yMax = d3.max(data, function(d){return parseInt(d.master_salary);});
        var yMin = d3.min(data, function(d){
            if(d.master_salary != 0){
                return parseInt(d.master_salary);
            }
        });
        var xScale = d3.scale.linear()
                        .domain([0, data.length])
                        .range([padding + axisPadding, width - legendPadding - margin.left - margin.right - padding]);
        //to handle the problem that having only one data
        var yScale = data.length == 1 ?
                        d3.scale.linear()
                            .domain([0, yMax])
                            .range([padding, height - margin.top - margin.bottom - padding]):
                        d3.scale.linear()
                            .domain([yMin, yMax])
                            .range([padding, height - margin.top - margin.bottom - padding]);
        var yScale2 =   d3.scale.linear()
                            .domain([yMin, yMax])
                            .range([height - margin.top - margin.bottom - padding, padding]);


		var svg = d3.select(".initChart");

        //yAxis
        var yAxis = d3.svg.axis()
                            .scale(yScale2)
                            .tickSize(1)
                            .orient('left');
        svg.append("g")
            .attr({
                "class": "yAxis",
                "transform": "translate(" + axisPadding +",0)"
            })
            .call(yAxis)
            .append("text")
            .attr({
                "text-anchor": "start",
            });
        svg.append("text")
            .attr({
                "class": "yLabel",
                "text-anchor": "end",
                "x": axisPadding,
                "y": height - margin.top - margin.bottom - padding,
                "dy": "1em",
                "opacity": 0.5
//                "transform": "rotate(-90)"
            })
            .text("(新台幣)");
        var last_field_name;
        var new_xScale = [];
        var new_yScale = [];
        //bar chart
        var bar = svg.selectAll(".point")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr('class', 'point');
        var color = d3.scale.category20b();
        bar.attr({
                "fill": function(d, i){
                    if(d.master_salary === 0){
                        return "#202020";
                    }
                    return color(parseInt(d.code / 100));
                },
                "cx": function(d, i){
                	if(d.field != last_field_name){
             			new_xScale.push(xScale(i));
         				new_yScale.push(height - margin.top - margin.bottom - yScale(d.master_salary));
             			last_field_name = d.field;
                	}
                    return xScale(i);
                },
                "cy": height - margin.top - margin.bottom,
//                    "width": barWidth,
//                    "height": 0,
                "r": function(d) {
                    if(d.master_salary == 0 ){
                        return 0;
                    }else{
                        return Math.sqrt(yScale(d.master_salary));
                    }
                },
                "opacity": 0.5,
                "id": function(d){
                    return "id" + parseInt(d.code / 100);
                },
                "class": function(d){
                    return  d.subject + "<br><span style=\"font-size:0.7em\">" + d.field + "領域</span>";
                },
                })
            .on("mouseover", function(){
                var setNumber = d3.select(this).property("id");
                var selectClass = d3.select(this).attr("class");
                d3.selectAll("#" + setNumber).attr({
                    "opacity": 0.9,
                    "stroke": "rgba(0, 0, 0, 0.12)",
                    "stroke-width": 2,
					"cursor": "pointer"
                });
                $(".info").empty().html(selectClass);
                $("#info_text").empty().text(selectClass);
            })
            .on("mouseout", function(){
                var setNumber = d3.select(this).property("id");
                d3.selectAll("#" + setNumber).attr({
                        "opacity": 0.5,
                        "stroke": "rgba(0, 0, 0, 0.12)",
                        "stroke-width": 0,
						"cursor": "none"
                });
            })
            .on("click", function(){
                setChangeNumber = d3.select(this).property("id");
                changed = true;
                pageChangeMaster(setChangeNumber);
                $(function(){
					$("main, #layout-header").stop().animate({scrollTop:$("#column2").prop("scrollHeight")+height/1.21}, 700, 'linear');
                })
            })
            .transition()
            .duration(1000)
            .attr({
                "cy": function(d){
                    if(d.master_salary != 0){
                        return height - margin.top - margin.bottom - yScale(d.master_salary);
                    }
                },
            });
        //field_name
        svg.selectAll(".field_text")
        	.data(field_list)
        	.enter()
        	.append("text")
        	.attr({
        		"class": "field_text",
        		"x": function(d,i){
        			if(i!=new_xScale.length-1)
        				return (new_xScale[i]+new_xScale[i+1])/2;
        			return new_xScale[i];
        		},
        		"y": function(d,i){
        			return new_yScale[i];
        		},
        		"dy": function(d,i){
        			if(new_yScale[i] - 2*16 >0)
        				return "-4em";
        		},
        		"fill": "#666666"
        	})
        	.text(function(d,i){
        		if(new_yScale[i] > (height - margin.top - margin.bottom)){
        			return;
        		}
        		return d.slice(0,2);
        	})
        	.style({
        		"text-anchor": "middle",
        		"letter-spacing": "1px",
        		"cursor": "none",
        	});
        //legend
        var legendData = [];
        var legendText = [];
        var legendField= [];
        var foo = 0;
        for(var foobar in data){
            if(parseInt(data[foobar]["code"] / 100) != foo){
                foo = parseInt(data[foobar]["code"] / 100);
                legendData.push(foo);
                legendText.push(data[foobar]["subject"].slice(0,-2));
                legendField.push(data[foobar]["field"]);
            }
        }
        var legend = svg.selectAll(".legend")
                        .data(legendData)
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function(d, i) { return "translate(" + (width - legendPadding) + "," + i * 18 + ")"; });

        legend.append("rect")
                .attr({
                    "width": 10,
                    "height": 10,
                    "fill": function(d){
                        return color(d);
                    },
                    "id": function(d){
                        return "id" + d;
                    },
                    "opacity": 0.5,
                    "class": function(d, i){
                        return  legendText[i] + "學門<br><span style=\"font-size:0.7em\">" + legendField[i]  + "領域</span>";
                    },
                })
            .on("mouseover", function(){
                var setNumber = d3.select(this).property("id");
                var selectClass = d3.select(this).attr("class");
                d3.selectAll("#" + setNumber).attr({
                    "opacity": 0.9,
                    "stroke": "rgba(0, 0, 0, 0.12)",
                    "stroke-width": 2,
					"cursor": "pointer",
                });
                $(".info").empty().html(selectClass);
            })
            .on("mouseout", function(){
                var setNumber = d3.select(this).property("id");
                d3.selectAll("#" + setNumber).attr({
                    "opacity": 0.5,
                    "stroke": "rgba(0, 0, 0, 0.12)",
                    "stroke-width": 0,
                });
            })
            .on("click", function(){
                setChangeNumber = d3.select(this).property("id");
                changed = true;
                pageChangeMaster(setChangeNumber);
                $(function(){
					$("main, #layout-header").stop().animate({scrollTop:$("#column2").prop("scrollHeight")+height/1.21}, 700, 'linear');
                })
            })
        legend.append("text")
                .attr({
                    "x": "20",
                    "y": "5",
                    "dy": ".4em",
                })
                .style({
                    "text-anchor": "start",
                    "font-size": "0.7em",
                })
                .text(function(d, i) { return legendText[i]; });
        //line
          svg.append("line")
            .attr({
              "x1": axisPadding,
              "y1": yScale2(47300),
              "x2": width - legendPadding - margin.left - margin.right - padding,
              "y2": yScale2(47300),
              "stroke": "#ee86ba",
              "stroke-width": 2,
              "stroke-dasharray": 10,
              "id": "averageLine",
              "opacity": 0,
            })


        svg.append("text")
            .attr({
                "x": width/2,
                "y": yScale2(yMax),
                "dy": "-.70em",
                "id": "averageText",
                "opacity": 0,
            })
            .text("103年全國平均月薪資：47300(新台幣)")
            .style({
                "fill": "#ee86ba",
                "text-anchor": "middle",
                "font-size": 16,
            })
        d3.select("#checkAverage")//maleAverage(checkbox) <--> on click function
            .on("click", function(){
                if(d3.select("#averageLine").attr("opacity")==0&&
                   d3.select("#averageText").attr("opacity")==0){
                    d3.select("#averageLine").attr("opacity", 1);
                    d3.select("#averageText").attr("opacity", 1);
                }else{
                    d3.select("#averageLine").attr("opacity", 0);
                    d3.select("#averageText").attr("opacity", 0);
                }
            })
//        check if sort?
        var sorted = false;
        d3.select("#checkSort")
            .on("click", function(){
                if(sorted == false){
                    sort();
                    sorted = true;
                    svg.selectAll(".field_text").style("opacity",0);
                }else{
                    sort2();
                    sorted = false;
                    svg.selectAll(".field_text").style("opacity",1);
                }
            });
        var sort = function() {
                        svg.selectAll("circle")
                        .sort(function(a, b){
                            return d3.ascending(a.master_salary, b.master_salary);
                        })
                        .transition()
                        .duration(1000)
				        .attr("cx", function(d, i) {
				   	        return xScale(i);
				        });
                    };
        var sort2 = function() {
                        svg.selectAll("circle")
                        .sort(function(a, b){
                            return d3.ascending(a.code, b.code);
                        })
                        .transition()
                        .duration(1000)
				        .attr("cx", function(d, i) {
				   	        return xScale(i);
				        });
                    };
    });
}
function pageChangeMaster(selectNumber) {
    selectNumber = selectNumber.slice(2);
    d3.selectAll(".changeChart *").remove();
// d3 to visualize
    d3.csv("data/data_" + selectNumber +  ".csv", function(error, datasheet){
        if (error){
        console.log(error);
    }

        var yMax = d3.max(datasheet, function(d){return parseInt(d.master_salary);});
        var yMin = d3.min(datasheet, function(d){
            if(d.master_salary != 0){
                return parseInt(d.master_salary);
            }
        });
        if(yMax <= 47300){
            yMax = 47300;
        }else if(yMin>=47300){
            yMin = 47300;
        }
        var xScale = d3.scale.linear()
                        .domain([0, datasheet.length])
                        .range([padding, width - margin.left - margin.right - padding]);
        //to handle the problem that having only one data
        var yScale = datasheet.length == 1 ?
                        d3.scale.linear()
                            .domain([0, yMax])
                            .range([padding, height - margin.top - margin.bottom - padding]):
                        d3.scale.linear()
                            .domain([yMin, yMax])
                            .range([padding, height - margin.top - margin.bottom - padding]);
        var yScale2 =   d3.scale.linear()
                            .domain([yMin, yMax])
                            .range([height - margin.top - margin.bottom - padding, padding]);



        var svg = d3.select(".changeChart");
        svg.selectAll(".salary")
            .data(datasheet.sort(function(a, b){
						return d3.ascending(a.master_salary, b.master_salary);
			 }))
            .enter()
            .append("text")
            .attr("class", "salary")
            .text(function(d){
                if(d.master_salary == 0){
                    return "無資料";
                }
                return d.master_salary;
            })
            .attr({
                "x": function(d, i){
                    return xScale(i);
                },
                "y": height - margin.top - margin.bottom,
                "text-anchor": "center",
                "font-size": "1em",
            })
            .transition()
            .duration(1000)
            .attr({
                "y": function(d){
                    if(d.master_salary != 0 ){
                        return height - margin.top - margin.bottom - yScale(d.master_salary)  - 5;
                    }else{
                        return height - margin.top - margin.bottom;
                    }
                }
            });
        //yAxis
        var barWidth = ((width - padding * 2) / datasheet.length) - barMargin;
        if(barWidth >= 300){
            barWidth = 241.66666666666666;
        }
        //bar chart
        var bar = svg.selectAll(".barChart")
                    .data(datasheet.sort(function(a, b){
						return d3.ascending(a.master_salary, b.master_salary);
                     }))
                    .enter()
                    .append("rect")
                    .attr('class', 'barChart');
        bar.attr({
            "fill": function(d){
				if(first == false){
					return "#393b79"
				}
                return d3.selectAll("#id" + selectNumber).attr("fill");
            },
            "x": function(d, i){
				first = true;
                return xScale(i);
            },
            "y": height - margin.top - margin.bottom,
            "width": barWidth,
            "height": 0,
            "opacity": function(d, i){
				return (0.9/datasheet.length)*(i+1);
			},
            "id": function(d){
                return "bar_id" + d.code;
            }
            })
        	.on("mouseover", function(){
        		d3.select(this).style("cursor","pointer");
        	})
        	.on("mouseout", function(){
        		d3.select(this).style("cursor", "none");
        	})
            .on("click", function(){
                var setNumber = d3.select(this).property("id").slice(6);
                var setOpa = d3.select(this).attr("opacity");
                if(d3.select(this).attr("opacity") != 1){
                    bar.attr({
                            "fill": function(d, i){
                                if(d.code != setNumber){
                                    return "#000";
                                }
                                return d3.selectAll("#id" + selectNumber).attr("fill");
                            },
                            "opacity": 0.2,
                            });
                    d3.selectAll("#bar_id" + setNumber).attr({
                        "opacity": 1,
                        "stroke": "rgba(0, 0, 0, 0.16)",
                        "stroke-width": 5,
                    });
                }else{
                    d3.selectAll("#bar_id" + setNumber).attr({
                        "stroke-width": 0,
                    });
                    bar.attr({
                        "fill": function(d){
                            return d3.selectAll("#id" + selectNumber).attr("fill");
                        },
                        "opacity": function(d,i){
							return (0.9/datasheet.length)*(i+1);
						}
                    });
                }
            })
            .transition()
            .duration(1000)
            .attr({
                "y": function(d){
                    if(d.master_salary !== 0){
                        return height - margin.top - margin.bottom - yScale(d.master_salary);
                    }
                },
                "height": function(d){
                    if(d.master_salary != 0){
                        return yScale(d.master_salary);
                    }
                }
            });
            //TEXT
            //x axis
        var disciplineName = updataDisciplineName(datasheet)
        var xAxisTick = d3.svg.axis()
                    .scale(xScale)
                    .tickFormat(function(d, i) { return disciplineName[i]; })
                    .tickSize(0)
                    .ticks(datasheet.length)
                    .orient("bottom");

        svg.append("g")
            .attr({
                "class": "xAxis",
                "transform": "translate(" + (barWidth/2) + "," + (height - margin.top - margin.bottom) + ")"
            })
            .call(xAxisTick)
            .selectAll("text")
            .style({
                "font-size": "14px",
                "text-anchor": "start",
                "letter-spacing": "1px",
                "color": "#666666"
            })
            .attr({
                // "writing-mode": "vertical-lr",
                "transform": "rotate(35)",
            });
        //line
        svg.append("line")
            .attr({
              "x1": padding,
              "y1": yScale2(47300),
              "x2": width - margin.left - margin.right - padding,
              "y2": yScale2(47300),
              "stroke": "#ee86ba",
              "stroke-width": 2,
              "stroke-dasharray": 10,
              "id": "averageLine2",
              "opacity": 1,
            })


        svg.append("text")
            .attr({
                "x": width/2,
                "y": yScale2(yMax),
                "dy": "-.70em",
                "id": "averageText2",
                "opacity": 1,
            })
            .text("103年全國平均月薪資：47300(新台幣)")
            .style({
                "fill": "#ee86ba",
                "text-anchor": "middle",
                "font-size": 16,
            })
		document.getElementById("checkAverage2").checked = true;
        d3.select("#checkAverage2")//maleAverage(checkbox) <--> on click function
            .on("click", function(){
                if(d3.select("#averageLine2").attr("opacity")==0&&
                   d3.select("#averageText2").attr("opacity")==0){
                    d3.select("#averageLine2").attr("opacity", 1);
                    d3.select("#averageText2").attr("opacity", 1);
                }else{
                    d3.select("#averageLine2").attr("opacity", 0);
                    d3.select("#averageText2").attr("opacity", 0);
                }
            })
        //        check if sort?
        var sorted = true;
		document.getElementById("checkSort2").checked = true;
        d3.select("#checkSort2")
            .on("click", function(){
                if(sorted == false){
                    sort();
                    sorted = true;
                }else{
                    sort2();
                    sorted = false;
                }
            });
        var sort = function() {
                        svg.selectAll("rect")
                            .sort(function(a, b){
                                return d3.ascending(a.master_salary, b.master_salary);
                            })
                            .transition()
                            .duration(1000)
				            .attr("x", function(d, i) {
				   	            return xScale(i);
				            });

                        svg.selectAll(".salary")
                            .sort(function(a, b){
                                return d3.ascending(a.master_salary, b.master_salary);
                            })
                            .transition()
                            .duration(1000)
				            .attr("x", function(d, i) {
				   	            return xScale(i);
				            });
                        disciplineName = updataDisciplineName(datasheet.sort(function(a, b){
                            return d3.ascending(a.master_salary, b.master_salary);
                        }))
            //            var disciplineName = updataDisciplineName(datasheet);
                        xAxisTick = d3.svg.axis()
                                    .scale(xScale)
                                    .tickFormat(function(d, i) { return disciplineName[i]; })
                                    .tickSize(0)
                                    .ticks(datasheet.length)
                                    .orient("bottom");
            //            d3.selectAll(".xAxis").remove();
                        svg.selectAll(".xAxis")
                            .transition()
                            .duration(1000)
                            .call(xAxisTick)
                            .selectAll("text")
                            .style({
                                "font-size": "14px",
                                "text-anchor": "start",
                                "letter-spacing": "1px",
                                "color": "#666666"
                            })
                            .attr({
                                // "writing-mode": "vertical-lr",
                                "transform": "rotate(35)",
                            });
                    };
        var sort2 = function() {
                        svg.selectAll("rect")
                            .sort(function(a, b){
                                return d3.ascending(a.code, b.code);
                            })
                            .transition()
                            .duration(1000)
				            .attr("x", function(d, i) {
				   	            return xScale(i);
				            });
                        svg.selectAll(".salary")
                            .sort(function(a, b){
                                return d3.ascending(a.code, b.code);
                            })
                            .transition()
                            .duration(1000)
				            .attr("x", function(d, i) {
				   	            return xScale(i);
				            });
                        disciplineName = updataDisciplineName(datasheet.sort(function(a, b){
                            return d3.ascending(a.code, b.code);
                        }))
                        xAxisTick = d3.svg.axis()
                                    .scale(xScale)
                                    .tickFormat(function(d, i) { return disciplineName[i]; })
                                    .tickSize(0)
                                    .ticks(datasheet.length)
                                    .orient("bottom");
            //            d3.selectAll(".xAxis").remove();
                        svg.selectAll(".xAxis")
                            .transition()
                            .duration(1000)
                            .call(xAxisTick)
                            .selectAll("text")
                            .style({
                                "font-size": "14px",
                                "text-anchor": "start",
                                "letter-spacing": "1px",
                                "color": "#666666"
                            })
                            .attr({
                                // "writing-mode": "vertical-lr",
                                "transform": "rotate(35)",
                            });
                    };
    });
};