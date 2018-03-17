var warning_color = "red", 
    normal_color = "#00BFFF",
    color_set = d3["schemeSet3"].slice(0,1).concat(d3["schemeSet3"].slice(2,6).concat(d3["schemeSet3"].slice(9)));

var slopemargin = {top: 40, right: 40, bottom: 40, left: 60},
    slopewidth = 450 - slopemargin.left - slopemargin.right, 
    slopeheight = 432 - slopemargin.top - slopemargin.bottom,
    axiswidth = slopewidth + 10;

var slopecont;

var lineCont, second_lineCont;

$(function(){
    if(window.innerWidth < 768){
        slopewidth = 400 - slopemargin.left - slopemargin.right, 
        slopeheight = 384 - slopemargin.top - slopemargin.bottom,
        axiswidth = slopewidth + 10;
    }

    slopecont = d3.select("#slopesvg")
    .attr('width', window.innerWidth >= 768 ? "542" : "442") 
    .attr('height', slopeheight + slopemargin.top + slopemargin.bottom + 100)
    .attr('id', "slopesvg")
    .append("g")
    .attr('id', "slopeGroup");

    lineCont = slopecont.append("g"), 
    second_lineCont = slopecont.append("g"); 

    render_slopeDiagram(data2016, undefined);

    d3.selectAll(".div").attr('height', "500px");
});

function render_slopeDiagram(new_data, highlight_index){

    var total_consumption = 0 , total_population = 0, 
        data_source = new_data;

    for (var i = 0; i < data_source.length; i++) {
        var ele = data_source[i];
        total_consumption += ele.consumption;
        total_population += ele.population;
    }

    var conScale = d3.scaleLinear()
                    .domain([d3.min(data_source, function(d){ return d.consumption/total_consumption; }),
                            d3.max(data_source, function(d){ return d.consumption/total_consumption; })
                    ])
                    .range([slopeheight, 0]),

        popScale = d3.scaleLinear()
                    .domain([d3.min(data_source, function(d){ return d.population/total_population; }),
                            d3.max(data_source, function(d){ return d.population/total_population; })
                    ])
                    .range([slopeheight, 0]),

        usedScale = d3.max(data_source, function(d){ return d.consumption/total_consumption;})>d3.max(data_source, function(d){ return d.population/total_population;})?conScale:popScale;

    var new_line = lineCont.selectAll("line")
                            .data(data_source);

    new_line.enter()
            .append("line")
            .attr('class', "slope")
            .attr('id', function(d,i){ return "slope"+i; });
            
    new_line.transition()
            .attr('x1', 0+20)
            .attr('y1', function(d,i){ return usedScale(d.population/total_population); })
            .attr('x2', slopewidth-20)
            .attr('y2', function(d,i){ return usedScale(d.consumption/total_consumption); })
            .style('stroke', function(d,i){ return (i<=5)?color_set[i]:color_set[6]})            
            .style('stroke-width', "2px")
            .on("end", function(d,i){
                if(i === highlight_index)
                {
                    highlightASlope(i);
                }
            });

    new_line.exit().transition().remove();

    var new_circle_L = lineCont.selectAll("circle")
                            .data(data_source);

    new_circle_L.enter()
            .append("circle")
            .attr('class', "circle")
            .attr('id', function(d,i){ return "circle"+i; });
            
    new_circle_L.transition()
            .attr('cx', 0+20)
            .attr('cy', function(d){ return usedScale(d.population/total_population); })
            .attr('r', "3px")
            .style('position', "absolute")
            .style('z-index', "9999")
            .style('stroke', function(d){ return (d.population/total_population)<(d.consumption/total_consumption)?warning_color:normal_color})
            .style('stroke-width', "2px")
            .on("end", function(d,i){
                if(i === highlight_index)
                {
                    highlightTwoCircle(highlight_index);
                }
            });

    new_circle_L.exit().transition().remove();

    var new_circle_R = second_lineCont.selectAll("circle")
                            .data(data_source);

    new_circle_R.enter()
            .append("circle")
            .attr('class', "circle")
            .attr('id', function(d,i){ return "circle"+i; });
            
    new_circle_R.transition()
            .attr('cx', slopewidth-20)
            .attr('cy', function(d){ return usedScale(d.consumption/total_consumption); })
            .attr('r', "3px")
            .style('position', "absolute")
            .style('z-index', "9999")
            .style('stroke', function(d){ return (d.population/total_population)<(d.consumption/total_consumption)?warning_color:normal_color})
            .style('stroke-width', "2px")
            .on("end", function(d,i){
                if(i === highlight_index)
                {
                    highlightTwoCircle(highlight_index);
                }
            });

    new_circle_R.exit().transition().remove();

    if(signal == 1)
    {
        $("#slopeAxis").remove();
        $("#slopesvg text").remove();
        slopecont.append("g")
        .style('stroke-dasharray', "30, 20")
        .style('stroke-width', "4px")
        .attr('id', "slopeAxis")
        .call(d3.axisLeft(usedScale)
                .tickFormat(function(d){ return d*100 + "%"; })
                .tickSize(-(axiswidth),0)
                .ticks(7)
                .tickValues(d3.range(0, 25/100, 4/100))
            )
        .selectAll("g.tick line")
        .attr('opacity', "0.2")
        .style('stroke', "lightgray");
        

        d3.select("#slopesvg")
        .append("text")
        .text("人口佔全國比例")
        .attr('x', 40)
        .attr('y', slopeheight + 1.3*slopemargin.top + slopemargin.bottom - 10)
        .attr('style', "fill: " + d3["schemeCategory10"][0] + "; font-size: 15px");
        
        d3.select("#slopesvg")
        .append("text")
        .text("年用水量佔全國比例")
        .attr('x', (window.innerWidth > 768) ?
            542 - 220 : 442 - 220)
        .attr('y', slopeheight + 1.3*slopemargin.top + slopemargin.bottom - 10)
        .attr('style', "fill: " + d3["schemeCategory10"][0] + "; font-size: 15px");
    }

    d3.selectAll("g#slopeAxis g.tick text")
    .attr('opacity', "0.4");
    slopecont.select("#slopeAxis path.domain")
    .attr('display', "none");

    var x_displace = ($("#slopesvg").width()-(axiswidth + 30 - 45))/2;
    x_displace = window.innerWidth > 768 ? x_displace : (x_displace-20);
    d3.select("#slopeGroup").attr('transform', "translate("+ x_displace +","+(1.3*slopemargin.top)+")");
}

