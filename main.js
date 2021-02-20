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
    L.Control.fileLayerLoad({
        // Allows you to use a customized version of L.geoJson.
        // For example if you are using the Proj4Leaflet leaflet plugin,
        // you can pass L.Proj.geoJson and load the files into the
        // L.Proj.GeoJson instead of the L.geoJson.
        layer: L.geoJson,
        // See http://leafletjs.com/reference.html#geojson-options
        layerOptions: {style: {color:'red'}},
        // Add to map after loading (default: true) ?
        addToMap: true,
        // File size limit in kb (default: 1024) ?
        fileSizeLimit: 1024,
        // Restrict accepted file formats (default: .geojson, .json, .kml, and .gpx) ?
        formats: [
            '.geojson',
            '.kml'
        ]
    }).addTo(mymap);
}