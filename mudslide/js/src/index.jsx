'use strict';

//import style
import style from './../../css/index';

//import jsx
import L from 'leaflet';
import $ from 'jquery';

import {
  handleRain as HandleRain,
  handleLine as HandleLine
} from './data';

import {
  init as Init,
  site as Site,
  line as Line,
  setPlace as Set,
  resetView as Reset,
} from './map';

(function() {
  let data = require('json!./../../data/data');
  let rain = require('json!./../../data/rain');
  let line = require('json!./../../data/mudslide-line');
  rain = HandleRain(data, rain);
  HandleLine(data, line);
  let map = L.map('map').setView(new L.LatLng(23.619, 120.795), 8);

  Init(map);
  //Set(map);
  //Site(map, rain);
  Line(map, line);

  $("#reset").click(function() { Reset(map); });
  $("#set").click(function() { Set(map); });
})();
