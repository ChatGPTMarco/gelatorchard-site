/* ============================================================
   GELATORCHARD, /business · Capitolo 6
   Tab B2B + form preventivi condiviso. Nessun pagamento: tutto
   a preventivo/contatto. Il form è in "pre-launch preview": al
   lancio va collegato all'endpoint email/Slack di Marco.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Tab ---------- */
  var tabs = document.querySelectorAll('.biz-tabs .flavor-tab');
  function showTab(name) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === name;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    document.querySelectorAll('.biz-panel').forEach(function (p) {
      p.hidden = p.getAttribute('data-panel') !== name;
    });
  }
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { showTab(tab.getAttribute('data-tab')); });
  });

  /* CTA delle tab → scroll al form + preselezione tipo richiesta */
  document.querySelectorAll('a[data-request]').forEach(function (a) {
    a.addEventListener('click', function () {
      document.getElementById('bf-type').value = a.getAttribute('data-request');
    });
  });

  /* ---------- Form (validazione + conferma preview) ---------- */
  document.getElementById('bf-send').addEventListener('click', function () {
    var hint = document.getElementById('bf-hint');
    var name = document.getElementById('bf-name').value.trim();
    var email = document.getElementById('bf-email').value.trim();
    var type = document.getElementById('bf-type').value;
    if (!name) { hint.textContent = 'Please tell us your name'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { hint.textContent = 'Please enter a valid email address'; return; }
    if (!type) { hint.textContent = 'Please pick a request type'; return; }
    hint.textContent = '';
    document.getElementById('biz-form').hidden = true;
    document.getElementById('biz-done-msg').textContent =
      'Thanks, ' + name + ', your ' + type.toLowerCase() + ' enquiry is on its way to Marco.';
    document.getElementById('biz-done').hidden = false;

    /* Invio al webhook (email/Slack di Marco) quando configurato (Cap. 8) */
    if (window.GelatorchardBackend) {
      window.GelatorchardBackend.sendEnquiry({
        name: name,
        company: document.getElementById('bf-company').value.trim(),
        email: email,
        phone: document.getElementById('bf-phone').value.trim(),
        type: type,
        volume: document.getElementById('bf-volume').value.trim(),
        eventDate: document.getElementById('bf-date').value,
        message: document.getElementById('bf-msg').value.trim()
      }).then(function (r) {
        if (r && r.live) {
          var n = document.querySelector('#biz-done .notice.preview');
          if (n) n.remove();
        }
      }).catch(function () {});
    }
  });
})();
