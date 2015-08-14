var margin = {top:20,left:70,right:30,bottom:40},
    width = $("#chart").width()<400?400:$("#chart").width(),
    height = width*0.6;
var xScale = d3.scale.linear().range([0,width-margin.left-margin.right]).domain([87,104]);
var yScale = d3.scale.linear().range([height-margin.top-margin.bottom,0]);
var domainMax=30000;
var colorScale;
var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(15);
var yAxis = d3.svg.axis().scale(yScale).orient("left");
var target;
var line = d3.svg.line().interpolate("basis")
    .x(function(d){return xScale(d.year);})
    .y(function(d){return d[target]=="-"?yScale(0):yScale(d[target]);});
var zoom = d3.behavior.zoom().on("zoom",redraw).scaleExtent([1,30]).center([margin.left,height-margin.bottom]);
zoom.y(yScale);
var svg = d3.select("#chart").append("svg")
    .attr({
        width:width,
        height:height
    }).call(zoom).on("mousemove",drawPointer);
var info_svg = d3.select("#info_box").append("svg")
    .attr({
        width:$("#info_box").width(),
        height:600,
    })
var g = svg.append("g")
    .attr("transform","translate("+margin.left+","+(margin.top)+")");
var personnelArray = ["總計","醫師","中醫師","牙醫師","藥師","醫事檢驗師","護理師"
    ,"護士","助產師","助產士","鑲牙生","藥劑生","醫事檢驗生","醫事放射師","醫事放射士"
    ,"營養師","物理治療師","物理治療生","職能治療師","職能治療生","臨床心理師"
    ,"諮商心理師","呼吸治療師","語言治療師","聽力師","牙體技術師","牙體技術生"];
d3.csv("all.csv",function(data){
    visual(data);
})
$(".button").click(changeData);
function changeData(){

}
function drawPointer(){
    position = d3.mouse(this);
    x = position[0]-margin.left;
    if(x < xScale(88)) x = xScale(88)
    if(x > xScale(103)) x = xScale(103);
    d3.select(".pointer").attr({
        x1:x,
        x2:x
    })
    info_svg.selectAll("text").transition().duration(500).text(function(){
        var target = $(this).attr("data-name");
        var year = Math.round(xScale.invert(x))
        var data = d3.select("path."+target).datum()
        var number = data[year-88][target]
        return target+":"+number;
    })
}
function visual(data){
    yScale.domain([0,domainMax])
    svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")")
        .attr("class","yAxis").call(yAxis);
    svg.append("g").attr("transform","translate("+margin.left+","+(height-margin.bottom)+")")
        .attr("class","xAxis").call(xAxis);
    for(var i = 0;i<personnelArray.length;i++){
        target = personnelArray[i];
        g.append("path").datum(data).attr("class","line "+target).attr("d",line)
            .attr("stroke",function(d){color=i*15;return d3.hsl(color,0.6,0.5)})
        info_svg.append("rect").attr({
            y:i*17,
            width:10,
            height:10,
            fill:function(){color=i*15;return d3.hsl(color,0.6,0.5)}
        })
        info_svg.datum(data).append("text").attr({
            "data-name":target,
            x:15,
            y:i*17+17/2,
            "font-size":12,
        }).text(target)
    }
    g.append("line").attr("class","pointer").attr({
        x1:xScale(88),
        y1:yScale(0),
        x2:xScale(88),
        y2:yScale(domainMax),
        stroke:"grey",
        "stroke-width":1
    })
}
function redraw(){
    yScale.domain([0,domainMax/zoom.scale()/zoom.scale()])
    d3.select("g.yAxis").transition().duration(500).call(yAxis);
    for(var i = 0;i<personnelArray.length;i++){
        target = personnelArray[i];
        d3.selectAll("path."+target).transition().duration(500).attr("d",line);
    }
}
