/* ============================================================
   GELATORCHARD — stato live del drop settimanale (how-to-order,
   order, picker in home). Riempie ogni [data-drop-status] leggendo
   G.orderWindow (flavors.js, unica fonte del ritmo).

   PILLOLA FOMO (scelta founder, 8 ago 2026 — "combo"):
   - loss-frame con le DUE date reali a confronto (questo sabato vs
     il successivo) + countdown vivo alla chiusura (scadenza vera:
     regola copy 4, mai countdown finti);
   - sotto le 6 ore alla chiusura: stato .hot (rosso ruggine);
   - AL LANCIO si accende da solo il contatore "X of 42 servings
     left" con barra, appena GelatorchardBackend.dropServingsOrdered
     restituisce un numero reale (vista Supabase, vedi backend.js).
     Finché non c'è, mostra il cap statico: 42 porzioni, vero
     (PRODUZIONE.md), prima arrivata prima servita.
   Modello opzione B invariato: fuori finestra NON si blocca nulla,
   l'ordine scala al drop successivo — il copy vende la differenza.
   ============================================================ */
(function () {
  'use strict';
  var G = window.Gelatorchard;
  if (!G || !G.orderWindow) return;

  var DROP_CAP = 42; /* porzioni per drop: 7 cicli × 6 (PRODUZIONE.md) */

  function dayLong(d) {
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  function ord(n) {
    var s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  function countdown(to) {
    var ms = to - new Date();
    if (ms <= 0) return 'now';
    var h = Math.floor(ms / 3600000);
    var days = Math.floor(h / 24);
    var m = Math.floor((ms % 3600000) / 60000);
    if (days >= 1) return days + (days === 1 ? ' day ' : ' days ') + (h % 24) + 'h';
    return h + 'h ' + m + 'm';
  }

  /* Contatore reale: al lancio la vista Supabase risponde e la pillola
     si aggiorna da sola; in preview resta null → cap statico. */
  var ordered = null;
  if (window.GelatorchardBackend && window.GelatorchardBackend.dropServingsOrdered) {
    window.GelatorchardBackend.dropServingsOrdered().then(function (n) {
      if (typeof n === 'number') { ordered = n; render(); }
    });
  }

  function render() {
    var w = G.orderWindow();
    var sat1 = w.saturday;
    var sat2 = new Date(sat1.getFullYear(), sat1.getMonth(), sat1.getDate() + 7);
    var hot = w.open && (w.closesAt - new Date()) < 6 * 3600000;

    var line1, line2;
    if (w.open) {
      line1 = 'This drop closes in ' + countdown(w.closesAt) + '.';
      line2 = 'Order now → ' + dayLong(sat1) + '. After 6pm Tuesday → the ' + ord(sat2.getDate()) + '.';
    } else {
      line1 = 'Saturday ' + sat1.getDate() + ' or Saturday ' + sat2.getDate() + ': your call.';
      line2 = 'Order within ' + countdown(w.closesAt) + ' and you eat on the ' +
        ord(sat1.getDate()) + '. Miss it, and you wait another week.';
    }

    var tail;
    if (ordered != null) {
      var left = Math.max(0, DROP_CAP - ordered);
      var pct = Math.max(0, Math.min(100, Math.round(left / DROP_CAP * 100)));
      tail = '<div class="ds-count">' + left + ' of ' + DROP_CAP + ' servings left for ' + dayLong(sat1) +
        '<div class="ds-bar"><i style="width:' + pct + '%"></i></div></div>';
    } else {
      tail = '<div class="ds-cap">' + DROP_CAP + ' servings per drop · first come, first served</div>';
    }

    var html =
      '<div class="ds-line1"><span class="ds-dot' + (w.open ? ' open' : '') + '"></span>' + line1 + '</div>' +
      '<div class="ds-line2">' + line2 + '</div>' +
      tail;

    document.querySelectorAll('[data-drop-status]').forEach(function (el) {
      el.classList.toggle('open', w.open);
      el.classList.toggle('hot', hot);
      el.innerHTML = html;
    });
  }

  render();
  setInterval(render, 60000);
})();