function slopeReplyRegionMenu(region_index){
    recoverSlope();
    recoverCircle();

    var selectedRegion = d3.select("#drop-down-region").property("value");
    if(selectedRegion != "---"){
        for (var i = 0; i < 22; i++) {
            if(region_list[i] === selectedRegion)
            {
                break;
            }
        }
        highlightASlope(i);
        highlightTwoCircle(i);
    }
}

function recoverSlope(){
    d3.selectAll(".slope")
        .style('stroke-width', "2px")
        .attr('opacity', "1");
}

function highlightASlope(slope_index){
    d3.selectAll(".slope")
    .each(function(d,index){
        if(index == slope_index){
            d3.select(this)
                .attr('opacity', "1")
                .style('stroke-width', "7px");
        }
        else if(slope_index<=21 && slope_index>=0){
            d3.select(this)
                .attr('opacity', "0.05");
        }
    });
}

function recoverCircle(){
    d3.selectAll(".circle")
        .attr('r', "3px")
        .style('stroke-width', "2px")
        .style('z-index', "9999")
        .attr('opacity', "1");
    
    $(".prompt-text").remove();
}

function highlightTwoCircle(slope_index){
    d3.selectAll(".circle")
    .each(function(d,index){
        if(index == slope_index || (index-22) == slope_index){
            var here = d3.select(this);
            d3.select(this)
            .attr('r', "8px")
            .attr('opacity', "1")
            .style('stroke-width', "7px");

            d3.select("#slopesvg")
            .append("text")
            .attr('class', "prompt-text")
            .attr('x', $(this).offset().left - $("#slopesvg").offset().left - 10)
            .attr('y', $(this).offset().top-$(".right-div").offset().top)
            .text(index == slope_index? 
                (100*(population_list[slope_index]/total_population)).toFixed(2)+"%" :
                (100*(consumption_list[slope_index]/total_consumption)).toFixed(2)+"%");
        }
        else{
            d3.select(this)
                .attr('opacity', "0.05")
                .style('z-index', "-1");
        }
    });
}