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
                .padRadius(225);

var cont;

var signal = 0;

var pieData = [];
var data_source;
var total_consumption = 0 , total_population = 0;
var dummy_data = [];
for(var du=0; du < 23 ; du++)
    dummy_data.push({ consumption: 36685788, region: "宜蘭縣", population:	421328, per: 238 });

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
    .attr('width', window.innerWidth >= 768 ? "480" : "400") 
    .attr('height', window.innerWidth >= 768 ? "450" : "375")
    .attr('id', "piesvg")
    .append("g")
    .attr('transform', "translate("+($("#piesvg").width()/2)+","+(d3.select("#piesvg").attr("height")/2)+")")
    .attr('id', "pieChartGroup")
    .attr('opacity', "1");

    updatePieChart(dummy_data,undefined);
});

function updatePieChart(new_data, highlight_index){

    total_consumption = 0 , total_population = 0;
    pieData = [];
    data_source = new_data;

    for (var i = 0; i < data_source.length; i++) {
        var ele = data_source[i];
        total_consumption += ele.consumption;
        total_population += ele.population;
    }

    if(signal == 1){
        $("#pie-year").html(d3.select("#drop-down-year").property("value").slice(4) + " 年");
        $("#pie-total-population").html("總用水人口數量 ： " + numberWithCommas(total_population) + "  人");
        $("#pie-total-consumption").html("總用水量： " + numberWithCommas(total_consumption) + " 千公升");
    }

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

    var new_pie = cont.selectAll(".pieGroup") 
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
                if(i === highlight_index)
                {
                    highlightAPie(highlight_index,pieTextId,pieId);
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
                if(i === highlight_index)
                {
                    highlightAPie(highlight_index,pieTextId,pieId);
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

    var new_data_source;

    var year_selected = d3.select("#drop-down-year").property("value");
    var year_file = "./dataset/" + year_selected +".csv";

    d3.csv(year_file, function(d) {
        return {
            'population': +d.population,
            'region': d.region,
            'consumption': +d.consumption,
            'year': +d.year
        };
        }, function(error, csv_data) {
            new_data_source = csv_data;
            region_list = [];
            population_list = [];
            consumption_list = [];
            
            new_data_source.sort(function(a, b){
                if(a.consumption > b.consumption) return -1; 
                else if (a.consumption < b.consumption) return 1; 
                else return 0; 
            });
        
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
  });

function SVG_response(){
    ;
}

d3.select("#drop-down-region")
.on("change", function(){
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
        slopeReplyRegionMenu(i);
        updateTextInfo(i); 
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
    .text(region_list[i]);

    
    d3.select(pieId)
    .attr('stroke', "white")
    .attr('stroke-width', "0px")
    .attr('d', pieScale);
}

function updateTextInfo(i){
    if(d3.select("#drop-down-region").property("value") == "---"){
        i = 0;
    }

    $("#region-name, #region-rank, #region-population, #region-consumption, #region-more-water-s").attr("style", "visibility: visible;");
    $("#region-name").html(pieData[i].label);
    $("#region-rank").html("用水排名: " + (i+1));
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