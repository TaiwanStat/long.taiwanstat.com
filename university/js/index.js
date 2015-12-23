/*jslint browser: true*/
/*global Tangram, gui */

var picking = false;
map = (function () {
    var year = $('.year.dropdown .menu .active.item').attr('value');
    var data_type = $('.selected.dropdown .menu .active.item').attr('value');
    var underMouse;

    $('.selected.dropdown')
        .dropdown({
            onChange: function(value, text) {
                data_type = $('.selected.dropdown .menu .active.item').attr('value');   
                placeMarker();
            }
        });
    $('.year.dropdown')
        .dropdown({
            onChange: function(value, text) {
                year = $('.year.dropdown .menu .active.item').attr('value');   
                if(underMouse !== undefined) {
                    if(gdata[underMouse][year] !== undefined) {
                        $('.uname.disp').text(underMouse);
                        displayInfo(gdata[underMouse]);
                    }
                    else {
                        $('.uname.disp').text('選取地圖上的圖標來顯示學校資訊!');
                        $('.total.disp').text('');
                        $('.mnum.disp').text('');
                        $('.fnum.disp').text('');
                        $('.mfr.disp').text('');
                        $('.progress.disp').text('');
                    }
                }

                placeMarker();
            }
        });

    var locations = {
        'taiwan': [23.868475, 120.99295, 7.5],
        'north': [24.962730, 121.232870, 9.2],
        'mid': [23.868475, 120.99295, 9.2],
        'south': [22.741238, 120.753406, 9.2],
    };

    var map_start_location = locations['taiwan'];

    var url_hash = window.location.hash.slice(1, window.location.hash.length).split('/');
    keytext = "name";
    window.keytext = keytext;
    valuetext = "major_road";
    window.valuetext = valuetext;

    window.updateURL = function() {
        // if (picking) return;
        // console.log(window.location.hash);
        // var map_latlng = map.getCenter();
        // var url_options = [map.getZoom().toFixed(1), map_latlng.lat.toFixed(4), map_latlng.lng.toFixed(4), escape(keytext), escape(valuetext)];
        // window.location.hash = url_options.join('/');
    }

    var map = L.map('map',
        {"keyboardZoomOffset" : .05}
    );


    var gdata = null;
    var sortlist = [];

    function ucompare(a, b) {
        if(!a[0][year] || !b[0][year]) {
            return 0;
        }

        if(a[0][year][data_type] < b[0][year][data_type]) {
            return 1;
        } 
        if(a[0][year][data_type] > b[0][year][data_type]) {
            return -1;
        } 
        return 0;
    }

    markerSet = [];

    function placeMarker() {

        for(var k in markerSet) 
            map.removeLayer(markerSet[k]);

        sortlist = [];
        for(var k in gdata) { 
            sortlist.push([gdata[k], k]);         
        } 
        
        sortlist.sort(ucompare);

        var count = 1;
        for(var i in sortlist) {
            var u = sortlist[i][1];
            var mcolor = 'green';

            if(i < sortlist.length/3)
                mcolor = 'red';
            else if(i > sortlist.length/3*2)
                mcolor = 'blue';

            var micon = L.AwesomeMarkers.icon({
                icon: '',
                prefix: 'fa',
                markerColor: mcolor,
                html: count,
            });

            if(gdata[u]['lat'] !== undefined && gdata[u][year] !== undefined) {
                var marker = L.marker([gdata[u]['lat'], gdata[u]['lng']], {icon: micon, name: u}).addTo(map)
                    .on('mouseover', markerHover)
                    .on('click', markerClick);
                markerSet.push(marker);
                count += 1;
            }
        }
    }

    d3.json('data/result.json', function(data){
        gdata = data;
        
        for(var k in gdata){
            for(var y in gdata[k]){

                gdata[k][y]['mfr'] = gdata[k][y]['mnum']/gdata[k][y]['fnum'];

                var thisYearData = parseInt(gdata[k][y]['total']);
                var lastYear = parseInt(y) - 1;

                if(gdata[k][lastYear] !== undefined){
                    var lastYearData = parseInt(gdata[k][lastYear]['total']);     
                    gdata[k][y]['progress'] = (thisYearData-lastYearData)/lastYearData;
                }

            }
        }
        // var c = 0;
        // for(var k in gdata) { 
        //     sortlist.push([gdata[k], k]);         
        //     c += 1;
        // } 

        placeMarker();
    })

    function markerClick(e) {
        var uname = this.options.name;
        underMouse = uname;
        $('.uname.disp').text(uname);
        displayInfo(gdata[uname]);
        map.setView(this.getLatLng(), 15);
    }

    function markerHover(e) {
        var uname = this.options.name;
        underMouse = uname;
        $('.uname.disp').text(uname);
        displayInfo(gdata[uname]);
    }

    function displayInfo(d) {
        $('.total.disp').text('總學生數: ' + d[year]['total'] + '人');
        $('.mnum.disp').text('男學生數: ' + d[year]['mnum'] + '人');
        $('.fnum.disp').text('女學生數: ' + d[year]['fnum'] + '人');

        if(!d[year]['mfr']) 
            d[year]['mfr'] = d[year]['mnum'] / d[year]['fnum'];

        $('.mfr.disp').text('性別比(男/女): ' + Math.round(d[year]['mfr']*100)/100);
        
        if(!isNaN(d[year]['progress']))
            $('.progress.disp').text('較去年人數增加: ' + Math.round(d[year]['progress']*10000)/100 + '%');
        else
            $('.progress.disp').text('');
    }


    // marker.addTo(map);

    var layer = Tangram.leafletLayer({
        scene: 'scene.yaml',
        numWorkers: 2,
        attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>',
        unloadInvisibleTiles: false,
        updateWhenIdle: false
    });

    window.layer = layer;
    var scene = layer.scene;
    window.scene = scene;

    map.setView(map_start_location.slice(0, 3), map_start_location[2]);

    $('.resetz.button').on('click', function(){
        map.setView(map_start_location.slice(0, 3), map_start_location[2]);
    })
    $('.north.button').on('click', function(){
        map.setView(locations['north'].slice(0, 3), locations['north'][2]);
    })
    $('.mid.button').on('click', function(){
        map.setView(locations['mid'].slice(0, 3), locations['mid'][2]);
    })
    $('.south.button').on('click', function(){
        map.setView(locations['south'].slice(0, 3), locations['south'][2]);
    })

    map.on('moveend', updateURL);

    function updateKey(value) {
        keytext = value;

        for (layer in scene.config.layers) {
            if (layer == "earth") continue;
            scene.config.layers[layer].properties.key_text = value;
        }
        scene.rebuildGeometry();
        scene.requestRedraw();
        updateURL(); 
    }

    function updateValue(value) {
        valuetext = value;

        for (layer in scene.config.layers) {
            if (layer == "earth") continue;
            scene.config.layers[layer].properties.value_text = value;
        }
        scene.rebuildGeometry();
        scene.requestRedraw();
        updateURL();            
    }

    // Create dat GUI
    var gui = new dat.GUI({ autoPlace: true, hideable: false, width: 300 });
    function addGUI () {

        gui.domElement.parentNode.style.zIndex = 5; // make sure GUI is on top of map
        window.gui = gui;

        gui.keyinput = keytext;
        var keyinput = gui.add(gui, 'keyinput').name("key").listen();

        gui.valueinput = valuetext;
        var valueinput = gui.add(gui, 'valueinput').name("value").listen();
        
        updateKey(keytext);
        updateValue(valuetext);
        keyinput.onChange(function(value) {
            updateKey(value);
        });
        valueinput.onChange(function(value) {
            updateValue(value);
        });
        //select input text when you click on it
        keyinput.domElement.id = "keyfilter";
        keyinput.domElement.onclick = function() { this.getElementsByTagName('input')[0].select(); };
        valueinput.domElement.id = "valuefilter";
        valueinput.domElement.onclick = function() { this.getElementsByTagName('input')[0].select(); };
    }

    // var scene.picking = false;
    // Feature selection
    function initFeatureSelection () {
        // Selection info shown on hover
        var selection_info = document.createElement('div');
        selection_info.setAttribute('class', 'label');
        selection_info.style.display = 'none';
        selection_info.style.zindex = 1000;

        // Show selected feature on hover
        scene.container.addEventListener('mousemove', function (event) {
            if (picking) return;
            var pixel = { x: event.clientX, y: event.clientY };

            scene.getFeatureAt(pixel).then(function(selection) {    
                if (!selection) {
                    return;
                }
                var feature = selection.feature;
                if (feature != null) {
                    // console.log("selection map: " + JSON.stringify(feature));

                    var label = '';
                    if (feature.properties != null) {
                        // console.log(feature.properties);
                        var obj = JSON.parse(JSON.stringify(feature.properties));
                        label = "";
                        for (x in feature.properties) {
                            val = feature.properties[x]
                            label += "<span class='labelLine' key="+x+" value="+val+" onclick='setValuesFromSpan(this)'>"+x+" : "+val+"</span><br>"
                        }
                    }

                    if (label != '') {
                        selection_info.style.left = (pixel.x + 5) + 'px';
                        selection_info.style.top = (pixel.y + 15) + 'px';
                        selection_info.innerHTML = '<span class="labelInner">' + label + '</span>';
                        scene.container.appendChild(selection_info);
                    }
                    else if (selection_info.parentNode != null) {
                        selection_info.parentNode.removeChild(selection_info);
                    }
                }
                else if (selection_info.parentNode != null) {
                    selection_info.parentNode.removeChild(selection_info);
                }
            });

            // Don't show labels while panning
            if (scene.panning == true) {
                if (selection_info.parentNode != null) {
                    selection_info.parentNode.removeChild(selection_info);
                }
            }
        });

        // capture popup clicks
        // scene.labelLine.addEventListener('click', function (event) {
        //     return true;
        // });

        // toggle popup picking state
        scene.container.addEventListener('click', function (event) {
            picking = !picking;
        });
        // toggle popup picking state
        scene.container.addEventListener('drag', function (event) {
            picking = false;
        });
    }

    window.setValuesFromSpan = function(span) {
        keytext = span.getAttribute("key");
        valuetext = span.getAttribute("value");
        gui.keytext=span.getAttribute("key");
        gui.keyinput=span.getAttribute("key");
        gui.valuetext=span.getAttribute("value");
        gui.valueinput=span.getAttribute("value");
        updateKey(keytext);
        updateValue(valuetext);
        // scene.rebuildGeometry();
        // scene.requestRedraw();
        updateURL();
    }

    // Add map
    window.addEventListener('load', function () {
        // Scene initialized
        layer.on('init', function() {
            addGUI();
            var keyfilter = document.getElementById('keyfilter').getElementsByTagName('input')[0];
            if (keyfilter.value.length == 0) keyfilter.focus();
            else keyfilter.select();

            initFeatureSelection();
        });
        layer.addTo(map);
    });

    return map;

}());

