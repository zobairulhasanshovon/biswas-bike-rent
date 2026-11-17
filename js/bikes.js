/* =========================================================
   bikes.js - Bikes page (bikes.html)
   Search, filter and sort the bike list.
   ========================================================= */

function fillBranchFilter() {
  const select = document.getElementById("branchFilter");
  for (let i = 0; i < BRANCHES.length; i++) {
    select.innerHTML += '<option value="' + BRANCHES[i] + '">' + BRANCHES[i] + "</option>";
  }
}

function renderBikes() {
  const search = document.getElementById("searchBox").value.trim().toLowerCase();
  const type = document.getElementById("typeFilter").value;
  const branch = document.getElementById("branchFilter").value;
  const sortBy = document.getElementById("sortBy").value;
  const availableOnly = document.getElementById("availableOnly").checked;

  const allBikes = getBikes();
  const result = [];

  // 1. Keep only the bikes that match every filter
  for (let i = 0; i < allBikes.length; i++) {
    const bike = allBikes[i];
    const text = (bike.name + " " + bike.brand).toLowerCase();

    if (search !== "" && text.indexOf(search) === -1) continue;
    if (type !== "" && bike.type !== type) continue;
    if (branch !== "" && bike.branch !== branch) continue;
    if (availableOnly && bike.status !== "Available") continue;

    result.push(bike);
  }

  // 2. Sort the result
  if (sortBy === "low") {
    result.sort(function (a, b) { return a.pricePerDay - b.pricePerDay; });
  } else if (sortBy === "high") {
    result.sort(function (a, b) { return b.pricePerDay - a.pricePerDay; });
  } else if (sortBy === "name") {
    result.sort(function (a, b) { return a.name.localeCompare(b.name); });
  }

  // 3. Show the cards
  let html = "";
  for (let i = 0; i < result.length; i++) {
    html += bikeCardHTML(result[i]);
  }
  if (result.length === 0) {
    html = '<p class="empty">No bike matches your search. Try another filter.</p>';
  }

  document.getElementById("bikeList").innerHTML = html;
  document.getElementById("resultCount").innerHTML = "Showing " + result.length + " of " + allBikes.length + " bikes";
}

document.addEventListener("DOMContentLoaded", function () {
  fillBranchFilter();

  // If we came from the home page quick search, e.g. bikes.html?type=Scooter
  const typeFromUrl = getUrlParam("type");
  if (typeFromUrl) {
    document.getElementById("typeFilter").value = typeFromUrl;
  }

  // Re-draw the list whenever a filter changes
  document.getElementById("searchBox").addEventListener("input", renderBikes);
  document.getElementById("typeFilter").addEventListener("change", renderBikes);
  document.getElementById("branchFilter").addEventListener("change", renderBikes);
  document.getElementById("sortBy").addEventListener("change", renderBikes);
  document.getElementById("availableOnly").addEventListener("change", renderBikes);

  renderBikes();
});
