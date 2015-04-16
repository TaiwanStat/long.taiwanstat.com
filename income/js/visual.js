var margin = 20,
    diameter = 919;

var trueWidth = $('.plot').parent().width()*0.95;

var color = d3.scale.linear()
    .domain([0, 6])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

var pack = d3.layout.pack()
    .padding(2)
    .size([diameter - margin, diameter - margin])
    .value(function(d) { return d.size; })

var svg = d3.select(".plot").append("svg")
    .attr("width", trueWidth)
    .attr("height", trueWidth)
    .attr("viewBox", "0 0 " + diameter + " " + diameter)
    .attr("preserveAspectRatio", "xMinYMin meet")
  .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var focus = null,
    focusName = '全部',
    dirty = false,
    view;

function plot(root) {
  var nodes = pack.nodes(root);

  focus = root;

  var circle = svg.selectAll("circle")
      .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) { return d.parent ? d.children ? "node "+d.id : "node node--leaf "+d.id : "node node--root "+d.id; })
      .style("fill", function(d) {
        if(d.id == 'bot90' || d.id == 'top105' || d.id == 'top011' || d.id=='top51')
          return color(d.depth-1);
        return color(d.depth);
      })
      .on("click", function(d) {
        // console.log(d.id);
        if (focus !== d || dirty){
          zoom(d);
          d3.event.stopPropagation();
          strokeFocus(focus);
          updateTable(focus);
          dirty = false;
        }
        else {
          strokeFocus(root);
          updateTable(root);
        }

      });

  var text = svg.selectAll("text")
      .data(nodes)
    .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("font-size", function(d) { return 40; })
      .style('font-weight', 'bold')
      .style('fill', '#023F5A')
      .style('font-family', "Yu Gothic, SimHei")
      .style("display", function(d) { return d.parent === root ? null : "none"; })
      .text(function(d) { return d.name; });

  d3.select(".plot")
    .on("click", function() { zoom(root); strokeFocus(root);updateTable(root);});

  zoomTo([root.x, root.y, root.r * 2 + margin]);
  d3.select(self.frameElement).style("height", diameter + "px");

  $('.plot').click();

}

function zoom(d) {
  var focus0 = focus;
  focus = d;

  var transition = d3.transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween("zoom", function(d) {
        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
        return function(t) { zoomTo(i(t)); };
      });

  transition.selectAll("text")
    .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
      .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
      .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
      .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
}

function zoomTo(v) {
  var k = diameter / v[2]; view = v;
  var node = svg.selectAll("circle,text");
  node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
  var circle = svg.selectAll("circle")
  circle.attr("r", function(d) { return d.r * k; });
}

function strokeFocus(focus) {
  $('.node').css('stroke-width', '0');
  $('.node.'+focus.id).css('stroke-width', '5');
  for(var k in focus.children) {
    var d = focus.children[k];
    if(!(d.id == 'bot90' || d.id == 'top105' || d.id == 'top011' || d.id=='top51'))
      $('.node.'+d.id).css('stroke-width', '5');
  }
}

function updatePlot(root) {
    var nodes = pack.nodes(root);
    focusName = focus.name;
    focus = findChildren(root);

    node = svg.selectAll(".node")
      .data(nodes);

    node.enter().append("circle")
        .attr("class", function(d) { return d.parent ? d.children ? "node "+d.id : "node node--leaf "+d.id : "node node--root "+d.id; })
        .style("fill", function(d) {
          if(d.id == 'bot90' || d.id == 'top105' || d.id == 'top011' || d.id=='top51')
            return color(d.depth-1);

          return color(d.depth);
        });

    var text = svg.selectAll("text")
        .data(nodes)
      .enter().append("text")
        .attr("class", "label")
        .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
        .style("font-size", function(d) { return 40; })
        .style('font-weight', 'bold')
        .style('fill', '#023F5A')
        .style('font-family', "Yu Gothic, SimHei")
        .style("display", function(d) { return d.parent === root ? null : "none"; })
        .text(function(d) { return d.name; });

    d3.select(".plot")
      .on("click", function() { zoom(root); strokeFocus(root);updateTable(root);});

    // zoomTo([root.x, root.y, root.r * 2 + margin]);
    d3.select(self.frameElement).style("height", diameter + "px");
    dirty = true;
    $('.'+focus.id).d3Click();
}

