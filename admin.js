// Only the admin can open this page
if (currentUser === null || currentUser.role !== "admin") {
  alert("Only the admin can open this page.");
  window.location.href = "login.html";
}

// The numbers at the top
function showNumbers() {
  let available = 0;
  let rented = 0;
  for (let i = 0; i < bikes.length; i++) {
    if (bikes[i].status === "Available") {
      available++;
    } else {
      rented++;
    }
  }

  let income = 0;
  for (let i = 0; i < bookings.length; i++) {
    income = income + bookings[i].total;
  }

  document.getElementById("totalBikes").innerHTML = bikes.length;
  document.getElementById("availableBikes").innerHTML = available;
  document.getElementById("rentedBikes").innerHTML = rented;
  document.getElementById("totalBookings").innerHTML = bookings.length;
  document.getElementById("income").innerHTML = income;
}

// The bikes table
function showBikeTable() {
  let rows = "";
  for (let i = 0; i < bikes.length; i++) {
    rows += "<tr>" +
              "<td>" + bikes[i].id + "</td>" +
              "<td>" + bikes[i].name + "</td>" +
              "<td>" + bikes[i].cc + "cc</td>" +
              "<td>" + bikes[i].branch + "</td>" +
              "<td>" + bikes[i].price + " Taka</td>" +
              "<td>" + statusLabel(bikes[i].status) + "</td>" +
              '<td><button class="btn btn-small btn-red" onclick="deleteBike(' + i + ')">Delete</button></td>' +
            "</tr>";
  }
  document.getElementById("bikeTable").innerHTML = rows;
}

// Add a new bike from the form
function addBike() {
  let name = document.getElementById("newName").value;
  let cc = Number(document.getElementById("newCc").value);
  let price = Number(document.getElementById("newPrice").value);
  let branch = document.getElementById("newBranch").value;

  if (name === "" || cc <= 0 || price <= 0) {
    alert("Please enter the bike name, engine and price.");
    return false;
  }

  // New id = last bike's number + 1 (B106 -> B107)
  let newId = "B101";
  if (bikes.length > 0) {
    let lastNumber = Number(bikes[bikes.length - 1].id.substring(1));
    newId = "B" + (lastNumber + 1);
  }

  bikes.push({ id: newId, name: name, cc: cc, price: price, branch: branch, status: "Available" });
  saveAll();
  showAll();
  alert(name + " added.");
  document.getElementById("newName").value = "";
  return false;
}

// Delete a bike
function deleteBike(i) {
  if (bikes[i].status === "Rented") {
    alert("This bike is rented. You cannot delete it now.");
    return;
  }
  if (confirm("Delete " + bikes[i].name + "?")) {
    bikes.splice(i, 1);
    saveAll();
    showAll();
  }
}

// The bookings table
function showBookingTable() {
  let rows = "";
  for (let i = 0; i < bookings.length; i++) {
    let action = "-";
    if (bookings[i].status === "Active") {
      action = '<button class="btn btn-small" onclick="bikeReturned(' + i + ')">Returned</button>';
    }
    rows += "<tr>" +
              "<td>" + bookings[i].id + "</td>" +
              "<td>" + bookings[i].name + "</td>" +
              "<td>" + bookings[i].phone + "</td>" +
              "<td>" + bookings[i].bikeName + "</td>" +
              "<td>" + bookings[i].startDate + "</td>" +
              "<td>" + bookings[i].endDate + "</td>" +
              "<td>" + bookings[i].total + " Taka</td>" +
              "<td>" + bookings[i].payment + "</td>" +
              "<td>" + statusLabel(bookings[i].status) + "</td>" +
              "<td>" + action + "</td>" +
            "</tr>";
  }
  document.getElementById("bookingTable").innerHTML = rows;
}

// The customer brought the bike back
function bikeReturned(i) {
  bookings[i].status = "Returned";
  let bike = findBike(bookings[i].bikeId);
  if (bike !== null) {
    bike.status = "Available";
  }
  saveAll();
  showAll();
}

function showAll() {
  showNumbers();
  showBikeTable();
  showBookingTable();
}

showAll();
