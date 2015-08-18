var margin = {top:20,left:70,right:30,bottom:40},
    width = $("#chart").width()<400?400:$("#chart").width(),
    height = width*0.5;
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
var dataName = "all.csv";
d3.csv(dataName,function(data){
    init(data);
})
$(".button").click(changeData);
function changeData(){
    if((this.value=="所有醫事人員"&&dataName=="all.csv")||(this.value=="各科醫師"&&dataName=="doctor.csv")){
        yScale.domain([0,domainMax])
        d3.select("g.yAxis").transition().duration(500).call(yAxis);
        for(var i = 0;i<personnelArray.length;i++){
            target = personnelArray[i];
            d3.selectAll("path."+target).transition().duration(500).attr("d",line);
        }
    }
    else if(this.value=="所有醫事人員"){
        domainMax = 30000;
        dataName = "all.csv";
        personnelArray = ["總計","醫師","中醫師","牙醫師","藥師","醫事檢驗師","護理師"
            ,"護士","助產師","助產士","鑲牙生","藥劑生","醫事檢驗生","醫事放射師","醫事放射士"
            ,"營養師","物理治療師","物理治療生","職能治療師","職能治療生","臨床心理師"
            ,"諮商心理師","呼吸治療師","語言治療師","聽力師","牙體技術師","牙體技術生"];
    }
    else{
        domainMax = 1600;
        dataName = "doctor.csv";
        personnelArray = ["總計","家庭醫學科","內科","外科","兒科","婦產科","骨科","神經科"
            ,"神經外科","泌尿科","耳鼻喉科","眼科","皮膚科","精神科","復健科","麻醉科"
            ,"放射線診斷","放射線腫瘤","放射線核醫","急診醫學科"
            ,"解剖病理","臨床病理","核子醫學科","整形外科"
            ,"口腔顎面外科","口腔病理科","職業醫學科","齒顎矯正科"]
    }
    yScale.domain([0,domainMax]);
    d3.select(".yAxis").transition().duration(500).call(yAxis);
    g.selectAll("path").remove();
    info_svg.selectAll("text").remove();
    info_svg.selectAll("rect").remove();
    d3.csv(dataName,function(data){
        visual(data);
    })

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
function init(data){
    yScale.domain([0,domainMax])
    svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")")
        .attr("class","yAxis").call(yAxis);
    svg.append("g").attr("transform","translate("+margin.left+","+(height-margin.bottom)+")")
        .attr("class","xAxis").call(xAxis);
    visual(data);

    g.append("line").attr("class","pointer").attr({
        x1:xScale(88),
        y1:yScale(0),
        x2:xScale(88),
        y2:yScale(domainMax),
        stroke:"grey",
        "stroke-width":1
    })
}
function visual(data){
    for(var i = 0;i<personnelArray.length;i++){
        target = personnelArray[i];
        g.append("path").datum(data).attr("class","line "+target).attr("d",line)
            .attr("data-name",target)
            .attr("stroke",function(d){color=i*15;return d3.hsl(color,0.6,0.5)})
            .on("mouseover",function(){info_svg.select("text."+$(this).attr("data-name")).attr("fill","red")})
            .on("mouseout",function(){info_svg.selectAll("text").attr("fill","#000")})
        info_svg.append("rect").attr({
            y:i*17,
            width:10,
            height:10,
            fill:function(){color=i*15;return d3.hsl(color,0.6,0.5)}
        })
        info_svg.datum(data).append("text").attr({
            class:target,
            "data-name":target,
            x:15,
            y:i*17+17/2,
            "font-size":12,
        }).text(target)
        .on("mouseover",function(){$("path."+$(this).attr("data-name")).mouseover()})
    }
}
function redraw(){
    yScale.domain([0,domainMax/zoom.scale()/zoom.scale()])
    d3.select("g.yAxis").transition().duration(500).call(yAxis);
    for(var i = 0;i<personnelArray.length;i++){
        target = personnelArray[i];
        d3.selectAll("path."+target).transition().duration(500).attr("d",line);
    }
}
