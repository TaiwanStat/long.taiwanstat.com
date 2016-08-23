
var textClass = '';
  -function () {
    var bP = {};
    var buffMargin = 3, minHeight = 10;
    var me = this;
    this.options = {
      colors: ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#0099C6"],
      labelColumn: [-130, 40], //Column positions of labels.
      valueColumn: [-50, 100],
      barpercentColumn: [-10, 160],// x distance from left of main rect
      headerX: 108,
      headerY: -20,
      transitionWidth: 250,
      height: 300,
      sortbyKey: true,
      mainRectWidth:40,
    };

    /**
     *  sets Options
     * @param {object} options an object containing options
     */
    bP.setOptions = function (options) {
      me.options = options;
    };

    /**
     *  partData
     * @public
     * From t he original data set, creates two opposing arrays containing the counts of each corresponding record on each side.
     */
    bP.partData = function (data, p) {
      // preprocess the data
      var sData = {};
      // gets unique columns names (first element in array) - In Bipartite Parlance this is the U-Set
      var v1 = d3.set(data.map(function (d) { return d[0]; })).values();
      v1 = v1.map(function(d) {
        var sum = 0;
        data.forEach(function(d1) {
          if(d1[0] === d) sum += d1[2];
        })
        return {key: d, sum: sum};
      })
      // gets unique destination column name (second element in array) - In Bipartite Parlance this is the V-Set
      var v2 = d3.set(data.map(function (d) { return d[1]; })).values();
      v2 = v2.map(function(d) {
        var sum = 0;
        data.forEach(function(d1) {
          if(d1[1] === d) sum += d1[2];
        })
        return {key: d, sum: sum};
      })
      if (me.options.sortbyKey) {
        v1 = v1.sort(function(a, b) { return b.sum - a.sum;}).map(function(d) { return d.key;});
        v2 = v2.sort(function(a, b) { return b.sum - a.sum;}).map(function(d) { return d.key;});
      }
      var more1 = [
        '電信監理',
        '公路監理',
        '司法',
        '國家安全情報',
        '國有財產管理',
        '金融保險',
      ],
      more2 = [
        '中央民意機關',
      ];
      if(v1.length === 21) v1 = v1.concat(more1);
      else if(v1.length === 3) v1 = v1.concat(more2);
      if(v2.length === 21) v2 = v2.concat(more1);
      else if(v2.length === 3) v2 = v2.concat(more2);



      sData.keys = [v1, v2];
      // creates an array of arrays with all values set to 0
      sData.data = [
        sData.keys[0].map(function () { return sData.keys[1].map(function () { return 0; }); }),
        sData.keys[1].map(function () { return sData.keys[0].map(function () { return 0; }); })
      ];
      data.forEach(function (d) {
        sData.data[0][sData.keys[0].indexOf(d[0])][sData.keys[1].indexOf(d[1])] = d[p];
        sData.data[1][sData.keys[1].indexOf(d[1])][sData.keys[0].indexOf(d[0])] = d[p];
      });
      return sData;
    };

    function visualize(data) {
      // this function return the array including the height of the each mainBar
      var vis = {};
      function calculatePosition(a, s, e, b, m, i) {
        //a is the array include the each  mainBar val ex: [16,33,33]
        var total = d3.sum(a);
        //leftoverHeight means the sum of height of all mainBars
        var sum = 0, neededHeight = 0, leftoverHeight = e - s - 2 * b * a.length;
        var ret = [];
        //compute the height of the each mainBar and store it in ret
        a.forEach(
          function (d, j) {
            var v = {};
            v.percent = (total == 0 ? 0 : d / total);
            v.value = d;
            v.height = Math.max(v.percent * (e - s - 2 * b * a.length), m);
            (v.height == m ? leftoverHeight -= m : neededHeight += v.height);
            v.name = data.keys[i][j];
            ret.push(v);
          }
        );

        var scaleFact = leftoverHeight / Math.max(neededHeight, 1),sum = 0;
        // recompute the height of the each mainBar with the scaleFact
        // and return it
        ret.forEach(
          function (d) {
            d.percent = scaleFact * d.percent;
            d.height = (d.height == m ? m : d.height * scaleFact);
            d.middle = sum + b + d.height / 2;
            d.y = s + d.middle - d.percent * (e - s - 2 * b * a.length) / 2;
            d.h = d.percent * (e - s - 2 * b * a.length);
            d.percent = (total == 0 ? 0 : d.value / total);
            sum += 2 * b + d.height;
          }
        );
        return ret;
      }

      // vis.mainBars is an array including two array that present
      // the height of every bar of left and right side bar
      vis.mainBars = [calculatePosition(data.data[0].map(function (d) { return d3.sum(d); }), 0, me.options.height, buffMargin, minHeight, 0),
        calculatePosition(data.data[1].map(function (d) { return d3.sum(d); }), 0, me.options.height, buffMargin, minHeight, 1)];

      vis.subBars = [[], []];
      // vis.subBars is the height of each mainBar
      vis.mainBars.forEach(function (pos, p) {
        pos.forEach(function (bar, i) {
          calculatePosition(data.data[p][i], bar.y, bar.y + bar.h, 0, 0, p).forEach(function (sBar, j) {
            sBar.key1 = (p == 0 ? i : j);
            sBar.key2 = (p == 0 ? j : i);
            // doesn't know what are key1 key2 mean yet
            vis.subBars[p].push(sBar);
          });
        });
      });
      vis.subBars.forEach(function (sBar) {
        sBar.sort(function (a, b) {
          return (
            a.key1 < b.key1 ?
              -1 : a.key1 > b.key1 ?
              1 : a.key2 < b.key2 ?
                -1 : a.key2 > b.key2 ?
                1 : 0
          );
        });
      });

      vis.edges = vis.subBars[0].map(function (p, i) {
        return {
          key1: p.key1,
          key2: p.key2,
          y1: p.y,
          y2: vis.subBars[1][i].y,
          h1: p.h,
          h2: vis.subBars[1][i].h
        };
      });
      vis.keys = data.keys;
      return vis;
    }

    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);//https://github.com/damiangreen/EnvoyCustomerRegistration
      return function (t) {
        return edgePolygon(i(t));
      };
    }

    function drawPart(data, id, p) {
      d3.select("#" + id).append("g").attr("class", "part" + p).attr("transform", "translate(" + (p * (me.options.transitionWidth + me.options.mainRectWidth)) + ",0)");
      var el = d3.select("#" + id).select(".part" + p);
      el.append("g").attr("class", "subbars");
      el.append("g").attr("class", "mainbars");

      var mainbar = d3.select("#" + id).select(".part" + p).select(".mainbars").selectAll(".mainbar").data(data.mainBars[p])
        .enter().append("g").attr("class", "mainbar");

      mainbar.append("rect").attr("class", "mainrect")
        .attr("x", 0).attr("y", function (d) { return d.middle - d.height / 2; })
        .attr("width", me.options.mainRectWidth).attr("height", function (d) { return d.height; })


      var all = 0, needToBeEditedPercent = [0, 0],
        decimal = 0, tmpDecimal = 0;
      data.mainBars[p].forEach(function(d){
        all += Math.round(d.percent * 100);
      });
      if(all === 99) {
        needToBeEditedPercent[1] = 1;
        data.mainBars[p].forEach(function(d, i){
          decimal = d.percent * 100 - Math.floor(d.percent * 100);
          if( decimal < 0.5 &&
            decimal > tmpDecimal) {
            needToBeEditedPercent[0] = i;
            tmpDecimal = decimal;
          }
        })
      }
      else if(all === 101) {
        needToBeEditedPercent[1] = -1;
        data.mainBars[p].forEach(function(d, i){
          decimal = d.percent * 100 - Math.floor(d.percent * 100);
          if(decimal >= 0.5 &&
            decimal <  tmpDecimal) {
            needToBeEditedPercent[0] = i;
            tmpDecimal = decimal;
          }
        })
      }

      //draw bar label
      mainbar.append("text").attr("class", "barlabel " + textClass)
        .attr("x", me.options.labelColumn[p]).attr("y", function (d) { return d.middle + 5; })
        .text(function (d, i) {
          var percent = Math.round(d.percent * 100);
          if(i == needToBeEditedPercent[0]){
            percent += needToBeEditedPercent[1];
          }
          return data.keys[p][i] + " " +
            d.value +
            " (" + percent + ")";
        })
        .attr("text-anchor",function(){
          if(p === 0) return 'end';
          return 'start';
        });

      //draw count label
      /*
       mainbar.append("text").attr("class", "barvalue")
       .attr("x", me.options.valueColumn[p]).attr("y", function (d) { return d.middle + 5; })
       .text(function (d, i) { return d.value; })
       .attr("text-anchor", "end");

      //draw percentage label
      mainbar.append("text").attr("class", "barpercent")
      .attr("x", me.options.barpercentColumn[p]).attr("y", function (d) { return d.middle + 5; })
      .text(function (d, i) { return "( " + Math.round(100 * d.percent) + "%)"; })
      .attr("text-anchor", "end");
      */
      d3.select("#" + id).select(".part" + p).select(".subbars")
        .selectAll(".subbar").data(data.subBars[p]).enter()
        .append("rect").attr("class", "subbar")
        .attr("x", 0).attr("y", function (d) { return d.y; }).attr("width", me.options.mainRectWidth).attr("height", function (d) { return d.h; })
        .style("fill", function (d) { return me.options.colors[d.key1]; });
    }

    function drawEdges(data, id) {
      d3.select("#" + id).append("g").attr("class", "edges").attr("transform", "translate(" + me.options.mainRectWidth + ",0)");

      d3.select("#" + id).select(".edges").selectAll(".edge").data(data.edges).enter().append("polygon").attr("class", "edge")
        .attr("points", edgePolygon).style("fill", function (d) { return me.options.colors[d.key1]; }).style("opacity", 0.5)
        .each(function (d) { this._current = d; });
    }

    function drawHeader(data, header, id) {
      //d3.select("#" + id).append("g").attr("class", "header").append("text").text(header[2])
      //.attr("x", me.options.headerX).attr("y", me.options.headerY);
      [0, 1].forEach(function (d) {
        var h = d3.select("#" + id).select(".part" + d).append("g").attr("class", "header");

        h.append("text").text(header[d] + " 人次 (%)")
          .attr("x", (me.options.labelColumn[d] - 5)).attr("y", -5)
          .attr('text-anchor',function() {
            if(d === 0 ) return 'end';
            return 'start';
          });
        var sum = d3.sum(data.mainBars[d].map(function(d){return d.value;}));
        //h.append("text").text(sum + "(100%)").attr("x", (me.options.valueColumn[d] - 10)).attr("y", -5);

        h.append("line")
          .attr("x1", function (){
            var position = me.options.labelColumn[d];
            return position < 0 ? position + 10 : position - 10;
          })
          .attr("y1", -2).attr("x2", me.options.barpercentColumn[d] + 10).attr("y2", -2)
          .style("stroke", "black").style("stroke-width", "1").style("shape-rendering", "crispEdges");
      });
    }

    function edgePolygon(d) {
      return [0, d.y1, me.options.transitionWidth, d.y2, me.options.transitionWidth, d.y2 + d.h2, 0, d.y1 + d.h1].join(" ");
    }

    function transitionPart(data, id, p) {
      var mainbar = d3.select("#" + id).select(".part" + p).select(".mainbars").selectAll(".mainbar").data(data.mainBars[p]);
      mainbar.exit().remove();
      mainbar.select(".mainrect").transition().duration(500)
        .attr("y", function (d) { return d.middle - d.height / 2; }).attr("height", function (d) { return d.height; });
      var addmainbar = mainbar.enter().append("g").attr("class", "mainbar");
      //draw bar label
      addmainbar.append("rect").attr("class", "mainrect")
        .attr("x", 0).attr("y", function (d) { return d.middle - d.height / 2; })
        .attr("width", me.options.mainRectWidth).attr("height", function (d) { return d.height; })
      var all = 0, needToBeEditedPercent = [0, 0],
        decimal = 0, tmpDecimal = 0;
      data.mainBars[p].forEach(function(d){
        all += Math.round(d.percent * 100);
      });
      if(all === 99) {
        needToBeEditedPercent[1] = 1;
        data.mainBars[p].forEach(function(d, i){
          decimal = d.percent * 100 - Math.floor(d.percent * 100);
          if( decimal < 0.5 &&
            decimal > tmpDecimal) {
            needToBeEditedPercent[0] = i;
            tmpDecimal = decimal;
          }
        })
      }
      else if(all === 101) {
        needToBeEditedPercent[1] = -1;
        data.mainBars[p].forEach(function(d, i){
          decimal = d.percent * 100 - Math.floor(d.percent * 100);
          if(decimal >= 0.5 &&
            decimal <  tmpDecimal) {
            needToBeEditedPercent[0] = i;
            tmpDecimal = decimal;
          }
        })
      }

      //draw bar label
      addmainbar.append("text").attr("class", "barlabel " + textClass)
        .attr("x", me.options.labelColumn[p]).attr("y", function (d) { return d.middle + 5; })

        .text(function (d, i) {
          var percent = Math.round(d.percent * 100);
          if(i == needToBeEditedPercent[0]){
            percent += needToBeEditedPercent[1];
          }
          return data.keys[p][i] + " " +
            d.value +
            " (" + percent + ")";
        })
        .attr("text-anchor",function(){
          if(p === 0) return 'end';
          return 'start';
        });
      /*
      //draw count label
      addmainbar.append("text").attr("class", "barvalue")
      .attr("x", me.options.valueColumn[p]).attr("y", function (d) { return d.middle + 5; })
      .text(function (d, i) { return d.value; })
      .attr("text-anchor", "end");

      //draw percentage label
      addmainbar.append("text").attr("class", "barpercent")
      .attr("x", me.options.barpercentColumn[p]).attr("y", function (d) { return d.middle + 5; })
      .text(function (d, i) { return "( " + Math.round(100 * d.percent) + "%)"; })
      .attr("text-anchor", "end");
      */

      mainbar.select(".barlabel").transition().duration(500).attr("y", function (d) { return d.middle + 5; })
        .text(function (d, i) {
          var percent = Math.round(d.percent * 100);
          if(i == needToBeEditedPercent[0]){
            percent += needToBeEditedPercent[1];
          }
          return data.keys[p][i] + " " +
            d.value +
            " (" + percent + ")";
        })
        .attr("text-anchor",function(){
          if(p === 0) return 'end';
          return 'start';
        });
      mainbar.select(".barvalue").transition().duration(500).attr("y", function (d) { return d.middle + 5; }).text(function (d, i) { return d.value; });
      mainbar.select(".barpercent").transition().duration(500)
        .attr("y", function (d) { return d.middle + 5; })
        .text(function (d, i) {
          var percent = Math.round(data.mainBars[p][i].percent * 100);
          return data.keys[p][i] + " " +
            data.mainBars[p][i].value +
            " (" + percent + ")";
        })

      var subBar = d3.select("#" + id).select(".part" + p).select(".subbars").selectAll(".subbar").data(data.subBars[p]);
      subBar.exit().remove();
      subBar.transition().duration(500)
        .attr("y", function (d) { return d.y; }).attr("height", function (d) { return d.h; })
        .style("fill", function (d) { return me.options.colors[d.key1]; });
      subBar.enter()
        .append("rect").attr("class", "subbar")
        .attr("x", 0).attr("y", function (d) { return d.y; }).attr("width", me.options.mainRectWidth).attr("height", function (d) { return d.h; })
        .style("fill", function (d) { return me.options.colors[d.key1]; });
    }

    function transitionEdges(data, id) {
      d3.select("#" + id).append("g").attr("class", "edges").attr("transform", "translate(" + me.options.mainRectWidth + ",0)");

      var edges = d3.select("#" + id).select(".edges").selectAll(".edge").data(data.edges)
      edges.exit().remove();
      edges.transition().duration(500)
        .attrTween("points", arcTween).style("fill", function (d) { return me.options.colors[d.key1]; })
        .style("opacity", function (d) { return (d.h1 == 0 || d.h2 == 0 ? 0 : 0.5); });
      edges.enter().append("polygon").attr("class", "edge")
        .attr("points", edgePolygon).style("fill", function (d) { return me.options.colors[d.key1]; }).style("opacity", 0.5)
        .each(function (d) { this._current = d; });
    }
    function transitionHeader(data, header, id) {
      //d3.select("#" + id).append("g").attr("class", "header").append("text").text(header[2])
      //.attr("x", me.options.headerX).attr("y", me.options.headerY);
      [0, 1].forEach(function (d) {
        var h = d3.select("#" + id).select(".part" + d).select(".header");

        h.select("text").text(header[d] + " 人次 (%)").attr("x", (me.options.labelColumn[d] - 5)).attr("y", -5)
          .attr('text-anchor',function() {
            if(d === 0 ) return 'end';
            return 'start';
          });
        var sum = d3.sum(data.mainBars[d].map(function(d){return d.value;}));
        //h.append("text").text(sum + "(100%)").attr("x", (me.options.valueColumn[d] - 10)).attr("y", -5);

        h.select("line")
          .attr("x1", function (){
            var position = me.options.labelColumn[d];
            return position < 0 ? position + 10 : position - 10;
          })
          .attr("y1", -2)
          .attr("x2", me.options.barpercentColumn[d] + 10)
          .attr("y2", -2)
          .style("stroke", "black").style("stroke-width", "1").style("shape-rendering", "crispEdges");
      });
    }
    function transition(data, id, header) {
      transitionPart(data, id, 0);
      transitionPart(data, id, 1);
      transitionEdges(data, id);
      transitionHeader(data, header, id);
    }

    bP.draw = function (data, containerEl) {
      // this function is the start function
      var realWidth = me.options.width < 400 ? 400 : me.options.width;
      var height = (me.options.height + me.options.margin.b + me.options.margin.t);
      // var realHeight = realWidth==400?(me.options.height + me.options.margin.b + me.options.margin.t):(me.options.height + me.options.margin.b + me.options.margin.t);
      var svg = d3.select(containerEl)
        .append("svg")
        .attr('width', me.options.width)
        .attr('height', height)
        .attr('viewBox', '0,0,' + realWidth + "," + height)
        .append("g")
        .attr("transform", "translate(" + me.options.margin.l + "," + me.options.margin.t + ")");

      data.forEach(function (biP, s) {
        svg.append("g")
          .attr("id", biP.id)
          .attr("transform", "translate(" + (me.options.eachWidth * s ) + ",0)");

        var visData = visualize(biP.data);
        drawPart(visData, biP.id, 0);
        drawPart(visData, biP.id, 1);
        drawEdges(visData, biP.id);
        drawHeader(visData,biP.header, biP.id);

        [0, 1].forEach(function (p) {
          d3.select("#" + biP.id)
            .select(".part" + p)
            .select(".mainbars")
            .selectAll(".mainbar")
            .on("mouseover", function (d, i) { return bP.selectSegment(data, p, i, d.name); })
            .on("mouseout", function (d, i) { return bP.deSelectSegment(data, p, i); });
        });
      });
    };

    bP.selectSegment = function (data, m, s, key) {
      data.forEach(function (k) {
        var newdata = { keys: [], data: [] };

        newdata.keys = k.data.keys.map(function (d) { return d; });
        newdata.data[m] = k.data.data[m].map(function (d) { return d; });
        var new1 = k.data.data[1 - m].map(function (v) {
          return k.data.keys[m].map(function(d, i){
            // if(d === k.data.keys[m][s]){
            if(d === key){
              return v[i];
            }
            return 0;
          });
        });
        //newdata.data[1 - m] = k.data.data[1 - m].map(function (v) { return v.map(function (d, i) { return (s == i ? d : 0); }); });
        newdata.data[1 - m] = new1;
        transition(visualize(newdata), k.id, k.header);
        var selectedBar = d3.select("#" + k.id).select(".part" + m).select(".mainbars").selectAll(".mainbar").filter(function (d, i) { return (d.name == key); });
        var unselectedBar = d3.select("#" + k.id).select(".part" + m).select(".mainbars").selectAll(".mainbar").filter(function (d, i) { return (d.name !== key); });
        selectedBar.selectAll('.mainrect, .barlabel, .barvalue, .barpercent').classed({"selected":true,'unselected':false});
        unselectedBar.selectAll('.mainrect, .barlabel, .barvalue, .barpercent').classed({"unselected":true, 'selected':false});

      });
    };

    bP.deSelectSegment = function (data, m, s) {
      data.forEach(function (k) {
        transition(visualize(k.data), k.id, k.header);
      });
      d3.selectAll(".mainrect, .barlabel, .barvalue, .barpercent").classed({"selected":false, "unselected":false});
    };
    bP.changeData = function (data) {

      data.forEach(function (k) {
        transition(visualize(k.data), k.id, k.header);
        [0, 1].forEach(function (p) {
          d3.select("#" + k.id)
            .select(".part" + p)
            .select(".mainbars")
            .selectAll(".mainbar")
            .on("mouseover", function (d, i) {
              return bP.selectSegment(data, p, i, d.name);
            })
            .on("mouseout", function (d, i) { return bP.deSelectSegment(data, p, i); });
        });
      });

    };
    this.bP = bP;


}();

