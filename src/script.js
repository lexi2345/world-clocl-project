// City data with timezone information
const cityData = {
  "America/New_York": { name: "New York", country: "United States" },
  "Europe/London": { name: "London", country: "United Kingdom" },
  "Asia/Tokyo": { name: "Tokyo", country: "Japan" },
  "Australia/Sydney": { name: "Sydney", country: "Australia" },
  "Europe/Paris": { name: "Paris", country: "France" },
  "Asia/Dubai": { name: "Dubai", country: "UAE" },
};

// Get elements
const citySelect = document.getElementById("city-select");
const selectedCityDiv = document.getElementById("selected-city");
const defaultCitiesDiv = document.getElementById("default-cities");

let updateInterval = null;

// Function to format time for a specific timezone
function getTimeForTimezone(timezone) {
  try {
    const options = {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date());
  } catch (error) {
    console.error("Error formatting time:", error);
    return "N/A";
  }
}

// Function to format date for a specific timezone
function getDateForTimezone(timezone) {
  try {
    const options = {
      timeZone: timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date());
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
}

// Function to update all default city clocks
function updateDefaultClocks() {
  const cityCards = defaultCitiesDiv.querySelectorAll(".city-card");

  cityCards.forEach((card) => {
    const timezone = card.getAttribute("data-timezone");
    const timeElement = card.querySelector(".time");
    const dateElement = card.querySelector(".date");

    if (timezone && timeElement && dateElement) {
      timeElement.textContent = getTimeForTimezone(timezone);
      dateElement.textContent = getDateForTimezone(timezone);

      // Add pulse animation
      timeElement.classList.add("updating");
      setTimeout(() => {
        timeElement.classList.remove("updating");
      }, 500);
    }
  });
}

// Function to update selected city clock
function updateSelectedClock(timezone, cityName, country) {
  const timeElement = selectedCityDiv.querySelector(".time");
  const dateElement = selectedCityDiv.querySelector(".date");
  const nameElement = selectedCityDiv.querySelector(".city-name");

  if (timeElement && dateElement && nameElement) {
    timeElement.textContent = getTimeForTimezone(timezone);
    dateElement.textContent = getDateForTimezone(timezone);
    nameElement.textContent = cityName + ", " + country;

    // Add pulse animation
    timeElement.classList.add("updating");
    setTimeout(() => {
      timeElement.classList.remove("updating");
    }, 500);
  }
}

// Function to get user's current location time
function getCurrentLocationTime() {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const cityName = timezone.split("/").pop().replace(/_/g, " ");

    return {
      timezone: timezone,
      name: cityName,
      country: "Your Location",
    };
  } catch (error) {
    console.error("Error getting current location:", error);
    return {
      timezone: "UTC",
      name: "UTC",
      country: "Universal Time",
    };
  }
}

// Handle city selection
citySelect.addEventListener("change", function () {
  const selectedValue = this.value;

  // Clear any existing interval
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }

  if (selectedValue === "") {
    // Show default cities
    selectedCityDiv.classList.add("hidden");
    defaultCitiesDiv.classList.remove("hidden");

    // Update default clocks immediately
    updateDefaultClocks();

    // Set interval for default clocks
    updateInterval = setInterval(updateDefaultClocks, 1000);
  } else if (selectedValue === "current") {
    // Show current location
    const currentLocation = getCurrentLocationTime();
    selectedCityDiv.classList.remove("hidden");
    defaultCitiesDiv.classList.add("hidden");

    // Update selected city display immediately
    updateSelectedClock(
      currentLocation.timezone,
      currentLocation.name,
      currentLocation.country
    );

    // Set interval for selected city
    updateInterval = setInterval(() => {
      updateSelectedClock(
        currentLocation.timezone,
        currentLocation.name,
        currentLocation.country
      );
    }, 1000);
  } else {
    // Show selected city from dropdown
    const city = cityData[selectedValue];

    if (city) {
      selectedCityDiv.classList.remove("hidden");
      defaultCitiesDiv.classList.add("hidden");

      // Update selected city display immediately
      updateSelectedClock(selectedValue, city.name, city.country);

      // Set interval for selected city
      updateInterval = setInterval(() => {
        updateSelectedClock(selectedValue, city.name, city.country);
      }, 1000);
    }
  }
});

// Initialize the clocks when page loads
function initializeClocks() {
  // Update default clocks immediately
  updateDefaultClocks();

  // Set interval to update every second
  updateInterval = setInterval(updateDefaultClocks, 1000);
}

// Start the clocks when DOM is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeClocks);
} else {
  initializeClocks();
}

// Clean up interval when page is about to unload
window.addEventListener("beforeunload", function () {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
function updateTime() {
  // Los Angeles
  let losAngelesElement = document.querySelector("#los-angeles");
  if (losAngelesElement) {
    let losAngelesDateElement = losAngelesElement.querySelector(".date");
    let lostAngelesTimeElement = losAngelesElement.querySelector(".time");
    let losAngelesTime = moment().tz("America/Los_Angeles");

    losAngelesDateElement.innerHTML = losAngelesTime.format("MMMM	Do YYYY");
    lostAngelesTimeElement.innerHTML = losAngelesTime.format(
      "h:mm:ss [<small>]A[</small>]"
    );
  }

  // Paris
  let parisElement = document.querySelector("#paris");
  if (parisElement) {
    let parisDateElement = parisElement.querySelector(".date");
    let parisTimeElement = parisElement.querySelector(".time");
    let parisTime = moment().tz("Europe/Paris");

    parisDateElement.innerHTML = parisTime.format("MMMM	Do YYYY");
    parisTimeElement.innerHTML = parisTime.format(
      "h:mm:ss [<small>]A[</small>]"
    );
  }
}

function updateCity(event) {
  let cityTimeZone = event.target.value;
  if (cityTimeZone === "current") {
    cityTimeZone = moment.tz.guess();
  }
  let cityName = cityTimeZone.replace("_", " ").split("/")[1];
  let cityTime = moment().tz(cityTimeZone);
  let citiesElement = document.querySelector("#cities");
  citiesElement.innerHTML = `
  <div class="city">
    <div>
      <h2>${cityName}</h2>
      <div class="date">${cityTime.format("MMMM	Do YYYY")}</div>
    </div>
    <div class="time">${cityTime.format("h:mm:ss")} <small>${cityTime.format(
    "A"
  )}</small></div>
  </div>
  <a href="/">All cities</a>
  `;
}

updateTime();
setInterval(updateTime, 1000);

let citiesSelectElement = document.querySelector("#city");
citiesSelectElement.addEventListener("change", updateCity);
