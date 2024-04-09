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

// Displays

// Display for location data
function locationDisplay({ ...location }) {
  console.log("DATA", location.name);
  var element = document.getElementById("location-name");
  element.innerHTML = location.name;
}

// Display for today's weather data
function todayDisplay() {}

// Display for forcast weather data
function forcastDisplay() {}

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
