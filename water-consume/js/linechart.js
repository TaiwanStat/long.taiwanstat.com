var margin = {top: 40, right: 80, bottom: 30, left: 60},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y"),
    xScale = d3.scaleTime()
               .domain(d3.extent(linedata, function(d){ return d.year; }))
               .range([0, width]),
    xScaleAxis = d3.scaleTime()
               .domain(d3.extent(linedata, function(d){ return parseTime(d.year); }))
               .range([0, width]),
    yScale = d3.scaleLinear()
               .domain(d3.extent(linedata, function(d){ return d.consumption; }))
               .range([height, 0]),
    line = d3.line()
             .x(function (d){ return xScale(d.year); })
             .y(function (d){ return yScale(d.consumption); }),
    yScalePop = d3.scaleLinear()
                  .domain(d3.extent(popdata, function(d){ return d.population; }))
                  .range([height, 0]),
    popline = d3.line()
            .x(function (d) { return xScale(d.year); })
            .y(function (d) { return yScalePop(d.population); });

var svg = d3.select("body")
            .append("svg")
            .attr('id', "svg")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append("g")
            .attr('transform', "translate(55,10)")
            .attr('id', "group");

// consumption line chart
svg.append("path")
   .data([linedata])
   .attr('class', "line")
   .attr('stroke', "blue")
   .attr('d', line)
   .attr('fill', "none");

// x-axis
svg.append("g")
   .call(d3.axisBottom(xScaleAxis))
   .attr('transform', "translate(0,+"+height+")");

// left y-axis
svg.append("g")
   .attr('id', "leftY")
   .call(d3.axisLeft(yScale)
           .ticks(8)
           .tickPadding(5)
           .tickFormat(function(d){
                var tickStr = d / 1e6;
                return this.parentNode.nextSibling? tickStr : tickStr + ""; 
           })
           .tickValues(
            d3.range(
                d3.min(linedata, function(d){ return d.consumption; }),
                d3.max(linedata, function(d){ return d.consumption; })+1,
                (d3.max(linedata, function(d){ return d.consumption; })
                -d3.min(linedata, function(d){ return d.consumption; }))/7
             )
         )
    )
   .selectAll("text")
   .attr('fill', "blue");

// population line chart
svg.append("path")
   .data([popdata])
   .attr('class', "pop")
   .attr('stroke', "red")
   .attr('d', popline)
   .attr('fill', "none");

// right y-axis
svg.append("g")
   .attr('id', "rightY")
   .call(d3.axisRight(yScalePop)
           .ticks(8)
           .tickValues(
               d3.range(
                   d3.min(popdata, function(d){ return d.population; }),
                   d3.max(popdata, function(d){ return d.population; })+1,
                   (d3.max(popdata, function(d){ return d.population; })
                   -d3.min(popdata, function(d){ return d.population; }))/7
                )
            )
           .tickPadding(5)
           .tickFormat(function(d){
               return d;
           })
        )
   .attr('transform', "translate("+width+",0)")
   .selectAll("text")
   .attr('fill', "red");

// grid x
svg.append("g")
   .call(d3.axisBottom(xScale).tickFormat("").tickSize(-height,0))
   .attr('transform', "translate(0,"+height+")")
   .attr('opacity', "0.1");

// grid y
svg.append("g")
   .call(d3.axisLeft(yScale)
           .tickFormat("")
           .tickSize(-width,0)
           .tickValues(
            d3.range(
                d3.min(linedata, function(d){ return d.consumption; }),
                d3.max(linedata, function(d){ return d.consumption; })+1,
                (d3.max(linedata, function(d){ return d.consumption; })
                -d3.min(linedata, function(d){ return d.consumption; }))/7
            )
        )
    )
   .attr('opacity', "0.1");

// unit
var leftUnitX = $("#group").offset().left,
    leftUnitY = $("#group").offset().top;
// left unit
d3.select("svg").append("text")
   .text("1e6公升")
   .attr('x', $("svg").offset().left)
   .attr('y', height/2)
   .attr('style', "writing-mode:vertical-lr; font-size: 12px; fill: blue;");
// right unit
d3.select("svg").append("text")
  .text("1e4人")
  .attr('x', width+margin.right+margin.left-20)
  .attr('y', height/2)
  .attr('style', "writing-mode:vertical-lr; font-size: 12px; fill: red;");

d3.selectAll("#rightY .tick text")
  .each(function(d,i){
      //console.log(this);
      d3.select(this)
        .text((parseInt(d3.select(this).text())/1e4).toFixed(1))
  });

d3.selectAll("#leftY .tick text")
  .each(function(d,i){
      d3.select(this)
        .text(parseInt(parseInt(d3.select(this).text()).toFixed(1)))
  });

// circle
svg.append("g")
   .selectAll("circle")
   .data(linedata)
   .enter()
   .append("circle")
   .each(function(d,i){
       d3.select(this)
          .attr('cx', xScale(d.year))
          .attr('cy', yScale(d.consumption))
          .attr('r', 5)
          .attr('fill', "blue")
   });

svg.append("g")
   .selectAll("circle")
   .data(popdata)
   .enter()
   .append("circle")
   .each(function(d,i){
       d3.select(this)
          .attr('cx', xScale(d.year))
          .attr('cy', yScalePop(d.population))
          .attr('r', 5)
          .attr('fill', "red")
   });
// 做開關