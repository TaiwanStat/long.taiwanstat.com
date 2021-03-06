var visual_width = $(".vis_div").width();
if(visual_width>400) visual_width=400;
var r = visual_width/2;
//var color_scale = d3.scale.category10();
var color_scale = d3.scale.ordinal().domain(d3.range(0,6)).range(["#FFA488","#FFBB66","#FFDD55","#FFFF77","#DDFF77","#BBFF66","#66FF66"]);
var arc = d3.svg.arc().outerRadius(r).innerRadius(0);
var pie = d3.layout.pie().sort(null).value(function(d){
    if((d.key != "year")&&(d.key != "總計")&&(d.key != "平均每人每日垃圾產生量")){
        return parseInt(d.val);
    }
    else{
        return 0;
    }
});
var pie_g = d3.select(".vis_div").append("svg").attr({
    "width":visual_width,
    "height":visual_width,
}).append("g").attr("transform","translate("+r+","+r+")"); //append svg and the g start at the ceneter of the pie
var tip = d3.tip().attr("class","d3-tip").offset(function() {
    return [this.getBBox().height / 2, 0]
})
.html(function(d){
    var num = new Intl.NumberFormat('en-IN').format(d.data.val);
    var num1000 = parseInt(d.data.val/d.data.all_val*1000);
    var num_str = parseInt(num1000/10)+"."+num1000%100+"";
    return d.data.key+":"+num+"公噸,"+num_str+"%";
});
pie_g.call(tip);
d3.csv("year_data.csv",function(dataset){
    var dataset_arr=[];
    for(var index in dataset){ ////to change the obj into arr
        var data_arr=[];
        for(var i in dataset[index]){
            var obj={};
            obj.key = i;
            obj.val = dataset[index][i];
            obj.all_val = dataset[index]["總計"];
            data_arr.push(obj);
        }
        dataset_arr.push(data_arr);
    }
    console.log(dataset_arr);
    visual_pie(dataset_arr);
    //console.log(dataset);
});
d3.csv("month_data.csv",function(dataset){
    var dataset_arr = d3.nest().key(function(d){
        return d.month.substr(0,4);
    }).entries(dataset);
    console.log(dataset_arr);
    var index = 0;
    visual_rect(dataset_arr,index);

})
function visual_pie(dataset_arr){
    var arc_g = pie_g.selectAll("g").data(pie(dataset_arr[0])).enter()
    .append("g").attr("class","arc_g");
    var arc_path = arc_g.append("path").attr("class","arc_path").attr("d",arc)
    .attr("fill",function(d){return color_scale(d.data.key);})
    .each(function(d){this._current = d;}).on('mouseover', tip.show)
    .on('mouseout', tip.hide);
    /*var arc_path = pie_g.selectAll("path").data(pie(dataset_arr[0])).enter().append("path")
    .attr("class","arc_path").attr("d",arc)
    .attr("fill",function(d){return color_scale(d.data.key);})
    .each(function(d){this._current = d;});*/
    var arc_text = arc_g.append("text")
    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d) {
        if(d.data.val>400000){
            return d.data.key;
        }
        else{
            return "";
        }
    });

    var index = 0;
    info(dataset_arr,index);
    var interval = setInterval(go,1000);
    $(".pause_b").click(function(){
        clearTimeout(interval);

    })
    $(".play_b").click(function(){
        clearTimeout(interval);
        interval = setInterval(go,1000);
    })
    function go(){
        if(index >= 13){
            clearTimeout(interval);
        }
        else{
            index = index + 1;
            info(dataset_arr,index);
            change(dataset_arr,arc_path,arc_text,index,interval);
        }
    }

    //change(dataset_arr,arc_path);


}
function visual_rect(dataset_arr,index){
    data_arr = dataset_arr[index].values;
    var chart_width = $(".vis_div").width()+$(".info_div").width();
    var rect_svg = d3.select(".rect_div").append("svg")
    .attr("width",chart_width).attr("height",visual_width)
    var rect_g = rect_svg.append("g").attr("transform","translate(100,-50)");
    var x_scale = d3.scale.linear().domain([0,13]).range([0,chart_width-100]);
    var y_scale = d3.scale.linear().domain([0,950000]).range([visual_width-50,0]);
    var x_axis = d3.svg.axis().scale(x_scale).orient("bottom").ticks(0);
    var y_axis = d3.svg.axis().scale(y_scale).orient("left").ticks(10);
    rect_svg.append("g").attr("class","x_g")
    .attr("transform","translate(100,"+(visual_width-50)+")").call(x_axis)
    .append("text");
    rect_svg.append("g").attr("class","y_g")
    .attr("transform","translate(100,0)").call(y_axis);
    rect_svg.selectAll(".x_text").data(data_arr).enter().append("text").attr("class","x_text")
    .attr("transform",function(d,i){return "translate("+(x_scale(i)+(chart_width-100)/28+100)+","+(visual_width-20)+")";})
    .text(function(d,i){return (i+1)+"月";});
    var bar_g = rect_g.selectAll(".bar_g").data(data_arr).enter()
    .append("g").attr("class","bar_g")
    var arr = ["總計","焚化","衛生掩埋","巨大垃圾回收再利用","廚餘回收","資源回收","其他"];
    var position = [0,0,0,0,0,0,0,0,0,0,0,0];
    var length = [0,0,0,0,0,0,0,0,0,0,0,0];
    var ii = 0;
    for (ii=0;ii<6;ii++){

        bar_g//.selectAll("rect").data(data_arr).enter()
        .append("rect").attr("class","bar_"+ii).attr("x",function(d,i){return x_scale(i);})
        .attr("y",function(d,i){
            if(position[i]==0){
                position[i] = y_scale(d[arr[ii]])+50;
            }
            else{
                position[i] = length[i] + position[i];
            }

            return position[i];
        })
        .attr("width",(chart_width-100)/14)
        .attr("height",function(d,i){
            length[i] = visual_width-y_scale(d[arr[ii+1]])-50
            return length[i];
        })
    }
    var interval = setInterval(go,1000);
    $(".pause_b").click(function(){
        clearTimeout(interval);

    })
    $(".play_b").click(function(){
        clearTimeout(interval);
        interval = setInterval(go,1000);
    })
    function go(){
        if(index >= 12){
            clearTimeout(interval);
        }
        else{
            index = index + 1;
            change_rect(dataset_arr,index,chart_width,y_scale,interval);
        }
    }


}
function change_rect(dataset_arr,index,chart_width,y_scale){

    var y_axis = d3.svg.axis().scale(y_scale).orient("left").ticks(10);
    d3.selectAll(".y_g").transition().duration(700)
    .attr("transform","translate(100,0)").call(y_axis);
    var data_arr = dataset_arr[index].values;
    var arr = ["總計","焚化","衛生掩埋","巨大垃圾回收再利用","廚餘回收","資源回收","其他"];
    var position = [0,0,0,0,0,0,0,0,0,0,0,0];
    var length = [0,0,0,0,0,0,0,0,0,0,0,0];
    var ii = 0;
    for (ii=0;ii<6;ii++){

        d3.selectAll(".bar_"+ii).data(data_arr).transition().duration(700)
        .attr("y",function(d,i){
            if(position[i]==0){
                position[i] = y_scale(d[arr[ii]])+50;
            }
            else{
                position[i] = length[i] + position[i];
            }

            return position[i];
        })
        .attr("height",function(d,i){
            length[i] = visual_width-y_scale(d[arr[ii+1]])-50
            return length[i];
        })
    }
}
function info(dataset_arr,index){

    d3.map(dataset_arr[index],function(d){
        if(d.key=="year"){
            d3.select(".info_span_year").text(d.val);
        }
        else if (d.key=="總計") {
            var num = format(d.val);
            d3.select(".info_span_all").text(num);
        }
        else if (d.key=="平均每人每日垃圾產生量") {
            d3.select(".info_span_day").text(d.val);
        }
    })

}
function format(number){
    var number_head = parseInt(number/1000000);
    var number_middle = parseInt(number%1000000/1000);
    var number_tail = number%1000;
    if(number_tail==19) number_tail="019";
    return number_head+","+number_middle+","+number_tail;
}
function change(dataset_arr,arc_path,arc_text,index){

    arc_path = arc_path.data(pie(dataset_arr[index]));
    arc_path.transition().duration(700).attrTween("d",arcTween);
    arc_text = arc_text.data(pie(dataset_arr[index])).transition().duration(10).text(function(d) {
        if(d.data.val>400000){
            return d.data.key;
        }
        else{
            return "";
        }
    });
    arc_text.transition().duration(700) .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
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
