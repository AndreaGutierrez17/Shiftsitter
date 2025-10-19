// ===== AOS init =====
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) AOS.init({ once: true });
});

// ===== Year in footer =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Preserve ref=? and set role based on open buttons =====
(function(){
  const qs = new URLSearchParams(location.search);
  const ref = qs.get('ref');
  const refInput = document.getElementById('ref');
  if (ref && refInput) refInput.value = ref;

  // Role switching via triggers (if you add data-role on any button later)
  document.querySelectorAll('[data-bs-target="#signupDrawer"], [href="#signupDrawer"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-role') || 'parent';
      const roleInput = document.getElementById('role');
      if (roleInput) roleInput.value = role;
    });
  });
})();

// ===== ISOLATED Countdown (does NOT pollute global scope) =====
(function countdownModule(){
  const el = document.getElementById('countdown');
  if (!el) return;

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

// ===== Form validation + optional Firebase hook =====
(function formModule(){
  const form = document.getElementById('signupForm');
  const ok = document.getElementById('successMsg');
  if (!form) return;

  // Helper to read multiselect values
  function readMulti(name){
    const sel = form.querySelector(`[name="${name}"]`);
    return sel ? Array.from(sel.selectedOptions).map(o => o.value) : [];
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
      name: fd.get('name'),
      email: fd.get('email'),
      children: Number(fd.get('children')),
      location: fd.get('location'),
      ages: readMulti('ages'),
      challenge: readMulti('challenge'),
      affiliate: !!fd.get('affiliate'),
      consent: !!fd.get('consent'),
      ts: new Date().toISOString(),
      ua: navigator.userAgent
    };

    // === Firebase (optional) ===
    const firebaseConfig = {
      // apiKey: "...",
      // authDomain: "...",
      // projectId: "...",
    };
    try{
      if (firebaseConfig.projectId){
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        await db.collection('early_access').add(payload);
      } else {
        console.log('Payload (no Firebase config yet):', payload);
      }
      ok.classList.remove('d-none');
      setTimeout(()=>{ ok.classList.add('d-none'); form.reset(); }, 2000);
    }catch(err){
      console.error(err);
      alert('Network error. Please try again.');
    }
  });
})();
