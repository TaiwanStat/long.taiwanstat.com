 var visual_width = $(".vis_div").width();
 var r = visual_width/2;
 var color_scale = d3.scale.category10();
 var arc = d3.svg.arc().outerRadius(r).innerRadius(0);
 var pie = d3.layout.pie().sort(null).value(function(d){return parseInt(d.year);});
 var pie_g = d3.select(".vis_div").append("svg").attr({
    "width":visual_width,
    "height":visual_width,
}).append("g").attr("transform","translate("+r+","+r+")"); //append svg and the g start at the ceneter of the pie
d3.csv("year_data.csv",function(dataset){
    visual(dataset);
    console.log(dataset);
});
function visual(dataset){
    var arc_g = pie_g.selectAll("g").data(pie(dataset)).enter().append("g");
    arc_g.append("path").attr("d",arc).attr("fill",function(d){return color_scale(d.year);});
}
