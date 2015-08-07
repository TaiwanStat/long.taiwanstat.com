
var raw = null;

var curYearIndex = 0;
var year = 0;
var years = [];

var curData = {};


d3.csv("data/data.csv", function(data) {

  raw = data;

  for(var i=0; i<data.length; i++)
    years.push(data[i].Year);

  curYearIndex = years.length-1;

  buttonInit();
  var d = getDataOfYear(years[curYearIndex]);
  curData = d.data;
  plot(d.plotForm);

})

function buttonInit() {

  year = years[curYearIndex];
  $('.year.control .value').html('<i class="small calendar outline icon"></i>' + year);

  $('.year.left.button').on('click', function(){
    if(curYearIndex == 0)
      curYearIndex = years.length-1;
    else
      curYearIndex = curYearIndex - 1;
    $('.year.control .value').html('<i class="small calendar outline icon"></i>' + years[curYearIndex])
    // updateTable();
    var d = getDataOfYear(years[curYearIndex]);
    curData = d.data;
    updatePlot(d.plotForm);
  })
  $('.year.right.button').on('click', function(){
    if(curYearIndex == years.length-1)
      curYearIndex = 0;
    else
      curYearIndex = curYearIndex + 1;
    $('.year.control .value').html('<i class="small calendar outline icon"></i>' + years[curYearIndex])
    // updateTable();
    var d = getDataOfYear(years[curYearIndex]);
    curData = d.data;
    updatePlot(d.plotForm);
  })

}

function getDataOfYear(year) {
  var data = {};
  var result = {};

  for(var k in raw) {
    if(raw[k].Year == year)
      data = raw[k];
  }

  result.data = data;
  result.plotForm = {
    'name': '全部',
    'id': 'all',
    'children': [
      {
        'name': '前10%',
        'id': 'top10',
        'children': [
          {
            'name': '前5-10%',
            'id': 'top105',
            'size': parseFloat(data['Top 10-5% income share'])/4
          },
          {
            'name': '前5%',
            'id': 'top5',
            'children':[
              {
                'name': '前1-5%',
                'id': 'top51',
                'size': parseFloat(data['Top 5-1% income share'])/4
              },
              {
                'name': '前1%',
                'id': 'top1',
                'children': [
                  {
                    'name': '前0.1-1%',
                    'id': 'top011',
                    'size': (parseFloat(data['Top 1% income share']) - parseFloat(data['Top 0.1-0.01% income share']) -  parseFloat(data['Top 0.01% income share']))/4
                  },
                  {
                    'name': '前0.01-0.1%',
                    'id': 'top0101',
                    'size': parseFloat(data['Top 0.1-0.01% income share'])
                  },
                  {
                    'name': '前0.01%',
                    'id': 'top001',
                    'size': parseFloat(data['Top 0.01% income share'])
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        'name': '後90%',
        'id': 'bot90',
        'size': (100 - parseFloat(data['Top 10% income share']))/2
      }
    ]
  }

  return result;

}
