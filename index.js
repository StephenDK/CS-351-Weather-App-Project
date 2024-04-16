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

    locationDisplay(weatherData.location);
    currentConditionDisplay(weatherData.current);
    atmosphereDisplay(weatherData.current);
    forcastDisplayD1(weatherData.forecast.forecastday[0]);
  } catch (err) {
    console.log(err);
  }

  // Display Data
});

// Functions
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
function locationDisplay({ ...location }) {
  console.log("DATA", location.name);
  var name = document.getElementById("location-name");
  var country = document.getElementById("location-country");
  var region = document.getElementById("location-region");
  var localtime = document.getElementById("location-localtime");
  var lat = document.getElementById("location-lat");
  var lon = document.getElementById("location-lon");
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

// Display for forcast weather data
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

  // Format Image URL
  var modifiedURL = "https:" + day1.day.condition.icon;
  // Format Date
  var newDate = formatDate(day1.date);

  img.src = modifiedURL;
  date.innerHTML = newDate;
  averageTemp.innerHTML = day1.day.avgtemp_f;
  high.innerHTML = day1.day.maxtemp_f;
  low.innerHTML = day1.day.mintemp_f;
  precip.innerHTML = day1.day.totalprecip_in;
  wind.innerHTML = day1.day.maxwind_mph;
  sunrise.innerHTML = day1.astro.sunrise;
  sunset.innerHTML = day1.astro.sunset;
}

// Helper Functions
function formatDate(date) {
  var valueArr = date.split("-");

  var transformedDate = `${valueArr[1]}-${valueArr[2]}-${valueArr[0]}`;

  return transformedDate;
}