function findChildren(data) {
  var flag = true;
  var d = data;
  var r = {};
  while(flag) {
    var havec = '';
    for(var k in d.children) {
      if(d.children[k].name == focusName) {
        r = d.children[k];
        return r;
      }
      if(d.children[k].children != undefined){
        havec = k
      }
    }
    if(havec == '')
      break;
    else
      d = d.children[havec];
  }
  return data;
}

function updateTable(d) {
  $('.focus.header').text(d.name + '的人')
    .css('font-weight', 'bold')
    // .css('font-size', '40px')
    .css('font-family', "Yu Gothic, SimHei");

  var totalV = 0,
      meanV = 0,
      percent = 0;

  if(d.name == '全部') {
    totalV = parseFloat(curData['Average income per tax unit'])* parseFloat(curData['Number of tax units']);
    meanV = parseFloat(curData['Average income per tax unit']);
    percent = 100;
  }
  else if(d.name == '前10%') {
    totalV = parseFloat(curData['Number of tax units'])* parseFloat(curData['Top 10% average income']/10);
    meanV = parseFloat(curData['Top 10% average income']);
    percent = parseFloat(curData['Top 10% income share']);
  }
  else if(d.name == '前5%') {
    totalV = parseFloat(curData['Number of tax units'])* parseFloat(curData['Top 5% average income']/10);
    meanV = parseFloat(curData['Top 5% average income']);
    percent = parseFloat(curData['Top 5% income share']);
  }
  else if(d.name == '前1%') {
    totalV = parseFloat(curData['Number of tax units'])* parseFloat(curData['Top 1% average income']/10);
    meanV = parseFloat(curData['Top 1% average income']);
    percent = parseFloat(curData['Top 1% income share']);
  }

  $('.raw.value').text(Math.round(totalV/10));
  $('.mean.value').text(Math.round(meanV/10));
  $('.percent.value').text(percent);

  var thtml = '';

  d.children.sort(function(a, b){
    if (a.name < b.name)
     return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  });

  for(var k in d.children) {
    var c = d.children[k];
    var cmv = 0;
    var cp = 0;

    if(c.name == '後90%') {
      cmv = parseFloat(curData['Bottom 90% average income']);
      cp = 100 - parseFloat(curData['Top 10% income share']);
    }
    else if(c.name == '前5-10%') {
      cmv = parseFloat(curData['Top 10-5% average income']);
      cp = parseFloat(curData['Top 10-5% income share']);
    }
    else if(c.name == '前1-5%') {
      cmv = parseFloat(curData['Top 5-1% average income']);
      cp = parseFloat(curData['Top 5-1% income share']);
    }
    else if(c.name == '前0.1-1%') {
      cp = parseFloat(curData['Top 1% income share'])-parseFloat(curData['Top 0.1-0.01% income share'])-parseFloat(curData['Top 0.01% income share']);
      cmv = parseFloat(curData['Average income per tax unit'])* parseFloat(curData['Number of tax units']) *cp/100/ (parseFloat(curData['Number of tax units'])* 0.009);
    }
    else if(c.name == '前0.01-0.1%') {
      cmv = parseFloat(curData['Top 0.1-0.01% average income']);
      cp = parseFloat(curData['Top 0.1-0.01% income share']);
    }
    else if(c.name == '前0.01%') {
      cmv = parseFloat(curData['Top 0.01% average income']);
      cp = parseFloat(curData['Top 0.01% income share']);
    }
    else if(c.name == '前10%') {
      cmv = parseFloat(curData['Top 10% average income']);
      cp = parseFloat(curData['Top 10% income share']);
    }
    else if(c.name == '前5%') {
      cmv = parseFloat(curData['Top 5% average income']);
      cp = parseFloat(curData['Top 5% income share']);
    }
    else if(c.name == '前1%') {
      cmv = parseFloat(curData['Top 1% average income']);
      cp = parseFloat(curData['Top 1% income share']);
    }

    thtml += '<tr><td>' + c.name + '</td><td>' + Math.round(cmv/10) + '萬元</td><td>' + Math.round(cp*100)/100 + '%</td></tr>';

  }

  $('.tbody').html(thtml);

}

jQuery.fn.d3Click = function () {
  this.each(function (i, e) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    e.dispatchEvent(evt);
  });
};
