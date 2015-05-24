(function(){

  var countryabb = {
    '中國大陸':'chn',
    '加拿大':'can',
    '印尼':'idn',
    '墨西哥':'mex',
    '奈及利亞':'nga',
    '巴拿馬':'pan',
    '巴西':'bra',
    '德國':'deu',
    '新加坡':'sgp',
    '日本':'jpn',
    '沙烏地阿拉伯':'sau',
    '法國':'fra',
    '泰國':'tha',
    '澳大利亞':'aus',
    '科威特':'kwt',
    '紐西蘭':'nzl',
    '美國':'usa',
    '義大利':'ita',
    '英國':'gbr',
    '越南':'vnm',
    '阿根廷':'arg',
    '韓國':'kor',
    '香港':'hkg',
    '馬來西亞':'mys',
  }

  function model() {
    var years = [];
    var allMonths = [];

    var importData = [];
    var exportData = [];

    var sortfunc = {
      'export' : function(a, b){
        if (a.export < b.export) {
          return 1;
        }
        else if (a.export > b.export) {
          return -1;
        }
        return 0;
      },
      'import' : function(a, b){
        if (a.import < b.import) {
          return 1;
        }
        else if (a.import > b.import) {
          return -1;
        }
        return 0;
      },
      'importe' : function(a, b){
        if ((a.import - a.export) < (b.import - b.export)) {
          return 1;
        }
        else if ((a.import - a.export) > (b.import - b.export)) {
          return -1;
        }
        return 0;
      },
      'exporte' : function(a, b){
        if ((a.import - a.export) > (b.import - b.export)) {
          return 1;
        }
        else if ((a.import - a.export) < (b.import - b.export)) {
          return -1;
        }
        return 0;
      },
    }

    this.init = function(callback) {
        d3.csv('data/import.csv', function(data){
          importData = data;

          for(var k in data)
            allMonths.push(data[k]['月']);

          for(var k in allMonths) {
            var y = allMonths[k].split('M')
            if(years.indexOf(y[0]) == -1)
              years.push(y[0]);
          }

          d3.csv('data/export.csv', function(data){
            exportData = data;
            callback();
          })
        })
    };

    this.getYears = function() {
        return years;
    };

    this.getYearsLen = function() {
        return years.length;
    };

    this.getYearMonths = function(year) {
      var months = [];
      for(var k in allMonths) {
        if(allMonths[k].indexOf(year) != -1) {
          var m = allMonths[k].split('M');
          months.push(m[1]);
        }
      }
      return months;
    };

    this.getData = function(year, month, sortby) {
      var key = year + 'M' + month;

      var id = null;
      var ed = null;

      for(var k in importData) {
        if(importData[k]['月'] == key)
          id = importData[k];
      }
      for(var k in exportData) {
        if(exportData[k]['月'] == key)
          ed = exportData[k];
      }

      var data = [];
      for(var k in id){
        var country = k.split(' 　')[1];
        if(country) {
          data.push({
            'country': country,
            'import': parseInt(id[k]),
            'export': parseInt(ed[k]),
          });
        }
      }

      data.sort(sortfunc[sortby]);

      return data;
    }

  }

  function view() {

    var model = null;
    var controller = null;

    function yearsControlInit() {
      var html = '';
      var years = model.getYears();

      for(var k in years) {
        html += '<div class="item" data-value="' + years[k] +
          '">' + years[k] +'</div>';
      }
      $('.year.dropdown .menu').html(html);
      $('.year.dropdown .value').attr('value', years[years.length-1]);
      $('.year.dropdown').dropdown();

      $('.year.dropdown .value').change(function(){
        controller.updateMonths();
      })

    }

    function monthsControlInit() {
      $('.months.dropdown .value').change(function(){
        lastMonth = $('.months.dropdown .value').attr('value');
        controller.updateCards();
      })
    }

    function sortControlInit() {
      $('.sort.dropdown').dropdown();
      $('.sort.dropdown .value').change(function(){
        controller.updateCards();
      });
    }

    function appenCards(data) {
      var html = '';
      for(var k in data){
        var abb = countryabb[data[k].country];
        var excess = '';

        if(data[k].import > data[k].export) {
          excess = '<span class="red">入超(百萬元) : ' + (data[k].import-data[k].export) +
            '</span><br>';
        }
        else {
          excess = '<span class="green">出超(百萬元) : ' + (data[k].export-data[k].import) +
            '</span><br>';
        }

        html += '<div class="card" style="display:none;"><div class="image"><img src="images/' + abb +
          '.gif"></div><div class="content"><div class="header">' + data[k].country +
          '<div class="description"><span class="red">進口值(百萬元) : ' + data[k].import + '</span><br>' +
          '<span class="green">出口值(百萬元) : ' + data[k].export + '</span><br><br>' + excess +
          '</div></div></div><div class="extra content"><a><i class="trophy icon"></i>第 ' + (parseInt(k)+1) +' 名</a></div></div>'
      }

      $('.country.cards').html(html);

      $('.card').transition({
        animation  : 'slide right',
        duration   : '0.3s',});
    }

    this.init = function() {

      yearsControlInit();
      monthsControlInit();
      sortControlInit();

      controller.updateMonths();

    };


    var lastMonth = null;
    this.updateMonths = function(months) {
      var html = '';

      for(var k in months) {
        html += '<div class="item" data-value="' + months[k] +
          '">' + months[k] +'</div>';
      }

      $('.months.dropdown .menu').html(html);

      if(months.indexOf(lastMonth) == -1){
        $('.months.dropdown .value').attr('value', months[months.length-1]);
        lastMonth = months[months.length-1];
      }

      else
        $('.months.dropdown .value').attr('value', lastMonth);

      $('.months.dropdown').dropdown();

    };

    this.updateCards = function(data) {

      var top = $(document).scrollTop();

      if($('.cards').html().length == 0) {
        appenCards(data);
      }

      else {
        $('.card').transition({
          animation  : 'slide left',
          duration   : '0.3s',
          onComplete : function(){
            appenCards(data);
            $(document).scrollTop(top);
          }})
      }

    };

    this.getCurrentYear = function() {
      return $('.year.dropdown .value').attr('value');
    };

    this.getCurrentMonth = function() {
      return $('.months.dropdown .value').attr('value');
    };

    this.getSortby = function() {
      return $('.sort.dropdown .value').attr('value');
    }

    this.set = function(m, c) {
      model = m;
      controller = c;
    }

  }

  function controller() {
    var model = null;
    var view = null;
    var controller = this;

    var currentYear = null;
    var currentYearMonths = null;
    var currentMonth = null;
    var sortby = null;

    this.init = function() {
        model.init(function(){
          view.init();
        });
    };

    this.updateMonths = function() {

      currentYear = view.getCurrentYear();
      currentYearMonths = model.getYearMonths(currentYear);

      view.updateMonths(currentYearMonths);
    }

    this.updateCards = function() {
      currentMonth = view.getCurrentMonth();
      sortby = view.getSortby();

      var data = model.getData(currentYear, currentMonth, sortby);

      view.updateCards(data);
    }

    this.set = function(m, v) {
      model = m;
      view = v;
    }

  }

  var model = new model();
  var view = new view();
  var controller = new controller();

  controller.set(model, view);
  view.set(model, controller);

  controller.init();

})()
