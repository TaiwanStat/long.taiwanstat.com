var selector = ["hourMale", "hourFemale"];
var maleSelector = ["hourMale"];
var femaleSelector = ["hourFemale"];
var timeout;//change to grouped mode in ? second
var margin = {top: 30, right: 90, bottom: 110, left: 90},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
    return "<span style='color:white'>" + (d.y).toFixed(2) + "</span>";
  })

var svg = d3.select(".svg-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.csv("data/salary.csv", function(error, data) {
  if (error) throw error;

  var layers = d3.layout.stack()(selector.map(function(c) {
    return data.map(function(d) {
      return {x: d.work, y: +d[c]};
    });
  }));

  var dataMale = new Array();
  var dataFemale = new Array();

  data.forEach(function(d) {//read male data & female data
    var obj = new Object();
    obj.x = d.work;
    obj.y = +d.hourMale;
    dataMale.push(obj);

    var jbo = new Object();
    jbo.x = d.work;
    jbo.y = +d.hourFemale;
    dataFemale.push(jbo);
  })

  var byMale = dataMale.slice(0);//sorted male data
  byMale.sort(function(a,b) {
    return b.y - a.y;
  });
  var byFemale = dataFemale.slice(0);//sorted female data
  byFemale.sort(function(a,b) {
    return b.y - a.y;
  });

  var maleAvg = d3.sum(byMale, function(d) { return d.y; }) / byMale.length;
  var femaleAvg = d3.sum(byFemale, function(d) { return d.y; }) / byFemale.length;

  var n = 2, // number of layers
      m = layers[0].length, // number of samples per layer
      yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); }),
      yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

  var r = data.map(function(d) {//x domain for stacked and grouped
        return d.work;
  });

  var maleDomain = byMale.map(function(d){//x domain for male data
        return d.x;
  });

  var femaleDomain = byFemale.map(function(d){//x domain for female data
        return d.x;
  });

  var x = d3.scale.ordinal()
      .domain(r)
      .rangeRoundBands([0, width], 0.12);

  var y = d3.scale.linear()
      .domain([0, yStackMax])
      .range([height, 0]);

  var color = d3.scale.linear()
      .domain([0, n - 1])
      .range(["#80ccff", "#ff80c3"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(0)
      .tickPadding(6)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .tickSize(0)
      .tickPadding(3)
      .tickValues([200,400,600,800,1000])
      .orient("left")
      .tickFormat(function(d){return d});

  var layer = svg.selectAll(".layer")
      .data(layers)
      .enter()
      .append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return color(i); });

  var rect = layer.selectAll("rect")
      .data(function(d) { return d; })
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", height)
      .attr("width", x.rangeBand())
      .attr({rx : 5})
      // .attr("style","border-radius:30px")
      .attr("height", 0)
      .on("mouseover",tip.show)
      .on("mouseout", tip.hide)

  rect.transition()
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

  svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis)
     .selectAll("text")
     .style("font-size","16px")
     .style("font-weight", "normal")
     .style("text-anchor", "start")
     .style("fill","#4d4d4d")
     .attr("dx", "-0.1em")
     .attr("dy", "1em")
     .attr("transform", "rotate(25)" );

  svg.append("g")
     .attr("class", "y axis")
     .call(yAxis)
     .append("text")
     .style("font-size","16px")
     .style("font-weight", "normal")
     .style("fill","#4d4d4d")
     .text("時薪(NTD)")
     .attr("x", -7)
     .attr("y", -3)
     .attr("dy", ".71em")
     .style("text-anchor", "end");

  d3.selectAll(".chart").on("change", change);
  d3.selectAll(".maleChart").on("change",changeMale );
  d3.selectAll(".femaleChart").on("change",changeFemale );

  // timeout = setTimeout(function() {//change to grouped mode in ? second
  //   d3.select("input.chart[value=\"grouped\"]").property("checked", true).each(change);
  // }, 22000);

  svg.append("line")//male average line
     .attr("x1",0)//start x
     .attr("y1",y(maleAvg))//start y
     .attr("x2",width)//end x
     .attr("y2",y(maleAvg))//end y
     .attr("stroke","#3333ff")
     .attr("stroke-width",2)
     .attr("stroke-dasharray",10)
     .attr("id","maleLine")
     .style("opacity",0)

  svg.append("text")//male line text
     .attr("x",-26)
     .attr("y",y(maleAvg) )
     .attr("dy", ".35em")
     .attr("fill","#3333ff")
     .style("font-weight", "normal")
     .style("font-size","14px")
     .attr("id","maleLineText")
     .text(maleAvg.toFixed(0))
     .style("opacity",0)

  var maleOpacity;
  var maleBtn=d3.select('#maleAverage')//maleAverage(checkbox) <--> on click function
      .on("click", function(){
        var active = maleLine.active ? false : true,// Determine if current line is visible
            maleOpacity = active ? 1 : 0;
        d3.select("#maleLine").style("opacity", maleOpacity);// Hide or show the elements
        d3.select("#maleLineText").style("opacity", maleOpacity);
        maleLine.active = active;// Update whether or not the elements are active
      })

  svg.append("line")//female average line
     .attr("x1",0)//start x
     .attr("y1",y(femaleAvg))//start y
     .attr("x2",width)//end x
     .attr("y2",y(femaleAvg))//end y
     .attr("stroke","#cc0000")
     .attr("stroke-width",2)
     .attr("stroke-dasharray",10)
     .attr("id","femaleLine")
     .style("opacity",0)

  svg.append("text")//female line text
     .attr("x",-26)
     .attr("y",y(femaleAvg) )
     .attr("dy", ".35em")
     .attr("fill","#cc0000")
     .style("font-size","14px")
     .style("font-weight", "normal")
     .attr("id","femaleLineText")
     .text(femaleAvg.toFixed(0))
     .style("opacity",0)

  var femaleOpacity;
  var femaleBtn=d3.select('#femaleAverage')//femaleAverage(checkbox) <--> on click function
      .on("click", function(){
        var active = femaleLine.active ? false : true,// Determine if current line is visible
            femaleOpacity = active ? 1 : 0;
        d3.select("#femaleLine").style("opacity", femaleOpacity);// Hide or show the elements
        d3.select("#femaleLineText").style("opacity", femaleOpacity);
        femaleLine.active = active;// Update whether or not the elements are active
      })

