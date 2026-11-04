/* =========================================================
   EDIT THIS BLOCK: all your apartment details live here
   ========================================================= */
const CONFIG = {
  name: "Your Apartments",            // <-- put your business / apartment name
  location: "Lagos, Nigeria",         // <-- e.g. "Lekki Phase 1, Lagos"
  addressNote: "Full address shared after booking confirmation.",

  // WhatsApp number, international format, digits only (08035682772 -> 2348035682772)
  whatsappNumber: "2348035682772",

  currency: "₦",
  cautionFee: 50000,                  // refundable, charged once per booking
  checkIn: "2:00 PM",
  checkOut: "12:00 PM",
  maxNights: 60,

  // PRICES AND GUEST LIMITS BELOW ARE PLACEHOLDERS. Replace with your real nightly rates.
  types: [
    {
      id: "three",
      name: "3-Bedroom Apartment",
      units: 1,
      bedrooms: 3,
      maxGuests: 6,
      pricePerNight: 120000,
      image: "images/living-1.jpg",
      blurb: "Our largest space: spacious lounge with feature TV wall, dining area and three bedrooms. Ideal for families and groups."
    },
    {
      id: "two",
      name: "2-Bedroom Apartment",
      units: 4,
      bedrooms: 2,
      maxGuests: 4,
      pricePerNight: 80000,
      image: "images/bedroom-2.jpg",
      blurb: "Two comfortable bedrooms, stylish living room and fully equipped kitchen. Perfect for friends, couples and small families."
    },
    {
      id: "single",
      name: "Single Bedroom",
      units: 2,
      bedrooms: 1,
      maxGuests: 2,
      pricePerNight: 45000,
      image: "images/bedroom-1.jpg",
      blurb: "A cosy, well-furnished room with its own comforts. Great for solo travellers, business trips and short stays."
    }
  ],

  amenities: [
    ["📶", "Fast Wi-Fi"],
    ["❄️", "Air conditioning"],
    ["⚡", "24/7 power backup"],
    ["📺", "Smart TV"],
    ["🍳", "Equipped kitchen"],
    ["🚿", "Hot water"],
    ["🅿️", "Free parking"],
    ["🔒", "Security & CCTV"]
  ],

  gallery: [
    ["images/living-1.jpg", "Living room and dining area"],
    ["images/bedroom-2.jpg", "Bedroom with blue bedding"],
    ["images/kitchen.jpg", "Kitchen"],
    ["images/living-2.jpg", "Living room with TV wall"],
    ["images/dining.jpg", "Dining area"],
    ["images/living-3.jpg", "Lounge with chandelier"],
    ["images/bedroom-1.jpg", "Bedroom"],
    ["images/living-4.jpg", "TV and lounge"]
  ]
};

/* ---------------- Do not edit below unless you want to ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = (n) => CONFIG.currency + Math.round(n).toLocaleString("en-NG");
const waLink = (text) =>
  `https://wa.me/${CONFIG.whatsappNumber}` + (text ? `?text=${encodeURIComponent(text)}` : "");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

/* ---------- Fill page from CONFIG ---------- */
document.title = `${CONFIG.name} | Book Per Night`;
$$("[data-name]").forEach((e) => (e.textContent = CONFIG.name));
$$("[data-location]").forEach((e) => (e.textContent = CONFIG.location));
$$("[data-checkin]").forEach((e) => (e.textContent = CONFIG.checkIn));
$$("[data-checkout]").forEach((e) => (e.textContent = CONFIG.checkOut));
$$("[data-caution]").forEach((e) => (e.textContent = fmt(CONFIG.cautionFee)));
$$("[data-address]").forEach((e) => (e.textContent = CONFIG.addressNote));
$("#year").textContent = new Date().getFullYear();

const totalUnits = CONFIG.types.reduce((a, t) => a + t.units, 0);
const firstStat = $(".strip div strong");
if (firstStat) firstStat.textContent = totalUnits;

/* Apartment cards */
$("#typeCards").innerHTML = CONFIG.types
  .map(
    (t) => `
  <article class="type-card sr">
    <div class="pic">
      <img src="${esc(t.image)}" alt="${esc(t.name)}" loading="lazy">
      <span class="badge">${plural(t.units, "unit")} available</span>
    </div>
    <div class="type-body">
      <h3>${esc(t.name)}</h3>
      <ul class="facts">
        <li><b>${t.bedrooms}</b> bedroom${t.bedrooms > 1 ? "s" : ""}</li>
        <li>Up to <b>${t.maxGuests}</b> guests</li>
      </ul>
      <p>${esc(t.blurb)}</p>
      <div class="price"><strong>${fmt(t.pricePerNight)}</strong><span>/ night</span></div>
      <a href="#book" class="btn btn-primary" data-pick="${t.id}">Book this apartment</a>
    </div>
  </article>`
  )
  .join("");

/* Gallery + lightbox */
$("#galleryGrid").innerHTML = CONFIG.gallery
  .map(([src, alt]) => `<button type="button" class="sr" data-full="${esc(src)}" aria-label="View: ${esc(alt)}"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"></button>`)
  .join("");

const lb = $("#lightbox");
const lbImg = $("#lbImg");
$("#galleryGrid").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-full]");
  if (!b) return;
  lbImg.src = b.dataset.full;
  lbImg.alt = $("img", b).alt;
  lb.hidden = false;
});
lb.addEventListener("click", () => (lb.hidden = true));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") lb.hidden = true; });

/* Amenities */
$("#amenityList").innerHTML = CONFIG.amenities
  .map(([icon, label]) => `<div class="amenity sr"><span>${icon}</span><p>${esc(label)}</p></div>`)
  .join("");

