// ===== AOS init =====
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) AOS.init({ once: true });
  document.getElementById('year').textContent = new Date().getFullYear();
});

// ===== Preserve ref and set role from triggers =====
(function(){
  const qs = new URLSearchParams(location.search);
  const ref = qs.get('ref');
  const refInput = document.getElementById('ref');
  if (ref && refInput) refInput.value = ref;

  document.querySelectorAll('[data-role]').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-role') || 'parent';
      const roleInput = document.getElementById('role');
      if (roleInput) roleInput.value = role;
    });
  });
})();

// ===== ISOLATED Countdown (unchanged; safe) =====
(function countdownModule(){
  const el = document.getElementById('countdown');
  if (!el) return;

  // Ajustada: objetivo 31 Dic 2025 23:59:59
  const launchDate = new Date("Dec 31, 2025 23:59:59").getTime();

  let timerId;
  function tick(){
    const now = Date.now();
    const distance = launchDate - now;
    if (distance <= 0){
      el.textContent = "🚀 We’re live!";
      if (timerId) clearTimeout(timerId);
      return;
    }
    const days = Math.floor(distance / (1000*60*60*24));
    const hours = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
    const minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((distance % (1000*60)) / 1000);
    el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    timerId = setTimeout(() => requestAnimationFrame(tick), 1000);
  }
  tick();
})();

// ===== Form validation + payload + (optional) sender =====
(function formModule(){
  const form = document.getElementById('signupForm');
  const ok = document.getElementById('successMsg');
  if (!form) return;

  // Helper: read checkbox group values
  function readChecks(name){
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map(i => i.value);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()){
      form.classList.add('was-validated');
      return;
    }

    const fd = new FormData(form);
    const payload = {
      role: fd.get('role') || 'parent',
      source: fd.get('source') || 'site',
      ref: fd.get('ref') || '',
      name: fd.get('name') || '',
      email: fd.get('email') || '',
      children: Number(fd.get('children') || 0),
      location: fd.get('location') || '',
      ages: readChecks('ages'),               // checkbox array
      challenge: readChecks('challenge'),     // checkbox array
      affiliate: !!fd.get('affiliate'),
      consent: !!fd.get('consent'),
      ts: new Date().toISOString(),
      ua: navigator.userAgent
    };

    try{
      // === Sender (elige uno):
      // A) Google Apps Script → Sheets (pega tu URL /exec)
      // const WEB_APP_URL = 'https://script.google.com/macros/s/XXXX/exec';
      // const res = await fetch(WEB_APP_URL, {
      //   method: 'POST', headers: {'Content-Type':'application/json'},
      //   body: JSON.stringify(payload)
      // });
      // const out = await res.json();
      // if (!out.ok) throw new Error(out.error || 'Write failed');

      // B) Solo demo local (mientras tanto)
      console.log('Payload:', payload);

      ok.classList.remove('d-none');
      setTimeout(()=>{ ok.classList.add('d-none'); form.reset(); }, 1800);
    }catch(err){
      console.error(err);
      alert('Network error. Please try again.');
    }
  });
})();
