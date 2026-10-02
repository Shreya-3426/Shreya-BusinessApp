// SETTINGS: change these two lines to your own details
const OWNER_EMAIL = "shreya.sinha_mba25@gsv.ac.in";   // enquiries are emailed here
const WHATSAPP_NUMBER = "917667048474";        // country code + number, no + or spaces

// Sample shipment records (replace with real data / an API in a real system)
const shipments = {
  TRK1021: {status:"Delivered", cls:"ok", cargo:"Steel coils, 24 t", location:"Delivered at Pune plant", eta:"Delivered 02 Oct, 4:10 PM", vehicle:"MH-12-AB-4471", partner:"Ramesh Patil (driver)", contact:"+91 90000 11021"},
  TRK1023: {status:"Delayed", cls:"bad", cargo:"Chemical drums, 18 t", location:"NH-48, near Vadodara (road work)", eta:"04 Oct, 9:30 PM (2 h late)", vehicle:"GJ-05-CT-2290", partner:"Imran Shaikh (driver)", contact:"+91 90000 11023"},
  TRK1025: {status:"In Transit", cls:"transit", cargo:"Auto parts, 12 t", location:"NH-44, near Nagpur", eta:"03 Oct, 8:00 PM", vehicle:"MH-31-TX-8812", partner:"Suresh Kumar (driver)", contact:"+91 90000 11025"}
};

const form = document.getElementById("trackForm");
const input = document.getElementById("shipId");
const out = document.getElementById("result");

function track(id) {
  const s = shipments[id.trim().toUpperCase()];
  if (!s) {
    out.innerHTML = '<div class="card bad"><b>No shipment found for "' + id.replace(/[<>&"]/g, "") + '".</b> Check the ID and try again, for example TRK1025.</div>';
    return;
  }
  out.innerHTML = '<div class="card ' + s.cls + '"><div class="status">' + s.status + '</div><dl>' +
    '<dt>Cargo</dt><dd>' + s.cargo + '</dd><dt>Location</dt><dd>' + s.location + '</dd>' +
    '<dt>Expected</dt><dd>' + s.eta + '</dd><dt>Vehicle</dt><dd>' + s.vehicle + '</dd>' +
    '<dt>Driver</dt><dd>' + s.partner + '</dd><dt>Contact</dt><dd>' + s.contact + '</dd></dl></div>';
}

form.addEventListener("submit", e => { e.preventDefault(); track(input.value); });
document.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => { input.value = c.dataset.id; track(c.dataset.id); }));

// Enquiry form: sends an email to OWNER_EMAIL (FormSubmit service) and shows a message on the page
const enq = document.getElementById("enquiryForm");
const msg = document.getElementById("formMsg");
enq.addEventListener("submit", async e => {
  e.preventDefault();
  const btn = enq.querySelector("button[type=submit]");
  btn.disabled = true;
  msg.textContent = "Sending...";
  const data = new FormData(enq);
  data.append("_subject", "New transport enquiry from " + data.get("name"));
  data.append("_captcha", "false");
  try {
    const r = await fetch("https://formsubmit.co/ajax/" + OWNER_EMAIL, {method: "POST", headers: {Accept: "application/json"}, body: data});
    const res = await r.json();
    if (!r.ok || String(res.success) !== "true") throw new Error();
    msg.textContent = "Thank you. Your enquiry was sent. We will call you within one working day.";
    enq.reset();
  } catch (err) {
    msg.textContent = "The enquiry could not be sent. Check your internet connection or use the WhatsApp button.";
  }
  btn.disabled = false;
});

// WhatsApp button: opens WhatsApp with the form details as a ready message
document.getElementById("waBtn").addEventListener("click", function () {
  const f = new FormData(enq);
  const text = "Hello IndusMove, I am " + (f.get("name") || "a customer") + ". I need a quote for " + f.get("cargo") + ". " + (f.get("message") || "");
  this.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
});

// Dashboard chart
Chart.defaults.color = "#cfd9e6";
Chart.defaults.borderColor = "#28405c";
new Chart(document.getElementById("tripChart"), {
  type: "bar",
  data: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {label: "On time", data: [318, 335, 342, 330], backgroundColor: "#4aa3ff"},
      {label: "Delayed", data: [27, 21, 18, 29], backgroundColor: "#ff8c1a"}
    ]
  },
  options: {responsive: true, maintainAspectRatio: false, scales: {x: {stacked: true}, y: {stacked: true, title: {display: true, text: "Trips"}}}}
});

document.getElementById("yr").textContent = new Date().getFullYear();
