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
    data.dailyTemp = [], data.dailyWeather = [], data.dailyLow = [], data.dailyHigh = [], data.hourlyTime = [], data.hourlyTemp = [];
    // today
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + location + '&appid=0c1ce888b5b00b8dcae362794387f5bd', {mode: 'cors'})
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // console.log(response);
            data.feelsLike = convertTemp(response['main']['feels_like']);
            data.humidity = response['main']['humidity'] + '%';
            data.pressure = response['main']['pressure'] + ' hpa';
            data.windSpeed = response['wind']['speed'] + ' m/s';
            data.sunRise = response['sys']['sunrise'];
            data.sunSet = response['sys']['sunset'];
            console.log(data);
        })
        .catch((error) => {
            console.error('Error: Unable to fetch current weather.', error);
        });

        // forecast
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + location + '&appid=0c1ce888b5b00b8dcae362794387f5bd', {mode: 'cors'})
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // hourly
            console.log(response);
            for (let i = 0; i < 10; i++)
            {
                data.hourlyTime[i] = (response['list'][i]['dt_txt']).substring(
                    (response['list'][i]['dt_txt']).indexOf(' '), 
                    ((response['list'][i]['dt_txt']).indexOf(' ') + 6));
                data.hourlyTemp[i] = convertTemp(response['list'][i]['main']['temp']);
            }
            // daily
            let minTemp = 100000;
            let maxTemp = 0;
            let tempSum = 0;
            let itemsPerDay = 0;
            let weather = [];
            let date = response['list'][0]['dt_txt'].slice(0, 10);
            let day = 0;
            for (let i = 0; i < response['list'].length; i++)
            {
                if (response['list'][i]['dt_txt'].slice(0, 10) != date)
                {
                    console.log("Successful day end: " + date);
                    data.dailyTemp[day] = convertTemp(tempSum / itemsPerDay);
                    data.dailyLow[day] = convertTemp(minTemp);
                    data.dailyHigh[day] = convertTemp(maxTemp);
                    data.dailyWeather[day] = weather.sort((a, b) => weather.filter(v => v===a).length - weather.filter(v => v===b).length).pop();
                    date = response['list'][i]['dt_txt'].slice(0, 10);
                    day++;
                    minTemp = 100000, maxTemp = 0, tempSum = 0, itemsPerDay = 0, weather = [];
                }
                if (minTemp > response['list'][i]['main']['temp_min'])
                {
                    minTemp = response['list'][i]['main']['temp_min'];
                }
                if (maxTemp < response['list'][i]['main']['temp_max'])
                {
                    maxTemp = response['list'][i]['main']['temp_max'];
                }
                weather[itemsPerDay] = response['list'][i]['weather'][0]['main'];
                itemsPerDay++;
                tempSum += response['list'][i]['main']['temp'];
            }
            console.log(data);
        })
        .catch((error) => {
            console.error('Error: Unable to fetch weather forecast.', error);
        });
        updateDOM(data);
}

function setDates() {
    const week = [ ];
    for (let i = 0; i < 7; i++)
    {
        week[i] = new Date;
        week[i].setDate(week[i].getDate() + i);
    }
    const weekDOM = document.querySelectorAll('.daily-panel-item-date');
    for (let j = 0; j < 5; j++)
    {
        weekDOM[j].textContent = new Date(week[j].getFullYear(), week[j].getMonth(), week[j].getDate());
        weekDOM[j].textContent = (weekDOM[j].textContent).split([' '], 3)
        weekDOM[j].textContent = weekDOM[j].textContent.replace(',', ' ');
        weekDOM[j].textContent = weekDOM[j].textContent.replace(',', ' ');
    }
}

function convertTemp (value) {
    if (tempUnit === 'F') return Math.round(((((value - 273.15) * 9) / 5) + 32)) + '°F';
    else if (tempUnit === 'C') return Math.round((value - 273.15)) + '°C';
    else return value + '°K';
}

function updateDOM(dataObject) {
    
}

function Data(dailyTemp, dailyWeather, dailyHigh, dailyLow, hourlyTime, hourlyTemp, feelsLike, humidity, pressure, windSpeed, sunRise, sunSet) {
    this.dailyTemp = dailyTemp
    this.dailyWeather = dailyWeather
    this.dailyLow = dailyLow
    this.dailyHigh = dailyHigh
    this.hourlyTime = hourlyTime
    this.hourlyTemp = hourlyTemp
    this.feelsLike = feelsLike
    this.humidity = humidity
    this.pressure = pressure
    this.windSpeed = windSpeed
    this.sunRise = sunRise
    this.sunSet = sunSet
    }