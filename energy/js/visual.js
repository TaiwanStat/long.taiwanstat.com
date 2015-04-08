function piechart(data, year) {

  var width = 600,
    height = 600,
    radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
    .range(["#F2C61F", "#60BF76", "#3C83C0", "#E1805A", "#D95C5C", "#00B5AD", "#D9499A"]);

  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d[year]; });

  var trueWidth = $('.plot').parent().width()*0.8;

  var svg = d3.select(".plot").append("svg")
    .attr("width", trueWidth)
    .attr("height", trueWidth)
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMin meet")
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var g = svg.selectAll(".arc")
    .data(pie(data))
  .enter().append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("d", arc)
    .style("fill", function(d, i) {
      $('.name.tno'+i).css('color', color(i));
      return color(i);
    })
    .on("click", function(d, i) {
      $('.curSelect.header')
        .text(data[i].name)
        .css('color', color(i));

      $('.raw.value').text(data[i][year]);
      $('.percent.value').text($('.mean.tno'+i).text());
      highlight= i;

      if(data[i].children != undefined)
        $('.curSelect.button').removeClass('disabled');
      else if(data[i].children == undefined)
        $('.curSelect.button').addClass('disabled');
    });

  $('.curSelect.header')
    .text(data[highlight].name)
    .css('color', color(highlight));

  $('.raw.value').text(data[highlight][year]);
  $('.percent.value').text($('.mean.tno'+highlight).text());

  // g.append("text")
  //   .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
  //   .attr("dy", ".35em")
  //   .style("text-anchor", "middle")
  //   .text(function(d) { return d.data.name; });

}

function updatePie(data, year) {
  $('.plot').html('');
  piechart(data, year);
}
