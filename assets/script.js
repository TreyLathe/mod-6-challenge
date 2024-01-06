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




});
