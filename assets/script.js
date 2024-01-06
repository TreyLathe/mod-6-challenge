let dateTime = document.getElementById("dateTime");

function dateTimeUpdate() {
  let rightNow = dayjs().format("dddd, MMMM DD YYYY");
  dateTime.textContent = rightNow;
}


setInterval(dateTimeUpdate, 1000) ;


let apiKey = '8c92ac2f6bf9c17163d39d5544b8a5f9';
let searchForm = document.getElementById('searchForm');
let cityInput = document.getElementById('cityInput');
let cityList = document.getElementById('cityList');
let currentWeatherSection = document.getElementById('currentWeather');
let fiveDayForecastSection = document.getElementById('fiveDayForecast');


