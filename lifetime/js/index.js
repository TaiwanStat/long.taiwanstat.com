$(function(){
    var $select = $("#age");
    for (i=10;i<=80;i++){
        $select.append("<option value=\""+i+"\">"+i+"</option>");
    }
});

var age = 10, hometown ="南投縣";
// $('#age').dropdown();

function getHometown(sel){
  hometown = sel.value;
}
function getAge(sel){
  age = sel.value;
}

function detectmob() { 
 if($(window).width()<900){
    console.log("mobile!")
    return true;
  }
 else {
    console.log("web!")
    return false;
  }
}

document.getElementById("go").onclick = function () { 


d3.select("svg").remove();
d3.select(".ProgressBar").remove();
d3.select(".tooltip").remove();
$("#main-container").html('\
  <div class="row">\
  <div class="column">\
    <div id="chart-descript"></div>\
    <div class="line-chart"></div>\
  </div>\
  <div class="column">\
    <div id="circle-descript"></div>\
    <div id="container"></div>\
  </div>\
  </div>\
  <div id="bottomtext"></div>\
  </div>');
$("#container").html('');

if(detectmob()){
  var margin = {top: 100, right: 50, bottom: 30, left: 80},
    width = 300 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

}else{
  var margin = {top: 100, right: 50, bottom: 30, left: 80},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
}

var bisectAge = d3.bisector(function(d) { return d.age; }).left;

var x = d3.scale.linear()
    .range([0, width]);
    
var y = d3.scale.linear()
    .range([height, 0]);
    
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(6);


if(detectmob()){
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(3);
}else{
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(4);
}


var line = d3.svg.line()
    .x(function(d) { return x(d.age); })
    .y(function(d) { return y(d.value); });

var svg = d3.select(".line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select(".line-chart").append("div").attr("class", "tooltip").style("opacity",0);

var totalPopulation = 0; 


d3.csv("data/"+hometown+".csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.age = +d.age;
    d.value = +d.value;
    totalPopulation = d.value + totalPopulation;
  });


  x.domain(d3.extent(data, function(d) { return d.age; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

  //X axis label
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 15)
    .text("年紀（年）");
      

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  //y axis label
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -15)
    .attr("x", 10)
    .text("人口數（人）");

  var mainLine = svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .style("stroke", "#495057")
      .style("opacity",.2);

    var text = age;
    var i = bisectAge(data, text,1),
    d0 = data[i - 1],
    d1 = data[i],
    d2 = text - d0.age > d1.age - text ? d1 : d0;
    var percent = d2.value/totalPopulation*100;
    var NumOfYounger = 0;
    data.forEach(function(d) {
      if(d.age <= d2.age)
        NumOfYounger = NumOfYounger + d.value;
    })
    var NumOfOlder = totalPopulation - NumOfYounger - d2.value;
    var YoungerPercent = NumOfYounger/totalPopulation*100

  var area = d3.svg.area()
  .x(function(d) { return x(d.age); })
  .y0(height)
  .y1(function(d) { return y(d.value); })
  .defined(function(d) { return d.age<=d2.age; });;

  svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .style("opacity",0.5)
        .style("fill", "#4c6ef5");

  var verticalText = svg.append("text");
  var verticalFixed = svg.append("line");
  var verticalCircle = svg.append("circle")
      .attr("r", 4.5).style("opacity",0);



  var verticalLine = svg.append('line')
// .attr('transform', 'translate(100, 50)')
.attr({
    'x1': 0,
    'y1': 0,
    'x2': 0,
    'y2': height + margin.top + margin.bottom
})
    .attr("stroke", "steelblue")
    .attr('class', 'verticalLine');

circle = svg.append("circle")
    .attr("opacity", 0)
    .attr({
    r: 6,
    fill: 'darkred'

});
    var rect = svg.append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("fill","transparent")
  .attr("z-index",999);

    rect.on('mousemove', function () {

    var xPos = d3.mouse(this)[0];
    d3.select(".verticalLine").attr("transform", function () {
        return "translate(" + xPos + ",0)";
    });
    // rect.on('mouseenter', function () {
    // d3.select(".verticalLine").attr("opacity", 1)
    // console.log("enter")
    // });
    // rect.on('mouseleave', function () {
    // d3.select(".verticalLine").attr("opacity", 0)
    // console.log("leave")
    // });

    

    var pathLength = mainLine.node().getTotalLength();
    var fx = xPos;
    var beginning = fx,
        end = pathLength,
        target;
    while (true) {
        target = Math.floor((beginning + end) / 2);
        pos = mainLine.node().getPointAtLength(target);
        if ((target === end || target === beginning) && pos.x !== fx) {
            break;
        }
        if (pos.x > fx) end = target;
        else if (pos.x < fx) beginning = target;
        else break; //position found
    }
    circle.attr("opacity", 1)
        .attr("cx", fx)
        .attr("cy", pos.y);
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectAge(data, x0,1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.age > d1.age - x0 ? d1 : d0;
    div.style("opacity", .6); 
    div.html("年紀："+d.age + "<br/>"  + "人數："+d.value)  
                    .style("left", fx + "px");
    $( "rect" ).hover(
                function( ){
                    d3.select(".verticalLine").attr("opacity", 1);
                    div.style("opacity", .6);
                    circle.attr("opacity", 1);
                },
                function(  ){
                    d3.select(".verticalLine").attr("opacity", 0);
                    div.transition().style("opacity", 0);
                    circle.attr("opacity", 0);
                }
    );

});
    
    verticalFixed
        .style("opacity",.4)
        .attr("y1", y(d2.value)+"px")
        .attr("y2", y(d2.value)-30+"px")
        .attr("x1", x(d2.age)+"px")
        .attr("x2", x(d2.age)+"px")
        .style("stroke-width", 1)
        .style("stroke", "black")
        .style("fill", "none");
    verticalCircle
        .attr("cx",x(d2.age)+"px")
        .attr("cy",y(d2.value)+"px" )
        .style("opacity",1)
        .style("stroke-width", 2)
        .style("fill", "gray")
        .style("stroke", "white");
  if(detectmob()){
    verticalText
        .style("text-anchor", "middle")
        .attr("x",x(d2.age)+"px")
        .attr("y",y(d2.value)-35+"px")
        .text(YoungerPercent.toFixed(2)+"%")
        .style("font-size","12px")
        .attr("fill", "#4c6ef5");
  }else{
    verticalText
        .style("text-anchor", "middle")
        .attr("x",x(d2.age)+"px")
        .attr("y",y(d2.value)-35+"px")
        .text(YoungerPercent.toFixed(2)+"%")
        .style("font-size","20px")
        .attr("fill", "#4c6ef5");
  }
    
var text = age;
var percentage = parseInt(text)/80.2;

    document.getElementById("chart-descript").innerHTML ="<h3 class=\"highlight\">您在當地年齡結構的位置</h3><p>在<span class=\"highlight\">"+hometown+"</span>，<br>有 "+percent.toFixed(2)+" % 的人與您同年，<br>即 "
    +d2.value+" 人，<br>同時有 <span class=\"highlight\">"+YoungerPercent.toFixed(2)+" %</span><br>的人比您還要年輕。</p>";
    document.getElementById("circle-descript").innerHTML = "<h3 class=\"highlight\">您的平均餘命</h3><p>而在 104 年的調查中，<br>台灣人平均壽命為 80.20 歲，<br>以您而言，度過了 <span class=\"highlight\">"+(percentage*100).toFixed(2)+" %</span> <br>的時光。</p>";

if(age < 20){
  document.getElementById("bottomtext").innerHTML = "人生才要開始，你有無限的可能。";
}else if(age>=20 && age < 40){
  document.getElementById("bottomtext").innerHTML = "所以說，人生還長，莫嘆已老。";
}else if(age>=40 && age < 60){
  document.getElementById("bottomtext").innerHTML = "人生過半，但求沒有遺憾。";
}else{
  document.getElementById("bottomtext").innerHTML = "歲月如梭，青春不老。";
}

var bar = new ProgressBar.Circle(container, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#4c6ef5', width: 4 },
  to: { color: '#ff5555', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(text+' / 80.20 歲');
    }

  }
});
bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
bar.text.style.fontSize = '1rem';
console.log(percentage.toFixed(2));
bar.animate(percentage.toFixed(2));

});
};