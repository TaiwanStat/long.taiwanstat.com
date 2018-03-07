var warning_color = "red", 
    normal_color = "#00BFFF",
    color_set = d3["schemeSet3"].slice(0,1).concat(d3["schemeSet3"].slice(2,6).concat(d3["schemeSet3"].slice(9)));

var slopemargin = {top: 40, right: 40, bottom: 40, left: 60},
    slopewidth = 500 - slopemargin.left - slopemargin.right, // for axis and line(circle)
    slopeheight = 480 - slopemargin.top - slopemargin.bottom,
    axiswidth = slopewidth + 10;

    // svg 

/* var slopecont = d3.select("body")
                    .append("svg") */
var slopecont;

var lineCont, second_lineCont;

// This is not good method. 'Ready' function should be put together.
// But I want get more control about my graph and code, I choose to take 'ready' function apart.
$(function(){
    if(window.innerWidth < 768){
        slopewidth = 400 - slopemargin.left - slopemargin.right, // for axis and line(circle)
        slopeheight = 384 - slopemargin.top - slopemargin.bottom,
        axiswidth = slopewidth + 10;
    }

    slopecont = d3.select("#slopesvg")
    .attr('width', window.innerWidth >= 768 ? "632px" : "532px") //%
    .attr('height', slopeheight + slopemargin.top + slopemargin.bottom)
    .attr('id', "slopesvg")
    .append("g")
    // cause fail RWD
    //.attr('width', "50%")
    // in the end of rendering slope function, it will set correctly 'transform'
    // .attr('transform', "translate("+($("#slopesvg").width()/3)+","+slopemargin.top+")")
    // .attr('transform', "translate("+(slopemargin.left+30)+","+(slopemargin.top)+")")
    .attr('id', "slopeGroup");

    lineCont = slopecont.append("g"), //left circle and line
    second_lineCont = slopecont.append("g"); // right circle

    render_slopeDiagram(data2016, undefined);

    d3.selectAll(".div").attr('height', "500px");
});

function render_slopeDiagram(new_data, highlight_index){

    // if choose new year, 1. initial value 2. change data source
    var total_consumption = 0 , total_population = 0, 
        data_source = new_data;

    // get extra data
    for (var i = 0; i < data_source.length; i++) {
        var ele = data_source[i];
        total_consumption += ele.consumption;
        total_population += ele.population;
    }

    // set scale
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

    // line
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
            // .style('stroke', function(d){ return popScale(d.population/total_population)>conScale(d.consumption/total_consumption)?warning_color:normal_color;})
            .style('stroke-width', "2px")
            .on("end", function(d,i){
                if(!d3.select(".myCheckbox").property("checked")){
                    if(i === highlight_index)
                    {
                        highlightASlope(i);
                    }
                }
                else
                {
                    if(signal == 1)
                        checkedCheckbox();
                }
            });

    new_line.exit().transition().remove();

    // circle left
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
                if(!d3.select(".myCheckbox").property("checked")){
                    if(i === highlight_index)
                    {
                        highlightTwoCircle(highlight_index);
                    }
                }
                else
                {
                    if(signal == 1)
                        checkedCheckbox();
                }
            });

    new_circle_L.exit().transition().remove();

    // circle right
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
                if(!d3.select(".myCheckbox").property("checked")){
                    if(i === highlight_index)
                    {
                        highlightTwoCircle(highlight_index);
                    }
                }
                else
                {
                    if(signal == 1)
                        checkedCheckbox();
                }
            });

    new_circle_R.exit().transition().remove();

    // axis
    if(signal == 1)
    {
        // First, remove axis and text
        $("#slopeAxis").remove();
        $("#slopesvg text").remove();
        slopecont.append("g")
        .style('stroke-dasharray', "30, 20")
        .style('stroke-width', "4px")
        .attr('id', "slopeAxis")
        // get bigger value between population rate and consumption rate
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
        // .attr('x', $("#slopesvg").width()/5)
        // .attr('x', $("#slopeGroup").offset().left - $(".right-div").offset().left)
        .attr('x', 0)
        //.attr('x', 30)
        .attr('y', slopeheight + slopemargin.top + slopemargin.bottom - 10)
        .attr('style', "fill: " + d3["schemeCategory10"][0] + "; font-size: 15px");
        
        d3.select("#slopesvg")
        .append("text")
        .text("年用水量佔全國比例")
        // .attr('x', $("#slopesvg").width()*3/5)
        // .attr('x', $("#slopeGroup").offset().left - $(".right-div").offset().left + $("#slopesvg").width()*1/2)
        .attr('x', (window.innerWidth > 768) ?
            632 - 200 : 532- 200)
        //.attr('x', 350)
        .attr('y', slopeheight + slopemargin.top + slopemargin.bottom - 10)
        .attr('style', "fill: " + d3["schemeCategory10"][0] + "; font-size: 15px");
    }

    d3.selectAll("g#slopeAxis g.tick text")
    .attr('opacity', "0.4");
    slopecont.select("#slopeAxis path.domain")
    .attr('display', "none");

    // After render finished, update transform
    console.log("hi"+($("#slopesvg").width()-(axiswidth + 30)));
    // 30 for axis tag, 
    // 15~20 for average visiblity of graph, because graph have axis tag 
    var x_displace = ($("#slopesvg").width()-(axiswidth + 30 - 20))/2;
    x_displace = window.innerWidth > 768 ? x_displace : (x_displace-40);
    d3.select("#slopeGroup").attr('transform', "translate("+ x_displace +","+slopemargin.top+")");
}

// drop-down menu about "Region"
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
        //console.log(i);
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
    
    // delete text
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