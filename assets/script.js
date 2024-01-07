//variables needed possibly for functions
let apiKey = '8c92ac2f6bf9c17163d39d5544b8a5f9';
let searchForm = $('#searchForm');
let cityInput = $('#cityInput');
let cityList = $('#cityList');
let currentWeatherSection = $('#currentWeather');
let fiveDayForecastSection = $('#fiveDayForecast');
let dateTime = $('#dateTime');

//gets day from day.js and formats (from previous mod 5 challenge)
function dateTimeUpdate() {
  let rightNow = dayjs().format("dddd, MMMM DD YYYY");
  dateTime.textContent = rightNow;
}

//updates timer
setInterval(dateTimeUpdate, 1000) ;


$(document).ready(function() {
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

            const { lat, lon } = geocodingData[0];
            const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

            console.log('Weather API URL:', weatherApiUrl);

            $.getJSON(weatherApiUrl)
                .done(data => {
                    console.log('Received Weather Data:', data);
                    updateCurrentWeatherUI(data);
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
  let humidity = data.list[0].main.humidity;

  let cityElement = $('#currentCity');
  let temperatureElement = $('#currentTemperature');
  let humidityElement = $('#currentHumidity');

  cityElement.text(`City: ${city}`);
  temperatureElement.text(`Temperature: ${temperatureCelsius.toFixed(2)}°C`);
   humidityElement.text(`Humidity: ${humidity}%`);
 }





});
