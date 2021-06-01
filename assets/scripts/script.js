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
    console.log("searchCity: " , cityName);
    // Define API url to locate info
    var APIurl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

    // Perform an asynchornous HTTP (ajax) request to the OpenWeatherAPI
    $.ajax({url: APIurl, method: "GET"})

    // store all of the retrieved data inside of an object called "response"
    .then(function(response) {
        var result = response;
        console.log(result);
        city = result.name.trim();
        //  var countryCode = result.sys.country;
        //  country = getCountryName(countryCode).trim();
        //  currentDate = moment().tz(country + "/" + city).format('l');
        currentDate = moment.unix(result.dt).format("l");
        console.log(currentDate);
        var tempK = result.main.temp;
        // Converts the temp to Kelvin with the below formula
        tempF = ((tempK - 273.15) * 1.80 + 32).toFixed(1);
        humidityValue = result.main.humidity;
        windSpeed = result.wind.speed;
        currentWeatherIconCode = result.weather[0].icon;
        currentWeatherIconUrl = "https://openweathermap.org/img/w/" + currentWeatherIconCode + ".png";
        var latitude = result.coord.lat;
        var longitude = result.coord.lon;
        var uvIndexQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;
        $.ajax({
            url: uvIndexQueryUrl,
            method: "GET"
        })
        .then(function(response) {
            uvIndexValue = response.value;
            displayCurrentWeather()
                
            var fiveDayQueryUrl = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&appid=" + APIKey + "&cnt=5";
            $.ajax({
                url: fiveDayQueryUrl,
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