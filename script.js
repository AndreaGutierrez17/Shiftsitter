// ========== ShiftSitter JS ==========


document.querySelectorAll('.navbar .nav-link').forEach(function (link) {
  link.addEventListener('click', function () {
    var nav = document.getElementById('navMain');
    if (nav && nav.classList.contains('show')) {
      var bsCollapse = bootstrap.Collapse.getOrCreateInstance(nav);
      bsCollapse.hide();
    }
  });
});


var y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// 3) Countdown
(function () {
  var el = document.getElementById('countdown');
  if (!el) return;
  var deadline = new Date('2026-03-01T00:00:00');
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

  setTimeout(() => {
    wrap.style.animation = 'fadeOut .3s ease-in forwards';
    setTimeout(() => wrap.remove(), 400);
  }, 2200);
}

// 8) FORM
var signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // validación bootstrap
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
      ages: fd.get('ages') || '',         
      challenges: fd.get('challenges') || '', 
      premium: (premiumHidden && premiumHidden.value) ? premiumHidden.value : (fd.get('premium') || 'no'),
      consent: fd.get('consent') ? '1' : ''
    };

    // URL publicada como app web
    var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzEZYYnBNRW--KzDUrAy3SFCXv9uEZh35-LXM3CWtRdrMCnAPQMqXQql49DcDuPjJcj/exec';

    // mostrar mensaje centrado
    showCenterSuccess('Thanks! We’ve received your info.');

    // mandar a Google
    fetch(ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).finally(function () {

      
      var drawer = document.getElementById('signupDrawer');
      if (drawer) {
        var off = bootstrap.Offcanvas.getInstance(drawer) || new bootstrap.Offcanvas(drawer);
        off.hide();
      }

      
      signupForm.reset();
      signupForm.classList.remove('was-validated');

    
      document.querySelectorAll('.ss-multi-toggle').forEach(function (t) {
        t.textContent = 'Select…';
      });
      document.querySelectorAll('.ss-multi-panel input[type="checkbox"]').forEach(function (c) {
        c.checked = false;
      });

      
      var agesHidden = document.getElementById('agesHidden');
      var challengesHidden = document.getElementById('challengesHidden');
      if (agesHidden) agesHidden.value = '';
      if (challengesHidden) challengesHidden.value = '';

      // reset premium
      if (premiumHidden) premiumHidden.value = 'no';
      if (premiumStatusText) premiumStatusText.textContent = 'Current: Early access only';
    });
  });
}


(function () {
  var saveBtn = document.getElementById('savePremiumBtn');
  if (!saveBtn) return;

  var STRIPE_LINK = 'https://buy.stripe.com/8x23cw2pc0zQ4DeaOldEs00'; // live

  saveBtn.addEventListener('click', function () {
    var yes = document.getElementById('premiumYes');
  
    if (yes && yes.checked) {
      var premiumHidden = document.getElementById('premiumHidden');
      if (premiumHidden) premiumHidden.value = 'yes';
      var premiumStatusText = document.getElementById('premiumStatusText');
      if (premiumStatusText) premiumStatusText.textContent = 'Current: Premium Founder Pass';

      window.open(STRIPE_LINK, '_blank', 'noopener');
    } else {
      
      var premiumHiddenNo = document.getElementById('premiumHidden');
      if (premiumHiddenNo) premiumHiddenNo.value = 'no';
      var premiumStatus = document.getElementById('premiumStatusText');
      if (premiumStatus) premiumStatus.textContent = 'Current: Early access only';
    }
  });
})();

  // Valida Bootstrap
  (function(){
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', e => {
        if (!form.checkValidity()) { e.preventDefault(); e.stopPropagation(); }
        form.classList.add('was-validated');
      }, false);
    });
  })();

  // Helper: serializa form a objeto
  function formToJSON(form){
    const data = new FormData(form);
    const obj = {};
    data.forEach((v,k) => {
      if (obj[k] !== undefined){
        if (!Array.isArray(obj[k])) obj[k] = [obj[k]];
        obj[k].push(v);
      } else {
        obj[k] = v;
      }
    });
    return obj;
  }

  // ===== PARTNER SUBMIT =====
  document.getElementById('partnerForm').addEventListener('submit', async function(e){
    e.preventDefault();
    if (!this.checkValidity()) return;

    const payload = formToJSON(this);
    try {
      
     const res = await fetch('https://script.google.com/macros/s/AKfycbzEZYYnBNRW--KzDUrAy3SFCXv9uEZh35-LXM3CWtRdrMCnAPQMqXQql49DcDuPjJcj/exec', {
  method: 'POST',
  mode: 'no-cors',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});


document.getElementById('successMsgPartner').classList.remove('d-none');
this.reset();
this.classList.remove('was-validated');
showCenterSuccess('✅ Thanks! We’ve received your request.');

    } catch(err){
      alert('There was a problem sending your request. Please try again.');
      console.error(err);
    }
  });


  // habilitar dropdown en móvil (tap)
  document.querySelectorAll('.dropdown-toggle').forEach(el => {
    el.addEventListener('touchstart', function(e){
      const menu = this.nextElementSibling;
      if(menu && menu.classList.contains('dropdown-menu')){
        e.preventDefault();
        menu.classList.toggle('show');
      }
    });
  });


// ===== COOKIE CONSENT =====
(function(){
  var banner = document.getElementById('cookieBanner');
  if (!banner) return;

  var CONSENT_KEY = 'ss_cookie_consent';

  // Si ya decidió antes, no mostramos nada
  var saved = localStorage.getItem(CONSENT_KEY);
  if (!saved){
    banner.classList.remove('d-none');
  }

  var btnAccept = document.getElementById('cookieAccept');
  var btnReject = document.getElementById('cookieReject');

  function hideBanner(){
    banner.classList.add('d-none');
  }

  if (btnAccept){
    btnAccept.addEventListener('click', function(){
      localStorage.setItem(CONSENT_KEY, 'accepted');
      // 🔹 Aquí en el futuro puedes inicializar Google Analytics, etc.
      hideBanner();
    });
  }

  if (btnReject){
    btnReject.addEventListener('click', function(){
      localStorage.setItem(CONSENT_KEY, 'necessary');

      hideBanner();
    });
  }
})();


// ========== End ShiftSitter JS ==========