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
    displayCities(searchedCities);
    if (localStorageCities !== null) {
      var currentCity = searchedCities[0];
      searchCity(currentCity);
    }
});

