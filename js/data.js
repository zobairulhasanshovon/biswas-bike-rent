// The 6 bikes of the shop
let defaultBikes = [
  { id: "B101", image: "images/yamaha-fzs-v3.jpg", name: "Yamaha FZS V3", cc: 149, price: 1500, branch: "Kuratoli", status: "Available" },
  { id: "B102", image: "images/bajaj-pulsar-n160.jpg", name: "Bajaj Pulsar N160", cc: 164, price: 1400, branch: "Bashundhara", status: "Available" },
  { id: "B103", image: "images/honda-hornet-2.jpg", name: "Honda Hornet 2.0", cc: 184, price: 1700, branch: "Uttara", status: "Available" },
  { id: "B104", image: "images/suzuki-gixxer-sf.jpg", name: "Suzuki Gixxer SF", cc: 155, price: 1600, branch: "Kuratoli", status: "Available" },
  { id: "B105", image: "images/tvs-apache-rtr-160.jpg", name: "TVS Apache RTR 160", cc: 160, price: 1400, branch: "Bashundhara", status: "Available" },
  { id: "B106", image: "images/yamaha-r15-v4.jpg", name: "Yamaha R15 V4", cc: 155, price: 2200, branch: "Uttara", status: "Available" }
];

// One admin and one customer
let defaultUsers = [
  { name: "Shop Admin", email: "admin@biswasbike.com", phone: "01700000000", password: "admin123", role: "admin" },
  { name: "Rahim Uddin", email: "customer@biswasbike.com", phone: "01811111111", password: "123456", role: "customer" }
];

// Read saved data from the browser. If nothing is saved, use the default.
function loadData(key, defaultValue) {
  let text = localStorage.getItem(key);
  if (text === null) {
    return defaultValue;
  }
  return JSON.parse(text);
}

let bikes = loadData("bikes", defaultBikes);
let users = loadData("users", defaultUsers);
let bookings = loadData("bookings", []);
let currentUser = loadData("currentUser", null);

// Save all data in the browser
function saveAll() {
  localStorage.setItem("bikes", JSON.stringify(bikes));
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("bookings", JSON.stringify(bookings));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

// Find a bike by its id
function findBike(id) {
  for (let i = 0; i < bikes.length; i++) {
    if (bikes[i].id === id) {
      return bikes[i];
    }
  }
  return null;
}

// Green label for Available/Returned, red label for Rented/Active
function statusLabel(status) {
  if (status === "Available" || status === "Returned") {
    return '<span class="label green">' + status + "</span>";
  } else {
    return '<span class="label red">' + status + "</span>";
  }
}

// One bike card (used on the Home and Bikes pages)
function bikeCard(bike) {
  let image = "images/bike.svg"; // for new bikes without a photo
  if (bike.image) {
    image = bike.image;
  }

  let button = '<span class="muted">Not available</span>';
  if (bike.status === "Available") {
    button = '<a href="rent.html?bike=' + bike.id + '" class="btn">Rent Now</a>';
  }

  return '<div class="bike-card">' +
           statusLabel(bike.status) +
           '<img src="' + image + '" alt="' + bike.name + '">' +
           "<h3>" + bike.name + "</h3>" +
           '<p class="muted">' + bike.cc + "cc, " + bike.branch + " branch</p>" +
           '<p class="price">' + bike.price + " Taka / day</p>" +
           button +
         "</div>";
}

// Show Login/Register or the user's name and Logout in the menu
function showUser() {
  let html = '<a href="login.html">Login</a> <a href="register.html">Register</a>';
  if (currentUser !== null) {
    html = "Hi, " + currentUser.name + " ";
    if (currentUser.role === "admin") {
      html += '<a href="admin.html">Dashboard</a> ';
    }
    html += '<a href="#" onclick="logout()">Logout</a>';
  }
  document.getElementById("navUser").innerHTML = html;
}

function logout() {
  currentUser = null;
  saveAll();
  window.location.href = "index.html";
}

showUser();
