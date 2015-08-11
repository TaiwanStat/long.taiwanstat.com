var margin = {top:20,right:0,left:50,bottom:0}
var width = $(".chart").width();
var height = 800,regHeight = height;
var yScaleMin = 1957;//new Date(1957,0,1);
var yScaleMax = 2016;//new Date(2016,0,1);
var xScaleMin = new Date(2015,0,1);
var xScaleMax = new Date(2015,11,30);
var yScale = d3.scale.linear().domain([yScaleMax,yScaleMin]).range([0,height-margin.top-margin.bottom]);
var rScale = d3.scale.linear().range([0,width/10]).domain([0,600]);
var xScale = d3.time.scale().range([0,width-margin.right-margin.left]).domain([xScaleMin,xScaleMax]);
var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10).tickFormat(function(d){console.log(d);return d;});
var xAxis = d3.svg.axis().scale(xScale).orient("top").ticks(6);
var svg = d3.select(".chart").append("svg")
    .attr("width",width).attr("height",height);
var zoom = d3.behavior.zoom().on("zoom",redraw).scaleExtent([0.5,10]);
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .html(function(d) {
      return (
          "年份："+d.年份+"<br>"+
          "編號："+d.編號+"<br>"+
          "中文名稱："+d.中文名稱+"<br>"+
          "英文名稱："+d.英文名稱+"<br>"+
          "路徑分類："+d.侵臺路徑分類+"<br>"+
          "警報期間："+d.警報期間+"<br>"+
          "近臺強度："+d.近臺強度+"<br>"+
          "生命期近中心最低氣壓(hPa)："+d["生命期近中心最低氣壓(hPa)"]+"<br>"+
          "近臺近中心最大風速(m/s)："+d["近臺近中心最大風速(m/s)"]+"<br>"+
          "近臺7級風暴風半徑："+d.近臺7級風暴風半徑+"<br>"+
          "近臺10級風暴風半徑："+d.近臺10級風暴風半徑+"<br>"+
          "警報發布報數："+d.警報發布報數+"<br>"
      );
  })
  // REQUIRED:  Call the tooltip on the context of the visualization

    //.center([(width-margin.left-margin.right)/2,(height-margin.top-margin.bottom)/2]);
zoom.y(yScale);
svg.append("g").attr("class","xAxis").attr("transform","translate("+margin.left+","+(margin.top)+")").call(xAxis);
svg.append("g").attr("class","yAxis").attr("transform","translate("+margin.left+","+margin.top+")").call(yAxis);
d3.csv("typhoon.csv",function(dataset){
    visual(dataset);
})
d3.select(".chart svg").call(zoom).call(tip).on(".drag", null);
//rule();
function rule(){
    var width = $(".rule").;
    var height;
    d3.select(".rule").append("svg")
}
function redraw(){
    height = regHeight*zoom.scale();
    svg.attr("height",height);
    yScale = d3.scale.linear().domain([yScaleMax,yScaleMin]).range([0,height-margin.top-margin.bottom]);
    yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);
    svg.select(".yAxis").transition().duration(500).call(yAxis);
    d3.selectAll(".node circle").transition().duration(500).attr("cy",function(d){
        var year = parseInt(d.警報期間.substr(0,4));
        return yScale(year);
    })

}
function visual(dataset){
    svg.append("g").attr("transform","translate(0,"+margin.top+")").attr("class","typhoon")
        .selectAll(".node").data(dataset).enter().append("g").attr("class","node")
        .sort(function(a,b){return b.近臺7級風暴風半徑-a.近臺7級風暴風半徑;})
        .on("mouseover",tip.show).on("mouseout",tip.hide);

    d3.selectAll(".node").append("circle")
        .attr({
            class:"levelSeven",
            r:function(d){
                if(d.近臺7級風暴風半徑=="---"){
                    return 0;
                }
                else{
                    return rScale(d.近臺7級風暴風半徑);
                }
            },
            cy:function(d){
                var year = parseInt(d.警報期間.substr(0,4));
                return yScale(year);
            },
            cx:function(d){
                //(width-margin.left-margin.right)/2+margin.left,
                var month = parseInt(d.警報期間.substr(5,2))-1;
                var day = parseInt(d.警報期間.substr(8,2));
                var date = new Date(2015,month,day);
                return xScale(date);
            },
            fill:function(d){
                color = parseFloat(1-d["近臺近中心最大風速(m/s)"]*0.01)
                return d3.hsl(200,color,color);
            },
        })
    d3.selectAll(".node").append("circle")
        .attr({
            class:"levelTen",
            r:function(d){
                if(d.近臺10級風暴風半徑=="---"){
                    return 0;
                }
                else{
                    return rScale(d.近臺10級風暴風半徑);
                }
            },
            cy:function(d){
                var year = parseInt(d.警報期間.substr(0,4));
                return yScale(year);
            },
            cx:function(d){
                //(width-margin.left-margin.right)/2+margin.left,
                var month = parseInt(d.警報期間.substr(5,2))-1;
                var day = parseInt(d.警報期間.substr(8,2));
                var date = new Date(2015,month,day);
                return xScale(date);
            },
            fill:function(d){
                //color = parseFloat(d["近臺近中心最大風速(m/s)"]*0.01)
                //return d3.hsl(200,color,color);
                return "#ff80e5";
            },
        })
}
