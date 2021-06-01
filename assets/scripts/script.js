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
var forecastTemp = "";
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
    localStorageCities.forEach(function(city) {city.toUpperCase();});
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
    forecastTemp = "";
    forecastHumidity = "";
    forecasticoncode = "";
    forecasticonurl = "";
    latitude = "";
    longitude = "";
}

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

//Function to search info for a city
function searchCity(cityName){
    //For Testing:
        //console.log("searchCity: " , cityName);
    //Define API url to locate info
    var APIurl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

    //Perform an asynchronous HTTP (ajax) request to the OpenWeatherAPI
    $.ajax({url: APIurl, method: "GET"})

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
        //Perform an asynchronous HTTP (ajax) request for the UV Index
        $.ajax({
            url: OneCallURL,
            method: "GET"
        })    
            //Get today's date using moment.js and convert to string format
            todayDate = moment.unix(APIdata.dt).format("l");
            //For Testing:    
                //console.log(todayDate);
            //Get temperature (in Kelvin)
            var todayTempKelvin = APIdata.main.temp;
            // Convert today's temperature from Kelvin to Fahrenheit (rounded to one decimal point)
            todayTemp = ((todayTempKelvin - 273.15) * 1.80 + 32).toFixed(1);
            //Get humidity
            todayHumidity = APIdata.main.humidity;
            //Get Wind Speed
            todayWind = APIdata.wind.speed;
            //Get Weather Icon from API code and image url
            todayIconCode = APIdata.weather.icon;
            todayIconUrl = "http://openweathermap.org/img/wn/" + todayIconCode + ".png";
            
        //Define UV Index URL using lat and long
        var UVindexURL = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;
        //Perform an asynchronous HTTP (ajax) request for the UV Index
        $.ajax({
            url: UVindexURL,
            method: "GET"
        })
        //Take data from UV Index ajax request and store in "response" object
        .then(function(response) {
            //Get UV Index
            uvIndexValue = response.value;
            //All today's weather info is identified so call the display function
            displayTodayWeather()
            //Define URL for Forecast from API    
            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
            $.ajax({
                url: forecastURL,
                method: "GET"
            })
            .then(function(response) {
                var fiveDayForecast = response.list;
                addCardDeckHeader()
                for (var i=0; i < 5; i++) {
                    iconcode = fiveDayForecast[i].weather[0].icon;
                    iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
                    //  dateValue = moment().tz(country + "/" + city).add(i, 'days').format('l');
                    dateValue = moment.unix(fiveDayForecast[i].dt).format('l');
                    minTempK = fiveDayForecast[i].temp.min;
                    minTempF =  ((minTempK - 273.15) * 1.80 + 32).toFixed(1);
                    maxTempK = fiveDayForecast[i].temp.max;
                    maxTempF =  (((fiveDayForecast[i].temp.max) - 273.15) * 1.80 + 32).toFixed(1);
                    dayhumidity = fiveDayForecast[i].humidity;
                    displayDayForeCast()
                } 
            });      
        }); 
    });
}