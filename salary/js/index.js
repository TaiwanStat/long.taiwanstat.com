
var width=$(".visual").width();
var leftwidth=$(".detail").width();
if(width>700) width=700;
if(width<500) width=500;
if(leftwidth>800) leftwidth=800;
if(leftwidth<500) leftwidth=500;
var leftheight=leftwidth*1/3;
var svg=d3.select(".visual").append("svg").attr("width",width).attr("height",width);
var svgNum=d3.select(".numbers").append("svg").attr("width",leftwidth).attr("height",leftheight);
var svgSalary=d3.select(".salary").append("svg").attr("width",leftwidth).attr("height",leftheight);
var svgTime=d3.select(".time").append("svg").attr("width",leftwidth).attr("height",leftheight);
var colorScale=d3.scale.category20();
var padding=(leftheight-80)/2;
var widthpadding=60;
var yScale=d3.scale.linear().domain([0,2]).range([padding,leftheight-padding]);
var xScale=d3.scale.linear().domain([0,0]).range([widthpadding,leftwidth-widthpadding]);
d3.csv("bigitem.csv",function(data){
	sv=d3.select(".colorinfo").append("svg").attr("width",$(".colorinfo").width()).attr("height",600);
	sv.selectAll("circle").data(data).enter()
		.append("circle").attr({
			cx:function(d,i){return 30;},
			cy:function(d,i){return i*25+30;},
			r:10,
			fill:function(d){return colorScale(d.job);}
		})
	sv.selectAll("text").data(data).enter()
		.append("text").attr("x",45).attr("y",function(d,i){return i*25+35;}).text(function(d){return d.job;})
})
d3.csv("salary.csv",function(data){
$(".ui.button").click(function(){
	console.log("dsaa");
	$("input[name='sort']").prop("checked",false);
	$(".ui.button").removeClass("clicked");
	$(this).addClass("clicked");

	visualize();
	$("input[name='text']").prop("checked",false);
});


var force;
var circles;
var gcircles;
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
	if(force!=undefined) force.stop();
	console.log("here");
	d3.selectAll(".gcircles").remove();
	$(".detail").show();
	$(".visual").removeClass("twelve wide column");
	$(".visual").addClass("eight wide column");
	$(".visual svg").attr("width",width).attr("height",width);
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
	gcircles=d3.select(".visual svg").selectAll("g.gcircles").data(nodes).enter().append("g")
		.attr("class","gcircles").on("mouseover",mouseover);;
	gcircles.append("circle").attr({
		r: function(d){return circleScale(d.value); },
		fill:function(d){return colorScale(d.type);},
		stroke: "#444",
	})
	gcircles.append("text").text(function(d){return d.job;}).attr("class","gtext")
	$(".gtext").hide(); //default no text
  force = d3.layout.force() // 建立 Layout
    		.nodes(nodes)               // 綁定資料
    		.size([width,width])            // 設定範圍
				.charge(-60)
    		.on("tick", tick2)           // 設定 tick 函式
    		.start();                   // 啟動！
	function mouseover(d){
		d3.selectAll("g.gcircles").classed("selected",false);
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
    		gcircles.attr("transform",function(d) { return 'translate(' + [d.x, d.y] + ')'; })
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
	$(".detail").hide();
	$(".visual").removeClass("eight wide column");
	$(".visual").addClass("twelve wide column");
	var num=Math.floor($(".visual").width()/120);

	dataTmp.sort(function(a,b){return b-a;});
	$(".visual svg").attr("width",width+leftwidth).attr("height",Math.floor(89/num)*120);
	force.size([$(".visual").width(),$(".visual").width()])
				.charge(0)
    		.on("tick", tick3)           // 設定 tick 函式
    		.start();                   // 啟動！
	function tick3() { // tick 會不斷的被呼叫
				var check=[];
				gcircles.transition().duration(60).attr("transform", function(d) {
						if(check.indexOf(d.value)==-1){
							check.push(d.value);
							return 'translate(' + [(dataTmp.indexOf(d.value)%num)*120+60,Math.floor(dataTmp.indexOf(d.value)/num)*120+60] + ')';
						}
						else{
							return 'translate(' + [((dataTmp.indexOf(d.value)+1)%num)*120+60,(Math.floor((dataTmp.indexOf(d.value)+1)/num))*120+60] + ')';
						}
				});
  	}
}
$("input[name='text']").click(function(){
	if($(this).prop("checked")){
		$(".gtext").show();
	}
	else{
		$(".gtext").hide();
	}
});
$("input[name='sort']").click(function(){
	if($(this).prop("checked")){
		force.stop();
		circlesort();

	}
	else{
		force.stop();
		visualize();
			if($("input[name='text']").prop("checked")){
				$(".gtext").show();
			}
			else{
				$(".gtext").hide();
			}
	}
})
});
