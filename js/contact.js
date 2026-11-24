// Runs when the contact form is submitted
function sendMessage() {
  let name = document.getElementById("cName").value;
  let email = document.getElementById("cEmail").value;
  let message = document.getElementById("cMessage").value;

  if (name === "" || email === "" || message === "") {
    alert("Please fill in all the fields.");
    return false;
  }
  if (!email.includes("@") || !email.includes(".")) {
    alert("Please enter a valid email.");
    return false;
  }

  alert("Thank you, " + name + "! We will reply soon.");
  document.getElementById("contactForm").reset();
  return false;
}
