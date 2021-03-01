// sidebar toggle
$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});
// leaflet map
var mymap = L.map('mapid').setView([27.6251403350933, 82.44140625000001], 6);
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);
// adding the osm geocoder
var osmGeocoder = new L.Control.OSMGeocoder({
    collapsed: false,
    text: 'Find!',

});
mymap.addControl(osmGeocoder);
// getting track location
let marker, circle;
function gettrack() {
    if (navigator.geolocation) {
        // making the updating the postion in every 5 seconds
        setInterval(() => {
            navigator.geolocation.getCurrentPosition(getPostion)
        }, 5000);
        // console.log(navigator.geolocation.getCurrentPosition(getPostion))
    } else {
        console.log("you do not support geo location")
    }
}
function getPostion(position) {
    console.log(position)
    // get lat, lng, accuracy
    let lat = position.coords.latitude
    let lng = position.coords.longitude
    let accuracy = position.coords.accuracy
    // removing marker if there is already
    if (marker) {
        mymap.removeLayer(marker)
        mymap.removeLayer(circle)
    }
    marker = L.marker([lat, lng]).bindPopup(`the accuracy is ${accuracy}m`);
    circle = L.circle([lat, lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: accuracy
    });
    // adding marker and circle to the feature group
    var featureGroup = L.featureGroup([marker, circle]).addTo(mymap)
    // making the map fitbound
    mymap.fitBounds(featureGroup.getBounds())
}
// using the draw plugin
function getdrawplugins() {
    var drawnItems = new L.FeatureGroup();
    mymap.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
        draw: {
            polygon: {
                shapeOptions: {
                    color: 'purple'
                },
                // don't allow us to intersect the polygon
                allowIntersection: false,
                drawError: {
                    color: 'orange',
                    timeout: 1000
                },
                // showing area in meter
                showArea: true,
                metric: false,
                // adding the repeated mode
                repeatMode: true
            },
            polyline: {
                shapeOptions: {
                    color: 'red'
                },
                repeatMode: true
            },
            rect: {
                shapeOptions: {
                    color: 'green'
                },
                repeatMode: true
            },
            circle: {
                shapeOptions: {
                    color: 'steelblue'
                },
                repeatMode: true
            },
        },

        edit: {
            featureGroup: drawnItems
        }
    });
    mymap.addControl(drawControl);
    mymap.on('draw:created', function (e) {
        var type = e.layerType,
            layer = e.layer;
        drawnItems.addLayer(layer);
    });
}
// getfileloadplugins()
function getfileloadplugins() {
    // creating the style
    var style = {
        color: 'red', opacity: 1.0, fillOpacity: 1.0, weight: 2,
        clickable: false
    };
    // custom label
    L.Control.FileLayerLoad.LABEL = '<i class="fa fa-folder-open"></i>';
    L.Control.fileLayerLoad({
        fitBounds: true,
        layerOptions: {
            style: style,
            pointToLayer: function (data, latlng) {
                return L.circleMarker(latlng, { style: style });
            }
        },
    }).addTo(mymap);
}
// getting the full screen
mymap.addControl(new L.Control.Fullscreen({
    title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
    }
}));
// mouse coordinate
L.control.coordinates({
    position: "bottomleft", //optional default "bootomright"
    decimals: 2, //optional default 4
    decimalSeperator: ".", //optional default "."
    labelTemplateLat: "Latitude: {y}", //optional default "Lat: {y}"
    labelTemplateLng: "Longitude: {x}", //optional default "Lng: {x}"
    enableUserInput: true, //optional default true
    useDMS: false, //optional default false
    useLatLngOrder: true, //ordering of labels, default false-> lng-lat
    markerType: L.marker, //optional default L.marker
    markerProps: {

        title: `This is the place where you enter `
    }, //optional default {},
    labelFormatterLng: function (lng) { return lng.toFixed(2) + " lng" }, //optional default none,
    labelFormatterLat: function (lat) { return lat.toFixed(2) + " lat" }, //optional default none
    //optional default none
    // customLabelFcn: function(latLonObj, opts) { "Geohash: " + encodeGeoHash(latLonObj.lat, latLonObj.lng)} 
}).addTo(mymap);
function encodeGeoHash(lat, lng) {

    console.log(lat),
        console.log(lng)
}

// adding scale
L.control.scale({
    position:'bottomright',
    metric:true,
    imperical:false
}).addTo(mymap)

// adding watermark
L.Control.Watermark = L.Control.extend({
    onAdd:function(map){
        var image = L.DomUtil.create('img');
        image.src = 'PAS074BGE004.jpg';
        image.style.width = '30px';
        return image
    },
    onRemove:function(map){},   
});
L.control.watermark = function(opts){
    return new L.Control.Watermark(opts)
}
L.control.watermark().addTo(mymap)
