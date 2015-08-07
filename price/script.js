d3.json('data/summary.json', function(data){

  var simple = data.simple;
  var complicated = data.complicated;

  data = simple;
  var switchFlag = true;
  $('.ui.checkbox')
    .checkbox({onChange: function(){

      $('.plot').html("");
      if(switchFlag){
        switchFlag = false;
        data = complicated;
      }
      else {
        switchFlag = true;
        data = simple;
      }
      plot(data, year.toString(), month);
    }});
  ;

  var years = Object.keys(data);

  var year = parseInt(years[years.length-1]);
  var month = parseInt(Object.keys(data[year]).length);

  plot(data, year.toString(), month);
  updateTable(complicated, year.toString(), month);

  var yearPercent = d3.scale.linear()
    .domain([parseInt(years[0]), year])
    .range([13, 100]);

  var monthPercent = d3.scale.linear()
    .domain([1, 12])
    .range([13, 100]);


  $('.year.progress').progress({percent: yearPercent(year), autoSuccess:false});
  $('.month.progress').progress({percent: monthPercent(month), autoSuccess:false});

  $('.year.label').text(year + '年');
  $('.month.label').text(month + '月');

  $('.year.left.button').on('click', function(){
    if(year-1 >= parseInt(years[0]))
      year = year-1;
    $('.year.label').text(year + '年');
    $('.year.progress').progress({percent: yearPercent(year), autoSuccess:false});

    updatePlot(data, year.toString(), month);
    updateTable(complicated, year.toString(), month);
  })

  $('.year.right.button').on('click', function(){
    if(year+1 <= parseInt(years[years.length-1]))
      year = year+1;

    if(year == parseInt(years[years.length-1]) && month > parseInt(Object.keys(data[year]).length)){
      month = parseInt(Object.keys(data[year]).length);
      $('.month.label').text(month+ '月');
      $('.month.progress').progress({percent: monthPercent(month), autoSuccess:false});
    }
    $('.year.label').text(year+ '年');
    $('.year.progress').progress({percent: yearPercent(year), autoSuccess:false});
    updatePlot(data, year.toString(), month);
    updateTable(complicated, year.toString(), month);
  })

  $('.month.left.button').on('click', function(){
    if(month-1 >= 1)
      month = month-1;
    else if(year > parseInt(years[0])){
      month = 12;
      year = year - 1;
      $('.year.label').text(year+ '年');
      $('.year.progress').progress({percent: yearPercent(year), autoSuccess:false});
    }

    $('.month.label').text(month + '月');
    $('.month.progress').progress({percent: monthPercent(month), autoSuccess:false});
    updatePlot(data, year.toString(), month);
    updateTable(complicated, year.toString(), month);
  })

  $('.month.right.button').on('click', function(){
    if(year == parseInt(years[years.length-1]) && month < parseInt(Object.keys(data[year]).length))
      month = month + 1;
    else if(year != parseInt(years[years.length-1]) && month+1 <= 12)
      month = month+1;
    else if(month==12 && year<parseInt(years[years.length-1])){
      month = 1;
      year = year +1;
      $('.year.label').text(year+ '年');
      $('.year.progress').progress({percent: yearPercent(year), autoSuccess:false});
    }
    $('.month.label').text(month+ '月');
    $('.month.progress').progress({percent: monthPercent(month), autoSuccess:false});
    updatePlot(data, year.toString(), month);
    updateTable(complicated, year.toString(), month);
  })

})
