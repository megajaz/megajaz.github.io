console.debug("Hello world!");

// const btnLocButton = document.getElementById("btn-get-loc");
// btnLocButton.addEventListener("click", showLoc);

const btnSaveMap = document.getElementById("btn-save-map");
btnSaveMap.addEventListener("click", saveMap);

function showLoc() {
    alert("Tu bedzie wyswietlana lokalizacja");
}

document.getElementById("btn-get-loc").addEventListener("click", function(event) {
    if (! navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
        alert(positionError.code + positionError.message);
    });
});

function saveMap() {
    alert("Tu bedzie zapis mapy");
}

var map = L.map('map').setView([53.430127, 14.564802], 3);

// openstreetmapsy - one sa nudne i zgermanizowane
// L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);

// zdjecia satelitarne - imo fancy
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);

