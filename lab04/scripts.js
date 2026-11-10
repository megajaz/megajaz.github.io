console.debug("Hello world!");

const APItoken = '968c10a632bcf20ba6fe31ed0d5ce2b8';

function reqListener() {
  console.log(this.responseText);
}

let weatherCurrent;

document.getElementById("btnGetWheather").addEventListener("click", function(event) {
    const cityName = document.getElementById("inputCityName").value;
    if(cityName.length == 0) {
        // uzyszkodnik nie podal nazwy miejscowosci w oknie desygnowanym do tego
        document.getElementById("city-err").innerHTML = "Podaj nazwe miejscowosci!";
    }
    else {
        // uzyszkodnik ulegl i podal miast
        document.getElementById("city-err").innerHTML = "";
        const cityName = document.getElementById("inputCityName").value;
        console.log(`Pobieranie info dla miasta ${cityName}`);
        
        
        // dzwonimy do api dla pogody teraz
        var lat, lon;
        const req = new XMLHttpRequest();
        req.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APItoken}&lang=pl`);
        req.addEventListener("load", function(event) {
            if(req.status == 200) {
                weatherCurrent = JSON.parse(req.responseText);
                console.log(weatherCurrent);
                
                document.querySelector(".current").innerHTML = `
                <h3>Pogoda ${cityName}</h3>
                <p>${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}; ${new Date().getHours()}:${(new Date().getMinutes()) < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()}</p>
                <p>Temperatura: ${Math.round(weatherCurrent.main.temp - 273)} &deg;C</p>
                <p>odczuwalna: ${Math.round(weatherCurrent.main.feels_like - 273)} &deg;C</p>
                <img src= https://openweathermap.org/payload/api/media/file/${weatherCurrent.weather[0].icon}.png>
                <p>${weatherCurrent.weather[0].description}</p>
                <p>Cisnienie: ${weatherCurrent.main.pressure} hPa</p>
                `;

                lat = weatherCurrent.coord.lat;
                lon = weatherCurrent.coord.lon;

                // dzwonimy do api dla pogody w przyszlosci (fetch)
                fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APItoken}&lang=pl`)
                .then((response) => {
                    // console.log(response);
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    // i tu wypisujemy pogode
                    document.querySelector(".forecast").innerHTML = "<h3>Prognoza na najbliższe godziny</h3>";
                    for(let i = 0; i < data.list.length; i++) {
                        
                        const div = document.createElement("div");
                        div.innerHTML = `
                        <p>${data.list[i].dt_txt}</p>
                        <p>Temperatura: ${Math.round(data.list[i].main.temp - 273)} &deg;C</p>
                        <p>Odczuwalna: ${Math.round(data.list[i].main.feels_like - 273)}</p>
                        <img src= https://openweathermap.org/payload/api/media/file/${data.list[i].weather[0].icon}.png>
                        <p>${data.list[i].weather[0].description}</p>
                        `
                        document.querySelector(".forecast").appendChild(div);
                    }
                });
            }
            else if(req.status == 404) {
                document.getElementById("city-err").innerHTML = "Miasto nie istnieje!";
            }
        });
        req.send();
    }
});