// Runs when the login form is submitted
function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (email === "" || password === "") {
    alert("Please enter your email and password.");
    return false;
  }

  // Look for a user with this email and password
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      currentUser = users[i];
      saveAll();

      if (currentUser.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "bikes.html";
      }
      return false;
    }
  }

  alert("Wrong email or password.");
  return false;
}

// Runs when the register form is submitted
function register() {
  let name = document.getElementById("regName").value;
  let email = document.getElementById("regEmail").value;
  let phone = document.getElementById("regPhone").value;
  let password = document.getElementById("regPassword").value;
  let confirmPassword = document.getElementById("regConfirm").value;

  if (name === "") {
    alert("Please enter your name.");
    return false;
  }
  if (!email.includes("@") || !email.includes(".")) {
    alert("Please enter a valid email.");
    return false;
  }
  if (phone.length !== 11 || isNaN(phone)) {
    alert("Mobile number must be 11 digits.");
    return false;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return false;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }

  // The same email cannot register twice
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      alert("This email is already registered.");
      return false;
    }
  }

  // Save the new user and log in
  let newUser = { name: name, email: email, phone: phone, password: password, role: "customer" };
  users.push(newUser);
  currentUser = newUser;
  saveAll();

  alert("Account created! Welcome, " + name + ".");
  window.location.href = "bikes.html";
  return false;
}
