
function showTab(tab) {
  document.querySelectorAll(".tab-content").forEach(el => el.style.display = "none");
  document.getElementById(tab).style.display = "block";
}
function appendNumber(num) {
  document.getElementById("dial-input").value += num;
}
function makeCall() {
  const number = document.getElementById("dial-input").value;
  alert("Calling " + number);
}
function searchContacts() {
  const searchValue = document.getElementById("search").value.toLowerCase();
  const contacts = document.querySelectorAll("#contact-list li");
  contacts.forEach(contact => {
    contact.style.display = contact.textContent.toLowerCase().includes(searchValue) ? "" : "none";
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(() => {
    console.log("✅ Service Worker registered.");
  });
}
