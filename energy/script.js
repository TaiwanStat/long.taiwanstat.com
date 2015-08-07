var highlight = 0;
var curYearIndex;
var curItem;
var parentStack = [];
var parentNameStack = [];
var years = [];

d3.csv("data/data.csv", function(data) {

  for(var k in Object.keys(data[0])){
    var y = parseInt(Object.keys(data[0])[k]);
    if(!isNaN(y))
      years.push(y)
  }

  curYearIndex = years.length-1;

  curItem = preProcess(data);

  buttonInit();

  updateTable();

  piechart(curItem, years[curYearIndex]);

});

function buttonInit() {
  $('.year.control .value').html('<i class="small calendar outline icon"></i>' + years[curYearIndex])

  $('.year.left.button').on('click', function(){
    if(curYearIndex == 0)
      curYearIndex = years.length-1;
    else
      curYearIndex = curYearIndex - 1;
    $('.year.control .value').html('<i class="small calendar outline icon"></i>' + years[curYearIndex])
    updateTable();
    updatePie(curItem, years[curYearIndex]);
  })
  $('.year.right.button').on('click', function(){
    if(curYearIndex == years.length-1)
      curYearIndex = 0;
    else
      curYearIndex = curYearIndex + 1;
    $('.year.control .value').html('<i class="small calendar outline icon"></i>' + years[curYearIndex])
    updateTable();
    updatePie(curItem, years[curYearIndex]);
  })

  $('.curSelect.button').on('click', function() {
    if(curItem[highlight].children != undefined) {
      parentStack.push(curItem);
      parentNameStack.push(curItem[highlight].name);
      curItem = curItem[highlight].children;
      highlight = 0;
      updateTable();
      updatePie(curItem, years[curYearIndex]);
    }

    if(curItem[highlight].children == undefined)
      $(this).addClass('disabled');
    else if(curItem[highlight][years[curYearIndex]] == 0)
      $(this).addClass('disabled');
    else
      $(this).removeClass('disabled');

    updateBreadcrumb();
  })
}

function updateBreadcrumb() {
  var html = ''
  if(parentNameStack.length == 0){
    html = '<div class="active section">全部</div><i class="right chevron icon divider"></i>';
    $('.breadcrumb').html(html);
  }
  else {
    html = '<a class="section" onclick="toBreadcrumb('+0+')">全部</a><i class="right chevron icon divider"></i>'
    for(var i=0; i<parentNameStack.length; i++) {
      // console.log(parentStack[i]);
      if(i != parentNameStack.length-1){
        html = html + '<a class="section" onclick="toBreadcrumb('+(i+1)+')">' +
          parentNameStack[i] + '</a><i class="right chevron icon divider"></i>';
      }
      else{
        html += '<div class="active section" onclick="toBreadcrumb('+(i+1)+'")>' +
          parentNameStack[i] + '</div><i class="right chevron icon divider"></i>';
      }
    }
    $('.breadcrumb').html(html);
  }
}

function updateTable() {
  var total = 0;
  var validCount = 0;
  var y = years[curYearIndex];

  for(var k in curItem){
    var o = curItem[k];
    var value = o[y];

    if(typeof(value) == 'string')
      value = value.replace(',','');

    if(!isNaN(parseFloat(value))){
      value = parseFloat(value);
      curItem[k][y] = value;
      total += value;
      validCount += 1;
    }
    else {
      value = 0;
      curItem[k][y] = value;
    }
  }

  if(highlight > validCount-1)
    hightlight = 0;

  $('.total.statistic .value').text(Math.round(total*100)/100);

  var html = ''
  for(var k in curItem){
    var value = curItem[k][y];
    var mean = value;

    if(!isNaN(value)){
      mean = curItem[k][y]/total;
      mean = Math.round(mean*10000)/100;
    }

    if(isNaN(mean))
      mean = 0;

    var ihtml =
      '<tr><td><div class="ui header name tno'+k+'">'+curItem[k]['name']+'</div></td>' +
      '<td><div class="ui mini statistic">'+
        '<div class="value">'+value+'</div>'+
        '<div class="left label">百萬度</div></div></td>'+
      '<td><div class="ui mini horizontal statistic">'+
        '<div class="mean tno'+k+' value">'+mean+'</div>'+
        '<div class="label">%</div></div></td></tr>';

    html += ihtml;
  }

  if( screen.width <= 480 ) {
    html = html.replace(/mini statistic/g, 'mini horizontal statistic');
    html = html.replace(/left label/g, 'label');
  }
  // console.log(html);

  if(curItem[highlight].children == undefined)
    $('.curSelect.button').addClass('disabled');
  else if(curItem[highlight][y] == 0)
    $('.curSelect.button').addClass('disabled');
  else
    $('.curSelect.button').removeClass('disabled');

  $('.piechart.tbody').html(html);

}

function preProcess(data) {
  for(var i=0; i<data.length; i++){
    var d = data[i];
    for(var j=1; j<5; j++){
      if(d['level'+j] != '')
        d.level = j
    }
    d.name = d['level'+d.level];
  }

  var i = 0;
  var level = 4;

  while(level > 1){

    if(i != 0){
      if(data[i].level == level && data[i].level == data[i-1].level+1){
        if(data[i-1].children == undefined)
          data[i-1].children = []
        data[i-1].children.push(data[i]);
        data.splice(i, 1);
        i -= 1;
      }
    }

    i++;
    if(i == data.length){
      i = 0;
      level -= 1;
    }
  }

  return data;
}

function toBreadcrumb(i) {
  curItem = parentStack[i];
  highlight = 0;
  updateTable();
  updatePie(curItem, years[curYearIndex]);
  while(parentStack.length > i){
    parentStack.pop();
    parentNameStack.pop();
  }
  updateBreadcrumb();
}
