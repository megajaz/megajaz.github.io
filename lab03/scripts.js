// console.debug("Hello world!");

document.getElementById("btn-get-loc").addEventListener("click", function(event) {
    if (! navigator.geolocation) {
        console.log("No geolocation.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon], 18);
    }, positionError => {
        console.error(positionError);
        alert(positionError.code + positionError.message);
    });
});

document.getElementById("btn-save-map").addEventListener("click", function(event) {

    leafletImage(map, function(err, canvas) {
        if(err) {
            console.error("Nie udalo sie pobrac mapy:", err);
            alert("Blad eksportowania mapy.");
            return;
            // kaplica oguem
        }

        alert("Eksport zakonczony sukcesem (de iure).");
        const pieces = [];
        const pieceWidth = Math.floor(canvas.width / 4);
        const pieceHeight = Math.floor(canvas.height / 4);

        for(let row = 0; row < 4; row++) {
            for(let col = 0; col < 4; col++) {
                const piece = document.createElement("canvas");

                piece.width = pieceWidth;
                piece.height = pieceHeight;

                const ctx = piece.getContext("2d");

                ctx.drawImage(
                    canvas,
                    col * pieceWidth,
                    row * pieceHeight,
                    pieceWidth,
                    pieceHeight,
                    0,
                    0,
                    pieceWidth,
                    pieceHeight
                );

                pieces.push({
                    canvas: piece,
                    correctIndex: row * 4 + col
                });
            }
        }

        pieces.sort(() => Math.random() - 0.5);

        const randomArea = document.getElementById("random");
        randomArea.innerHTML = "";

        pieces.forEach((piece, index) => {
            const puzzle = document.createElement("canvas");

            puzzle.width = pieceWidth;
            puzzle.height = pieceHeight;

            puzzle.classList.add("puzzle-piece");
            puzzle.draggable = true;
            puzzle.dataset.correctIndex = piece.correctIndex;
            puzzle.id = `puzzle-${index}`;

            puzzle.getContext("2d").drawImage(piece.canvas, 0, 0);

            puzzle.addEventListener("dragstart", event => {
                event.dataTransfer.setData("text/plain", puzzle.id);
            });

            randomArea.appendChild(puzzle);
        });
    });
});

function checkPuzzle() {
    const targets = document.querySelectorAll(".drag-target");

    for (const target of targets) {
        const puzzle = target.querySelector(".puzzle-piece");

        if (!puzzle) return;

        if (puzzle.dataset.correctIndex !== target.dataset.index) {
            return;
        }
    }

    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        const notification = new Notification("Gratulacje uzytkowniku!");
        // …
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
            const notification = new Notification("Gratulacje uzytkowniku!");
            // …
        }
        });
    }
}

var map = L.map('map').setView([53.430127, 14.564802], 3);

// openstreetmapsy - one sa nudne i zgermanizowane
// L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);

// zdjecia satelitarne - imo fancy
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
    {
	    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        crossOrigin: true
    }
).addTo(map);

let targets = document.querySelectorAll(".drag-target");
targets.forEach((target, index) => {
    target.dataset.index = index;

    target.addEventListener("dragenter", function (event) {
        this.style.border = "2px solid #040505";
    });

    target.addEventListener("dragleave", function (event) {
        this.style.border = "1px solid #e6f1fc";
    });

    target.addEventListener("dragover", function (event) {
        event.preventDefault();
    });

    target.addEventListener("drop", function (event) {
        event.preventDefault();

        let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
        this.appendChild(myElement)
        this.style.border = "1px solid #e6f1fc";
        checkPuzzle();
    },);
});