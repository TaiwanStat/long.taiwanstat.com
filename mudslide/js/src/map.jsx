'use strict';

import L from 'leaflet';

export function init(map) {
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 17,
    minZoom: 8,
    attribution: "Imagery from <a href=\"http://giscience.uni-hd.de/\">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
    id: "hsuting.o4lf8mg0",
    accessToken: "pk.eyJ1IjoiaHN1dGluZyIsImEiOiJRajF4Y0hjIn0.9UDt8uw_fxEX791Styd-lA"
  }).addTo(map);
}

export function site(map, data) {
  let info = {
    SiteName: "測站名",
    County: "縣市名",
    Township: "鄉鎮市名"
  };
  let rain = {
    Rainfall10min: "10分鐘",
    Rainfall1hr: "1小時",
    Rainfall3hr: "3小時",
    Rainfall6hr: "6小時",
    Rainfall12hr: "12小時",
    Rainfall24hr: "24小時"
  };
  let icon = L.icon({
    iconUrl: 'image/marker-icon.png',
    shadowUrl: 'image/marker-shadow.png',
    iconAnchor: [22, 94],
    popupAnchor: [-10, -86],
    shadowAnchor: [22, 94]
  });

  for(let i in data) {
    if(data[i].Rainfall10min != "0" || data[i].Rainfall1hr != "0" || data[i].Rainfall3hr != "0"
      || data[i].Rainfall6hr != "0" || data[i].Rainfall12hr != "0" || data[i].Rainfall24hr != "0") {

      let html = "";
      for(let key in info) {
        html += info[key] + "： " + data[i][key] + "<br>";
      }
      for(let key in rain) {
        html += rain[key] + "累積雨量： " + data[i][key] + "mm<br>";
      }

      L.marker([data[i].TWD67Lat, data[i].TWD67Lon], {icon: icon})
        .addTo(map)
        .bindPopup(html);
 
    }
  }
}

export function line(map, data) {
  let info = {
    DEBRISNO: "名稱",
    DATETIME: "公告時間",
    County: "縣市名",
    Town: "鄉鎮市名",
    Vill: "村里名",
    station1StationName: "參考雨量觀測站(1)",
    station2StationName: "參考雨量觀測站(2)",
    AlertValue: "警戒值"
  }

  L.geoJson(data, {
    style(feature) {
      var color;
      if (feature.properties.AlertValue < 250) {
        color = '#e1ce45'
      }
      else if (feature.properties.AlertValue < 300) {
        color = 'orange';
      }
      else if (feature.properties.AlertValue < 400) {
        color = '#e1593f';
      }
      else {
        color: 'red';
      }

      return {
        color: color,
        opacity: 1
      }
    },
    onEachFeature(feature, layer) {
      let html = "";
      for(let key in info) {
        html += info[key] + "： " + feature.properties[key] + "<br>";
      }
      layer.bindPopup(html);
    }
  }).addTo(map);
}

export function setPlace(map) {
  function setPosition(position) {
    map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 12);
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition);
  }
}

export function resetView(map) {
  map.setView(new L.LatLng(23.619, 120.795), 8);
};
