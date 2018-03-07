function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

var color_set = d3["schemeSet3"];
var pie = d3.arc();
var region_list = [], population_list = [], consumption_list = [];
var pieAttr = pie.innerRadius(0)
                 .outerRadius(200)
                 .cornerRadius(3)
                 .padAngle(0.005)
                 .padRadius(200);

var pieScale = d3.arc()
                .innerRadius(0)
                .outerRadius(225)
                .cornerRadius(3)
                .padAngle(0.005)
                .padRadius(200);

// data
/* var cont = d3.select('body')
             .append("svg") */
var cont;

var signal = 0;

// pie
var pieData = [];
var data_source;
var total_consumption = 0 , total_population = 0;


$(function(){
    if(window.innerWidth < 768){
        pieAttr = pie.innerRadius(0)
        .outerRadius(150)
        .cornerRadius(3)
        .padAngle(0.005)
        .padRadius(150);

        pieScale = d3.arc()
        .innerRadius(0)
        .outerRadius(175)
        .cornerRadius(3)
        .padAngle(0.005)
        .padRadius(175);    
    }

    cont = d3.select("#piesvg")
    .attr('width', window.innerWidth >= 768 ? "480" : "400") //%
    .attr('height', window.innerWidth >= 768 ? "450" : "375")
    .attr('id', "piesvg")
    .append("g")
    .attr('transform', "translate("+($("#piesvg").width()/2)+","+(d3.select("#piesvg").attr("height")/2)+")")
    .attr('id', "pieChartGroup")
    .attr('opacity', "1");

    updatePieChart(data2016,undefined);
});

function updatePieChart(new_data, highlight_index){

    // if choose new year, 1. initial value 2. change data source
    total_consumption = 0 , total_population = 0;
    pieData = [];
    data_source = new_data;

    // get extra data
    for (var i = 0; i < data_source.length; i++) {
        var ele = data_source[i];
        total_consumption += ele.consumption;
        total_population += ele.population;
    }

    // display extra data under pie chart
    if(signal == 1){
        $("#pie-year").html(d3.select("#drop-down-year").property("value").slice(4) + " 年");
        $("#pie-total-population").html("總用水人口數量 ： " + numberWithCommas(total_population) + "  人");
        $("#pie-total-consumption").html("總用水量： " + numberWithCommas(total_consumption) + " 千公升");
    }

    // get the pie chart data
    var doublePi = 2*Math.PI;
    for (var j = 0; j < data_source.length; j++) {
        var elem = data_source[j];
        pieData.push({  label: elem.region, 
                        startAngle: (j===0)?0:pieData[j-1].endAngle, 
                        endAngle: (j===(data_source.length-1))?doublePi:(j===0)?doublePi*(elem.consumption/total_consumption):doublePi*(elem.consumption/total_consumption)+pieData[j-1].endAngle
                    })
    }

    var pieId = "#pie"+highlight_index,
    pieTextId = "#pietext"+highlight_index;

    // draw pie
    var new_pie = cont.selectAll(".pieGroup") //g tag
                      .data(pieData);
    
    new_pie.enter()
           .append("path")
           .attr('id', function(d,i){ return "pie"+i; })
           .attr('class', "pieGroup");
           
    new_pie.transition()
           .attr('d', pieAttr)
           .attr('stroke', "initial")
           .each(function(d,i){
                d3.select(this).attr('fill', (i<=5)?color_set[i]:color_set[6])
           })
           .on("end", function(d,i){
                if(!d3.select(".myCheckbox").property("checked")){
                    if(i === highlight_index)
                    {
                        highlightAPie(highlight_index,pieTextId,pieId);
                        /* d3.select(pieId)
                        .attr('stroke', "blue")
                        .attr('stroke-width', "3px"); */
                    }
                }
            });

    new_pie.exit().transition().remove();

    var new_text = cont.selectAll(".textGroup")
                       .data(pieData);
    
    new_text.enter()
            .append("text")
            .attr('id', function(d,i){ return "pietext"+i; })
            .attr('class', "textGroup");

    new_text.transition()
            .attr('x', function(d){ return pieAttr.centroid(d)[0]; })
            .attr('y', function(d){ return pieAttr.centroid(d)[1]; })
            .attr('dx', "-18px")
            .style('fill', "black")
            .style('font-size', "12px")
            .style('z-index', "1")
            .text(function(d,i){
                return (pieData[i].endAngle-pieData[i].startAngle)<0.5?"":d.label;
            })
            .on("end", function(d,i){
                if(!d3.select(".myCheckbox").property("checked")){
                    if(i === highlight_index)
                    {
                        highlightAPie(highlight_index,pieTextId,pieId);
                        /* d3.select(pieTextId)
                        .style('fill', "yellow")
                        // .attr('dx', function(d){ return (highlight_index>=8&&highlight_index<=10)?"10px":(highlight_index>=12&&highlight_index<=16)?"-20px":(highlight_index==19)?"-25px":d3.select(this).attr('dx');})
                        // .attr('dy', function(d){ return (highlight_index>=0&&highlight_index<=5)?"-15px":(highlight_index>=8&&highlight_index<=10)?"15px":(highlight_index>=12&&highlight_index<=16)?"20px":(highlight_index==19||highlight_index==21)?"-25px":d3.select(this).attr('dy');})
                        .text(region_list[highlight_index]); */
                    }
                }
            });
    
    new_text.exit().transition().remove();
}

