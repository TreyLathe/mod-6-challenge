//variables needed for functions
let apiKey = '8c92ac2f6bf9c17163d39d5544b8a5f9';
let searchForm = $('#searchForm');
let cityInput = $('#cityInput');
let cityList = $('#cityList');
let currentWeatherSection = $('#currentWeather');
let fiveDayForecastSection = $('#fiveDayForecast');
let dateTime = $('#dateTime');

//load document before code is executed
$(document).ready(function() {
  //gets day from day.js and formats (from previous mod 5 challenge)
  function dateTimeUpdate() {
    let rightNow = dayjs().format("dddd, MMMM DD YYYY");
    dateTime.text(rightNow);
  }
  //updates timer
  setInterval(dateTimeUpdate, 1000);

  // Event handler for the form submission
  searchForm.submit(function(event) {
      // Prevent the default form submission behavior, which would reload the page
      event.preventDefault();
      
      // Get the trimmed value of the city input
      let cityName = cityInput.val().trim();
    
      // Check if a valid city name is provided
      if (cityName) {

        // console.log('Form submitted with city:', cityName);
          // Call the function to fetch weather data for the specified city
          getWeatherData(cityName);

          // Clear the input field after submission
          cityInput.val('');
      }
  });

  //function pull data from openweathermap API
  function getWeatherData(cityName) {
    //variable for API for gecoding API need to convert city names to long/lat coordinates
    let geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    //getting data
    $.getJSON(geocodingUrl)
        .done(geocodingData => {
            if (geocodingData.length === 0) {
                // Handle case where geocoding data is not found
                console.error('Geocoding data not found');
                return;
            }
            //variables for obtaining lat/long from gecoding API and creating an API call
            let { lat, lon } = geocodingData[0];
            let weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
            //checking the data
            console.log('Weather API URL:', weatherApiUrl);
            //obtaining API data
            $.getJSON(weatherApiUrl)
                .done(data => {
                    console.log('Received Weather Data:', data);
                    updateCurrentWeatherUI(data);
                    updateFiveDayForecastUI(data);
                    addToCityList(cityName);
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
  
  //updates the UI to include current weather information
  function updateCurrentWeatherUI(data) {
    //variables for data from API
    let city = data.city.name;
    let temperatureCurrent = data.list[0].main.temp;
    let roundedTemperatureCurrent = Math.round(temperatureCurrent); // rounding to nearest whole number 
    let humidity = data.list[0].main.humidity;
    let skyIcon = data.list[0].weather[0].icon;
    let skyView = data.list[0].weather[0].main;
    let feelsLike = data.list[0].main.feels_like;
    let roundedFeelsLike = Math.round(feelsLike);
    let windSpeed = data.list[0].wind.speed;
    let roundWindSpeed = Math.round(windSpeed);
  
    //variables to pull IDs from HTML
    let cityElement = $('#currentCity');
    let temperatureElement = $('#currentTemperature');
    let humidityElement = $('#currentHumidity');
    let skyIconElement = $('#skyIcon');
    let skyViewElement = $('#skyView');
    let feelsLikeElement = $('#feelsLike');
    let windSpeedElement = $('#windSpeed');

    //Adding text to current weather block with variables above
    skyIconElement.html(`<img src="https://openweathermap.org/img/wn/${skyIcon}.png" width=80px height=80px>`);
    cityElement.text(`${city}`);
    skyViewElement.text(`Today's sky: ${skyView}.`);
    temperatureElement.text(`Currently with a temperature of ${roundedTemperatureCurrent}°F`,);
    humidityElement.text(` humidity at ${humidity}%,`);
    windSpeedElement.text(` and a wind speed of ${roundWindSpeed} mph. `);
    feelsLikeElement.text(`It feels like ${roundedFeelsLike}'F `)
  }

  //function that will update the information for 5 day forecast
  function updateFiveDayForecastUI(data) {
    let forecastList = data.list;
    let fiveDayForecastSection = document.getElementById('fiveDayForecast');//get section for fiveday forecast
    fiveDayForecastSection.innerHTML = '';

    //for loop to iterate for weather information for each day
    for (let i = 0; i < 40; i += 8) {
      let forecast = forecastList[i];
      let date = dayjs.unix(forecast.dt).format('ddd M/D');
      let temperatureMax = forecast.main.temp_max
      let roundedTempMax = Math.round(temperatureMax);//rounding temperature to nearest whole number 
      let humidity = forecast.main.humidity;
      let cloudCover = forecast.weather[0].main;
      let cloudIcon = forecast.weather[0].icon;
      let highWindSpeed = forecast.wind.speed;
      let roundHighWindSpeed = Math.round(highWindSpeed);
      //create div for forecast
      let dayElement = document.createElement('div');
      dayElement.classList.add('forecast-day');
 
      //create cards for forecasts days and information
      dayElement.innerHTML = `
          <ul class="list-group list-group-flush">
          <li class="list-group-item bg-primary text-warning fw-bold"><img src="https://openweathermap.org/img/wn/${cloudIcon}.png" alt="Weather Icon"></br> ${date}</li>
          <li class="list-group-item bg-warning text-primary fw-bold">${cloudCover} <br>high ${roundedTempMax}°F<br>humidity ${humidity}%<br>wind speed ${roundHighWindSpeed}mph</li>`;
      fiveDayForecastSection.appendChild(dayElement);
    }
  }

  //function to create a list of searched cities to save search history
  function addToCityList(cityName) {
    // Check if city is already in the list to avoid duplicates
    if (cityList.find("button").filter(function() { return $(this).text() === cityName; }).length === 0) {
      //create buttons for searched cities so can revisit search easily
      let cityButton = $('<button>')
          .addClass('list-group-item list-group-item-action')
          .text(cityName)
          .click(function() {
              getWeatherData(cityName);
          });
      //remove buttons for searched cities
      let removeButton = $('<button>')
          .addClass('btn btn-danger btn-sm')
          .html('&times;')
          removeButton.click(function() {
            removeFromCityList(cityName);
          });
      //add list item with class, append the city button and the remove button
      let listItem = $('<li>').addClass('list-group-item d-flex justify-content-between ');
      listItem.append(cityButton).append(removeButton);
      cityList.append(listItem);
      saveCityListToLocalStorage(); //save to local storage
    }
  }

  //function to remove city from saved list
  function removeFromCityList(cityName) {
    // Remove city from the list
    $("#cityList button").filter(function() { return $(this).text() === cityName; }).parent().remove();
    // Save updated list to local storage
    saveCityListToLocalStorage();
  }
  //function to save city to local storage
  function saveCityListToLocalStorage() {
    let cities = [];
    $("#cityList button").each(function() {
      cities.push($(this).text());
    });
  localStorage.setItem("cityList", JSON.stringify(cities));
  }
  //function to pull previous city list from local storage
  function loadCityListFromLocalStorage() {
    let cities = JSON.parse(localStorage.getItem("cityList"));
    if (cities) {
      cities.forEach(cityName => {
          addToCityList(cityName);
      });
    }
  }

  // Load city list from local storage on page load
  loadCityListFromLocalStorage();
});

