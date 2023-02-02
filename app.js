// include a live background that changes depending on the weather
let tempUnit = 'F';
fetchData('London');
setDates();
const submit = document.querySelector('button');
submit.addEventListener('click', function(e) {
    e.preventDefault();
    const location = document.getElementById('location-input').value;
    tempUnit = document.querySelector('input[name="degrees"]:checked').value;
    fetchData(location);
});

function fetchData (location) {
    const data = new Data();
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + location + '&appid=0c1ce888b5b00b8dcae362794387f5bd', {mode: 'cors'})
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // info box data
            console.log(response);
            data.feelsLike = convertTemp(response['main']['feels_like']);
            data.humidity = response['main']['humidity'] + '%';
            data.pressure = response['main']['pressure'] + ' hpa';
            data.windSpeed = response['wind']['speed'] + ' m/s';
            data.sunRise = response['sys']['sunrise'];
            data.sunSet = response['sys']['sunset'];
            console.log(data);
        })
        .catch((error) => {
            console.error('Error: Unable to fetch weather.', error);
        });

}

function setDates() {
    const week = [ ];
    for (let i = 0; i < 7; i++)
    {
        week[i] = new Date;
        week[i].setDate(week[i].getDate() + i);
    }
    const weekDOM = document.querySelectorAll('.daily-panel-item-date');
    for (let j = 0; j < 7; j++)
    {
        weekDOM[j].textContent = new Date(week[j].getFullYear(), week[j].getMonth(), week[j].getDate());
        weekDOM[j].textContent = (weekDOM[j].textContent).split([' '], 3)
        weekDOM[j].textContent = weekDOM[j].textContent.replace(',', ' ');
        weekDOM[j].textContent = weekDOM[j].textContent.replace(',', ' ');
    }
    console.log(weekDOM);
}

function convertTemp (value) {
    if (tempUnit === 'F')
    {
        return Math.round(((((value - 273.15) * 9) / 5) + 32)) + '°F';
    }
    else if (tempUnit === 'C')
    {
        return Math.round((value - 273.15)) + '°C';
    }
    else
    {
        return value + '°K';
    }
}


function Data(dailyTemp, dailyWeather, dailyHigh, dailyLow, hourly, feelsLike, humidity, pressure, windSpeed, sunRise, sunSet) {
    this.dailyTemp = dailyTemp
    this.dailyWeather = dailyWeather
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

