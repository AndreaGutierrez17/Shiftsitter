// ===== Helper: navbar autoclose on click (mobile) =====
document.querySelectorAll('.navbar .nav-link').forEach(l => {
  l.addEventListener('click', () => {
    const nav = document.getElementById('navMain');
    if (nav.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(nav);
      bsCollapse.hide();
    }
  });
});

// ===== Year in footer =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Countdown to Feb 1, 2026 00:00:00 local =====
const deadline = new Date('2026-02-01T00:00:00');
const countdownEl = document.getElementById('countdown');
function tick() {
  const now = new Date();
  let diff = Math.max(0, deadline - now);
  const d = Math.floor(diff / (1000*60*60*24)); diff -= d*86400000;
  const h = Math.floor(diff / (1000*60*60)); diff -= h*3600000;
  const m = Math.floor(diff / (1000*60)); diff -= m*60000;
  const s = Math.floor(diff / 1000);
  countdownEl.textContent = `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
}
tick(); setInterval(tick, 1000);

// ===== State -> City dynamic options =====
const CITY_MAP = {
  'Maryland': ['Baltimore','Columbia','Germantown','Silver Spring','Frederick','Rockville','Gaithersburg','Bethesda','Towson','Bowie','Other'],
  'Virginia': ['Arlington','Alexandria','Fairfax','Norfolk','Richmond','Virginia Beach','Other'],
  'District of Columbia': ['Washington, DC'],
  'Pennsylvania': ['Philadelphia','Pittsburgh','Allentown','Harrisburg','Other'],
  'Delaware': ['Wilmington','Dover','Newark','Other'],
  'West Virginia': ['Charleston','Morgantown','Huntington','Other'],
  'New Jersey': ['Newark','Jersey City','Paterson','Elizabeth','Other'],
  'New York': ['New York City','Buffalo','Rochester','Yonkers','Other'],
  'North Carolina': ['Charlotte','Raleigh','Greensboro','Durham','Other'],
  'Other': ['Other']
};

const stateSelect = document.getElementById('stateSelect');
const cityWrap = document.getElementById('cityWrap');
const citySelect = document.getElementById('citySelect');

function renderCities(state){
  const cities = CITY_MAP[state] || ['Other'];
  citySelect.innerHTML = '<option value="" disabled selected>Select your city</option>' + 
    cities.map(c => `<option>${c}</option>`).join('');
}
stateSelect.addEventListener('change', e => renderCities(e.target.value));

// ===== Form handling + Premium Upsell & Confirmation =====
const signupForm = document.getElementById('signupForm');
const premiumModal = new bootstrap.Modal(document.getElementById('premiumModal'));
const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
const confirmText = document.getElementById('confirmText');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!signupForm.checkValidity()) {
    signupForm.classList.add('was-validated');
    return;
  }

  // Prepara payload para DB
  const formData = new FormData(signupForm);
  const payload = Object.fromEntries(formData.entries());
  payload.state = stateSelect.value;
  payload.city = citySelect.value;

  // Guarda en hidden para que lo tomes en tu integración
  document.getElementById('dbPayload').value = JSON.stringify(payload);

  // TODO: Aquí puedes enviar 'payload' a tu backend / Google Apps Script / Firebase, etc.
  // fetch('TU_ENDPOINT', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})

  // Upsell modal
  premiumModal.show();
});

// Upsell actions
document.getElementById('yesPremium').addEventListener('click', () => {
  // TODO: Reemplaza por tu enlace real de Stripe Checkout
  const STRIPE_CHECKOUT_URL = 'https://checkout.stripe.com/c/pay_your_session_id';
  window.location.href = STRIPE_CHECKOUT_URL;
});

document.getElementById('noPremium').addEventListener('click', () => {
  premiumModal.hide();

  const selectedState = stateSelect.value;
  if (selectedState === 'Maryland') {
    confirmText.innerHTML = `🎉 You’re in! You’ll be among the first families we welcome into the Maryland community as we begin matching parent networks and support circles.`;
  } else {
    confirmText.innerHTML = `Thanks for signing up! We’re currently live in Maryland, but you’re now on the priority list for your state. We’ll notify you when ShiftSitter opens in your area — and early sign-ups will get first access.`;
  }

  confirmModal.show();

  // Cierra el offcanvas para dar sensación de “listo”
  const canvas = document.getElementById('signupCanvas');
  bootstrap.Offcanvas.getOrCreateInstance(canvas).hide();

  // Limpia el form
  signupForm.reset();
  citySelect.innerHTML = '<option value="" selected disabled>Select your city</option>';
});

// ===== Accesibilidad menor =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') signupForm.classList.remove('was-validated');
});

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signupForm');
  const successMsg = document.getElementById('successMsg');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // recolectar datos base
    const data = {};
    const fd = new FormData(form);
    fd.forEach((v, k) => data[k] = v);

    // arrays
    data.ages = Array.from(form.querySelectorAll('input[name="ages[]"]:checked')).map(i => i.value);
    data.challenges = Array.from(form.querySelectorAll('input[name="challenge[]"]:checked')).map(i => i.value);

    console.log('READY TO SAVE →', data);

    // aquí luego pegamos tu fetch a Google / Apps Script
    // fetch('TU_URL', { method:'POST', body: JSON.stringify(data) })

    if (successMsg) successMsg.classList.remove('d-none');

    // limpiar y cerrar después
    setTimeout(() => {
      form.reset();
      form.classList.remove('was-validated');

      const offcanvasEl = document.getElementById('signupDrawer');
      const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (offcanvas) offcanvas.hide();
    }, 1800);
  });
});