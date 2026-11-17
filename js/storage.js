/* =========================================================
   Biswas Bike Rent - storage.js (shared by EVERY page)
   ---------------------------------------------------------
   We have no server or database in this project, so we keep
   all data in the browser's localStorage. localStorage only
   stores text, so we use JSON.stringify() to save an array
   and JSON.parse() to read it back.

   Data we store (each one is an ARRAY of OBJECTS):
     bikes    -> all bikes in the shop
     users    -> admin + registered customers
     rentals  -> every booking
     messages -> messages from the contact form
     session  -> id of the user who is logged in
   ========================================================= */

const KEYS = {
  bikes: "bbr_bikes",
  users: "bbr_users",
  rentals: "bbr_rentals",
  messages: "bbr_messages",
  session: "bbr_session"
};

const BRANCHES = ["Kuratoli (near AIUB)", "Bashundhara R/A", "Uttara Sector 7", "Dhanmondi 27", "Mirpur 10"];

// Refundable security deposit for each bike type (in Taka)
const DEPOSIT = { Motorbike: 5000, Scooter: 3000, Bicycle: 500 };

const HELMET_PRICE = 100;   // one-time charge per rental
const LONG_RENT_DAYS = 7;   // 7 days or more gets a discount
const LONG_RENT_DISCOUNT = 10; // percent
const MAX_RENT_DAYS = 30;

// Starting bikes (loaded the first time the site opens)
const DEFAULT_BIKES = [
  { id: "B101", name: "Yamaha FZS V3", type: "Motorbike", brand: "Yamaha", cc: 149, color: "#1d4ed8", pricePerDay: 1500, branch: BRANCHES[0], status: "Available" },
  { id: "B102", name: "Bajaj Pulsar N160", type: "Motorbike", brand: "Bajaj", cc: 164, color: "#111827", pricePerDay: 1400, branch: BRANCHES[1], status: "Available" },
  { id: "B103", name: "Honda Hornet 2.0", type: "Motorbike", brand: "Honda", cc: 184, color: "#dc2626", pricePerDay: 1700, branch: BRANCHES[2], status: "Available" },
  { id: "B104", name: "Suzuki Gixxer SF", type: "Motorbike", brand: "Suzuki", cc: 155, color: "#0ea5e9", pricePerDay: 1600, branch: BRANCHES[0], status: "Rented" },
  { id: "B105", name: "TVS Apache RTR 160 4V", type: "Motorbike", brand: "TVS", cc: 160, color: "#f8fafc", pricePerDay: 1400, branch: BRANCHES[3], status: "Available" },
  { id: "B106", name: "Yamaha R15 V4", type: "Motorbike", brand: "Yamaha", cc: 155, color: "#7c3aed", pricePerDay: 2200, branch: BRANCHES[1], status: "Maintenance" },
  { id: "B107", name: "Honda Dio", type: "Scooter", brand: "Honda", cc: 110, color: "#f97316", pricePerDay: 900, branch: BRANCHES[4], status: "Available" },
  { id: "B108", name: "TVS Ntorq 125", type: "Scooter", brand: "TVS", cc: 125, color: "#16a34a", pricePerDay: 1000, branch: BRANCHES[0], status: "Available" },
  { id: "B109", name: "Yamaha Ray ZR", type: "Scooter", brand: "Yamaha", cc: 125, color: "#e11d48", pricePerDay: 950, branch: BRANCHES[3], status: "Available" },
  { id: "B110", name: "Veloce Mountain 27.5", type: "Bicycle", brand: "Veloce", cc: 0, color: "#ea580c", pricePerDay: 300, branch: BRANCHES[0], status: "Available" },
  { id: "B111", name: "Duranta City Cruiser", type: "Bicycle", brand: "Duranta", cc: 0, color: "#0d9488", pricePerDay: 250, branch: BRANCHES[1], status: "Available" },
  { id: "B112", name: "Phoenix Classic 26", type: "Bicycle", brand: "Phoenix", cc: 0, color: "#374151", pricePerDay: 200, branch: BRANCHES[4], status: "Available" }
];

