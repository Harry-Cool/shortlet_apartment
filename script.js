/* =========================================================
   EDIT THIS BLOCK: all your apartment details live here
   ========================================================= */
const CONFIG = {
  name: "Your Apartment Name",
  location: "Lekki, Lagos",
  // WhatsApp number in international format, digits only (no +, spaces or leading 0)
  // Example: Nigerian number 0803 123 4567 becomes 2348031234567
  whatsappNumber: "2348000000000",
  currency: "₦",
  pricePerNight: 50000,
  cleaningFee: 0,          // one-time fee, set 0 to hide from the estimate
  minNights: 1,
  maxGuests: 4,
  bedrooms: 2,
  bathrooms: 2,
  checkIn: "2:00 PM",
  checkOut: "12:00 PM",
  about: "Welcome to our bright, modern apartment in a quiet and secure neighbourhood. Ideal for business trips, holidays and family stays. Close to restaurants, supermarkets and major roads.",
  addressNote: "Full address shared after booking confirmation.",
  amenities: [
    ["📶", "Fast Wi-Fi"],
    ["❄️", "Air conditioning"],
    ["⚡", "24/7 power backup"],
    ["📺", "Smart TV"],
    ["🍳", "Equipped kitchen"],
    ["🚿", "Hot water"],
    ["🅿️", "Free parking"],
    ["🔒", "Security & CCTV"]
  ]
};

/* ---------------- Do not edit below unless you want to ---------------- */
const $ = (s) => document.querySelector(s);
const fmt = (n) => CONFIG.currency + Math.round(n).toLocaleString("en-NG");
const waLink = (text) =>
  `https://wa.me/${CONFIG.whatsappNumber}` + (text ? `?text=${encodeURIComponent(text)}` : "");

/* Fill page content from CONFIG */
document.title = `${CONFIG.name} | Book Your Stay`;
$("#brandName").textContent = CONFIG.name;
$("#footName").textContent = CONFIG.name;
$("#heroLocation").textContent = CONFIG.location;
$("#qBeds").textContent = CONFIG.bedrooms;
$("#qBaths").textContent = CONFIG.bathrooms;
$("#qGuests").textContent = CONFIG.maxGuests;
$("#aboutText").textContent = CONFIG.about;
$("#checkIn").textContent = CONFIG.checkIn;
$("#checkOut").textContent = CONFIG.checkOut;
$("#priceDisplay").textContent = fmt(CONFIG.pricePerNight);
$("#addressLine").textContent = CONFIG.addressNote;
$("#year").textContent = new Date().getFullYear();

$("#amenityList").innerHTML = CONFIG.amenities
  .map(([icon, label]) => `<div class="amenity"><span>${icon}</span><p>${label}</p></div>`)
  .join("");

const guestSel = $("#guests");
for (let i = 1; i <= CONFIG.maxGuests; i++) {
  guestSel.add(new Option(`${i} guest${i > 1 ? "s" : ""}`, i));
}

/* WhatsApp buttons (general enquiry) */
document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = waLink(`Hello, I'm interested in ${CONFIG.name}. Is it available?`);
  a.target = "_blank";
  a.rel = "noopener";
});

/* Date handling */
const ci = $("#checkin");
const co = $("#checkout");
const iso = (d) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};
const today = new Date();
ci.min = iso(today);
co.min = iso(today);

const nightsBetween = () => {
  if (!ci.value || !co.value) return 0;
  const a = new Date(ci.value + "T00:00:00");
  const b = new Date(co.value + "T00:00:00");
  return Math.round((b - a) / 86400000);
};

function updateSummary() {
  const n = nightsBetween();
  const box = $("#summary");
  if (n > 0) {
    $("#sNights").textContent = n;
    $("#sTotal").textContent = fmt(n * CONFIG.pricePerNight + CONFIG.cleaningFee);
    box.hidden = false;
  } else {
    box.hidden = true;
  }
}

ci.addEventListener("change", () => {
  if (ci.value) {
    const next = new Date(ci.value + "T00:00:00");
    next.setDate(next.getDate() + CONFIG.minNights);
    co.min = iso(next);
    if (co.value && co.value < co.min) co.value = co.min;
  }
  updateSummary();
});
co.addEventListener("change", updateSummary);

/* Submit: validate, then open WhatsApp with details prefilled */
$("#bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const err = $("#formError");
  const name = $("#name").value.trim();
  const n = nightsBetween();

  const fail = (msg) => { err.textContent = msg; err.hidden = false; };
  err.hidden = true;

  if (!name) return fail("Please enter your name.");
  if (!ci.value || !co.value) return fail("Please choose your check-in and check-out dates.");
  if (n < CONFIG.minNights) return fail(`Minimum stay is ${CONFIG.minNights} night${CONFIG.minNights > 1 ? "s" : ""}.`);

  const total = n * CONFIG.pricePerNight + CONFIG.cleaningFee;
  const notes = $("#notes").value.trim();
  const lines = [
    `Hello, I'd like to book ${CONFIG.name}.`,
    ``,
    `Name: ${name}`,
    `Check-in: ${ci.value}`,
    `Check-out: ${co.value}`,
    `Nights: ${n}`,
    `Guests: ${guestSel.value}`,
    `Estimated total: ${fmt(total)}`,
    notes ? `Notes: ${notes}` : null,
    ``,
    `Please confirm availability.`
  ].filter((l) => l !== null);

  window.open(waLink(lines.join("\n")), "_blank", "noopener");
});
