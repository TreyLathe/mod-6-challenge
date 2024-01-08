//variables needed possibly for functions
let apiKey = '8c92ac2f6bf9c17163d39d5544b8a5f9';
let searchForm = $('#searchForm');
let cityInput = $('#cityInput');
let cityList = $('#cityList');
let currentWeatherSection = $('#currentWeather');
let fiveDayForecastSection = $('#fiveDayForecast');
let dateTime = $('#dateTime');


$(document).ready(function() {
//gets day from day.js and formats (from previous mod 5 challenge)
function dateTimeUpdate() {
  let rightNow = dayjs().format("dddd, MMMM DD YYYY");
  dateTime.text(rightNow);
}

//updates timer
setInterval(dateTimeUpdate, 1000);

  // Event handler for the form submission
  $('#searchForm').submit(function(event) {
      // Prevent the default form submission behavior, which would reload the page
      event.preventDefault();
      
      // Get the trimmed value of the city input
      let cityName = $('#cityInput').val().trim();
    
      // Check if a valid city name is provided
      if (cityName) {

        console.log('Form submitted with city:', cityName);
          // Call the function to fetch weather data for the specified city
          getWeatherData(cityName);

          // Clear the input field after submission
          $('#cityInput').val('');
      }
  });

  function getWeatherData(cityName) {
    let geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    $.getJSON(geocodingUrl)
        .done(geocodingData => {
            if (geocodingData.length === 0) {
                // Handle case where geocoding data is not found
                console.error('Geocoding data not found');
                return;
            }

            let { lat, lon } = geocodingData[0];
            let weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

            console.log('Weather API URL:', weatherApiUrl);

            $.getJSON(weatherApiUrl)
                .done(data => {
                    console.log('Received Weather Data:', data);
                    updateCurrentWeatherUI(data);
                    updateFiveDayForecastUI(data);
                })
                .fail(() => {
                    // Handle case where there is an error fetching weather data
                    console.error('Error fetching weather data');
                });
        })
        .fail(() => {
            // Handle case where there is an error fetching geocoding data
            console.error('Error fetching geocoding data');
        });
}

function updateCurrentWeatherUI(data) {
  let city = data.city.name;
  let temperatureKelvin = data.list[0].main.temp;
  let temperatureCelsius = temperatureKelvin - 273.15;
  let roundedTemperatureCelsius = Math.round(temperatureCelsius); 
  let humidity = data.list[0].main.humidity;
  let skyIcon = data.list[0].weather[0].icon;
  let skyView = data.list[0].weather[0].description;
  

  let cityElement = $('#currentCity');
  let temperatureElement = $('#currentTemperature');
  let humidityElement = $('#currentHumidity');
  let skyIconElement = $('#skyIcon');
  let skyViewElement = $('#skyView');

  skyIconElement.html(`<img src="https://openweathermap.org/img/wn/${skyIcon}.png" width=80px height=80px>`);
  cityElement.text(`${city}`);
  skyViewElement.text(`Today's weather will include ${skyView}.`);
  temperatureElement.text(`With a temperature of ${roundedTemperatureCelsius}°C`);
  humidityElement.text(`and humidity at ${humidity}%`);
 }


function updateFiveDayForecastUI(data) {
  let forecastList = data.list;
  let fiveDayForecastSection = document.getElementById('fiveDayForecast');
  fiveDayForecastSection.innerHTML = '';

  for (let i = 0; i < 40; i += 8) {
      let forecast = forecastList[i];
      let date = dayjs.unix(forecast.dt).format('ddd, M/D');
      let temperatureKelvin = forecast.main.temp;
      let temperatureCelsius = temperatureKelvin - 273.15;
      let roundedTempCelsius = Math.round(temperatureCelsius);
      let humidity = forecast.main.humidity;
      let cloudCover = forecast.clouds.all;
      let cloudIcon = forecast.weather.icon;//this isn't it.

      let dayElement = document.createElement('div');
      dayElement.classList.add('forecast-day');

   //create cards for forecasts days and information
      dayElement.innerHTML = `
          <ul class="list-group list-group-flush">
          <li class="list-group-item bg-primary text-warning fw-bold"><img src="https://openweathermap.org/img/wn/${cloudIcon}.png alt="Weather Icon"> ${date}</li>
          <li class="list-group-item bg-warning text-primary fw-bold">Temp: ${roundedTempCelsius}°C</li>
          <li class="list-group-item bg-warning text-primary fw-bold">Humidity: ${humidity}%</li>
          <li class="list-group-item bg-warning text-primary fw-bold">Clouds: ${cloudCover}%</li>
      `;
      console.log(`Kelvin: ${temperatureKelvin}, Celsius: ${temperatureCelsius}, Rounded: ${roundedTempCelsius}`);
      fiveDayForecastSection.appendChild(dayElement);
  }
}
 


});