function change() {
  clearTimeout(timeout);
  if (this.value === "grouped") transitionGrouped();
  else transitionStacked();
}

function changeMale(){
  x.domain(maleDomain);

  svg.selectAll(".x.axis")
     .transition()
     .duration(1000)
     .call(xAxis)
     .selectAll("text")
     .style("font-size","16px")
     .style("font-weight", "normal")
     .style("text-anchor", "start")
     .attr("dx", "-0.1em")
     .attr("dy", "1em")
     .attr("transform", "rotate(25)" );

  rect.data(byMale)
      .transition()
      .duration(1000)
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .attr("width", x.rangeBand())
      .attr("height", function(d){
        return height - y(d.y);
      })
      .style("fill","#80ccff" )

}

function changeFemale(){
  x.domain(femaleDomain);

  svg.selectAll(".x.axis")
     .transition()
     .duration(1000)
     .call(xAxis)
     .selectAll("text")
     .style("font-size","16px")
     .style("font-weight", "normal")
     .style("text-anchor", "start")
     .attr("dx", "-0.1em")
     .attr("dy", "1em")
     .attr("transform", "rotate(25)" );

  rect.data(byFemale)
      .transition()
      .duration(1000)
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .attr("width", x.rangeBand())
      .attr("height", function(d){
        return height - y(d.y);
      })
      .style("fill","#ff80c3" )
}

function transitionGrouped() {
  y.domain([0, yGroupMax]);
  x.domain(r);

  svg.selectAll(".x.axis")
     .transition()
     .duration(1000)
     .call(xAxis)
     .selectAll("text")
     .style("font-size","16px")
     .style("font-weight", "normal")
     .style("text-anchor", "start")
     .attr("dx", "-0.1em")
     .attr("dy", "1em")
     .attr("transform", "rotate(25)" );

  layer.data(layers);

  rect.data(function(d){return d;})
      .transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
      .attr("width", x.rangeBand() / n)
      .transition()
      .attr("y", function(d) { return y(d.y); })
      .attr("height", function(d) { return height - y(d.y); })
      .style("fill", function(d, i) {
          if(d.y0 === 0)
            return color(0);
          else
            return color(1); });
  }

function transitionStacked() {
  y.domain([0, yStackMax]);
  x.domain(r);

  svg.selectAll(".x.axis")
     .transition()
     .duration(1000)
     .call(xAxis)
     .selectAll("text")
     .style("font-size","16px")
     .style("font-weight", "normal")
     .style("text-anchor", "start")
     .attr("dx", "-0.1em")
     .attr("dy", "1em")
     .attr("transform", "rotate(25)" );

  layer.data(layers);

  rect.data(function(d){return d;})
      .transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
      .transition()
      .attr("x", function(d) { return x(d.x); })
      .attr("width", x.rangeBand())
      .style("fill", function(d, i) {
          if(d.y0 === 0)
            return color(0);
          else
            return color(1); });
}


});