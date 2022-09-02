console.log("Import logic.js worked")

console.log("Loading map")

// Source of the earthquake data
const usgsURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const usgs4URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

function getColor(mag) {
    switch (true) {
        //  Danger Level: Maximum Danger Red #FF0000
        case mag>8: 
            return "#FF0000"

        //  Danger level: Dangerous Orange #FF8000
        case mag>6: 
            return "#FF8000";
        
        //  Danger level: Warning Yellow #FFFF00
        case mag>4: 
            return "#FFFF00";
        
        //  Danger level: Caution Green #00FF00
        case mag>2:
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
            let mapPoint = L.circle(latlng,{radius: depth*100, color: getColor(mag), fillcolor: "#99ff66" });
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
  
    // combined the layers into one variable
    const baseMaps = {
        Street: streetmap,
        Dark: darkmap,
    };

    // Create the layer for the earthquakes
    let earthquakes = new L.layerGroup();
    let overlays = {
        Earthquakes: earthquakes
    };




    
    createMapMarkers(earthquakes, usgsURL);

    // Create the map instance
    let map = L.map("map", { center: [40.7, -94.5], zoom: 4, layers: [streetmap, earthquakes] });  

    // add baseMap to control the layer options
    L.control.layers(baseMaps, overlays).addTo(map)

    return map

}






var bigmap = createMap();

console.log("Map Loading Complete")