// init data
(function(){
  var items = ['性別','涉案類別', '犯罪時服務機關', '職務層級'],
    leadDataSet = {};
  leadDataSet.update = function(eachData, item, item1){
    var index0Data = eachData[item],
      index1Data = eachData[item1],
      checkHave = false;
    this[item][item1].forEach(function(arr, i){
      if(arr[0] === index0Data && arr[1] ===index1Data){
        checkHave = i;
      }
    });
    if(checkHave === false){
      this[item][item1].push([index0Data, index1Data, 1]);
    }
    else{
      this[item][item1][checkHave][2] ++ ;
    }

  };

  items.forEach(function(item){
    leadDataSet[item] = {};
    items.forEach(function(item1){
      leadDataSet[item][item1] = [];

    });
  });

  function otherItems(chosenoption){
    return items.filter(function(d){
      if(d !== chosenoption){
        return d;
      }
    });
  }
  d3.csv('./dist/data/廉政.csv', function(d){
    //mainItem: gender

    d.forEach(function(eachData){
      items.forEach(function(item){
        items.forEach(function(item1){
          leadDataSet.update(eachData, item, item1);
        });
      });
    });
    var chosenoption = '性別',
      otherItemsArr = otherItems(chosenoption),
      data = [
        { data: bP.partData(leadDataSet[chosenoption][otherItemsArr[0]], 2), id: 'i', header: [chosenoption, otherItemsArr[0], "i"] },
        { data: bP.partData(leadDataSet[chosenoption][otherItemsArr[1]], 2), id: 'ii', header: [chosenoption, otherItemsArr[1], "ii"] },
        { data: bP.partData(leadDataSet[chosenoption][otherItemsArr[2]], 2), id: 'iii', header: [chosenoption, otherItemsArr[2], "iii"] }
      ];
      if(window.innerWidth < 1200) {
        data = [
          { data: bP.partData(leadDataSet[chosenoption][otherItemsArr[0]], 2), id: 'i', header: [chosenoption, otherItemsArr[0], "i"] },
        ];
      }

      bP.setOptions({
        //  colors: ["#BCD9D9", "#93C0C0", "#6BA3A3", "#4D8E8E", "#347C7C",
        //    "#C5CDE0", "#A1AECB", "#7C8DB3",'#5D719E','#42588A', '#FFF4DD', '#FFEBC4','#FFE2A8',
        //  '#ECC880','#CFA656','#FFECDD', '#FFDFC4','#FFCFA8', '#ECB180', '#CF8D56'],
        colors: ["#3366cc", "#d65c5c", "#db8b70", "#ffc266", "#39ac73", "#00264d",
          '#003366','#004080', '#004d99','#0059b3','#0066cc',
          '#0073e6','#0080ff',
          "#1a8cff",'#3399ff','#4da6ff','#66b3ff','#80bfff','#99ccff','#b3d9ff','#cce6ff','#e6f2ff'


        ],
        // colors: ["#97C00E", "FFCC00", "#FF6464"],
        labelColumn: [-10, 40],
        valueColumn: [-0, 120], //(count (%)) first value is left position x, second value is right position x
        barpercentColumn: [-100, 100], //Column positions of labels.
        headerX: 305,
        headerY: -20,
        transitionWidth: 30,
        mainRectWidth:30,
        sortbyKey: true,
        barlabelFontSize: "12",
        barValueFontSize: "10",
        barPercentFontSize: "10",
        width :  window.innerWidth > 1200 ? 1200 : window.innerWidth,
        height : window.innerHeight < 600? 600 : window.innerHeight * 0.85,
        margin : { b: 40, t: 40, l: window.innerWidth < 600 ? 130:170 , r: 0 },
        eachWidth:385,
      });
      bP.draw(data,'#vis');
      document.getElementById("mainItem")
        .onchange=function(){ //run some code when "onchange" event fires
          var chosenoption=this.options[this.selectedIndex].value; //this refers to "selectmenu"
          var otherItemsArr = otherItems(chosenoption);
          var data = [
            { data: bP.partData(leadDataSet[chosenoption][otherItemsArr[0]], 2), id: 'i', header: [chosenoption, otherItemsArr[0], "i"] },
            { data: bP.partData(leadDataSet[chosenoption][otherItemsArr[1]], 2), id: 'ii', header: [chosenoption, otherItemsArr[1], "ii"] },
            { data: bP.partData(leadDataSet[chosenoption][otherItemsArr[2]], 2), id: 'iii', header: [chosenoption, otherItemsArr[2], "iii"] }
          ];
          bP.changeData(data);
        };
      if(window.innerWidth < 1200) {
        document.getElementById("mainItem")
          .onchange=function(){ //run some code when "onchange" event fires
            var chosenoption=this.options[this.selectedIndex].value; //this refers to "selectmenu"
            var otherItemsArr = otherItems(chosenoption);
            var subOption = document.getElementById('subItem').value;
            var index = otherItemsArr.indexOf(subOption);
            if(index === -1){
              var subItemEl = document.getElementById('subItem');
              subItemEl.selectedIndex = subItemEl.querySelector('option[value="' + otherItemsArr[0] + '"]').index;
              // subItemEl.selectedIndex = 2;
              index = 0;
            }
            var data = [
              { data: bP.partData(leadDataSet[chosenoption][otherItemsArr[index]], 2), id: 'i', header: [chosenoption, otherItemsArr[index], "i"] },
            ];
            bP.changeData(data);
          };
        document.getElementById("subItem")
          .onchange=function(){ //run some code when "onchange" event fires
            var chosenoption=this.options[this.selectedIndex].value; //this refers to "selectmenu"
            var otherItemsArr = otherItems(chosenoption);
            var mainItem = document.getElementById('mainItem').value;
            var index = otherItemsArr.indexOf(mainItem);
            if(index === -1){
              var mainItemEl = document.getElementById('mainItem');
              mainItemEl.selectedIndex = mainItemEl.querySelector('option[value="' + otherItemsArr[0] + '"]').index;
              index = 0;
            }
            var data = [
              { data: bP.partData(leadDataSet[otherItemsArr[index]][chosenoption], 2), id: 'i', header: [otherItemsArr[index],chosenoption, "i"] },
            ];
            bP.changeData(data);
          };

      }
      $('.plus.button').on('click', function() {
        var oldClass = $("text.barlabel").attr('class');
        if(oldClass.indexOf('bigText') === -1) {
          textClass = 'bigText';
          $('svg text.barlabel').attr('class',oldClass + ' ' + textClass);
        }
        else if(oldClass.indexOf('hugeText') === -1) {
          textClass = 'bigText hugeText';
          $('svg text.barlabel').attr('class',oldClass + ' hugeText');
        }
      });
      $('.minus.button').on('click', function() {
        var oldClass = $("text.barlabel").attr('class');
        if(oldClass.indexOf('hugeText') !== -1) {
          textClass = 'bigText';
          var newClass = oldClass.replace('hugeText', '');

          $('svg text.barlabel').attr('class', newClass);
        }
        else if(oldClass.indexOf('bigText') !== -1) {
          textClass = '';
          var newClass = oldClass.replace('bigText', '');
          $('svg text.barlabel').attr('class', newClass);
        }
      });
    });

    // window.addEventListener('scroll', intro.pre, false);
    if($(document).ready()){
      $('.menu .item').tab();
    }
}());
