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