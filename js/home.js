// Show the numbers in the boxes
function showNumbers() {
  let available = 0;
  for (let i = 0; i < bikes.length; i++) {
    if (bikes[i].status === "Available") {
      available++;
    }
  }

  document.getElementById("totalBikes").innerHTML = bikes.length;
  document.getElementById("availableBikes").innerHTML = available;
  document.getElementById("totalBookings").innerHTML = bookings.length;
}

// Show the first 3 bikes
function showPopularBikes() {
  let html = "";
  for (let i = 0; i < 3 && i < bikes.length; i++) {
    html += bikeCard(bikes[i]);
  }
  document.getElementById("popularBikes").innerHTML = html;
}

showNumbers();
showPopularBikes();
