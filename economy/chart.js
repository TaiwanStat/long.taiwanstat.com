//var width=$(".axisX").width();
//if(width>800) width=800;
var width=800;
var height=500;
var scaleX=d3.scale.linear().range([0,width-100]).domain([1991,2015]);
var scaleY=d3.scale.linear().range([height-100,0]).domain([0,100]);
var scaleColor=d3.scale.category10();
var axisX = d3.svg.axis()
    .scale(scaleX)
    .orient("bottom")
    .ticks(10);

var axisY = d3.svg.axis()
    .scale(scaleY)
    .orient("left")
    .ticks(10);
var svg=d3.select("#chart").append("svg").attr("width",width).attr("height",width*5/8).attr("viewBox","0 0 800 500");
var g=svg.append("g");
var line = d3.svg.line()  
    .x(function(d,i) {  
        return scaleX(parseInt(d._TIME_PERIOD)); //利用尺度運算資料索引，傳回x的位置  
    })  
    .y(function(d) {   
        return scaleY(parseFloat(d._OBS_VALUE.replace(",","").replace(",",""))); //利用尺度運算資料的值，傳回y的位置  
    });
svg.append("g").attr("class","axisX").call(axisX)
svg.append("text").attr("class","labelX").attr("x",width-140).attr("y",height-20).text("單位：年");
svg.append("g").attr("class","axisY").call(axisY);
var areaWidth=$("#chart").width()-100;
var areaHeight=$("#chart").height()-100;
var area=svg.append("rect").attr("class","area_mask").attr("x",80).attr("y",20)
		.attr("width",areaWidth).attr("height",areaHeight).on("mousemove",rectInteraction);
var yearScale=d3.scale.linear().range([80,80+areaWidth]).domain([1991,2015]);
var eachItem;
d3.json("economy.json",function(data){
	 eachItem=d3.nest().key(function(d){return d.SeriesProperty._FREQ;})
		.key(function(d){return d._ITEM;}).map(data.GenericData.DataSet.Series);
});


function rectInteraction(){
	d3.select(".yearPath").remove();
	console.log(yearScale.invert(d3.mouse(this)[0]));
	var year=yearScale.invert(d3.mouse(this)[0]);
	var value;
	var first="";
	var second="";
	g.append("line").attr("class","yearPath").attr("stroke","gray")
		.attr("x1",scaleX(year))
		.attr("y1",0)
		.attr("x2",scaleX(year))
		.attr("y2",areaHeight);
	var itemName=$(".itemColor").text().split(" ");
	g.selectAll(".circleOnLine").remove();
	for(var index in itemName){
		//itemName[index]+=")";
		itemName[index]=itemName[index].split(":");
		value=computeValue(itemName[index][0],year);
		g.append("circle").attr("cx",scaleX(year)).attr("cy",scaleY(value)).attr("r",2).attr("class","circleOnLine");
		if(value/1000>=1){
			second=",";
			if(value/1000000>=1){
				first=",";
				if(parseInt(value%1000000/1000)<100)	
					value=parseInt(value/1000000)+first+"0"+parseInt(value%1000000/1000)+second+parseInt(value%1000);
				else
					value=parseInt(value/1000000)+first+parseInt(value%1000000/1000)+second+parseInt(value%1000);
			}
			else{
				value=parseInt(value/1000)+second+parseInt(value%1000);
			}
		}
		value=itemName[index][0]+":"+value+" ";
		$($(".itemColor")[index]).text(value);//.text();
	}
	
}
function computeValue(itemName,year){
	var theItem=eachItem.A[itemName][0].SeriesProperty.Obs;
	var ceil=Math.ceil(year);
	var floor=Math.floor(year);
	var ceilValue,floorValue;
	for(var index in theItem){
		if(parseInt(theItem[index]._TIME_PERIOD)==floor) floorValue=parseFloat(theItem[index]._OBS_VALUE.replace(",","").replace(",","")); 
		if(parseInt(theItem[index]._TIME_PERIOD)==ceil) ceilValue=parseFloat(theItem[index]._OBS_VALUE.replace(",","").replace(",","")); 
	}
	var value=Math.round(((year-floor)*(ceilValue-floorValue)+floorValue)*100)/100;
	return value;
}
function createPath(itemName){
var checkString;
if(itemName=="全國GDP、GNI(百萬元)"){redraw(20000000); checkString="百萬元";}
else if(itemName=="每人GDP、GNI(新台幣元)"){redraw(1000000); checkString="新台幣元";}
else if(itemName=="各項成長率(%)"){redraw(20);checkString="%";}
	d3.selectAll(".dataPath").remove();
	var theItem;
	var i=0;
	for(var findItem in eachItem.A){
		if(findItem.indexOf(checkString)!=-1){
			theItem=eachItem.A[findItem][0].SeriesProperty.Obs;
			g.append("path").attr("d",line(theItem))
				.attr("stroke",scaleColor(findItem)).classed("dataPath",true);
			if(theItem[0]._OBS_VALUE=="-"){}
			else {
				i++;
				g.append("text").classed("itemColor",true)
					.attr("transform","translate(140,"+20*(i+1)+")")
					.attr("fill",scaleColor(findItem)).text(findItem+": ");
				
			}
		}
	}
}
function redraw(max){
	if(max==20) {
			scaleY=d3.scale.linear().range([height-100,0]).domain([-8,max]);
			g.append("line").attr("class","zeroPath").attr("stroke","gray")
				.attr("x1",scaleX(1991))
				.attr("y1",scaleY(0))
				.attr("x2",scaleX(2015))
				.attr("y2",scaleY(0));
		}
	else {
		scaleY=d3.scale.linear().range([height-100,0]).domain([0,max]);
		d3.selectAll(".zeroPath").remove();
	}
 	axisY = d3.svg.axis()
   	 .scale(scaleY)
  	  .orient("left")
    	.ticks(10);
	svg.select(".axisY").call(axisY);
	g.selectAll(".itemColor").remove();
//svg.append("g").attr("class","axisY").call(axisY);
	
}
