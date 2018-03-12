var screenwidth=screen.width;
if(screenwidth<450){
    var zoom=7;
}else if(screenwidth<800){
    var zoom=7.5;
}else{
    var zoom=8;
}
var styledMapType = new google.maps.StyledMapType(
    [
      {elementType: 'geometry', stylers: [{color: '#A1A1A1'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#000000'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#ffffff'}]},
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{color: '#000000'}]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'geometry.stroke',
        stylers: [{color: '#dcd2be'}]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{color: '#ae9e90'}]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{color: '#A1A1A1'}]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}],
        stylers: [{visibility: "off"}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#93817c'}],
        stylers: [{visibility: "off"}]
        
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{color: '#a5b076'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#ffffff'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#f5f1e6'}],
        stylers: [{visibility: "off"}]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{color: '#fdfcf8'}],
        stylers: [{visibility: "off"}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#f8c967'}],
        stylers: [{visibility: "off"}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#e9bc62'}],
        stylers: [{visibility: "off"}]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [{color: '#e98d58'}],
        stylers: [{visibility: "off"}]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.stroke',
        stylers: [{color: '#db8555'}],
        stylers: [{visibility: "off"}]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{color: '#806b63'}],
        stylers: [{visibility: "off"}]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}],
        stylers: [{visibility: "off"}]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.fill',
        stylers: [{color: '#8f7d77'}],
        stylers: [{visibility: "off"}]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#ebe3cd'}],
        stylers: [{visibility: "off"}]
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}],
        stylers: [{visibility: "off"}]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{color: '#ffffff'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#ffffff'}]
      }
    ],
    {name: 'Styled Map'});
    datapath = "./position.csv"

d3.csv(datapath,function(dataset){
    
    var myLatLng = [];
    for(var i=0;i<101;i++){
        myLatLng[i]={lat: +dataset[i].lat, lng: +dataset[i].lng}
    }

    var map = new google.maps.Map(document.getElementById('googleMap'), {
        center: {lat: 23.58, lng: 121.0},
        zoom: zoom,
        mapTypeControlOptions: {
          mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                  'styled_map']
        }
      });
      
      map.mapTypes.set('styled_map', styledMapType);
      map.setMapTypeId('styled_map');
      for(var i=0;i<101;i++){
        var marker = new google.maps.Marker({
                    map: map,
                    position: myLatLng[i],
                    title:dataset[i].hospital
                });
    }
})