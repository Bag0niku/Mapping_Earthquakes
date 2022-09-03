console.log("Import logic.js worked")

console.log("Loading map")

// Source of the earthquake data
// All quakes within the last hour
const usgsURL1hour = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
// All quakes within the last day
const usgsURL1day = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
// All quakes withing the last 7 days
const usgsURL7day = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// All Major quakes within the last 7 days
const usgs4URL7day = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson" ;
// All Major quakes within the las 30 days
const usgs4URL30day = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
// Tectonic Plates GeoJSON Location data
const plates_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


function createTPlates(layer, url) {
    d3.json(url).then((data) => {
        Object(data.features).forEach(feature => {
            let latlng = feature.geometry.coordinates.map(d => d.reverse());
            let plate = L.polyline(latlng, {color:"Black"});
            plate.addTo(layer);    
        });
    });
}

function getRadius(magnitude) {if (magnitude < 1) {return 10} else {return magnitude * 10}
}

function getColor(magnitude) {
    switch (true) {
        //  Danger Level: Maximum Danger Red #FF0000
        case magnitude>5: 
            return "#FF0000"

        //  Danger level: Dangerous Orange #FF8000
        case magnitude>4: 
            return "#FF8000";
        
        //  Danger level: Warning Yellow #FFFF00
        case magnitude>3: 
            return "#FFFF00";
        
        //  Danger level: Caution Green #00FF00
        case magnitude>2:
            return "#00FF00";
        
        //  Danger level: No Need to Worry Blue #0000FF
        default:
            return "#0000FF";        
    }
}


function createMapMarkers(layer, queryURL) {
    // retrieve the earthquake information from the url
    d3.json(queryURL).then( data => {
        // save the relevent data and add it to the layer.
        let eQuakes = data.features;

        L.geoJSON(eQuakes, {pointToLayer: function(feature, latlng) {
            // console.log(feature);
            let lon = feature.geometry.coordinates[0];
            let lat = feature.geometry.coordinates[1];
            let depth = feature.geometry.coordinates[2];
            let mag = feature.properties.mag;
            let mapPoint = L.circleMarker(latlng,{radius: getRadius(mag), color: getColor(mag), fillcolor: "#000000"  });
            mapPoint.bindPopup("Latitude: "+ lat+ "<br> Longitude: " +lon + "<br> Magnitude: " +mag + "<br> Depth: " +depth+"km" );
            return mapPoint
        }}).addTo(layer);
    }

    );

}

// Create the map that will be viewed
function createMap() {
    // streetview tile layer for the map
    const streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    });

    // Darkview tile layer option for the map
    const darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/dark-v10',
        accessToken: API_KEY
    });

    let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
    });
  
    // combined the layers into one variable
    const baseMaps = {
        Street: streetmap,
        Dark: darkmap,
        Satellite: satelliteStreets
    };

    // Create the layer for the earthquakes
    let earthquakesH = new L.layerGroup();  // All quakes for the last hour
    let earthquakesD = new L.layerGroup();  // All quakes for the last day
    let earthquakesW = new L.layerGroup();  // All quakes for the last week
    let dangerquakes7 = new L.layerGroup(); // 4.5+ quakes for the last week
    let dangerquakes30 = new L.layerGroup();// 4.5+ quakes for the last month
    let tectonicplates = new L.layerGroup(); // visualize the tectonic plates

    createTPlates(tectonicplates, plates_url)
    createMapMarkers(earthquakesH, usgsURL1hour);
    createMapMarkers(earthquakesD, usgsURL1day);
    createMapMarkers(earthquakesW, usgsURL7day);
    createMapMarkers(dangerquakes7, usgs4URL7day);
    createMapMarkers(dangerquakes30, usgs4URL30day);
    
    let overlays = {
        "All Quakes in Last 1 hour": earthquakesH,
        "All Quakes in Last 1 days": earthquakesD,
        "All Quakes in Last 7 days": earthquakesW,
        "Major Quakes in Last 7 days": dangerquakes7,
        "Major Quakes in Last 30 days" : dangerquakes30,
        "Tectonic Plates": tectonicplates
    };
    

    // Create the map instance
    let map = L.map("map", { center: [40.7, -94.5], zoom: 4, layers: [streetmap, earthquakesW] });  

    // add baseMap to control the layer options
    L.control.layers(baseMaps, overlays).addTo(map)

    return map

}



var bigmap = createMap();

console.log("Map Loading Complete")