// Starting users. role is "admin" or "customer"
const DEFAULT_USERS = [
  { id: "U1", name: "Shop Admin", email: "admin@biswasbike.com", phone: "01700000000", password: "admin123", role: "admin", joined: "2026-01-01" },
  { id: "U2", name: "Rahim Uddin", email: "customer@biswasbike.com", phone: "01811111111", password: "123456", role: "customer", joined: "2026-03-10" },
  { id: "U3", name: "Karim Hasan", email: "karim@gmail.com", phone: "01922222222", password: "123456", role: "customer", joined: "2026-05-22" }
];

/* ---------- Basic save / load helpers ---------- */

function loadData(key, fallback) {
  try {
    const text = localStorage.getItem(key);
    if (text === null) {
      return fallback;
    }
    return JSON.parse(text);
  } catch (error) {
    console.log("Could not read " + key, error);
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log("Could not save " + key, error);
  }
}

function getBikes() { return loadData(KEYS.bikes, []); }
function saveBikes(list) { saveData(KEYS.bikes, list); }

function getUsers() { return loadData(KEYS.users, []); }
function saveUsers(list) { saveData(KEYS.users, list); }

function getRentals() { return loadData(KEYS.rentals, []); }
function saveRentals(list) { saveData(KEYS.rentals, list); }

function getMessages() { return loadData(KEYS.messages, []); }
function saveMessages(list) { saveData(KEYS.messages, list); }

function findBike(id) {
  const bikes = getBikes();
  for (let i = 0; i < bikes.length; i++) {
    if (bikes[i].id === id) {
      return bikes[i];
    }
  }
  return null;
}

// Change one field of one bike, then save
function updateBikeStatus(bikeId, newStatus) {
  const bikes = getBikes();
  for (let i = 0; i < bikes.length; i++) {
    if (bikes[i].id === bikeId) {
      bikes[i].status = newStatus;
    }
  }
  saveBikes(bikes);
}

/* ---------- Date helpers ---------- */

// Today's date as "YYYY-MM-DD" (same format as <input type="date">)
function todayStr() {
  return dateToStr(new Date());
}

function dateToStr(d) {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

// Add (or subtract) days from today
function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return dateToStr(d);
}

// Number of days from start to end (same day = 0)
function daysBetween(start, end) {
  const a = new Date(start + "T00:00:00");
  const b = new Date(end + "T00:00:00");
  return Math.round((b - a) / 86400000);
}

