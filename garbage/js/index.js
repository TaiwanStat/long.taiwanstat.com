var visual_width = $(".vis_div").width();
var r = visual_width/2;
var color_scale = d3.scale.category10();
var arc = d3.svg.arc().outerRadius(r).innerRadius(0);
var pie = d3.layout.pie().sort(null).value(function(d){
    if((d.key != "year")&&(d.key != "總計")&&(d.key != "平均每人每日垃圾產生量")){
        console.log(d.key);
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
    
    visual(dataset_arr[0]);
    //console.log(dataset);
});
function visual(data_arr){
    var arc_g = pie_g.selectAll("g").data(pie(data_arr)).enter().append("g");
    arc_g.append("path").attr("d",arc).attr("fill",function(d){return color_scale(d.data.key);});
}
