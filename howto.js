/* ============================================================
   GELATORCHARD — drop card FOMO (how-to-order, order, picker home).
   Riempie ogni [data-drop-status] leggendo G.orderWindow (flavors.js,
   unica fonte del ritmo). Versione "viva" (founder, 8 ago 2026):
   - orologio che TICCHETTA A SECONDI verso la chiusura reale della
     finestra (countdown lecito: la scadenza esiste, regola copy 4);
   - le due date a confronto (loss-frame: mangi il 15 o aspetti il 22);
   - barra del tempo che si svuota lungo la settimana verso mar 18:00
     (dato reale, nessun numero inventato);
   - pallino che pulsa; stato .hot rosso ruggine sotto le 6 ore.
   AL LANCIO: la riga cap statica ("42 servings…") diventa il contatore
   reale "X of 42 servings left" + barra porzioni appena
   GelatorchardBackend.dropServingsOrdered risponde (RPC Supabase,
   vedi backend.js). MAI numeri inventati nel contatore.
   Opzione B invariata: nulla si blocca, il copy vende la differenza.
   ============================================================ */
(function () {
  'use strict';
  var G = window.Gelatorchard;
  if (!G || !G.orderWindow) return;

  var DROP_CAP = 42;           /* porzioni per drop: 7 cicli × 6 (PRODUZIONE.md) */
  var WEEK = 7 * 86400000;

  function dayLong(d) {
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  function ord(n) {
    var s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  /* Orologio d + hh:mm:ss, cifre tabellari nel CSS */
  function clock(to) {
    var ms = Math.max(0, to - new Date());
    var d = Math.floor(ms / 86400000);
    var h = Math.floor(ms % 86400000 / 3600000);
    var m = Math.floor(ms % 3600000 / 60000);
    var s = Math.floor(ms % 60000 / 1000);
    return (d ? d + 'd ' : '') + pad(h) + ':' + pad(m) + ':' + pad(s);
  }

  /* Contatore reale: al lancio la RPC risponde e la card si aggiorna
     da sola; in preview resta null → riga cap statica. */
  var ordered = null;
  if (window.GelatorchardBackend && window.GelatorchardBackend.dropServingsOrdered) {
    window.GelatorchardBackend.dropServingsOrdered().then(function (n) {
      if (typeof n === 'number') { ordered = n; build(); }
    });
  }

  /* build(): struttura (una volta al minuto o al cambio stato);
     tick(): ogni secondo aggiorna SOLO orologio e barra (no flicker) */
  var lastKey = '';
  function build() {
    var w = G.orderWindow();
    var sat1 = w.saturday;
    var sat2 = new Date(sat1.getFullYear(), sat1.getMonth(), sat1.getDate() + 7);
    var hot = w.open && (w.closesAt - new Date()) < 6 * 3600000;
    lastKey = (w.open ? 'o' : 'c') + (hot ? 'h' : '') + sat1.getDate() + (ordered != null ? 'n' : '');

    var kicker, toLabel, line2;
    if (w.open) {
      kicker = 'Drop open · eat ' + dayLong(sat1);
      toLabel = 'until this drop closes';
      line2 = 'After 6pm Tuesday → Saturday the ' + ord(sat2.getDate()) + '.';
    } else {
      kicker = 'Next drop · ' + dayLong(sat1);
      toLabel = 'left to order';
      line2 = 'Make it → you eat on the ' + ord(sat1.getDate()) +
        '. Miss it → Saturday the ' + ord(sat2.getDate()) + '.';
    }

    var tail;
    if (ordered != null) {
      var left = Math.max(0, DROP_CAP - ordered);
      var pct = Math.max(0, Math.min(100, Math.round(left / DROP_CAP * 100)));
      tail = '<div class="ds-cap"><strong>' + left + ' of ' + DROP_CAP +
        ' servings left</strong> for Saturday the ' + ord(sat1.getDate()) + '</div>' +
        '<div class="ds-bar servings"><i style="width:' + pct + '%"></i></div>';
    } else {
      tail = '<div class="ds-cap">' + DROP_CAP + ' servings per drop · first come, first served</div>';
    }

    var html =
      '<div class="ds-kicker"><span class="ds-dot' + (w.open ? ' open' : '') + '"></span>' + kicker + '</div>' +
      '<div class="ds-big"><span class="ds-timer">' + clock(w.closesAt) + '</span>' +
        '<span class="ds-to">' + toLabel + '</span></div>' +
      '<div class="ds-line2">' + line2 + '</div>' +
      '<div class="ds-bar time"><i></i></div>' +
      tail;

    document.querySelectorAll('[data-drop-status]').forEach(function (el) {
      el.classList.toggle('open', w.open);
      el.classList.toggle('hot', hot);
      el.innerHTML = html;
    });
    tick();
  }

  function tick() {
    var w = G.orderWindow();
    var sat1 = w.saturday;
    var hot = w.open && (w.closesAt - new Date()) < 6 * 3600000;
    var key = (w.open ? 'o' : 'c') + (hot ? 'h' : '') + sat1.getDate() + (ordered != null ? 'n' : '');
    if (key !== lastKey) { build(); return; } /* cambio stato → ristruttura */

    var t = clock(w.closesAt);
    /* barra tempo: quota di settimana che resta prima della chiusura */
    var pct = Math.max(0, Math.min(100, (w.closesAt - new Date()) / WEEK * 100));
    document.querySelectorAll('[data-drop-status]').forEach(function (el) {
      var timer = el.querySelector('.ds-timer');
      if (timer && timer.textContent !== t) timer.textContent = t;
      var bar = el.querySelector('.ds-bar.time i');
      if (bar) bar.style.width = pct.toFixed(2) + '%';
    });
  }

  build();
  setInterval(tick, 1000);
})();
