// Global Variables
const API_KEY = "592208bd50884c689f870435242502";

var weatherData = {};
var isLoading = true;

// On document load
$(document).ready(async function () {
  // Show laoding
  $(".loading-container").show();

  try {
    // API Call
    weatherData = await getLocation();
    console.log("GLOBAL WEATHER VAR:", weatherData);
    // Hide loading
    $(".loading-container").hide();

    addGoogleMapToElement(
      GOOGLE_MAP_API_KEY,
      weatherData.location.lat,
      weatherData.location.lon
    );

    locationDisplay(weatherData.location, weatherData.current.condition.icon);
    currentConditionDisplay(weatherData.current);
    atmosphereDisplay(weatherData.current);
    forcastDisplayD1(weatherData.forecast.forecastday[0]);
    forcastDisplayD2(weatherData.forecast.forecastday[1]);
    forcastDisplayD3(weatherData.forecast.forecastday[2]);
  } catch (err) {
    console.log(err);
  }
});

// Event Listner for search button
document
  .getElementById("search-button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    // Get value from input
    var cityName = document.getElementById("city-input").value;
    console.log("INPUT VALUE", cityName);
    fetchWeatherData(cityName);
  });

// Functions
// Get location from user
function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Latitude: " + latitude);
          console.log("Longitude: " + longitude);
          getAPIData(latitude, longitude)
            .then((data) => resolve(data))
            .catch((error) => reject(error));
        },
        (error) => {
          console.error("Error getting location:", error);
          getAPIData()
            .then((data) => resolve(data))
            .catch((error) => reject(error));
        }
      );
    } else {
      console.error("Geolocation not supported.");
      getAPIData()
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    }
  });
}

