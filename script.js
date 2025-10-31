// ===== Helper: navbar autoclose on click (mobile) =====
document.querySelectorAll('.navbar .nav-link').forEach(l => {
  l.addEventListener('click', () => {
    const nav = document.getElementById('navMain');
    if (nav && nav.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(nav);
      bsCollapse.hide();
    }
  });
});

// ===== Year in footer =====
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ===== Countdown =====
const countdownEl = document.getElementById('countdown');
const deadline = new Date('2026-02-01T00:00:00');

function tick() {
  if (!countdownEl) return;
  const now = new Date();
  let diff = Math.max(0, deadline - now);

  const d = Math.floor(diff / 86400000); diff -= d * 86400000;
  const h = Math.floor(diff / 3600000);   diff -= h * 3600000;
  const m = Math.floor(diff / 60000);     diff -= m * 60000;
  const s = Math.floor(diff / 1000);

  countdownEl.textContent = `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
}

tick();
setInterval(tick, 1000);

// =================== FORM ===================

// TU endpoint de Apps Script
const GSHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbzYzmDYpLp-M_dJUcoSVI4LeHY3SqboQV9b8eD_E_THRqD-vssvFmzQA1ODs4ItHYu2ng/exec";

const signupForm = document.getElementById('signupForm');
const successMsg = document.getElementById('successMsg');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // validación bootstrap
    if (!signupForm.checkValidity()) {
      signupForm.classList.add('was-validated');
      return;
    }

    // recolectar datos
    const fd = new FormData(signupForm);
    const data = Object.fromEntries(fd.entries());

    // edades múltiples
    data.ages = Array.from(
      signupForm.querySelectorAll('input[name="ages[]"]:checked')
    ).map(i => i.value);

    // retos múltiples
    data.challenges = Array.from(
      signupForm.querySelectorAll('input[name="challenge[]"]:checked')
    ).map(i => i.value);

    // enviar a Google
    try {
      await fetch(GSHEET_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn('No se pudo enviar a Google:', err);
      // igual mostramos success para no espantar al usuario
    }

    // mostrar mensajito
    if (successMsg) {
      successMsg.classList.remove('d-none');
    }

    // cerrar offcanvas y limpiar
    setTimeout(() => {
      // cerrar offcanvas
      const offcanvasEl = document.getElementById('signupDrawer');
      if (offcanvasEl) {
        const off = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);
        off.hide();
      }

      // ocultar mensaje
      if (successMsg) {
        successMsg.classList.add('d-none');
      }

      // limpiar formulario
      signupForm.reset();
      signupForm.classList.remove('was-validated');
    }, 1500);
  });
}