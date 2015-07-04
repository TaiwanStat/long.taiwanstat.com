
var width=$(".six.wide.column").width();
var leftwidth=$(".four.wide.column").width();
if(width>800) width=800;
if(width<500) width=500;
if(leftwidth>800) leftwidth=800;
if(leftwidth<500) leftwidth=500;
var leftheight=leftwidth*1/3;
var svg=d3.select(".six.wide.column").append("svg").attr("width",width).attr("height",width);
var svgNum=d3.select(".numbers").append("svg").attr("width",leftwidth).attr("height",leftheight);
var svgSalary=d3.select(".salary").append("svg").attr("width",leftwidth).attr("height",leftheight);
var svgTime=d3.select(".time").append("svg").attr("width",leftwidth).attr("height",leftheight);
var colorScale=d3.scale.category20();
var padding=(leftheight-80)/2;
var widthpadding=60;
var yScale=d3.scale.linear().domain([0,2]).range([padding,leftheight-padding]);
var xScale=d3.scale.linear().domain([0,0]).range([widthpadding,leftwidth-widthpadding]);

d3.csv("salary.csv",function(data){
$(".ui.button").click(function(){
	console.log("dsaa");
	$("input[name='sort']").prop("checked",false);
	$(".ui.button").removeClass("clicked");
	$(this).addClass("clicked");

	visualize();
});


var force;
var circles;
var salaryMM,numberMM,timeMM;
var itemName;
var circleScale=d3.scale.sqrt().range([8,40]).domain([0,0]);
var tmp1=data.map(function(d){return parseInt(d.人數總計);})
numberMM=[d3.min(tmp1),d3.max(tmp1)];
var tmp2=data.map(function(d){return parseInt(d.薪資平均);})
salaryMM=[d3.min(tmp2),d3.max(tmp2)];
var tmp3=data.map(function(d){return parseFloat(d.工時平均);})
timeMM=[d3.min(tmp3),d3.max(tmp3)];

function visualize(){
	//$(".ui.checkbox").checkbox("behavior","set enabled");
	console.log("here");
	d3.selectAll("circle").remove();
	itemName=$(".ui.button.clicked").text();

	var max=0,min=1000000;
	var nodes=data.map(function(d){
					return{
						job:d.job,
						value:returnValue(d),
						type:d.type,
					};
					function returnValue(d){
						if(itemName=="人數")
							return parseFloat(d[itemName+"總計"]);
						else
							return parseFloat(d[itemName+"平均"]);
					}

			});
	if(itemName=="人數")
		circleScale=d3.scale.sqrt().range([8,40]).domain(numberMM);
	else if(itemName=="薪資")
		circleScale=d3.scale.sqrt().range([8,40]).domain(salaryMM);
	else
		circleScale=d3.scale.sqrt().range([8,40]).domain(timeMM);
	circles=d3.select(".visual svg").selectAll("circle").data(nodes).enter().append("circle").on("mouseover",mouseenter);//.on("mouseout",out);
  force = d3.layout.force() // 建立 Layout
    		.nodes(nodes)               // 綁定資料
    		.size([width,width])            // 設定範圍
				.charge(-60)
    		.on("tick", tick2)           // 設定 tick 函式
    		.start();                   // 啟動！
	function mouseenter(d){
		d3.selectAll("circle").classed("selected",false);
		force.charge(-60);
		force.start();
		d3.select(this).classed("selected",true);
		force.charge(
			function(d2){
				if(d==d2) {
					return -500;
				}
				else return -60;
			}
		)
		force.start();
		showDetail(d);
	}
	function out(){
		d3.select(this).classed("selected",false);
		force.charge(-60);
		force.start();
	}
	function tick2() { // tick 會不斷的被呼叫
    		circles.attr({
      		cx: function(it) { return it.x; },  // it.x 由 Force Layout 提供
      		cy: function(it) { return it.y; },  // it.y 由 Force Layout 提供
      		r: function(it){return circleScale(it.value); },
					fill:function(d){return colorScale(d.type);},
    			stroke: "#444",
    		})
  	}


}
$(".ui.button.people").click();
function showDetail(d){
	var theData;
	for(var i in data){
		if(data[i].job==d.job){
			theData=data[i]
		}
	}
	$(".job").text(d.job);
	$(".type").text("(屬於："+d.type+")");
	numData=[["人數總計",theData.人數總計],["人數(男)",theData.人數男],["人數(女)",theData.人數女]]; //to d3 selector read
	salData=[["薪資平均",theData.薪資平均],["薪資(男)",theData.薪資男],["薪資(女)",theData.薪資女]]; //to d3 selector read
	timeData=[["工時平均",theData.工時平均],["工時(男)",theData.工時男],["工時(女)",theData.工時女]]; //to d3 selector read
	if ($("rect").length==9){
		xScale=d3.scale.linear().domain(numberMM).range([padding,leftheight-padding]);
		changeRect(".numbers svg",numData);
		xScale=d3.scale.linear().domain(salaryMM).range([padding,leftheight-padding]);
		changeRect(".salary svg",salData);
		xScale=d3.scale.linear().domain(timeMM).range([padding,leftheight-padding]);
		changeRect(".time svg",timeData);
	}
	else{
		xScale=d3.scale.linear().domain(numberMM).range([padding,leftheight-padding]);
		createRect(".numbers svg",numData);
		xScale=d3.scale.linear().domain(salaryMM).range([padding,leftheight-padding]);
		createRect(".salary svg",salData);
		xScale=d3.scale.linear().domain(timeMM).range([padding,leftheight-padding]);
		createRect(".time svg",timeData);
	}
}
function createRect(itemName,rectData){
	d3.select(itemName).selectAll("rect").data(rectData).enter().append("rect")
		.attr({
			x:widthpadding,
			y:function(d,i){return yScale(i);},
			height:20,
			width:function(d){return xScale(d[1])},
			fill:function(d){var color=0.8-(xScale(d[1])/leftwidth)*0.7;
				return d3.hsl(200,color,color);}
		});
	d3.select(itemName).selectAll("text").data(rectData).enter().append("text")
		.attr({
			x:0,
			y:function(d,i){return yScale(i)+15;}, //the rect center is diff from text
		})
		.text(function(d){return d[0];})
		.append("text")
		.attr({
			x:0,
			y:0,
		})

	d3.select(itemName).selectAll("text.value").data(rectData).enter().append("text")
		.attr({
			"class":"value",
			x:widthpadding,
			y:function(d,i){return yScale(i)+15;}, //the rect center is diff from text
		})
		.text(function(d){return d[1]+rank(d);})


}
function changeRect(itemName,rectData){
	d3.select(itemName).selectAll("rect").data(rectData).transition().duration(250)
		.attr({
			x:widthpadding,
			y:function(d,i){return yScale(i);},
			height:20,
			width:function(d){return xScale(d[1])},
			fill:function(d){var color=0.8-(xScale(d[1])/leftwidth)*0.7;
				return d3.hsl(200,color,color);}
		});
	d3.select(itemName).selectAll("text.value").data(rectData).transition().duration(250)
		.attr({
			x:widthpadding,
			y:function(d,i){return yScale(i)+15;}, //the rect center is diff from text
		})
		.text(function(d){return d[1]+rank(d);})

}
function rank(item){
	item[0]=item[0].replace("(","");
	item[0]=item[0].replace(")","");
	var rankArr=[];
	data.map(function(d){
		rankArr.push(parseFloat(d[item[0]]));
	})
	rankArr.sort(function(a,b){return b-a;})
	return " (No."+(rankArr.indexOf(parseFloat(item[1]))+1)+")";
}
function circlesort(){
	var dataTmp;
	if(itemName=="人數"){
			dataTmp=tmp1;
	}
	else if (itemName=="薪資") {
		dataTmp=tmp2;
	}
	else {
		dataTmp=tmp3;
	}

	dataTmp.sort(function(a,b){return b-a;});
	$(".visual svg").attr("height",width*3);

	force.size([width,1200])
				.charge(0)
    		.on("tick", tick3)           // 設定 tick 函式
    		.start();                   // 啟動！
	function tick3() { // tick 會不斷的被呼叫
				var checky=[];
				var checkx=[];
				circles.attr({
      		cx: function(it) {

															if(checkx.indexOf(it.value)==-1){

																	checkx.push(it.value);
																	return (dataTmp.indexOf(it.value)%6)*80+40;
															}
															else{

																	return ((dataTmp.indexOf(it.value)+1)%6)*80+40;
															}
					},
      		cy: function(it) {
															if(checky.indexOf(it.value)==-1){

																	checky.push(it.value);
																	return Math.floor(dataTmp.indexOf(it.value)/6)*80+40;
															}
															else{
																	return Math.floor((dataTmp.indexOf(it.value)+1)/6)*80+40;
															}
					},
      		r: function(it){return circleScale(it.value); },
					fill:function(d){return colorScale(d.type);},
    			stroke: "#444",
    		})

  	}
}

$("input[name='sort']").click(function(){
	if($(this).prop("checked")){
		circlesort();

	}
	else{
		$(".visual svg").attr("height",width);
		//visualize();

			force.size([width,width])
						.charge(-60)
						.on("tick", tick1)           // 設定 tick 函式
						.start();                   // 啟動！
			function tick1() { // tick 會不斷的被呼叫
						circles.attr({
							cx: function(it) { return it.x; },
							cy: function(it) { return it.y; },
							r: function(it){return circleScale(it.value); },
							fill:function(d){return colorScale(d.type);},
							stroke: "#444",
						})
				}
	}
})
});
