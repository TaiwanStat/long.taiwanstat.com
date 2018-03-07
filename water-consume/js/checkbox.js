d3.select(".myCheckbox").on("change", function(){
    if(signal == 1){
        // recover all graph and react 'check box'
        recoverPie();
        recoverSlope();
        recoverCircle();
        $(".tagRegion").remove();
        if(d3.select(".myCheckbox").property("checked")){
            if(signal == 1)
                checkedCheckbox();
        }
    }
});

function checkedCheckbox(){
    //$(".tagRegion").remove();
    //highlight region where line is red
    d3.selectAll("line[style*='stroke: rgb(255, 0, 0)']")
    .attr('opacity', "1")
    .style('stroke-width', "7px");
    d3.selectAll("circle[style*='stroke: rgb(255, 0, 0)']")
    .attr('r', "8px")
    .attr('opacity', "1")
    .style('stroke-width', "7px");

    // console.log(d3.selectAll("circle[style*='stroke: rgb(255, 0, 0)']"));
    var parsedId = [];
    d3.selectAll("line[style*='stroke: rgb(255, 0, 0)']")
      .each(function(d,i){
            parsedId.push(d3.select(this).attr('id'));
      });
    var element, pieId, pieTextId;
    for (var i = 0; i < parsedId.length; i++) {
        element = parsedId[i].split("slope")[1];
        pieId = "#pie" + element;
        pieTextId = "#pietext" + element;
        highlightAPie(element, pieTextId, pieId);
    }
    var textTarget = d3.selectAll("circle[cx*= '"+(slopewidth-20)+"'][style*='stroke: rgb(255, 0, 0)']").nodes();
    for (var j = 0; j < textTarget.length; j++) {
        var tmp = textTarget[j];
        d3.select("#slopesvg")
          .append("text")
          .text(region_list[tmp["id"].split("circle")[1]])
          .attr('x', tmp["cx"].animVal["value"]+105)
          .attr('y', tmp["cy"].animVal["value"]+40)
          .attr('style', "fill: #1E90FF; font-size: 14px")
          .attr('class', "tagRegion");
        console.log(tmp["cy"].animVal["value"]);
        console.log(tmp["id"].split("circle")[1]);
    }

    // hide region where line is not red
    d3.selectAll("line[style*='stroke: rgb(0, 191, 255)']")
    .attr('opacity', "0.05");
    d3.selectAll("circle[style*='stroke: rgb(0, 191, 255)']")
    .attr('opacity', "0.05");
}
