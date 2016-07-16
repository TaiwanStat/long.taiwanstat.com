(function(window) {

  var words = [];
  var frame = 0;
  var width = $('#main-content').width();
  var myWordCloud;
  var bar_elem = document.getElementById("range_bar");
  var month_elem = document.getElementById("month");

  d3.json('./data.json', function(data) {
    words = data;
    myWordCloud = wordCloud('#cloud');
    myWordCloud.update(getWords(frame % words.length));

    // resize bar range
    bar_elem.max = words.length-1;

   var d = words[frame].date;
    month_elem.innerHTML = d.substring(0, 4) + '年' + d.substring(4) + '月';
  });

  function getRandomColor(i) {
    return 'rgb(214, 163, 24)';
    fontColor = ["#FFBB00", "#FF8800", "#DDAA00", "#AA7700", "#CC6600"];
    return fontColor[i%5];
  }

  function wordCloud(selector) {

      //var fill = d3.scale.category10();
      var fill = d3.scale.category10();
      //Construct the word cloud's SVG element
      var svg = d3.select(selector).append("svg")
          .attr("width", width)
          .attr("height", 300)
          .append("g")
          .attr("transform", "translate(" + width*0.48 +  "," + "155)");


      //Draw the word cloud
      function draw(words) {
          var cloud = svg.selectAll("g text")
                          .data(words, function(d) { return d.text; })

          //Entering words
          cloud.enter()
              .append("text")
              .style("font-family", " dynamic_font,dynamic_font2 Gothic MB101 DemiBold")
              .style("font-weight", "600")
              .style("fill", function(d, i) { return getRandomColor(i); })
              .attr("text-anchor", "middle")
              .attr('font-size', 1)
              .text(function(d) { return d.text; });

          //Entering and existing words
          cloud
              .transition()
                  //.duration(500)
              .duration(function(d, i){ return (100-i)*10})
              .style("font-size", function(d) { return d.size + "px"; })
              .attr({
                "opacity":1,
                "transform": function(d) {  return "translate(" + d.x + "," + d.y + ")rotate(" + d.rotate + ")"; }
              })
              .style("fill-opacity", 1);

          //Exiting words
          cloud.exit()
              .transition()
                  //.duration(200)
          .duration(function(d, i){ return (100-i)*10})
          .attr({
            "opacity":0,
            "transform": function(d) { return "translate(" + d.x + "," + d.y + ")rotate(" + d.rotate + ")"; }
           })
                        //.style('fill-opacity', 1e-6)
          .attr('font-size', 1)
          .remove();
      }


      return {

          //Recompute the word cloud for a new set of words. This method will
          // asycnhronously call draw when the layout has been computed.
          //The outside world will need to call this function, so make it part
          // of the wordCloud return value.
          update: function(words) {
              d3.layout.cloud().size([width-10, 300])
                  .words(words)
                  .padding(5)
                  //.rotate(function() { return ~~(Math.random() * 2) * 45; })
                  .rotate(function() { return 0; })
                  .font(" dynamic_font,dynamic_font2 Gothic MB101 DemiBold")
                  .fontSize(function(d) { return d.size; })
                  .on("end", draw)
                  .start();
          }
      };
  }

  function getWords(i) {
    word_list = words[i].word_list;
    result = [];
    for (i = 0; i < word_list.length; i++) {
        result.push({text:word_list[i].word, size:word_list[i].count});
    }

     var leaderScale = d3.scale.linear()
        .range([10,100])
        .domain([d3.min(result,function(d) { return d.size; }),
                 d3.max(result,function(d) { return d.size; })
               ]);
    for (i = 0; i<result.length; i++){
        result[i].size = leaderScale(result[i].size);
    }
    return result;
  }


  var is_playing = false;
  var timeoutVar;

  function playCloud() {
    if (bar_elem.value == words.length-1) {
      clearTimeout(timeoutVar);
    }
    else {
      myWordCloud.update(getWords(++frame % words.length));
      bar_elem.value = frame % words.length;
      timeoutVar = setTimeout(playCloud, 2000);
      var d = words[frame].date;
      month_elem.innerHTML = d.substring(0, 4) + '年' + d.substring(4) + '月';
    }
  }

  d3.select('#range_bar')
    .on('change', function() {
      clearTimeout(timeoutVar);
      is_playing = false;
      myWordCloud.update(getWords(bar_elem.value));
      frame = bar_elem.value;

      var d = words[frame].date;
      month_elem.innerHTML = d.substring(0, 4) + '年' + d.substring(4) + '月';

      icon.addClass('play');
      icon.removeClass('pause');
    });

  var icon = $('#icon');
  d3.select('#button')
    .on('click', function(){
      if (!is_playing){
        timeoutVar = setTimeout(playCloud, 0);
        is_playing = true;
        icon.removeClass('play');
        icon.addClass('pause');
      }
      else {
        clearTimeout(timeoutVar);
        is_playing = false;
        icon.addClass('play');
        icon.removeClass('pause');
      }
    });


})(window);
