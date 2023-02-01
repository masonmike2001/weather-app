// include a live background that changes depending on the weather

console.log(fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=0c1ce888b5b00b8dcae362794387f5bd'));
fetchData(location);
const submit = document.querySelector('button');
submit.addEventListener('click', function(e) {
    e.preventDefault();
    const location = document.getElementById('location-input').value;
    fetchData(getCoordinates(location));

});

async function fetchData (coordinates) {
    const data = new Data();
    data.dailyHigh
}

async function getCoordinates (input) {
    const coordinates = [2];
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + input + '&appid=0c1ce888b5b00b8dcae362794387f5bd', {mode: 'cors'})
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            coordinates[0] = response[0].lat;
            coordinates[1] = response[0].lon;
            return coordinates;
        })
        .catch((error) => {
            console.error('Error: Unable to fetch coordinates.', error);
        });


    /*
    const latitude = fetch(('https://api.openweathermap.org/geo/1.0/direct?q=' + input + '&appid=0c1ce888b5b00b8dcae362794387f5bd').0.lat);
    const latitude = fetch(('https://api.openweathermap.org/geo/1.0/direct?q=' + input + '&appid=0c1ce888b5b00b8dcae362794387f5bd').0.lon);
    if (weather)
    {
        console.log([weather.lat, weather.lon]);
        return [weather.lat, weather.lon];
    }
    */

}

function Data(dailyTemp, dailyHigh, dailyLow, hourly, feelsLike, humidity, pressure, windSpeed, sunRise, sunSet) {
    this.dailyTemp = dailyTemp
    this.dailyLow = dailyLow
    this.dailyHigh = dailyHigh
    this.hourly = hourly
    this.feelsLike = feelsLike
    this.humidity = humidity
    this.pressure = pressure
    this.windSpeed = windSpeed
    this.sunRise = sunRise
    this.sunSet = sunSet
    }

