// ========== ShiftSitter JS ==========

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

// 5) Premium modal → poner valor en hidden
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

// ===== helper para mostrar el popup centrado =====
function showCenterSuccess(msg) {
  // si ya hay uno, lo quitamos
  var old = document.getElementById('ss-success-overlay');
  if (old) old.remove();

  var wrap = document.createElement('div');
  wrap.id = 'ss-success-overlay';
  wrap.style.position = 'fixed';
  wrap.style.inset = '0';
  wrap.style.background = 'rgba(0,0,0,.45)';
  wrap.style.display = 'flex';
  wrap.style.alignItems = 'center';
  wrap.style.justifyContent = 'center';
  wrap.style.zIndex = '9999';

  var box = document.createElement('div');
  box.style.background = '#0f172a';
  box.style.color = '#fff';
  box.style.padding = '20px 26px';
  box.style.borderRadius = '14px';
  box.style.boxShadow = '0 20px 40px rgba(0,0,0,.25)';
  box.style.minWidth = '260px';
  box.style.textAlign = 'center';
  box.style.fontWeight = '500';
  box.innerHTML = '<div style="font-size:30px;line-height:1;margin-bottom:8px;">✅</div>' + msg;

  wrap.appendChild(box);
  document.body.appendChild(wrap);

  return wrap;
}

// 6) FORM
var signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // validación bootstrap
    if (!signupForm.checkValidity()) {
      signupForm.classList.add('was-validated');
      return;
    }

    // recoger datos
    var fd = new FormData(signupForm);
    var data = {};
    fd.forEach(function (val, key) {
      data[key] = val;
    });

    // ======= TU ENDPOINT DE GOOGLE =========
    var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzYzmDYpLp-M_dJUcoSVI4LeHY3SqboQV9b8eD_E_THRqD-vssvFmzQA1ODs4ItHYu2ng/exec';
    // ======================================

    // mostrar SUCCESS al toque para que lo veas
    var overlay = showCenterSuccess('Thanks! We’ve received your info.');

    fetch(ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(function (err) {
      console.warn('No se pudo mandar a Google, pero mostramos OK', err);
    }).finally(function () {

      setTimeout(function () {
        // quitar overlay
        if (overlay) overlay.remove();

        // cerrar offcanvas
        var drawer = document.getElementById('signupDrawer');
        if (drawer) {
          var off = bootstrap.Offcanvas.getInstance(drawer) || new bootstrap.Offcanvas(drawer);
          off.hide();
        }

        // reset form
        signupForm.reset();
        signupForm.classList.remove('was-validated');

        // reset selects tipo Fiverr
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

        if (premiumHidden) premiumHidden.value = 'no';
        if (premiumStatusText) premiumStatusText.textContent = 'Current: Early access only';

      }, 1500);
    });
  });
}