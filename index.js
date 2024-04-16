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

  windDirection.innerHTML = 
  windMPH.innerHTML = 
  windKPH.innerHTML = 
  air_carbon.innerHTML = 
  air_nitrogen.innerHTML = 
}

// Display for forcast weather data
function forcastDisplay() {}
