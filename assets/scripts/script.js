//API Key from Open Weather API
var APIKey = "cf589712e83c2302d49522e11784d1ab";

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



//Identify current searched city from array and run search function
$(document).ready(function(){
    //Pull city search history from local storage
    var localStorageCities = JSON.parse(localStorage.getItem("city-search-history"));
    if (localStorageCities !== null) {
        localStorageCities.forEach(function(City) {City.toUpperCase();});
        searchedCities = localStorageCities ;  
        var currentCity = searchedCities[0];
        console.log(searchedCities);
        searchCity(currentCity);
        showCityList(searchedCities);
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
    var todayHeader = $("<h2>").text(City + " (" + todayDate.toString() + ")");
    var weatherIcon = $("<img>").attr('src', todayIconUrl);

    var TemperatureToday = $("<p>").text("Temp: " + todayTemp + "ºF");
    var WindSpeedToday = $("<p>").text("Wind Speed: " + todayWind + " MPH");
    var HumidityToday = $("<p>").text("Humidity: " + todayHumidity + " %");
    var UVItoday = $("<p>").text("UV Index: ");
    var UVItodayBGformat = $("<span>").text(UVindex).css("background-color", UVIBackgroundColor(UVindex)).addClass("badge text-white"); 
    //order string elements in card
    todayHeader.append(weatherIcon);
    todayCard.append(todayHeader);
    todayCard.append(TemperatureToday);
    todayCard.append(WindSpeedToday);
    todayCard.append(HumidityToday);
    UVItoday.append(UVItodayBGformat);
    todayCard.append(UVItoday);
    //send card with ordered strings to HTML
    $("#current-weather").append(todayCard);
}

//Function to customize color of UV Index badge based on value
function UVIBackgroundColor(UVindex) {
    //convert UV index from string to number
    var UVIvalue = parseFloat(UVindex);
    var UVcolor = "";
    //define color based on UV index value
    if (UVIvalue <= 3) {
        UVcolor = "#167e50";
      } else if ((UVIvalue > 3) && (UVIvalue <= 6)) {
        UVcolor = "#7e7c16";
      } else if ((UVIvalue > 6) && (UVIvalue <= 10)) {
        UVcolor = "#7e5416";
      } else if (UVIvalue > 10) {
        UVcolor = "#7e1616";
      }
      return UVcolor;
}

//Function to display list of searched cities
function showCityList(searchedCities) {
    $("#city-list").removeClass("hide");
    var count = 0;
    count = searchedCities.length;
    for (var i=0; i < count; i++) {
      $("#city-list").append(`<a href="#" class="list-group-item btn-block" style="text-decoration: none; color: black; background-color: #b7b7b7; border: none; text-align: center;">`
      + searchedCities[i] + `</a>`);
    }
}

//Function to add Header for Forecast
function addForecastHeader() {
    deckHeader = $("<h4>").text("5-Day Forecast:").attr("id", "card-deck-title");
    $(".card-deck").before(deckHeader);
}

// function displayForecast() {
//     //Set card format
//     var todayCard = $("<div class='container border border-dark bg-transparent'>");
//     //define each line for card as a string
//     var todayHeader = $("<h4>").text(City + " (" + todayDate.toString() + ")");
//     var weatherIcon = $("<img>").attr('src', todayIconUrl);

//     var TemperatureToday = $("<p>").text("Temp: " + todayTemp + "ºF");
//     var WindSpeedToday = $("<p>").text("Wind Speed: " + todayWind + " MPH");
//     var HumidityToday = $("<p>").text("Humidity: " + todayHumidity + " %");
//     var UVItoday = $("<p>").text("UV Index: ");
//     var UVItodayBGformat = $("<span>").text(UVindex).css("background-color", UVIBackgroundColor(UVindex)).addClass("badge text-white"); 
//     //order string elements in card
//     todayHeader.append(weatherIcon);
//     todayCard.append(todayHeader);
//     todayCard.append(TemperatureToday);
//     todayCard.append(WindSpeedToday);
//     todayCard.append(HumidityToday);
//     UVItoday.append(UVItodayBGformat);
//     todayCard.append(UVItoday);
//     //send card with ordered strings to HTML
//     $("#current-weather").append(todayCard);
// }

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
        var OneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&appid=" + APIKey;
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
                UVindex = OneCallData.current.uvi;
                //Get Weather Icon from API code and image url
                todayIconCode = OneCallData.current.weather[0].icon;
                todayIconUrl = "http://openweathermap.org/img/wn/" + todayIconCode + ".png";
                //All today's weather info is identified so call the display function
            displayTodayWeather();
            //Isolate forecast data from "daily" section of One Call API response
            addForecastHeader();
            for (var i=0; i < 5; i++) {
                forecastDate = moment.unix(OneCallData.daily[i].dt).format('l');
                var forecastTempKelvin = OneCallData.daily[i].temp.day;
                forecastTemp =  ((forecastTempKelvin - 273.15) * 1.80 + 32).toFixed(1);
                forecastWind = OneCallData.daily[i].wind_speed;
                forecastHumidity = OneCallData.daily[i].humidity;
                forecasticoncode = OneCallData.daily[i].weather[0].icon;
                forecasticonurl = "http://openweathermap.org/img/wn/" + forecasticoncode + "@2x.png";
                displayForecast()
            } 
        });
    });
}