async function getAPIData(lat, long) {
  try {
    var apiURL =
      `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}` +
      (lat && long
        ? `&q=${lat},${long}&days=3&aqi=yes&alerts=no`
        : `&q=Hayward&days=3&aqi=yes&alerts=no`);
    console.log(apiURL);
    const response = await fetch(apiURL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

async function fetchWeatherData(cityName) {
  try {
    const request = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=3&aqi=yes&alerts=no`
    );
    const data = await request.json();

    weatherData = data;
    console.log("DATA RECEIVED");
    updateUI(weatherData);
  } catch (err) {
    console.log("BAD REQUEST");
    console.log(err);
  }
}

function updateUI(weatherData) {
  console.log("UPDATING DATA");
  locationDisplay(weatherData.location, weatherData.current.condition.icon);

  // Update current condition display
  currentConditionDisplay(weatherData.current);

  // Update atmosphere display
  atmosphereDisplay(weatherData.current);

  // Update forecast display
  forcastDisplayD1(weatherData.forecast.forecastday[0]);
  forcastDisplayD2(weatherData.forecast.forecastday[1]);
  forcastDisplayD3(weatherData.forecast.forecastday[2]);
}

// Initialize Map Display
function addGoogleMapToElement(apiKey, latitude, longitude) {
  var mapUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${latitude},${longitude}&zoom=12`;

  console.log("GOOGLE MAP URL", mapUrl);

  var iframe = document.createElement("iframe");
  iframe.setAttribute("width", "100%");
  iframe.setAttribute("height", "100%");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("style", "border:0");
  iframe.setAttribute("src", mapUrl);

  var element = document.getElementById("google-map");
  element.appendChild(iframe);
}

// Display location data
function locationDisplay({ ...location }, imgURL) {
  console.log("DATA", location.name);
  var img = document.getElementById("location-img");
  var name = document.getElementById("location-name");
  var country = document.getElementById("location-country");
  var region = document.getElementById("location-region");
  var localtime = document.getElementById("location-localtime");
  var lat = document.getElementById("location-lat");
  var lon = document.getElementById("location-lon");
  img.src = formatImgURL(imgURL);
  name.innerHTML = location.name;
  region.innerHTML = location.region;
  country.innerHTML = location.country;
  localtime.innerHTML = location.localtime;
  lat.innerHTML = location.lat;
  lon.innerHTML = location.lon;
}

// Display Today's Weather Data
function currentConditionDisplay({ ...current }) {
  var conditionText = document.getElementById("condition-text");
  var temp_c = document.getElementById("temp_c");
  var temp_f = document.getElementById("temp_f");
  var condition_humidity = document.getElementById("condition-humidity");
  var condition_precipitation = document.getElementById(
    "condition-precipitation"
  );
  var condition_cloud = document.getElementById("condition-cloud");

  conditionText.innerHTML = current.condition.text;
  temp_c.innerHTML = current.temp_c;
  temp_f.innerHTML = current.temp_f;
  condition_humidity.innerHTML = current.humidity;
  condition_precipitation.innerHTML = current.precip_in;
  condition_cloud.innerHTML = current.cloud;
}

// Display atmosphere weather data
function atmosphereDisplay({ ...current }) {
  var windDirection = document.getElementById("current-windDirection");
  var windMPH = document.getElementById("current-windMPH");
  var windKPH = document.getElementById("current-windKPH");
  var air_carbon = document.getElementById("air-quality-carbon");
  var air_nitrogen = document.getElementById("air-quality-nitrogen");

  windDirection.innerHTML = current.wind_dir;
  windMPH.innerHTML = current.wind_mph;
  windKPH.innerHTML = current.wind_kph;
  air_carbon.innerHTML = current.air_quality.co;
  air_nitrogen.innerHTML = current.air_quality.no2;
}

// Display for forcast day 1 weather data
function forcastDisplayD1({ ...day1 }) {
  console.log("FORCAST DAY 1:", day1);
  var img = document.getElementById("day1-img");
  var date = document.getElementById("day1-date");
  var averageTemp = document.getElementById("day1-averageTemp");
  var high = document.getElementById("day1-high");
  var low = document.getElementById("day1-low");
  var precip = document.getElementById("day1-precipitation");
  var wind = document.getElementById("day1-wind");
  var sunrise = document.getElementById("day1-sunrise");
  var sunset = document.getElementById("day1-sunset");

  // Format Date
  var newDate = formatDate(day1.date);

  img.src = formatImgURL(day1.day.condition.icon);
  date.innerHTML = newDate;
  averageTemp.innerHTML = day1.day.avgtemp_f;
  high.innerHTML = day1.day.maxtemp_f;
  low.innerHTML = day1.day.mintemp_f;
  precip.innerHTML = day1.day.totalprecip_in;
  wind.innerHTML = day1.day.maxwind_mph;
  sunrise.innerHTML = day1.astro.sunrise;
  sunset.innerHTML = day1.astro.sunset;
}

//
// Display for forcast day 2 weather data
function forcastDisplayD2({ ...day2 }) {
  console.log("FORCAST DAY 2:", day2);
  var img = document.getElementById("day2-img");
  var date = document.getElementById("day2-date");
  var averageTemp = document.getElementById("day2-averageTemp");
  var high = document.getElementById("day2-high");
  var low = document.getElementById("day2-low");
  var precip = document.getElementById("day2-precipitation");
  var wind = document.getElementById("day2-wind");
  var sunrise = document.getElementById("day2-sunrise");
  var sunset = document.getElementById("day2-sunset");

  // Format Date
  var newDate = formatDate(day2.date);

  img.src = formatImgURL(day2.day.condition.icon);
  date.innerHTML = newDate;
  averageTemp.innerHTML = day2.day.avgtemp_f;
  high.innerHTML = day2.day.maxtemp_f;
  low.innerHTML = day2.day.mintemp_f;
  precip.innerHTML = day2.day.totalprecip_in;
  wind.innerHTML = day2.day.maxwind_mph;
  sunrise.innerHTML = day2.astro.sunrise;
  sunset.innerHTML = day2.astro.sunset;
}

// Display for forcast day 3 weather data
function forcastDisplayD3({ ...day3 }) {
  console.log("FORCAST DAY 3:", day3);
  var img = document.getElementById("day3-img");
  var date = document.getElementById("day3-date");
  var averageTemp = document.getElementById("day3-averageTemp");
  var high = document.getElementById("day3-high");
  var low = document.getElementById("day3-low");
  var precip = document.getElementById("day3-precipitation");
  var wind = document.getElementById("day3-wind");
  var sunrise = document.getElementById("day3-sunrise");
  var sunset = document.getElementById("day3-sunset");

  // Format Date
  var newDate = formatDate(day3.date);

  img.src = formatImgURL(day3.day.condition.icon);
  date.innerHTML = newDate;
  averageTemp.innerHTML = day3.day.avgtemp_f;
  high.innerHTML = day3.day.maxtemp_f;
  low.innerHTML = day3.day.mintemp_f;
  precip.innerHTML = day3.day.totalprecip_in;
  wind.innerHTML = day3.day.maxwind_mph;
  sunrise.innerHTML = day3.astro.sunrise;
  sunset.innerHTML = day3.astro.sunset;
}

// Helper Functions
function formatImgURL(url) {
  return `https:${url}`;
}

function formatDate(date) {
  var valueArr = date.split("-");

  var transformedDate = `${valueArr[1]}-${valueArr[2]}-${valueArr[0]}`;

  return transformedDate;
}
