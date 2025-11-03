// 1) Cerrar navbar en móvil
document.querySelectorAll('.navbar .nav-link').forEach(function (link) {
  link.addEventListener('click', function () {
    var nav = document.getElementById('navMain');
    if (nav && nav.classList.contains('show')) {
      var bsCollapse = bootstrap.Collapse.getOrCreateInstance(nav);
      bsCollapse.hide();
    }
  });
});

// 2) Año en footer
var y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// 3) Countdown
(function () {
  var el = document.getElementById('countdown');
  if (!el) return;
  var deadline = new Date('2026-02-01T00:00:00');
  function tick() {
    var now = new Date();
    var diff = deadline - now;
    if (diff <= 0) {
      el.textContent = 'Launching soon';
      return;
    }
    var d = Math.floor(diff / 86400000);
    diff -= d * 86400000;
    var h = Math.floor(diff / 3600000);
    diff -= h * 3600000;
    var m = Math.floor(diff / 60000);
    diff -= m * 60000;
    var s = Math.floor(diff / 1000);
    if (h < 10) h = '0' + h;
    if (m < 10) m = '0' + m;
    if (s < 10) s = '0' + s;
    el.textContent = d + 'd ' + h + 'h ' + m + 'm ' + s + 's';
  }
  tick();
  setInterval(tick, 1000);
})();

// 4) MULTI tipo Fiverr (ages + challenges)
function initMultiSelects() {
  var blocks = document.querySelectorAll('.ss-multi');
  blocks.forEach(function (blk) {
    var toggle = blk.querySelector('.ss-multi-toggle');
    var panel = blk.querySelector('.ss-multi-panel');
    var targetId = blk.getAttribute('data-target');
    var hidden = document.getElementById(targetId);
    if (!toggle || !panel || !hidden) return;

    toggle.addEventListener('click', function () {
      panel.classList.toggle('show');
    });

    panel.querySelectorAll('input[type="checkbox"]').forEach(function (chk) {
      chk.addEventListener('change', function () {
        var selected = [];
        panel.querySelectorAll('input[type="checkbox"]').forEach(function (c) {
          if (c.checked) selected.push(c.value);
        });
        hidden.value = selected.join(', ');
        toggle.textContent = selected.length ? selected.join(', ') : 'Select…';
      });
    });

    document.addEventListener('click', function (ev) {
      if (!blk.contains(ev.target)) panel.classList.remove('show');
    });
  });
}
initMultiSelects();

// 5) Premium modal
var premiumHidden = document.getElementById('premiumHidden');
var premiumStatusText = document.getElementById('premiumStatusText');
var savePremiumBtn = document.getElementById('savePremiumBtn');

if (savePremiumBtn) {
  savePremiumBtn.addEventListener('click', function () {
    var yes = document.getElementById('premiumYes');
    if (yes && yes.checked) {
      if (premiumHidden) premiumHidden.value = 'yes';
      if (premiumStatusText) premiumStatusText.textContent = 'Current: Premium Founder Pass';
    } else {
      if (premiumHidden) premiumHidden.value = 'no';
      if (premiumStatusText) premiumStatusText.textContent = 'Current: Early access only';
    }
  });
}

// ✅ Mensaje centrado con animación
function showCenterSuccess(msg) {
  var old = document.getElementById('ss-success-overlay');
  if (old) old.remove();

  var wrap = document.createElement('div');
  wrap.id = 'ss-success-overlay';
  Object.assign(wrap.style, {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    animation: 'fadeIn .3s ease-out'
  });

  var box = document.createElement('div');
  Object.assign(box.style, {
    background: '#0f172a',
    color: '#fff',
    padding: '28px 36px',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,.25)',
    minWidth: '280px',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: '17px',
    transform: 'scale(0.9)',
    opacity: '0',
    animation: 'popIn .4s ease-out forwards'
  });

  box.innerHTML = `
    <div style="font-size:40px;line-height:1;margin-bottom:10px;">✅</div>
    ${msg}
  `;

  wrap.appendChild(box);
  document.body.appendChild(wrap);

  // auto quitar después de 2.2s
  setTimeout(() => {
    wrap.style.animation = 'fadeOut .3s ease-in forwards';
    setTimeout(() => wrap.remove(), 400);
  }, 2200);
}

// Animaciones
const styleAnim = document.createElement('style');
styleAnim.textContent = `
@keyframes fadeIn { from {opacity: 0;} to {opacity: 1;} }
@keyframes fadeOut { from {opacity: 1;} to {opacity: 0;} }
@keyframes popIn {
  0% {transform: scale(0.9); opacity: 0;}
  80% {transform: scale(1.05); opacity: 1;}
  100% {transform: scale(1); opacity: 1;}
}`;
document.head.appendChild(styleAnim);

// 6) FORM
var signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!signupForm.checkValidity()) {
      signupForm.classList.add('was-validated');
      return;
    }

    var fd = new FormData(signupForm);
    var data = {
      name: fd.get('name') || '',
      email: fd.get('email') || '',
      children: fd.get('children') || '',
      state: fd.get('state') || '',
      city: fd.get('city') || '',
      source: fd.get('source') || 'site',
      ref: fd.get('ref') || '',
      premium: (premiumHidden && premiumHidden.value) ? premiumHidden.value : (fd.get('premium') || 'no'),
      consent: fd.get('consent') ? '1' : '',
      ages: fd.getAll('ages[]'),
      challenges: fd.getAll('challenge[]')
    };

    var ENDPOINT = 'https://script.google.com/macros/s/AKfycbwTJRCZoW45VmnnC3F2fUH7vHZJRd_TiM5CiHjZDM9N7re_PfIjpsRhTPlCQrix0TtLuQ/exec';

  
    showCenterSuccess('✅ Thanks! We’ve received your info.');

    fetch(ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).finally(function () {
    
      signupForm.reset();
      signupForm.classList.remove('was-validated');
      document.querySelectorAll('.ss-multi-toggle').forEach(t => t.textContent = 'Select…');
      document.querySelectorAll('.ss-multi-panel input[type="checkbox"]').forEach(c => (c.checked = false));

      var agesHidden = document.getElementById('agesHidden');
      var challengesHidden = document.getElementById('challengesHidden');
      if (agesHidden) agesHidden.value = '';
      if (challengesHidden) challengesHidden.value = '';

      if (premiumHidden) premiumHidden.value = 'no';
      if (premiumStatusText) premiumStatusText.textContent = 'Current: Early access only';
    });
  });
}