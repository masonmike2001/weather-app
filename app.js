let tempUnit = 'F';
setDates();
fetchData('02556');
const submit = document.querySelector('button');
submit.addEventListener('click', function(e) {
  e.preventDefault();
  tempUnit = document.querySelector('input[name="degrees"]:checked').value;
  const location = document.querySelector('input').value;
  fetchData(location);
});

/**
 * Fetches weather data from OWM API, and saves into data object.
 * @param {string} location The input location given by user (or default value).
**/
async function fetchData(location) {
  const data = new Data();
  data.dailyTemp = [], data.dailyWeather = [], data.dailyLow = [],
  data.dailyHigh = [], data.hourlyTime = [], data.hourlyTemp = [];
  // today
  fetch('https://api.openweathermap.org/data/2.5/weather?q=' + location + '&appid=0c1ce888b5b00b8dcae362794387f5bd', {mode: 'cors'})
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        console.log(location);
        data.feelsLike = convertTemp(response['main']['feels_like']);
        data.humidity = response['main']['humidity'] + '%';
        data.pressure = response['main']['pressure'] + ' hpa';
        data.windSpeed = response['wind']['speed'] + ' m/s';
        data.sunRise = new Date(response['sys']['sunrise']*1000);
        data.sunSet = new Date(response['sys']['sunset']*1000);
        document.querySelector('#location').
            textContent = response['name'] + '?';
        console.log(response);
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
        for (let i = 0; i < 10; i++) {
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
        for (let i = 0; i < response['list'].length; i++) {
          if (response['list'][i]['dt_txt'].slice(0, 10) != date) {
            data.dailyTemp[day] = convertTemp(tempSum / itemsPerDay);
            data.dailyLow[day] = convertTemp(minTemp);
            data.dailyHigh[day] = convertTemp(maxTemp);
            data.dailyWeather[day] = weather.sort((a, b) =>
              weather.filter((v) => v===a).
                  length - weather.filter((v) => v===b).length).pop();
            date = response['list'][i]['dt_txt'].slice(0, 10);
            day++;
            minTemp = 100000, maxTemp = 0, tempSum = 0,
            itemsPerDay = 0, weather = [];
          }
          if (minTemp > response['list'][i]['main']['temp_min']) {
            minTemp = response['list'][i]['main']['temp_min'];
          }
          if (maxTemp < response['list'][i]['main']['temp_max']) {
            maxTemp = response['list'][i]['main']['temp_max'];
          }
          weather[itemsPerDay] = response['list'][i]['weather'][0]['main'];
          itemsPerDay++;
          tempSum += response['list'][i]['main']['temp'];
          updateDOM(data);
          changeBackground(data);
        }
      })
      .catch((error) => {
        console.error('Error: Unable to fetch weather forecast.', error);
      });
}

/**
 * Sets dates for the 5-day forecast.
**/
function setDates() {
  const week = [];
  for (let i = 0; i < 7; i++) {
    week[i] = new Date;
    week[i].setDate(week[i].getDate() + i);
  }
  const weekDOM = document.querySelectorAll('.daily-panel-item-date');
  for (let j = 0; j < 5; j++) {
    weekDOM[j].textContent = new Date(week[j].getFullYear(),
        week[j].getMonth(), week[j].getDate());
    weekDOM[j].textContent = (weekDOM[j].textContent).split([' '], 3);
    weekDOM[j].textContent = weekDOM[j].textContent.replace(',', ' ');
    weekDOM[j].textContent = weekDOM[j].textContent.replace(',', ' ');
  }
}

/**
 * Converts temperature into user's desired unit, defaulting as Fahrenheit.
 * @param {int} value The input location given by user (or default value).
 * @return {string} The converted temperature, with unit appended.
**/
function convertTemp(value) {
  if (tempUnit === 'F') {
    return Math.round(((((value - 273.15) * 9) / 5) + 32)) + '°F';
  } else if (tempUnit === 'C') return Math.round((value - 273.15)) + '°C';
  else return Math.round(value) + '°K';
}

