//API Key from Open Weather API
var APIkey = "cf589712e83c2302d49522e11784d1ab";

//global variables for Today Card
var City = "";
var todayDate = "";
var todayIconCode = "";
var todayIconUrl = "";
var todayTemp = "";
var todayWind = "";
var todayHumidity = "";
var UVindex = "";

//global variables for forecast Cards
var forecastDate = "";
var forecastTemp = "";
var forecastWind = "";
var forecastHumidity = "";
var forecasticoncode = "";
var forecasticonurl = "";

//global variables
var latitude = "";
var longitude = "";
var searchedCities = [];

//Pull city search history from local storage
var localStorageCities = JSON.parse(localStorage.getItem("city-search-history"));
if (localStorageCities !== null) {
    localStorageCities.forEach(function(City) {City.toUpperCase();});
    searchedCities = localStorageCities;  
}

//Identify current searched city from array and run search function
$(document).ready(function(){
    showCityList(searchedCities);
    if (localStorageCities !== null) {
      var currentCity = searchedCities[0];
      searchCity(currentCity);
    }
});

//Function response to Search Button click
$("#search-button").on("click", function() {
    event.preventDefault();
    clearDisplay();
    //get User Input city name and search
    var cityName = $("input").val().toUpperCase().trim();
    console.log("City Searched: ",cityName);
    $("#city-input").val("");
    searchCity(cityName);
    
    //build searchedCities array
    if (cityName !== "" && searchedCities[0] !== cityName) {
      searchedCities.unshift(cityName);
      localStorage.setItem("city-search-history", JSON.stringify(searchedCities));
      //if searchedCities array has content display info
      if (searchedCities.length === 1) {
        $("#city-list").removeClass("hide");
      }
      //display list of searched cities
      $("#city-list").prepend(`<a href="#" class="list-group-item btn-block" style="text-decoration: none; color: black; background-color: #b7b7b7; border: none; text-align: center;">
      ${cityName}</a>`);
    }
});

//Function response to clicking previously searched City Name
$(document).on("click", ".list-group-item", function() {
    var cityName = $(this).text();
    clearDisplay();
    searchCity(cityName);
});

//function to Clear Active Display and global variables
function clearDisplay () {
    //Clear active display
    $("#current-weather").empty();
    $("#card-deck-title").remove();
    $(".card-deck").empty();
    //Reset global variables
    City = "";
    todayDate = "";
    todayIconCode = "";
    todayIconUrl = "";
    todayTemp = "";
    todayWind = "";
    todayHumidity = "";
    UVindex = "";
    forecastDate = "";
    forecastTemp = "";
    forecastWind = "";
    forecastHumidity = "";
    forecasticoncode = "";
    forecasticonurl = "";
    latitude = "";
    longitude = "";
}

function displayTodayWeather() {
    //Set card format
    var todayCard = $("<div class='container border border-dark bg-transparent'>");
    //define each line for card as a string
    var todayHeader = $("<h4>").text(City + " " + todayDate.toString());
    var weatherIcon = $("<img>").attr('src', todayIconUrl);

    var temperatureEl = $("<p>").text("Temp " + tempF+ " ºF");
    var windSpeedEl = $("<p>").text("Wind Speed: " + windSpeed + " MPH");
    var humidityEl = $("<p>").text("Humidity: " + humidityValue + "%");
    var uvIndexEl = $("<p>").text("UV Index: ");
    // var uvIndexValueEl = $("<span>").text(uvIndexValue).css("background-color", getColorCodeForUVIndex(uvIndexValue)).addClass("text-white");
    var uvIndexValueEl = $("<span>").text(uvIndexValue).css("background-color", getColorCodeForUVIndex(uvIndexValue)); 
    
    todayHeader.append(weatherIcon);
    uvIndexEl.append(uvIndexValueEl);
    todayCard.append(todayHeader);
    todayCard.append(temperatureEl);
    todayCard.append(humidityEl);
    todayCard.append(windSpeedEl);
    todayCard.append(uvIndexEl);
    $("#current-weather").append(todayCard);
  }

//Function to search info for a city
function searchCity(cityName){
    //For Testing:
        //console.log("searchCity: " , cityName);
    //Define API url to locate info
    var APIurl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    //Perform an asynchronous HTTP (ajax) request to the OpenWeatherAPI
    $.ajax({
        url: APIurl, 
        method: "GET"
    })

    //Take data from ajax request and store in "response" object
    .then(function(response) {
        var APIdata = response;
        //For Testing:
            //console.log(APIdata);
        //Isolate data from API response using JSON
            //Get City name
            City = APIdata.name.trim();
            //Get Latitude & Longitude to switch to One Call API 
            latitude = APIdata.coord.lat;
            longitude = APIdata.coord.lon;
        //Define One Call URL using lat and long
        var OneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&appid=" + APIkey;
        //Perform an asynchronous HTTP (ajax) request for One Call API
        $.ajax({
            url: OneCallURL,
            method: "GET"
        })  

        //Take data from One Call ajax request and store in "response" object  
        .then(function(response) {
            var OneCallData = response;
            //Isolate today's data from "current" section of One Call API response
                //Get today's date using moment.js and convert to string format
                todayDate = moment.unix(OneCallData.current.dt).format("l");
                //For Testing:    
                    //console.log(todayDate);
                //Get temperature (in Kelvin)
                var todayTempKelvin = OneCallData.current.temp;
                // Convert today's temperature from Kelvin to Fahrenheit (rounded to one decimal point)
                todayTemp = ((todayTempKelvin - 273.15) * 1.80 + 32).toFixed(1);
                //Get Wind Speed
                todayWind = OneCallData.current.wind_speed;
                //Get humidity
                todayHumidity = OneCallData.current.humidity;
                //Get UV Index
                uvIndexValue = OneCallData.current.uvi;
                //Get Weather Icon from API code and image url
                todayIconCode = OneCallData.current.weather.icon;
                todayIconUrl = "http://openweathermap.org/img/wn/" + todayIconCode + "@2x.png";
                //All today's weather info is identified so call the display function
            displayTodayWeather();
            //Isolate forecast data from "daily" section of One Call API response
            addCardDeckHeader();
            for (var i=0; i < 5; i++) {
                forecastDate = moment.unix(OneCallData.daily[i].dt).format('l');
                var forecastTempKelvin = OneCallData.daily[i].temp.day;
                forecastTemp =  ((forecastTempKelvin - 273.15) * 1.80 + 32).toFixed(1);
                forecastWind = OneCallData.daily[i].wind_speed;
                forecastHumidity = OneCallData.daily[i].humidity;
                forecasticoncode = OneCallData.daily[i].weather[0].icon;
                forecasticonurl = "http://openweathermap.org/img/wn/" + forecasticoncode + "@2x.png";
                displayDayForeCast()
            } 
        });
    });
}

