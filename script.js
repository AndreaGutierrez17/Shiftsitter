// Init AOS
if (window.AOS) AOS.init();

// Current year
document.getElementById('year').textContent = new Date().getFullYear();

// Countdown to Feb 1, 2026 00:00:00
const countdownEl = document.getElementById("countdown");
const launchDate = new Date("Feb 1, 2026 00:00:00").getTime();

(function startCountdown(){
  function tick(){
    const now = Date.now();
    const distance = launchDate - now;

    if (distance <= 0){
      countdownEl.textContent = "🚀 We’re live!";
      return;
    }
    const d = Math.floor(distance / (1000*60*60*24));
    const h = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
    const m = Math.floor((distance % (1000*60*60)) / (1000*60));
    const s = Math.floor((distance % (1000*60)) / 1000);
    countdownEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
  }
  tick();
  setInterval(tick, 1000);
})();

// Auto-close navbar on link click (hamburger)
document.querySelectorAll('.navbar .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const nav = document.getElementById('navMain');
    if (nav && nav.classList.contains('show')) {
      const bs = bootstrap.Collapse.getInstance(nav);
      if (bs) bs.hide();
    }
  });
});

// Populate US states (MD preselected)
const states = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota",
  "Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon",
  "Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah",
  "Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

(function fillStates(){
  const sel = document.getElementById('state');
  if (!sel) return;
  sel.innerHTML = `<option value="" disabled selected>Select your state</option>` +
    states.map(st => `<option value="${st}" ${st==="Maryland"?"selected":""}>${st}</option>`).join("");
})();

// Referral param capture (?ref=xxx)
(function captureRef(){
  const params = new URLSearchParams(location.search);
  const ref = params.get("ref");
  if (ref) {
    const refInput = document.getElementById("ref");
    if (refInput) refInput.value = ref;
  }
})();

// Form validation + Success + Upsell
const form = document.getElementById("signupForm");
const successMsg = document.getElementById("successMsg");
const upsellModalEl = document.getElementById('upsellModal');
const upsellModal = upsellModalEl ? new bootstrap.Modal(upsellModalEl) : null;

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()){
      form.classList.add('was-validated');
      return;
    }

    // TODO: Database integration (Firebase/Backend) goes here.
    // Gather payload
    const data = new FormData(form);
    // Example: console.log(Object.fromEntries(data.entries()));

    // Show upsell after “submission”
    if (upsellModal) upsellModal.show();
  });
}

// Upsell actions
if (upsellModalEl){
  upsellModalEl.addEventListener('click', (ev) => {
    const yes = ev.target.closest('[data-upsell="yes"]');
    const no  = ev.target.closest('[data-upsell="no"]');

    if (yes){
      // Redirect to Stripe (placeholder)
      window.location.href = "https://checkout.stripe.com/pay/STRIPE_CHECKOUT_URL";
    }
    if (no){
      // Continue with standard confirmation
      if (successMsg) successMsg.classList.remove("d-none");
      setTimeout(() => {
        successMsg?.classList.add("d-none");
        form?.reset();
      }, 2500);
      upsellModal?.hide();
    }
  });
}