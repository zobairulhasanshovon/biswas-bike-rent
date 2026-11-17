/* =========================================================
   rent.js - Booking page (rent.html)
   1. Fill the bike list   2. Live price summary
   3. Validate the form    4. Save the rental
   ========================================================= */

let currentUser = null;

// Put every AVAILABLE bike in the <select>
function fillBikeSelect() {
  const select = document.getElementById("bikeSelect");
  const bikes = getBikes();
  let html = '<option value="">-- Select a bike --</option>';
  let count = 0;

  for (let i = 0; i < bikes.length; i++) {
    if (bikes[i].status === "Available") {
      html += '<option value="' + bikes[i].id + '">' + escapeHTML(bikes[i].name) + " (" + bikes[i].type + ") - " + formatTaka(bikes[i].pricePerDay) + "/day</option>";
      count++;
    }
  }
  select.innerHTML = html;

  if (count === 0) {
    showToast("Sorry, no bike is available right now.", "error");
  }

  // Pre-select the bike if we came from "Rent Now" (rent.html?bike=B101)
  const bikeFromUrl = getUrlParam("bike");
  if (bikeFromUrl) {
    select.value = bikeFromUrl;
    if (select.value !== bikeFromUrl) {
      showToast("That bike is not available any more. Please choose another.", "error");
    }
  }
}

// Work out the price. Returns an object with every part of the bill.
function calculatePrice(bike, startDate, endDate, wantsHelmet) {
  const bill = { days: 0, rent: 0, helmet: 0, discount: 0, total: 0 };
  if (bike === null || startDate === "" || endDate === "") {
    return bill;
  }

  let days = daysBetween(startDate, endDate);
  if (days < 0) {
    return bill; // return date is before pick-up date
  }
  if (days === 0) {
    days = 1; // same-day return still counts as 1 day
  }

  bill.days = days;
  bill.rent = days * bike.pricePerDay;

  if (wantsHelmet && bike.type !== "Bicycle") {
    bill.helmet = HELMET_PRICE;
  }
  if (days >= LONG_RENT_DAYS) {
    bill.discount = Math.round(bill.rent * LONG_RENT_DISCOUNT / 100);
  }

  bill.total = bill.rent + bill.helmet - bill.discount;
  return bill;
}

// Runs every time the user changes the bike, dates or helmet box
function updateSummary() {
  const bikeId = document.getElementById("bikeSelect").value;
  const bike = findBike(bikeId);
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const wantsHelmet = document.getElementById("helmet").checked;

  // Show or hide fields that only motorbikes and scooters need
  const needsLicense = bike !== null && bike.type !== "Bicycle";
  document.getElementById("licenseField").style.display = needsLicense ? "block" : "none";
  document.getElementById("helmetField").style.display = needsLicense ? "block" : "none";

  // Bike preview at the top of the summary box
  const preview = document.getElementById("bikePreview");
  if (bike === null) {
    preview.innerHTML = '<p class="muted">Select a bike to see the price.</p>';
  } else {
    preview.innerHTML =
      '<div class="bike-img" style="border-radius:10px;">' + bikeSVG(bike.type, bike.color) + "</div>" +
      '<h3 style="margin-top:10px;">' + escapeHTML(bike.name) + "</h3>" +
      '<p class="muted">Pick-up: ' + escapeHTML(bike.branch) + "</p>";
  }

  const bill = calculatePrice(bike, startDate, endDate, wantsHelmet);
  document.getElementById("sumRate").innerHTML = bike ? formatTaka(bike.pricePerDay) + "/day" : "-";
  document.getElementById("sumDays").innerHTML = bill.days > 0 ? bill.days : "-";
  document.getElementById("sumRent").innerHTML = formatTaka(bill.rent);
  document.getElementById("sumHelmet").innerHTML = formatTaka(bill.helmet);
  document.getElementById("sumDiscount").innerHTML = "- " + formatTaka(bill.discount);
  document.getElementById("sumTotal").innerHTML = formatTaka(bill.total);
  document.getElementById("sumDeposit").innerHTML = bike ? formatTaka(DEPOSIT[bike.type]) : "-";
}

function getSelectedPayment() {
  const options = document.getElementsByName("payment");
  for (let i = 0; i < options.length; i++) {
    if (options[i].checked) {
      return options[i].value;
    }
  }
  return "";
}

