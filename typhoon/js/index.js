var margin = {top:20,right:0,left:50,bottom:0}
var width = $(".chart").width();
var height = 2200,regHeight = height;
var yScaleMin = 1957;//new Date(1957,0,1);
var yScaleMax = 2016;//new Date(2016,0,1);
var xScaleMin = new Date(2015,0,1);
var xScaleMax = new Date(2015,11,30);
var yScale = d3.scale.linear().domain([yScaleMax,yScaleMin]).range([0,height-margin.top-margin.bottom]);
var rScale = d3.scale.linear().range([0,width/15]).domain([0,600]);
var xScale = d3.time.scale().range([0,width-margin.right-margin.left]).domain([xScaleMin,xScaleMax]);
var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10).tickFormat(function(d){return d;});
var xAxis = d3.svg.axis().scale(xScale).orient("top").ticks(5);
var svg = d3.select(".chart").append("svg")
    .attr("width",width).attr("height",height);
var zoom = d3.behavior.zoom().on("zoom",redraw).scaleExtent([0.2,2]);
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
rule();
function rule(){
    var width = $(".rRule").width();
    var text = 50;
    var rectHeight = 30;
    var height = (2*rScale(600)+text)*3;
    var svg = d3.select(".rRule").append("svg").attr({
        "width":width,
        "height":height,
    })
    var data = [100,300,600];

    //create rRule

    svg.selectAll("circle").data(data).enter().append("circle").attr({
        r:function(d){return rScale(d);},
        cx:width/2,
        cy:function(d,i){
            return (height/3)*(i+1)-rScale(600)
        },
    });
    svg.selectAll("text").data(data).enter().append("text").attr({
        x:width/2,
        y:function(d,i){return height/3*i+text;},
    }).text(function(d){return "暴風半徑"+d+"公里";})

    //create colorRule

    svg = d3.select(".colorRule").append("svg").attr({
        "width":width,
        "height":10*rectHeight+text,
    })
    data = [10,20,30,40,50,60,70,80,90,100];
    svg.selectAll("rect").data(data).enter().append("rect").attr({
        x:width/4,
        y:function(d,i){
            return text+i*rectHeight;
        },
        width:width/4,
        height:rectHeight,
        fill:function(d){
            color = parseFloat(255-3*d)
            return d3.rgb(100,color,color);
        }
    })
    svg.selectAll("text").data(data).enter().append("text").attr({
        x:width/2,
        y:function(d,i){
            return text+(i+1)*rectHeight-rectHeight/4
        },
    }).text(function(d){return "風速每秒"+d+"公尺";})

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
                color = parseFloat(255-3*d["近臺近中心最大風速(m/s)"])
                return d3.rgb(100,color,color);
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
        })
}
