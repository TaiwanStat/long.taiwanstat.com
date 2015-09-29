(function(window) {

  var map,
      data,
      villageData,
      threeCircleData,
      fiveCircleData,
      drugOrg,
      drugData,
      circles = [],
      drugCircles = [],
      markers = [],
      day = 3,
      info = L.control(),
      showDrug = false,
      from = new Date('2015/06/01'),
      end = new Date('2015/09/29'),
      pivot,
      diffDays,
      latlngs = {},
      topoLayer,
      stopIntervalIsTrue = false,
      defaultCirlceParams = {
        size: 500,
        color: '#e851c',
        fillColor: '#E24A31',
        showBig: true,
        opacity: 0.1
      };

  info.onAdd = onInfoAdd;
  info.update = onInfoUpdate;
  window.initData = initData;
  initMap();

  function initData(dengueUrl, drugUrl, barUrl, villageUrl, topoUrl) {

    d3.json(dengueUrl, function(d) {
      data = d;
      var timeDiff = Math.abs(end.getTime() - from.getTime());
      diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
      $('.range input')[0].max = diffDays;
      var pivot = new Date(end);
      var key = pivot.toISOString().substring(0, 10).replace(/-/g, '/');
      $('.current').text(key); 
      var latestDate = new Date();
      latestDate.setDate(pivot.getDate());
      $('.updateAt').text(latestDate.toLocaleDateString());
      threeCircleData = format(data[key].three);
      fiveCircleData = format(data[key].five);
      drawCircle(threeCircleData, defaultCirlceParams);
  
      if (drugUrl)
        d3.json(drugUrl, function(data) {
          drugOrg = data;
          drugData = format(drugOrg[key]);
          toggleDrugCircle();
        });
    });

    if (topoUrl)
      d3.json(topoUrl, function(topoData) {
        for (var key in topoData.objects) {
          geojson = topojson.feature(topoData, topoData.objects[key]);
        }
        topoLayer = L.geoJson(geojson, {
          style: style,
          onEachFeature: onEachFeature
        }).addTo(map);
      });
    
    if (barUrl)
      d3.json(barUrl, function(error, data) { window.drawChart(data, showDefaultTip, true); });

    if (villageUrl) d3.json(villageUrl, function(data) { villageData = data; });
  }

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

  function getDate(dateArr) {
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

    map.setView(new L.LatLng(22.99, 120.2), 13);
    osm.addTo(map);
    info.addTo(map); 
  }

  function drawCircle(data, argvs) {
    latlngs = {};
    data.forEach(function(point) {
      if (latlngs[point.Longitude] && latlngs[point.Longitude][point.Latitude]) {
        return;
      }

      var circle = L.circle([point.Latitude, point.Longitude], argvs.size,
        {fillColor: argvs.fillColor, color: argvs.color, opacity: argvs.opacity,
          clickable: false})
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
    this._div.innerHTML = '<h4><span>橘紅色</span>區塊表示：' +
      '這個範圍3天內的登革熱病例數超過整體的百分之三</h4><span>（半徑500公尺）</span>';
    return this._div;
  }

  function onInfoUpdate() {
     this._div.innerHTML = '<h4><span>橘紅色</span>區塊表示：這個範圍' + day  +
       '天內的登革熱病例數超過整體的百分之三</h4><span>（半徑500公尺）</span>';
    return this._div;
  }

  function updateCircle(d) {
    day = d;
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
    if (parseInt(input.value) > diffDays || !(key in data) || stopIntervalIsTrue) {
      clearInterval(interval);
    }
    threeCircleData = format(data[key].three);
    fiveCircleData = format(data[key].five);
  
    if (key in drugOrg) 
      drugData = format(drugOrg[key]);
    else
      drugData = null;

    $('.current').text(key); 
    updateCircle(day);

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
              updateCircle(value); 
            }
          }
          else if (value == 'on') {
            updateCircle(day, 'off'); 
          } 
        });
      }
  });

  function showDefaultTip(d) {
    return d.date.toLocaleDateString() + 
      '  <strong>病例數：</strong> <span style="color:red">' + d.value + '</span><br/>' +
      '<strong>氣溫：</strong> <span style="color:red">' + d.氣溫 + '</span> '+
      '<strong>降水量：</strong> <span style="color:red">' + d.降水量 + '</span> ' +
      '<strong>相對溼度：</strong> <span style="color:red">' + d.相對溼度 + '</span>';
  }

  function style(feature) {
    return {
      fillColor: '#D5D5D5',
      weight: 1,
      opacity: 0.3,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.1
    };
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: layerOnClick
    });
    layer.bindPopup(feature.properties.TOWNNAME +
        ' ' + feature.properties.VILLAGENAM);
  }

  function resetHighlight(e) {
    topoLayer.resetStyle(e.target);
  }

  function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.6
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }
  }


  function layerOnClick(e) {
    var valliage = e.target.feature.properties.VILLAGENAM;
    var svg = $('#bar svg');
    if (svg.length > 0) {
      svg[0].remove();
    }
    window.drawChart(villageData[valliage], function(d) {
      var info = d.date.toLocaleDateString() + 
       '  <strong>病例數：</strong> <span style="color:red">' + d.value + '</span>';
      if (d.降水量 > 0) 
        info += '<br/>降水：<span style="color:red">' + d.rain_day + '</span>天內<br/>' +
          '降水量：<span style="color:red">' + d.降水量 + '</span>（毫米）';
      return info;
    }, true);
  }

})(window);