/**
 * Updates DOM of website, inputting the fetched data for current location.
 * @param {Object} data Object with all logged weather data.
**/
function updateDOM(data) {
  // daily
  const weatherDOM = document.querySelectorAll('.daily-panel-item-weather');
  const tempDOM = document.querySelectorAll('.daily-panel-item-temp');
  const hiDOM = document.querySelectorAll('.daily-panel-item-hi');
  const loDOM = document.querySelectorAll('.daily-panel-item-lo');
  for (let i = 0; i < 5; i++) {
    weatherDOM[i].textContent = data.dailyWeather[i];
    tempDOM[i].textContent = data.dailyTemp[i];
    hiDOM[i].textContent = data.dailyHigh[i];
    loDOM[i].textContent = data.dailyLow[i];
  }

  // hourly
  const hTime = document.querySelectorAll('.hourly-panel-item-time');
  const hTemp = document.querySelectorAll('.hourly-panel-item-temp');

  for (let j = 0; j < 10; j++) {
    hTime[j].textContent = data.hourlyTime[j];
    hTemp[j].textContent = data.hourlyTemp[j];
  }

  // info
  document.querySelector('#feels-like-value').textContent = data.feelsLike;
  document.querySelector('#humidity-value').textContent = data.humidity;
  document.querySelector('#pressure-value').textContent = data.pressure;
  document.querySelector('#wind-value').textContent = data.windSpeed;
  document.querySelector('#sunrise-value').textContent = data.sunRise;
  document.querySelector('#sunset-value').textContent = data.sunSet;
  document.querySelector('#sunrise-value').textContent =
  (document.querySelector('#sunrise-value').textContent).substring(16, 25);
  document.querySelector('#sunset-value').textContent =
  (document.querySelector('#sunset-value').textContent).substring(16, 25);
}

/**
 * Changes background video depending on current weather.
 * @param {Object} data Object with all logged weather data.
**/
function changeBackground(data) {
  console.log(data.dailyWeather[0]);
  if (data.dailyWeather[0] === 'Clear') {
    (document.querySelector('source')).
        setAttribute('src', './assets/clear.mp4');
  } else if (data.dailyWeather[0] === 'Clouds') {
    (document.querySelector('source')).
        setAttribute('src', './assets/cloudy.mp4');
  } else if (data.dailyWeather[0] === 'Rain') {
    (document.querySelector('source')).setAttribute('src', './assets/rain.mp4');
  }
  document.querySelector('#myVideo').load();
}

/**
 * Constructor for data object.
 * @param {Array} dailyTemp Array of all averaged temperatures in forecast.
 * @param {Array} dailyWeather Array of each day's most common weather pattern.
 * @param {Array} dailyHigh Array of minimum temperature of each day.
 * @param {Array} dailyLow Array of maximum temperature of each day.
 * @param {Array} hourlyTime Array of the time of each temperature data item.
 * @param {Array} hourlyTemp Array of temperatures for every three hours.
 * @param {string} feelsLike Temperature that factors in wind chill in location.
 * @param {string} humidity Amount of humidity in the location.
 * @param {string} pressure Amount of atmospheric pressure of location.
 * @param {string} windSpeed Wind speed of location.
 * @param {string} sunRise Time of sunrise at location, in 24h format.
 * @param {string} sunSet Time of sunset at location, in 24h format.
**/
function Data(dailyTemp, dailyWeather, dailyHigh, dailyLow, hourlyTime,
    hourlyTemp, feelsLike, humidity, pressure, windSpeed, sunRise, sunSet) {
  this.dailyTemp = dailyTemp;
  this.dailyWeather = dailyWeather;
  this.dailyLow = dailyLow;
  this.dailyHigh = dailyHigh;
  this.hourlyTime = hourlyTime;
  this.hourlyTemp = hourlyTemp;
  this.feelsLike = feelsLike;
  this.humidity = humidity;
  this.pressure = pressure;
  this.windSpeed = windSpeed;
  this.sunRise = sunRise;
  this.sunSet = sunSet;
}