function formatDate(str) {
  if (!str) return "-";
  const d = new Date(str + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/* ---------- Other helpers ---------- */

function formatTaka(amount) {
  return "৳" + Number(amount).toLocaleString("en-IN");
}

// Make a short unique id, e.g. "R482913"
function makeId(prefix) {
  return prefix + Date.now().toString().slice(-6) + Math.floor(Math.random() * 10);
}

// Stop users from injecting HTML when we print their text with innerHTML
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Colored badge for a bike or rental status
function statusBadge(status) {
  let cls = "badge-gray";
  switch (status) {
    case "Available":
    case "Returned":
      cls = "badge-green";
      break;
    case "Rented":
    case "Cancelled":
      cls = "badge-red";
      break;
    case "Maintenance":
      cls = "badge-orange";
      break;
    case "Active":
      cls = "badge-blue";
      break;
  }
  return '<span class="badge ' + cls + '">' + status + "</span>";
}

// Read a value from the page address, e.g. bikes.html?type=Scooter
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/* ---------- Bike pictures (drawn with SVG, so no image files needed) ---------- */

function bikeSVG(type, color) {
  const wheel = "#1f2937";
  let body = "";

  if (type === "Bicycle") {
    body =
      '<circle cx="50" cy="80" r="27" fill="none" stroke="' + wheel + '" stroke-width="5"/>' +
      '<circle cx="152" cy="80" r="27" fill="none" stroke="' + wheel + '" stroke-width="5"/>' +
      '<path d="M50 80 L98 80 L84 40 Z M98 80 L136 40 L84 40 M136 40 L152 80" fill="none" stroke="' + color + '" stroke-width="6" stroke-linejoin="round"/>' +
      '<path d="M84 40 L80 30 M72 30 L92 30" stroke="' + wheel + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M136 40 L132 26 L146 24" fill="none" stroke="' + wheel + '" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="98" cy="80" r="6" fill="' + wheel + '"/>';
  } else if (type === "Scooter") {
    body =
      '<circle cx="52" cy="88" r="19" fill="#fff" stroke="' + wheel + '" stroke-width="8"/>' +
      '<circle cx="152" cy="88" r="19" fill="#fff" stroke="' + wheel + '" stroke-width="8"/>' +
      '<path d="M30 74 Q34 50 72 52 L112 54 L118 80 L58 84 Z" fill="' + color + '" stroke="#00000033"/>' +
      '<rect x="100" y="76" width="42" height="9" rx="3" fill="#374151"/>' +
      '<path d="M128 28 L142 28 L160 86 L142 86 Z" fill="' + color + '" stroke="#00000033"/>' +
      '<path d="M44 52 Q68 38 104 46 L104 54 L44 58 Z" fill="#111827"/>' +
      '<path d="M130 30 L150 20" stroke="' + wheel + '" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="147" cy="36" r="5" fill="#fbbf24"/>';
  } else {
    // Motorbike
    body =
      '<circle cx="46" cy="84" r="24" fill="#fff" stroke="' + wheel + '" stroke-width="9"/>' +
      '<circle cx="158" cy="84" r="24" fill="#fff" stroke="' + wheel + '" stroke-width="9"/>' +
      '<path d="M46 84 L96 70" stroke="#4b5563" stroke-width="6"/>' +
      '<path d="M158 84 L140 38" stroke="#6b7280" stroke-width="7"/>' +
      '<rect x="84" y="60" width="38" height="24" rx="5" fill="#4b5563"/>' +
      '<path d="M70 82 L30 74" stroke="#9ca3af" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M94 46 Q116 30 142 40 L134 62 L96 64 Z" fill="' + color + '" stroke="#00000033"/>' +
      '<path d="M56 50 L98 45 L98 56 L62 60 Z" fill="#111827"/>' +
      '<path d="M34 54 L58 48 L62 60 L40 64 Z" fill="' + color + '" stroke="#00000033"/>' +
      '<path d="M140 38 L128 28" stroke="' + wheel + '" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="150" cy="46" r="6" fill="#fbbf24"/>';
  }

  return '<svg viewBox="0 0 200 115" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + type + ' picture">' + body + "</svg>";
}

// HTML for one bike card (used on Home and Bikes pages)
function bikeCardHTML(bike) {
  let engine = bike.cc > 0 ? bike.cc + "cc" : "Pedal";
  let button = "";
  if (bike.status === "Available") {
    button = '<a href="rent.html?bike=' + bike.id + '" class="btn btn-sm">Rent Now</a>';
  } else {
    button = '<button class="btn btn-sm" disabled>Not Available</button>';
  }

  return (
    '<div class="bike-card">' +
      '<div class="bike-img">' + statusBadge(bike.status) + bikeSVG(bike.type, bike.color) + "</div>" +
      '<div class="bike-body">' +
        "<h3>" + escapeHTML(bike.name) + "</h3>" +
        '<p class="bike-meta">' + bike.type + " &bull; " + engine + " &bull; " + escapeHTML(bike.branch) + "</p>" +
        '<div class="bike-bottom">' +
          '<span class="price">' + formatTaka(bike.pricePerDay) + "<small>/day</small></span>" +
          button +
        "</div>" +
      "</div>" +
    "</div>"
  );
}

/* ---------- Login session ---------- */

function getCurrentUser() {
  const userId = loadData(KEYS.session, null);
  if (userId === null) return null;
  const users = getUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === userId) {
      return users[i];
    }
  }
  return null;
}

function loginUser(user) {
  saveData(KEYS.session, user.id);
}

function logoutUser() {
  localStorage.removeItem(KEYS.session);
  window.location.href = "index.html";
}

// Send visitors to the login page if they are not logged in
function requireLogin() {
  const user = getCurrentUser();
  if (user === null) {
    const here = window.location.pathname.split("/").pop() + window.location.search;
    window.location.href = "login.html?next=" + encodeURIComponent(here);
    return null;
  }
  return user;
}

function requireAdmin() {
  const user = requireLogin();
  if (user !== null && user.role !== "admin") {
    alert("Only the admin can open the dashboard.");
    window.location.href = "index.html";
    return null;
  }
  return user;
}

/* ---------- First-time setup ---------- */

