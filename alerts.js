/* ============================================================
   GELATORCHARD — Seasonal Alert List · Capitolo 7
   Componente di iscrizione riutilizzabile (app.html, homepage,
   /calendario). NIENTE abbonamenti: lista notifica gratuita.
   Fonte dati: Gelatorchard.FLAVORS/SEASONS (mai duplicare).
   Storage provvisorio: localStorage gc-alerts — al lancio il
   form si collega a Brevo (vedi EMAILS.md).
   ============================================================ */
(function () {
  'use strict';
  var G = window.Gelatorchard;

  function rangeLabel(id) {
    var s = G.SEASONS[id];
    return G.MONTHS_SHORT[s.start[0] - 1] + '–' + G.MONTHS_SHORT[s.end[0] - 1];
  }

  /* renderAlertSignup(el[, opts]) — opts.preselect: [ids] aggiuntivi
     oltre a quello in ?fruit= (arriva dalle tile fuori stagione). */
  G.renderAlertSignup = function (el, opts) {
    opts = opts || {};
    var pre = (opts.preselect || []).slice();
    var urlFruit = new URLSearchParams(location.search).get('fruit');
    if (urlFruit && G.SEASONS[urlFruit] && pre.indexOf(urlFruit) < 0) pre.push(urlFruit);

    el.innerHTML =
      '<div class="checkout-card">' +
        '<div class="fruit-checks">' +
          G.FLAVORS.fruit.map(function (f) {
            var on = pre.indexOf(f.id) >= 0;
            return '<label class="fcheck' + (on ? ' on' : '') + '" data-id="' + f.id + '">' +
              '<input type="checkbox"' + (on ? ' checked' : '') + '>' +
              '<span class="fc-name">' + f.name + '</span>' +
              '<span class="fc-range">' + rangeLabel(f.id) + '</span></label>';
          }).join('') +
        '</div>' +
        '<button class="pill pill-ghost pill-sm follow-all" type="button">+ Follow all UK fruit</button>' +
        '<div style="margin-top:20px">' +
          '<label class="field-label" for="al-email-' + (opts.key || 'x') + '">Your email</label>' +
          '<input class="field-input al-email" id="al-email-' + (opts.key || 'x') + '" type="email" placeholder="you@example.co.uk" autocomplete="email">' +
        '</div>' +
        '<div class="step-ctas">' +
          '<button class="pill pill-dark al-join" type="button">Join the alert list — free</button>' +
          '<span class="cta-hint al-hint"></span>' +
        '</div>' +
        '<p class="alert-reassure">No subscription. No billing. Just a heads-up before it disappears until next year.</p>' +
        '<div class="al-done" hidden></div>' +
      '</div>';

    el.querySelectorAll('.fcheck').forEach(function (lab) {
      lab.querySelector('input').addEventListener('change', function (e) {
        lab.classList.toggle('on', e.target.checked);
      });
    });

    el.querySelector('.follow-all').addEventListener('click', function () {
      var boxes = el.querySelectorAll('.fcheck input');
      var allOn = Array.prototype.every.call(boxes, function (b) { return b.checked; });
      boxes.forEach(function (b) {
        b.checked = !allOn;
        b.closest('.fcheck').classList.toggle('on', !allOn);
      });
    });

    el.querySelector('.al-join').addEventListener('click', function () {
      var hint = el.querySelector('.al-hint');
      var fruits = Array.prototype.filter.call(el.querySelectorAll('.fcheck input'), function (b) { return b.checked; })
        .map(function (b) { return b.closest('.fcheck').getAttribute('data-id'); });
      var email = el.querySelector('.al-email').value.trim();
      if (fruits.length === 0) { hint.textContent = 'Pick at least one fruit to follow'; return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { hint.textContent = 'Please enter a valid email address'; return; }
      hint.textContent = '';
      try {
        localStorage.setItem('gc-alerts', JSON.stringify({ email: email, fruits: fruits }));
      } catch (e) {}
      var names = fruits.map(function (id) { return G.flavorById(id).name; }).join(', ');
      var card = el.querySelector('.checkout-card');
      card.innerHTML =
        '<p style="font-size:17px;font-weight:600">You’re on the list for: ' + names + '.</p>' +
        '<p class="alert-reassure" style="margin-top:12px">You’ll hear from Marco exactly twice per fruit:</p>' +
        '<ul class="check-list" style="margin-top:8px">' +
          '<li>the day it comes into season (new batch available)</li>' +
          '<li>about a week before the season ends (last call)</li>' +
        '</ul>' +
        '<div class="notice preview">Pre-launch preview — the alert service connects at launch, so nothing was saved to a real mailing list yet.</div>';

      /* Invio a Supabase quando configurato (Cap. 8) */
      if (window.GelatorchardBackend) {
        window.GelatorchardBackend.subscribeAlerts(email, fruits).then(function (r) {
          if (r && r.live) {
            var n = card.querySelector('.notice.preview');
            if (n) n.remove();
          }
        }).catch(function () {});
      }
    });
  };

  /* Auto-init */
  var mount = document.getElementById('alert-signup');
  if (mount) G.renderAlertSignup(mount, { key: 'main' });
  var embed = document.getElementById('alert-signup-embed');
  if (embed) G.renderAlertSignup(embed, { key: 'embed' });
})();
