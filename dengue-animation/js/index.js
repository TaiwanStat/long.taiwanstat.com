(function() {

  var map;
  var data;
  var threeCircleData;
  var fiveCircleData;
  var drugOrg;
  var drugData;
  var circles = [];
  var drugCircles = [];
  var markers = [];
  var day = 3;
  var info = L.control();
  var dist800 = 'off';
  var showDrug = false;
  var from = new Date('2015/06/01');
  var end = new Date('2015/09/23');
  var pivot;
  var diffDays;
  var latlngs = {};
  var stopIntervalIsTrue = false;
  var defaultCirlceParams = {
    size: 500,
    color: '#e851c',
    fillColor: '#E24A31',
    showBig: true,
    opacity: 0.1
  };


  info.onAdd = onInfoAdd;
  info.update = onInfoUpdate;


  initMap();

  d3.json('./data.json', function(_data) {
    data = _data;
    var timeDiff = Math.abs(end.getTime() - from.getTime());
    diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    $('.range input')[0].max = diffDays;

    var pivot = new Date(end);
    var key = pivot.toISOString().substring(0, 10).replace(/-/g, '/');
    $('.current').text(key); 

    threeCircleData = format(data[key].three);
    fiveCircleData = format(data[key].five);
    drawCircle(threeCircleData, defaultCirlceParams);
    d3.json('./drug_data.json', function(data) {
      drugOrg = data;
      drugData = format(drugOrg[key]);
      toggleDrugCircle();
    });
  });

  function format(arr) {
    var data = [];
    for (var i = 1; i < arr.length; ++ i){
      var tmp = {};
      for (var j = 0; j < arr[i].length; ++ j) {
        tmp[arr[0][j]] = arr[i][j];
      }
      data.push(tmp);
    }
    return data;
  }

  function getDate (dateArr) {
    if (dateArr[1] < 10) {
      dateArr[1] = '0' + dateArr[1];
    }
    if (dateArr[2] < 10) {
      dateArr[2] = '0' + dateArr[2];
    }
    return dateArr;
  }

  function initMap() {
    map = new L.Map('map');

    var url = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
    var attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
    var osm = new L.TileLayer(url, {minZoom: 12,  maxZoom: 19, attribution: attrib});   

    map.setView(new L.LatLng(23, 120.2), 13);
    osm.addTo(map);
    info.addTo(map); 
  }

  function drawCircle(data, argvs) {
    latlngs = {};
    data.forEach(function(point) {
      if (latlngs[point.Longitude] && latlngs[point.Longitude][point.Latitude]) {
        return;
      }

      if (argvs.showBig && dist800 == 'on') {
        var bigCircle = L.circle([point.Latitude, point.Longitude], 800, 
          {fillColor: '#DE8552', color: '#CA1F18', opacity: 0.1})
          .addTo(map);
        circles.push(bigCircle);
      }
     
      var circle = L.circle([point.Latitude, point.Longitude], argvs.size,
        {fillColor: argvs.fillColor, color: argvs.color, opacity: argvs.opacity})
        .addTo(map);

      if (argvs.showBig) {
        circles.push(circle);
      }
      else {
        drugCircles.push(circle);
      }
      if (!latlngs[point.Longitude])
        latlngs[point.Longitude] = {};
      latlngs[point.Longitude][point.Latitude] = true;
    });
  }

  function onInfoAdd(map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this._div.innerHTML = '<h4><span>橘紅色</span>區塊表示：這個範圍3天內的登革熱病例數超過整體的百分之三</h4><span>（半徑500公尺）</span>';
    return this._div;
  }
  function onInfoUpdate() {
     this._div.innerHTML = '<h4><span>橘紅色</span>區塊表示：這個範圍' + day  +
       '天內的登革熱病例數超過整體的百分之三</h4><span>（半徑500公尺）</span>';
    return this._div;
  }


  function updateCircle(d, dist) {
    day = d;
    dist800 = dist;
    removeCircles(circles);
    if (day == 3) {
      drawCircle(threeCircleData, defaultCirlceParams);
    }
    else if (day == 5){
      drawCircle(fiveCircleData, defaultCirlceParams);
    }
    info.update();
  }

  function removeCircles(_circles) {
    _circles.forEach(function(circle) {
      map.removeLayer(circle);
    }); 
  }

  function toggleDrugCircle () {
    showDrug = !showDrug;
    if (!showDrug)  
      return removeCircles(drugCircles);
    drawCircle(drugData, {
      color: '#028D9B',
      fillColor: '#028D9B',
      size: 50,
      opacity: 0.5,
      showBig: false
    });
  }

  function updateVis (input, interval) {
    input.value = parseInt(input.value) + 1;
    var pivot = new Date(from);
    pivot.setDate(from.getDate()+parseInt(input.value));
    var key = pivot.toISOString().substring(0, 10).replace(/-/g, '/');
    //var key = getDate(dateArr).join('/');
    if (parseInt(input.value) > diffDays || !(key in data) || 
      stopIntervalIsTrue) {
      clearInterval(interval);
    }
    threeCircleData = format(data[key].three);
    fiveCircleData = format(data[key].five);
  
    if (key in drugOrg) 
      drugData = format(drugOrg[key]);
    else
      drugData = null;

    $('.current').text(key); 
    updateCircle(day, dist800);

    $('rect').attr("class", "");
    $('#bar-'+key.replace(/\//g, '-')).attr("class", "active");
    if (showDrug) {
      removeCircles(drugCircles);
      if (drugData) {
        drawCircle(drugData, {
          color: '#028D9B',
          fillColor: '#028D9B',
          size: 50,
          opacity: 0.5,
          showBig: false
        });
      }
    }
  }

  $('.play').click(function() {
    stopIntervalIsTrue = false;
    var input = $('.range input')[0];
    var interval = setInterval(function(){ 
        // update circle data
        updateVis(input, interval);
        return;
      }, 1000); 
  });

  $('.pause').click(function() {
    stopIntervalIsTrue = true;
  });

  $('.stepback').click(function() {
    stopIntervalIsTrue = true;
    $('.range input')[0].value = 0;
  });

  $('.range input').change(function() {
    updateVis(this); 
  });

  
  $('.checkbox')
    .checkbox({
      onChange: function() {
        var checkboxs = $(this);
        checkboxs.each(function(i) {
          var value = checkboxs[i].value;
          var name = checkboxs[i].name;
          if (name == 'drug'){
            return toggleDrugCircle();
          }

          if (checkboxs[i].checked) {
            if (value == 5 || value == 3) {
              updateCircle(value, dist800); 
            }
            else {
              updateCircle(day, value); 
            }
          }
          else if (value == 'on') {
            updateCircle(day, 'off'); 
          } 
        });
      }
    });

})();