/* WhatsApp buttons (general enquiry) */
$$("[data-wa]").forEach((a) => {
  a.href = waLink(`Hello, I'm interested in booking at ${CONFIG.name}. Is there availability?`);
  a.target = "_blank";
  a.rel = "noopener";
});

/* ---------- Booking form ---------- */
const typeChoice = $("#typeChoice");
typeChoice.innerHTML = CONFIG.types
  .map(
    (t, i) => `
  <div class="opt">
    <input type="radio" name="type" id="type-${t.id}" value="${t.id}" ${i === 1 ? "checked" : ""}>
    <label for="type-${t.id}">
      <span><b>${esc(t.name)}</b><small>${plural(t.units, "unit")} · up to ${t.maxGuests} guests</small></span>
      <span class="p">${fmt(t.pricePerNight)}</span>
    </label>
  </div>`
  )
  .join("");

const nightsEl = $("#nights");
const checkin = $("#checkin");
const unitsSel = $("#units");
const guestsSel = $("#guests");
nightsEl.max = CONFIG.maxNights;

const iso = (d) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};
checkin.min = iso(new Date());

const selectedType = () => CONFIG.types.find((t) => t.id === $("input[name=type]:checked").value);
const nights = () => Math.max(1, Math.min(CONFIG.maxNights, parseInt(nightsEl.value, 10) || 1));
const niceDate = (d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function refreshSelects() {
  const t = selectedType();
  const keepU = unitsSel.value, keepG = guestsSel.value;
  unitsSel.innerHTML = "";
  for (let i = 1; i <= t.units; i++) unitsSel.add(new Option(plural(i, "apartment"), i));
  guestsSel.innerHTML = "";
  const maxG = t.maxGuests * Number(unitsSel.value || 1);
  for (let i = 1; i <= t.maxGuests * t.units; i++) guestsSel.add(new Option(plural(i, "guest"), i));
  if (keepU && Number(keepU) <= t.units) unitsSel.value = keepU;
  if (keepG && Number(keepG) <= t.maxGuests * t.units) guestsSel.value = keepG;
}

function stayDates() {
  if (!checkin.value) return null;
  const start = new Date(checkin.value + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + nights());
  return { start, end };
}

function totals() {
  const t = selectedType();
  const n = nights();
  const u = Number(unitsSel.value || 1);
  const stay = t.pricePerNight * n * u;
  return { t, n, u, stay, caution: CONFIG.cautionFee, total: stay + CONFIG.cautionFee };
}

function updateSummary() {
  const { t, n, u, stay, caution, total } = totals();
  $("#sRate").textContent = `${fmt(t.pricePerNight)} × ${plural(n, "night")}${u > 1 ? " × " + plural(u, "apartment") : ""}`;
  $("#sStay").textContent = fmt(stay);
  $("#sCaution").textContent = fmt(caution);
  $("#sTotal").textContent = fmt(total);
  const d = stayDates();
  $("#sDates").textContent = d ? `${niceDate(d.start)} → ${niceDate(d.end)}` : "Pick a check-in date";
}

typeChoice.addEventListener("change", () => { refreshSelects(); updateSummary(); });
[unitsSel, guestsSel, checkin].forEach((el) => el.addEventListener("change", updateSummary));
nightsEl.addEventListener("input", updateSummary);
nightsEl.addEventListener("blur", () => { nightsEl.value = nights(); updateSummary(); });
$("#minus").addEventListener("click", () => { nightsEl.value = Math.max(1, nights() - 1); updateSummary(); });
$("#plus").addEventListener("click", () => { nightsEl.value = Math.min(CONFIG.maxNights, nights() + 1); updateSummary(); });

/* "Book this apartment" buttons preselect the type */
$$("[data-pick]").forEach((a) =>
  a.addEventListener("click", () => {
    const r = $(`#type-${a.dataset.pick}`);
    if (r) { r.checked = true; refreshSelects(); updateSummary(); }
  })
);

refreshSelects();
updateSummary();

$("#bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const err = $("#formError");
  const fail = (m) => { err.textContent = m; err.hidden = false; };
  err.hidden = true;

  const name = $("#name").value.trim();
  if (!name) return fail("Please enter your name.");
  if (!checkin.value) return fail("Please choose your check-in date.");
  if (checkin.value < checkin.min) return fail("Check-in date cannot be in the past.");

  const { t, n, u, stay, caution, total } = totals();
  const d = stayDates();
  const notes = $("#notes").value.trim();

  const msg = [
    `Hello, I'd like to book at ${CONFIG.name}.`,
    ``,
    `Name: ${name}`,
    `Apartment: ${t.name}${u > 1 ? ` (${u} apartments)` : ""}`,
    `Check-in: ${niceDate(d.start)}`,
    `Check-out: ${niceDate(d.end)}`,
    `Nights: ${n}`,
    `Guests: ${guestsSel.value}`,
    ``,
    `Rate: ${fmt(t.pricePerNight)} per night`,
    `Stay cost: ${fmt(stay)}`,
    `Caution fee (refundable): ${fmt(caution)}`,
    `Total: ${fmt(total)}`,
    notes ? `\nNotes: ${notes}` : null,
    ``,
    `Please confirm availability and payment details. Thank you.`
  ].filter((l) => l !== null).join("\n");

  window.open(waLink(msg), "_blank", "noopener");
});

/* ---------- Nav background on scroll ---------- */
const nav = $("#nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- Scroll reveal ---------- */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }),
    { threshold: 0.12 }
  );
  $$(".sr").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 80}ms`; io.observe(el); });
} else {
  $$(".sr").forEach((el) => el.classList.add("in"));
}
