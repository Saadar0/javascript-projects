document.getElementById("search-button").addEventListener("click", function () {
    const searchInput = document.getElementById("search-input");
    const city = searchInput.value.trim();

    if (city) {
        fetchWeather(city);
        searchInput.value = ""; 
    }
});

function detectLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeather(`${lat},${lon}`); 
            },
            error => {
                console.warn("Geolocation denied or not available. Using default city.");
                fetchWeather("Casablanca"); 
            }
        );
    } else {
        console.warn("Geolocation not supported. Using default city.");
        fetchWeather("Casablanca");
    }
}

function fetchWeather(location) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=c481d3f08cbd425a97b21120252301&q=${location}&days=1`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            displayNext6Hours(data);
            console.log(data);
        })
        .catch(error => {
            document.getElementById("infos").innerText = error.message;
        });
}

function displayWeather(data) {
    const tempElement = document.getElementById("temp");
    const tempValue = Math.floor(data.current.temp_c);

    tempElement.style.color =
        tempValue >= 30 ? "#ff3939" :
        tempValue >= 15 ? "#f18969" : "#0648c4";

    document.getElementById("location").innerText = `${data.location.name}, ${data.location.country}`;
    document.getElementById("coord").innerText = `lat: ${data.location.lat.toFixed(2)}, lon: ${data.location.lon.toFixed(2)}`;
    document.getElementById("temp").innerText = `${tempValue}°C`;
    document.getElementById("description").innerText = data.current.condition.text;
    document.getElementById("chance_rain").innerText = `Chance of rain: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;
    document.getElementById("feels_like").innerText = `Feels like: ${data.current.feelslike_c}°C`;
    document.getElementById("Humidity").innerText = `Humidity: ${data.current.humidity}%`;
    document.getElementById("Uv_index").innerText = `UV Index: ${data.current.uv}`;
    document.getElementById("dewpoint").innerText = `Dew point: ${data.current.dewpoint_c}°C`;
    document.getElementById("wind").innerText = `Wind speed: ${data.current.wind_kph} km/h`;
    document.getElementById("pressure").innerText = `Pressure: ${data.current.pressure_mb} mbar`;

    const iconod = weathericon(data);
    document.getElementById("iconW").setAttribute("src", `icons/${iconod}.png`);
}

function displayNext6Hours(data) {
    const now = new Date();
    const upcomingHours = data.forecast.forecastday[0].hour.filter(hour => new Date(hour.time) > now).slice(0, 6);

    document.getElementById("forecast_output").innerHTML = `<p id="title">The next 6 hours</p>`;
    upcomingHours.forEach(hour => {
        const iconId = weathericon({ current: hour });
        document.getElementById("forecast_output").innerHTML += `
            <div id="output">
                <p id="time">${hour.time.split(" ")[1]}</p>
                <img id="icon" src="icons/${iconId}.png"/>
                <p id="day">${hour.condition.text}</p>
                <p id="temp-for">${Math.floor(hour.temp_c)}°C</p>
            </div>`;
    });
}

function weathericon(data) {
    const code = data.current.condition.code;
    const is_day = data.current.is_day;

    switch (true) {
        case code === 1000 && is_day === 1:
            return "sun";
        case code === 1000 && is_day === 0:
            return "moon";
        case (code === 1003 || code === 1009 || code === 1240) && is_day === 1:
            return "few_clouds_day";
        case (code === 1003 || code === 1009 || code === 1240) && is_day === 0:
            return "few_clouds_night";
        case code === 1006:
            return "clouds";
        case code === 1030:
            return "mist";
        case (code === 1063 || code == 1153) && is_day === 1:
            return "day_rain";
        case (code === 1063 || code == 1153) && is_day === 0:
            return "night_rain";
        case code === 1183 || code === 1195 || code === 1189 : 
            return "rain";
        case code === 1210:
            return "snow";
        case code === 1273:
            return "thunder_storm";
        default:
            return "unknown";
    }
}

detectLocation();