// Form validation. Returns true only if every field is correct.
function validateRentForm() {
  let ok = true;
  const bike = findBike(document.getElementById("bikeSelect").value);
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const nid = document.getElementById("nid").value.trim();
  const license = document.getElementById("license").value.trim();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  // Clear old errors first
  const ids = ["bikeSelect", "customerName", "phone", "nid", "license", "startDate", "endDate", "payment", "terms"];
  for (let i = 0; i < ids.length; i++) {
    setError(ids[i], "");
  }

  if (bike === null) {
    setError("bikeSelect", "Please choose a bike.");
    ok = false;
  } else if (bike.status !== "Available") {
    setError("bikeSelect", "This bike was just booked by someone else.");
    ok = false;
  }

  if (name.length < 3 || !/^[A-Za-z .]+$/.test(name)) {
    setError("customerName", "Enter your full name (letters only).");
    ok = false;
  }

  // Bangladeshi mobile: 11 digits, starts with 013-019
  if (!/^01[3-9][0-9]{8}$/.test(phone)) {
    setError("phone", "Enter a valid number like 01712345678.");
    ok = false;
  }

  // NID can be 10, 13 or 17 digits
  if (!/^([0-9]{10}|[0-9]{13}|[0-9]{17})$/.test(nid)) {
    setError("nid", "NID must be 10, 13 or 17 digits.");
    ok = false;
  }

  if (bike !== null && bike.type !== "Bicycle" && license.length < 6) {
    setError("license", "License number is required for this bike.");
    ok = false;
  }

  if (startDate === "") {
    setError("startDate", "Choose a pick-up date.");
    ok = false;
  } else if (startDate < todayStr()) {
    setError("startDate", "Pick-up date cannot be in the past.");
    ok = false;
  }

  if (endDate === "") {
    setError("endDate", "Choose a return date.");
    ok = false;
  } else if (startDate !== "" && endDate < startDate) {
    setError("endDate", "Return date must be after pick-up date.");
    ok = false;
  } else if (startDate !== "" && daysBetween(startDate, endDate) > MAX_RENT_DAYS) {
    setError("endDate", "You can rent for at most " + MAX_RENT_DAYS + " days.");
    ok = false;
  }

  if (getSelectedPayment() === "") {
    setError("payment", "Choose how you will pay.");
    ok = false;
  }

  if (!document.getElementById("terms").checked) {
    setError("terms", "You must agree to the rental terms.");
    ok = false;
  }

  return ok;
}

function submitBooking(event) {
  event.preventDefault();

  if (!validateRentForm()) {
    showToast("Please fix the errors in the form.", "error");
    return;
  }

  const bike = findBike(document.getElementById("bikeSelect").value);
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const wantsHelmet = document.getElementById("helmet").checked;
  const bill = calculatePrice(bike, startDate, endDate, wantsHelmet);

  // Build the rental object
  const rental = {
    id: makeId("R"),
    userId: currentUser.id,
    customerName: document.getElementById("customerName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    nid: document.getElementById("nid").value.trim(),
    license: bike.type === "Bicycle" ? "" : document.getElementById("license").value.trim(),
    bikeId: bike.id,
    bikeName: bike.name,
    bikeType: bike.type,
    pricePerDay: bike.pricePerDay,
    branch: bike.branch,
    startDate: startDate,
    endDate: endDate,
    days: bill.days,
    helmet: bill.helmet > 0,
    payment: getSelectedPayment(),
    discount: bill.discount,
    total: bill.total,
    lateFee: 0,
    status: "Active",
    createdAt: todayStr(),
    returnedAt: ""
  };

  // Save the rental and mark the bike as rented
  const rentals = getRentals();
  rentals.push(rental);
  saveRentals(rentals);
  updateBikeStatus(bike.id, "Rented");

  alert("Booking confirmed!\n\nBooking ID: " + rental.id + "\nBike: " + rental.bikeName + "\nTotal: " + formatTaka(rental.total) + "\nPick-up: " + rental.branch);
  window.location.href = "my-rentals.html";
}

document.addEventListener("DOMContentLoaded", function () {
  currentUser = requireLogin();
  if (currentUser === null) return;

  fillBikeSelect();

  // Fill name and phone from the user's account
  document.getElementById("customerName").value = currentUser.name;
  document.getElementById("phone").value = currentUser.phone;

  // Dates cannot be before today
  document.getElementById("startDate").min = todayStr();
  document.getElementById("endDate").min = todayStr();
  document.getElementById("startDate").value = todayStr();
  document.getElementById("endDate").value = addDays(1);

  // Update the summary on every change
  document.getElementById("bikeSelect").addEventListener("change", updateSummary);
  document.getElementById("startDate").addEventListener("change", function () {
    document.getElementById("endDate").min = this.value;
    updateSummary();
  });
  document.getElementById("endDate").addEventListener("change", updateSummary);
  document.getElementById("helmet").addEventListener("change", updateSummary);
  document.getElementById("rentForm").addEventListener("submit", submitBooking);

  updateSummary();
});