function initData() {
  if (localStorage.getItem(KEYS.bikes) === null) {
    saveBikes(DEFAULT_BIKES);
  }
  if (localStorage.getItem(KEYS.users) === null) {
    saveUsers(DEFAULT_USERS);
  }
  if (localStorage.getItem(KEYS.rentals) === null) {
    // Two sample rentals so the dashboard is not empty
    saveRentals([
      {
        id: "R100001", userId: "U2", customerName: "Rahim Uddin", phone: "01811111111", nid: "1990123456",
        license: "DK0123456789", bikeId: "B104", bikeName: "Suzuki Gixxer SF", bikeType: "Motorbike",
        pricePerDay: 1600, branch: BRANCHES[0], startDate: addDays(-2), endDate: addDays(1), days: 3,
        helmet: true, payment: "bKash", discount: 0, total: 4900, lateFee: 0,
        status: "Active", createdAt: addDays(-3), returnedAt: ""
      },
      {
        id: "R100000", userId: "U3", customerName: "Karim Hasan", phone: "01922222222", nid: "1985987654",
        license: "", bikeId: "B110", bikeName: "Veloce Mountain 27.5", bikeType: "Bicycle",
        pricePerDay: 300, branch: BRANCHES[0], startDate: addDays(-20), endDate: addDays(-12), days: 8,
        helmet: false, payment: "Cash", discount: 240, total: 2160, lateFee: 0,
        status: "Returned", createdAt: addDays(-21), returnedAt: addDays(-12)
      }
    ]);
  }
  if (localStorage.getItem(KEYS.messages) === null) {
    saveMessages([]);
  }
}

// Delete everything and load the starting data again (admin button)
function resetAllData() {
  localStorage.removeItem(KEYS.bikes);
  localStorage.removeItem(KEYS.users);
  localStorage.removeItem(KEYS.rentals);
  localStorage.removeItem(KEYS.messages);
  localStorage.removeItem(KEYS.session);
  initData();
}

/* ---------- Header, menu and toast (used on every page) ---------- */

function setupHeader() {
  // 1. Highlight the link of the current page
  const page = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll("#mainNav a");
  for (let i = 0; i < links.length; i++) {
    if (links[i].getAttribute("href") === page) {
      links[i].classList.add("active");
    }
  }

  // 2. Show Login/Register or the user's name + Logout
  const navUser = document.getElementById("navUser");
  const user = getCurrentUser();
  if (navUser) {
    if (user === null) {
      navUser.innerHTML =
        '<a href="login.html">Login</a>' +
        '<a href="register.html" class="btn btn-sm">Register</a>';
    } else {
      let html = '<span class="hello">Hi, ' + escapeHTML(user.name.split(" ")[0]) + "</span>";
      if (user.role === "admin") {
        html += '<a href="admin.html">Dashboard</a>';
      }
      html += '<button class="btn btn-sm btn-outline" id="logoutBtn">Logout</button>';
      navUser.innerHTML = html;
      document.getElementById("logoutBtn").addEventListener("click", logoutUser);
    }
  }

  // 3. Mobile menu button (☰)
  const menuBtn = document.getElementById("menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      document.getElementById("mainNav").classList.toggle("open");
    });
  }

  // 4. Footer year
  const year = document.getElementById("year");
  if (year) {
    year.innerHTML = new Date().getFullYear();
  }
}

// Small message box at the bottom right. type = "success" or "error"
function showToast(message, type) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.className = "show " + (type || "");
  setTimeout(function () {
    toast.className = "";
  }, 2800);
}

// Show or clear an error under a form field
function setError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorBox = document.getElementById(inputId + "Error");
  if (errorBox) {
    errorBox.innerHTML = message;
  }
  if (input) {
    if (message === "") {
      input.classList.remove("invalid");
    } else {
      input.classList.add("invalid");
    }
  }
}

// Remove a field's red error as soon as the user fixes it
function clearErrorsOnInput() {
  const fields = document.querySelectorAll(".field input, .field select, .field textarea");
  for (let i = 0; i < fields.length; i++) {
    fields[i].addEventListener("input", function () {
      if (this.id) setError(this.id, "");
      if (this.name === "payment") setError("payment", "");
    });
  }
}

// Run on every page
initData();
document.addEventListener("DOMContentLoaded", function () {
  setupHeader();
  clearErrorsOnInput();
});
