(function() {

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width]);

  var y = d3.scale.linear()
    .range([height - 100, 0])
    .domain([1, 0]);

  var color = d3.scale.category10();

  var formatPercent = d3.format('%');

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickFormat(formatPercent);

  var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  d3.json("中小企業家數－按行業別分103.json", function(err, data) {
    if(err) throw err;

    function numberFormat(number, decimals, decPoint, thousandsSep) {
      decimals = isNaN(decimals) ? 2 : Math.abs(decimals);
      decPoint = (decPoint === undefined) ? '.' : decPoint;
      thousandsSep = (thousandsSep === undefined) ? ',' : thousandsSep;

      var sign = number < 0 ? '-' : '';
      number = Math.abs(+number || 0);

      var intPart = parseInt(number.toFixed(decimals), 10) + '';
      var j = intPart.length > 3 ? intPart.length % 3 : 0;

      return sign + (j ? intPart.substr(0, j) + thousandsSep : '') + intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep) + (decimals ? decPoint + Math.abs(number - intPart).toFixed(decimals).slice(2) : '');
    };

    var fix_d = data.map(function(d, i) {

      var origin = d["TD"];
      return {
        "總數": +origin[0].P.trim().replace(/,/g, ''),
        "總數原始": origin[0].P.trim(),
        "大企業數": +origin[0].P.trim().replace(/,/g, '') - +origin[1].P.trim().replace(/,/g, ''),
        "大企業數原始": numberFormat(+origin[0].P.trim().replace(/,/g, '') - +origin[1].P.trim().replace(/,/g, ''), 0),
        "中小企業數": +origin[1].P.trim().replace(/,/g, ''),
        "中小企業數原始": origin[1].P.trim(),
        "中小比例": +origin[2].P.trim() / 100,
        "大公司比例": 1 - (+origin[2].P.trim()) / 100 ,
        "項目": origin[3].P.trim()
      }
    })

    var items = fix_d.map(function(d) {return d["項目"];});

    color.domain(["中小比例", "大公司比例"]);
    x.domain(items);

    svg.append("g")
      .attr('class', "x axis")
      .attr("transform", "translate(0," + (height - 100)+ ")")
      .call(xAxis);

    var crops = svg.selectAll(".crops")
      .data(fix_d)
    .enter().append("g")
      .attr("class", "crops")
      .attr("transform", function(d, i) { return "translate(" + (x.rangeBand() * i + 5) + ",0)";})

    crops.append("rect")
      .attr("class", "area")
      .attr("width", x.rangeBand() - 2)
      .attr("y", function(d) { return height - 100 - y(d["中小比例"]); })
      .attr("height", function(d) {return y(d["中小比例"]); })
      .on("mouseover", function(d) {
        d3.select("#title-corp").html(d["項目"]);
        d3.select("#sm-count").html(d["中小企業數原始"]);
        d3.select("#l-count").html(d["大企業數原始"])
        d3.select("#all-count").html(d["總數原始"])

        d3.select(this)
          .style('stroke', 'yellow')
          .style('stroke-width', 1.5)
      })
      .on("mouseout", function(d) {
        d3.select("#title-corp").html("請移到圖表中看資訊");
        d3.select("#sm-count").html("請移到圖表中看資訊");
        d3.select("#l-count").html("請移到圖表中看資訊")
        d3.select("#all-count").html("請移到圖表中看資訊")
        d3.select(this)
          .style('stroke-width', 0)
      })
      .style("fill", color("中小比例"));

    crops.append("rect")
      .attr("class", "big-area")
      .attr("width", x.rangeBand() - 2)
      .attr("height", function(d) {return y(d["大公司比例"]); })
      .style("fill", color("大公司比例"))
      .on("mouseover", function(d) {
        d3.select("#title-corp").html(d["項目"]);
        d3.select("#sm-count").html(d["中小企業數原始"]);
        d3.select("#l-count").html(d["大企業數原始"])
        d3.select("#all-count").html(d["總數原始"])

        d3.select(this)
          .style('stroke', 'yellow')
          .style('stroke-width', 1.5)
      })
      .on("mouseout", function(d) {
        d3.select("#title-corp").html("請移到圖表中看資訊");
        d3.select("#sm-count").html("請移到圖表中看資訊");
        d3.select("#l-count").html("請移到圖表中看資訊")
        d3.select("#all-count").html("請移到圖表中看資訊")

        d3.select(this)
          .style('stroke-width', 0)
      })

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("比例");
  })

})()
