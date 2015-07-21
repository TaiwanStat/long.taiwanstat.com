var visual_width = $(".vis_div").width();
if(visual_width>400) visual_width=400;
var r = visual_width/2;
var color_scale = d3.scale.category10();
var arc = d3.svg.arc().outerRadius(r).innerRadius(0);
var pie = d3.layout.pie().sort(null).value(function(d){
    if((d.key != "year")&&(d.key != "總計")&&(d.key != "平均每人每日垃圾產生量")){
        return parseInt(d.value);
    }
    else{
        return 0;
    }
});
var pie_g = d3.select(".vis_div").append("svg").attr({
    "width":visual_width,
    "height":visual_width,
}).append("g").attr("transform","translate("+r+","+r+")"); //append svg and the g start at the ceneter of the pie
d3.csv("year_data.csv",function(dataset){
    var dataset_arr=[];
    for(var index in dataset){ ////to change the obj into arr
        var data_arr=[];
        for(var i in dataset[index]){
            var obj={};
            obj.key=i;
            obj.value=dataset[index][i];
            data_arr.push(obj);
        }
        dataset_arr.push(data_arr);
    }

    visual(dataset_arr);
    //console.log(dataset);
});
function visual(dataset_arr){
    //var arc_g = pie_g.selectAll("g").data(pie(dataset_arr[0])).enter().append("g").attr("class","arc_g");
    //var arc_path = arc_g.append("path").attr("class","arc_path").attr("d",arc).attr("fill",function(d){return color_scale(d.data.key);});
    var arc_path = pie_g.selectAll("path").data(pie(dataset_arr[0])).enter().append("path")
        .attr("class","arc_path").attr("d",arc)
        .attr("fill",function(d){return color_scale(d.data.key);})
        .each(function(d){this._current = d;});
    var index = 0;
    info(dataset_arr,index);
    var interval = setInterval(function(){
        index = index + 1;
        info(dataset_arr,index);
        change(dataset_arr,arc_path,index,interval);
    },2000);
    //change(dataset_arr,arc_path);


}
function info(dataset_arr,index){
    d3.selectAll(".info_p").remove();
    d3.select(".info_div").selectAll("p").data(dataset_arr[index]).enter().append("p")
    .attr("fill","black").attr("class","info_p").text(function(d){
        if(d.key=="year"){
            return d.value+"年";
        }
        else if (d.key=="平均每人每日垃圾產生量") {
            return d.key+":"+d.value+"公斤";
        }
    });
}
function change(dataset_arr,arc_path,index,interval){
   if(index == 8){
        clearTimeout(interval);
    }
    arc_path = arc_path.data(pie(dataset_arr[index]));
    arc_path.transition().duration(700).attrTween("d",arcTween);
    //arc_g.transition().duration(750).attrTween("d",arcTween); //redraw
}
function arcTween(a){
        //console.log(this._current);
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
            return arc(i(t));
        };
}
