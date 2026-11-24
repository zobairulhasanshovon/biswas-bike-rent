// Show the bikes. The search box shows only the matching bikes.
function showBikes() {
  let search = document.getElementById("search").value.toLowerCase();
  let html = "";

  for (let i = 0; i < bikes.length; i++) {
    let name = bikes[i].name.toLowerCase();
    if (name.includes(search)) {
      html += bikeCard(bikes[i]);
    }
  }

  if (html === "") {
    html = "<p>No bike found.</p>";
  }
  document.getElementById("bikeList").innerHTML = html;
}

showBikes();
