console.log("Import logic.js worked")

console.log("Loading map")

// Source of the earthquake data
const usgsURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


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

    // Create the map instance
    let map = L.map("map", { center: [40.7, -94.5], zoom: 4, layers: [streetmap] });  

    // add baseMap to control the layer options
    L.control.layers(baseMaps).addTo(map)
    return map

}


function createMapMarkers(queryURL) {
    d3.json(usgsURL).then( data => {
        let earthquakes = data.features
        earthquakes.forEach((quake) => {
            let lon = quake.geometry.coordinates[0];
            let lat = quake.geometry.coordinates[1];
            let depth = quake.geometry.coordinates[2];
            let mag = quake.properties.mag;
            let mapPoint = L.marker([lat,lon]);
            mapPoint.bindPopup("Latitude: "+ lat+ "<br> Longitude: " +lon + "<br> Magnitude: " +mag + "<br> Depth: " +depth+"km" );
            mapPoint.addTo(bigmap);
        });
    }

    );

}

var bigmap = createMap();
createMapMarkers(usgsURL);

var LAcircle = new L.circle(
    [34.0522, -118.2437], 
    {radius: 1000, color: "#99ff66", fillcolor: "#99ff66" });
LAcircle.addTo(bigmap);


console.log("Map Loading Complete")
