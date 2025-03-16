document.getElementById("search-button").addEventListener("click", function () {
    const searchInput = document.getElementById("search-input");
    const city = searchInput.value.trim();

    if (city) {
        fetchastro(city);
        searchInput.value = ""; 
    }
});

function detectLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchastro(`${lat},${lon}`); 
            },
            error => {
                console.warn("Geolocation denied or not available. Using default city.");
                fetchastro("Casablanca");
            }
        );
    } else {
        console.warn("Geolocation not supported. Using default city.");
        fetchastro("Casablanca");
    }
}

function fetchastro(location) {
    const url = `https://api.weatherapi.com/v1/astronomy.json?key=c481d3f08cbd425a97b21120252301&q=${location}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            displayastro(data);
            console.log(data)
        })
        .catch(error => {
            document.getElementById("error-message").innerText = error.message;
        });
}

function displayastro(data) {

    document.getElementById("location").innerText = data.location.name + ", " + data.location.country;
    document.getElementById("sunrise_time").innerText =  data.astronomy.astro.sunrise;
    document.getElementById("sunset_time").innerText = data.astronomy.astro.sunset;
    document.getElementById("moonrise_time").innerText = data.astronomy.astro.moonrise;
    document.getElementById("moonset_time").innerText = data.astronomy.astro.moonset;

    const phase_img = document.getElementById("phase_img");
    const phase = moon_phases(data);

    phase_img.setAttribute("src",`moon_phases/${phase}.png`)


}

const astroFacts = [
    "A day on Venus is longer than a year on Venus!",
    "Neutron stars are so dense that a sugar-cube-sized amount would weigh a billion tons!",
    "There’s a planet made of diamonds called 55 Cancri e.",
    "The Sun is 400 times larger than the Moon, but it's also 400 times farther from Earth, making them appear the same size!",
    "Jupiter has 79 known moons.",
    "Saturn's rings are mostly made of water ice, some as large as mountains!",
    "The universe is 13.8 billion years old.",
    "There’s a giant water cloud in space with 140 trillion times the water in Earth's oceans!",
    "A teaspoon of a neutron star would weigh about 6 billion tons!",
    "If two pieces of the same metal touch in space, they will fuse together permanently. This is called cold welding.",
    "One day on Mars is only about 37 minutes longer than a day on Earth.",
    "The largest volcano in the solar system is Olympus Mons on Mars, which is three times taller than Mount Everest!",
    "The Andromeda Galaxy is on a collision course with the Milky Way and will merge with it in about 4.5 billion years.",
    "A black hole's gravity is so strong that nothing, not even light, can escape it once it crosses the event horizon.",
    "There is a massive hexagonal storm on Saturn’s north pole that has existed for decades.",
    "The Moon is slowly drifting away from Earth at a rate of about 3.8 cm per year.",
    "Uranus rotates on its side, meaning it essentially rolls around the Sun!",
    "Voyager 1, launched in 1977, is the farthest human-made object from Earth, currently traveling in interstellar space.",
    "Mercury experiences the most extreme temperature changes in the solar system, from -173°C at night to 427°C during the day.",
    "In space, there is no sound because there is no air to carry sound waves.",
    "The Sun accounts for about 99.8% of the total mass of our solar system!",
    "Pluto has a heart-shaped glacier called Tombaugh Regio.",
    "The Hubble Space Telescope can see galaxies over 13 billion light-years away.",
    "Saturn’s moon Titan has lakes of liquid methane and ethane.",
    "If you could fold a piece of paper 42 times, it would reach the Moon!"
];


function changeFact() {
    const factBox = document.getElementById("astro_fact");
    const randomIndex = Math.floor(Math.random() * astroFacts.length);
    factBox.innerText = astroFacts[randomIndex];
}

function moon_phases(data) {
    const phase = data.astronomy.astro.moon_phase

    switch(true){
        case phase == "New Moon": return "new";
        case phase == "First Quarter": return "first_quarter";
        case phase == "Waxing Crescent": return "Waxing-crescent";
        case phase == "Waxing Gibbous": return "Waxing-gibbous";
        case phase == "Full Moon": return "full";
        case phase == "Last Quarter": return "third_quarter";
        case phase == "Waning Crescent": return "Waning-crescent";
        case phase == "Waning Gibbous": return "Waning-gibbous";
        default: return "unknown"; 
    }
}

setInterval(changeFact, 5000);
changeFact();

detectLocation();
