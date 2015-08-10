var margin = {top:20,right:100,left:100,bottom:100}
var width = 1200;
var height = 400;
var xScaleMin = new Date(1957,0,1);
var xScaleMax = new Date(2016,0,1);
var xScale = d3.time.scale().domain([xScaleMin,xScaleMax]).range([0,width-margin.left-margin.right]);
//var yScale = d3.scale.linear().range([0,height-margin.top-margin.bottom]).domain([0,1])
var rScale = d3.scale.sqrt().range([0,height-margin.top-margin.bottom]).domain([0,600]);
var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(30);
var yAxis = d3.svg.axis().scale(rScale).orient("left").ticks(0);
var svg = d3.select(".chart").append("svg")
    .attr("width",width).attr("height",height);
svg.append("g").attr("class","xAxis").attr("transform","translate("+margin.left+","+(height-margin.bottom)+")").call(xAxis);
svg.append("g").attr("class","yAxis").attr("transform","translate("+margin.left+","+margin.top+")").call(yAxis);
d3.csv("typhoon.csv",function(dataset){
    visual(dataset);
})
function visual(dataset){
    svg.append("g").attr("transform","translate("+margin.left+",0)").attr("class","chart")
        .selectAll("circle.levelTen").data(dataset).enter().append("circle")
        .attr({
            class:"levelTen",
            r:function(d){
                return rScale(d.近臺10級風暴風半徑)/2;
            },
            cx:function(d){
                var year = parseInt(d.警報期間.substr(0,4));
                var month = parseInt(d.警報期間.substr(5,2))-1;
                var day = parseInt(d.警報期間.substr(8,2));
                var date = new Date(year,month,day);
                console.log(year);
                return xScale(date);
            },
            cy:(height-margin.top-margin.bottom)/2+margin.top,
            fill:function(d){
                color = parseFloat(d["近臺近中心最大風速(m/s)"]*0.01)
                return d3.hsl(200,color,color);
            }
        })
    svg.select("g.chart")
        .selectAll("circle.levelSeven").data(dataset).enter().append("circle")
        .attr({
        class:"levelSeven",
        r:function(d){
            return rScale(d.近臺7級風暴風半徑)/2;
        },
        cx:function(d){
            var year = parseInt(d.警報期間.substr(0,4));
            var month = parseInt(d.警報期間.substr(5,2))-1;
            var day = parseInt(d.警報期間.substr(8,2));
            var date = new Date(year,month,day);
            console.log(year);
            return xScale(date);
        },
        cy:(height-margin.top-margin.bottom)/2+margin.top,
        fill:function(d){
            color = parseFloat(1-d["近臺近中心最大風速(m/s)"]*0.01)
            return d3.hsl(200,color,color);
        }
    })

}
