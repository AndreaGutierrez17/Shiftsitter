AOS.init();

// Countdown
const countdownEl = document.getElementById('countdown');
const targetDate = new Date('2025-12-01T00:00:00').getTime();

const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    countdownEl.innerText = "We're Live!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  countdownEl.innerText = `${days}d ${hours}h ${minutes}m`;
};

setInterval(updateCountdown, 1000);
updateCountdown();

// Form
const form = document.getElementById('signupForm');
form.addEventListener('submit', function(e){
  e.preventDefault();
  if(!form.checkValidity()){
    form.classList.add('was-validated');
    return;
  }
  document.getElementById('successMsg').classList.remove('d-none');
  setTimeout(()=>{
    document.getElementById('successMsg').classList.add('d-none');
    form.reset();
  }, 2500);
});

/* ===== COUNTDOWN ROBUSTO =====
   Usa data-deadline si lo pones en el HTML.
   Si no, toma 15 Dic 2025 17:00 UTC como default.
*/
(function () {
  const el = document.getElementById('countdown');
  if (!el) return;

  // 1) Fecha objetivo
  const attr = el.getAttribute('data-deadline');
  // Ejemplo para MX/CDMX: data-deadline="2025-12-15T11:00:00-06:00"
  // Ejemplo para NY (ET): data-deadline="2025-12-15T12:00:00-05:00"
  const deadline = attr ? new Date(attr) : new Date(Date.UTC(2025, 11, 15, 17, 0, 0)); // 15 Dic 2025 17:00 UTC

  function pad(n){ return String(n).padStart(2,'0'); }

  function tick() {
    const now = new Date();
    let diff = deadline - now;

    if (isNaN(deadline.getTime())) {
      el.textContent = 'Set a valid date';
      return;
    }

    if (diff <= 0) {
      el.textContent = "We’re live!";
      clearInterval(timer);
      return;
    }

    const d = Math.floor(diff / 86400000); diff %= 86400000;
    const h = Math.floor(diff / 3600000);  diff %= 3600000;
    const m = Math.floor(diff / 60000);    diff %= 60000;
    const s = Math.floor(diff / 1000);

    el.textContent = `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  }

  tick();
  const timer = setInterval(tick, 1000);
})();

