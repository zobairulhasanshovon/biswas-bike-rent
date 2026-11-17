/* =========================================================
   home.js - Home page (index.html)
   Shows live numbers, featured bikes and the quick search.
   ========================================================= */

function showHomeStats() {
  const bikes = getBikes();
  const rentals = getRentals();

  // Count available bikes with a loop
  let available = 0;
  for (let i = 0; i < bikes.length; i++) {
    if (bikes[i].status === "Available") {
      available++;
    }
  }

  // Count different customers who have rented at least once
  const riderIds = [];
  for (let i = 0; i < rentals.length; i++) {
    if (riderIds.indexOf(rentals[i].userId) === -1) {
      riderIds.push(rentals[i].userId);
    }
  }

  document.getElementById("statBikes").innerHTML = bikes.length;
  document.getElementById("statAvailable").innerHTML = available;
  document.getElementById("statBranches").innerHTML = BRANCHES.length;
  // 500 = riders before the website was launched
  document.getElementById("statRiders").innerHTML = (500 + riderIds.length) + "+";
}

function showFeaturedBikes() {
  const bikes = getBikes();
  const types = ["Motorbike", "Scooter", "Bicycle"];
  let html = "";

  // Take the first available bike of each type
  for (let t = 0; t < types.length; t++) {
    for (let i = 0; i < bikes.length; i++) {
      if (bikes[i].type === types[t] && bikes[i].status === "Available") {
        html += bikeCardHTML(bikes[i]);
        break; // stop after the first one
      }
    }
  }

  if (html === "") {
    html = '<p class="empty">All bikes are booked right now. Please check again later.</p>';
  }
  document.getElementById("featuredBikes").innerHTML = html;
}

function setupQuickSearch() {
  document.getElementById("quickSearch").addEventListener("submit", function (event) {
    event.preventDefault(); // stop the normal form submit
    const type = document.getElementById("quickType").value;
    if (type === "") {
      window.location.href = "bikes.html";
    } else {
      window.location.href = "bikes.html?type=" + type;
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("heroArt").innerHTML = bikeSVG("Motorbike", "#f42a41");
  showHomeStats();
  showFeaturedBikes();
  setupQuickSearch();
});