d3.select("#drop-down-year")
  .on("change", function(){
    signal = 1;

    if(d3.select("#drop-down-year").property("value") == "---"){
        d3.select("#container-div").style('display', "none");
        return;
    }
    else
        d3.select("#container-div").style('display', "flex");

    var new_data_source = eval(d3.select("#drop-down-year").property("value"));
    region_list = [];

    // Based on consumption, sort data source array
    new_data_source.sort(function(a, b){
        if(a.consumption > b.consumption) return -1; // a,b
        else if (a.consumption < b.consumption) return 1; // b,a
        else return 0; // unchanged *
    });

    // source of data is sorted
    for (var i = 0; i < new_data_source.length; i++) {
        var element = new_data_source[i];
        region_list.push(element.region);
        population_list.push(element.population);
        consumption_list.push(element.consumption);
    }
    var selectedRegion = d3.select("#drop-down-region").property("value");
    for (var i = 0; i < 22; i++) {
        if(region_list[i] === selectedRegion)
        {
            break;
        }
    }
    updatePieChart(new_data_source, i);
    render_slopeDiagram(new_data_source, i);
    updateTextInfo(i);
  });

// event handler
/* 
d3.selectAll(".pieGroup, .textGroup")
.on("mouseenter", function(d,i){
    if(!d3.select(".myCheckbox").property("checked")){
        // .on function will pass event object (i) at parameter
        recoverPie();
        console.log("look me:::::::::::", i);
        i = (i>21)?(i-22):i;
        var pieId = "#pie"+i,
            pieTextId = "#pietext"+i;

        highlightAPie(i, pieTextId, pieId);

        recoverSlope();
        highlightASlope(i);

        recoverCircle();
        highlightTwoCircle(i);
    }
})
.on("mouseout", function(d,i){

    if(!d3.select(".myCheckbox").property("checked")){
        //remind: replace original recovery method with recoverPie()
        recoverPie();
        recoverSlope();
        recoverCircle();

        // back to reply region manu 
        var selectedRegion = d3.select("#drop-down-region").property("value");
        if(selectedRegion != "---"){
            for (var recover_index = 0; recover_index < 22; recover_index++) {
                if(region_list[recover_index] === selectedRegion)
                {
                    var pieId = "#pie"+recover_index,
                        pieTextId = "#pietext"+recover_index;
                    break;
                }
            }

            highlightAPie(recover_index, pieTextId, pieId);

            highlightASlope(recover_index);
            highlightTwoCircle(recover_index);
        }
    }
});
*/

function SVG_response(){
    ;
}

d3.select("#drop-down-region")
.on("change", function(){
    if(!d3.select(".myCheckbox").property("checked")){
        if(signal == 1)
        {
            recoverPie();
            var selectedRegion = d3.select("#drop-down-region").property("value");
            if(selectedRegion != "---"){
                for (var i = 0; i < 22; i++) {
                    if(region_list[i] === selectedRegion)
                    {
                        var pieId = "#pie"+i,
                        pieTextId = "#pietext"+i;
                        break;
                    }
                }

                highlightAPie(i, pieTextId, pieId);
            } 
            // call slope update
            slopeReplyRegionMenu(i); // this update function will check region menu value whether is "---"
            updateTextInfo(i); // will check region menu
        }
    }
});

function recoverPie(){
    d3.selectAll(".textGroup")
    .style('fill', "black")
    .each(function(d,i){
        if(i>=0 && i<=5)
            d3.select(this).text(region_list[i]);
        else
            d3.select(this).text("");
    });
    
    d3.selectAll(".pieGroup")
    .attr('stroke', "none")
    .attr('d', pieAttr);;
}

function highlightAPie(i, pieTextId, pieId){
    d3.select(pieTextId)
    .style('fill', "black")
    // .attr('dx', function(d){ return (i>=8&&i<=10)?"10px":(i>=12&&i<=16)?"-20px":(i==19)?"-25px":d3.select(this).attr('dx');})
    // .attr('dy', function(d){ return (i>=0&&i<=5)?"-15px":(i>=8&&i<=10)?"15px":(i>=12&&i<=16)?"20px":(i==19||i==21)?"-25px":d3.select(this).attr('dy');})
    .text(region_list[i]);

    
    d3.select(pieId)
    .attr('stroke', "white")
    .attr('stroke-width', "0px")
    .attr('d', pieScale);
}

function updateTextInfo(i){
    // display detail info of a region
    // display ranking of consumption of water
    if(d3.select("#drop-down-region").property("value") == "---"){
        i = 0;
    }

    $("#region-name, #region-rank, #region-population, #region-consumption, #region-more-water-s").attr("style", "visibility: visible;");
    $("#region-name").html(pieData[i].label);
    $("#region-rank").html("用水排名: " + (i+1));
/*         $("#region-population").html("用水人口數: " + population_list[i] + " 人("+ ((population_list[i]/total_population)*100).toFixed(2) + "%)");
    $("#region-consumption").html("用水量: " + consumption_list[i] + " 千公升("+ ((consumption_list[i]/total_consumption)*100).toFixed(2) + "%)"); */
    $("#region-population").html("用水人口數: " + numberWithCommas(population_list[i]) + " 人");
    $("#region-consumption").html("用水量: " + numberWithCommas(consumption_list[i]) + " 千公升");
    $("#focus-more-water-s").html(function(){
        var i = 0, count = 1, concated_str = "";
        for (let i = 0; i < region_list.length; i++) {
            if((consumption_list[i]/total_consumption) > (population_list[i]/total_population)){
                count = count==3?1:count+1;
                concated_str = concated_str + region_list[i] + "," + (count == 1?"<br>":"");
            }
                
        }
        return concated_str.slice(0,concated_str.length-1) + " ";
    });
}