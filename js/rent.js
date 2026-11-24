// Only a logged-in user can book
if (currentUser === null) {
  alert("Please login first.");
  window.location.href = "login.html";
}

// Put every available bike in the list
function fillBikeList() {
  let html = '<option value="">-- Select a bike --</option>';
  for (let i = 0; i < bikes.length; i++) {
    if (bikes[i].status === "Available") {
      html += '<option value="' + bikes[i].id + '">' + bikes[i].name + "</option>";
    }
  }
  document.getElementById("bike").innerHTML = html;

  // "Rent Now" opens rent.html?bike=B101, so select that bike
  let bikeId = window.location.search.replace("?bike=", "");
  document.getElementById("bike").value = bikeId;
}

// Number of days between the two dates (same day = 1 day)
function getDays() {
  let start = document.getElementById("startDate").value;
  let end = document.getElementById("endDate").value;
  if (start === "" || end === "" || end < start) {
    return 0;
  }
  let days = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
  if (days === 0) {
    days = 1;
  }
  return days;
}

// Show the price: total = days x price per day
function showPrice() {
  let bike = findBike(document.getElementById("bike").value);
  let days = getDays();
  let price = 0;
  if (bike !== null) {
    price = bike.price;
  }
  document.getElementById("pricePerDay").innerHTML = price;
  document.getElementById("days").innerHTML = days;
  document.getElementById("total").innerHTML = days * price;
}

// Check the form and save the booking
function bookBike() {
  let bike = findBike(document.getElementById("bike").value);
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let start = document.getElementById("startDate").value;
  let end = document.getElementById("endDate").value;
  let payment = document.getElementById("payment").value;

  if (bike === null) {
    alert("Please choose a bike.");
    return false;
  }
  if (name === "") {
    alert("Please enter your name.");
    return false;
  }
  if (phone.length !== 11 || isNaN(phone)) {
    alert("Mobile number must be 11 digits.");
    return false;
  }
  if (start === "" || end === "") {
    alert("Please choose the dates.");
    return false;
  }
  if (end < start) {
    alert("Return date cannot be before the pick-up date.");
    return false;
  }
  if (payment === "") {
    alert("Please choose a payment method.");
    return false;
  }

  let booking = {
    id: "R" + (101 + bookings.length),
    name: name,
    phone: phone,
    bikeId: bike.id,
    bikeName: bike.name,
    startDate: start,
    endDate: end,
    total: getDays() * bike.price,
    payment: payment,
    status: "Active"
  };

  bookings.push(booking);
  bike.status = "Rented";
  saveAll();

  alert("Booking confirmed! Your booking ID is " + booking.id + ". Total: " + booking.total + " Taka.");
  window.location.href = "bikes.html";
  return false;
}

fillBikeList();
if (currentUser !== null) {
  document.getElementById("name").value = currentUser.name;
  document.getElementById("phone").value = currentUser.phone;
}
showPrice();
