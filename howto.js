/* ============================================================
   GELATORCHARD — stato live del drop settimanale (how-to-order + order)
   Riempie ogni [data-drop-status] leggendo G.orderWindow (flavors.js,
   unica fonte del ritmo). Countdown SOLO su scadenze reali (regola 4):
   la finestra lun 10:00 → mar 18:00 esiste davvero, quindi si conta.
   Modello "opzione B" (decisione founder 6 ago 2026): fuori finestra
   NON si blocca nulla — l'ordine si accoda al drop successivo e il
   copy lo dice esplicitamente. Mai far credere che sia chiuso il
   negozio: è chiusa solo la conta di questa settimana.
   ============================================================ */
(function () {
  'use strict';
  var G = window.Gelatorchard;
  if (!G || !G.orderWindow) return;

  function dayLong(d) {
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
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

  function render() {
    var w = G.orderWindow();
    var html = w.open
      ? '<span class="ds-dot open"></span><strong>This week’s drop is open.</strong> Order by Tuesday 6pm, in ' +
        countdown(w.closesAt) + ' · delivery ' + dayLong(w.saturday) + ' or Sunday'
      : '<span class="ds-dot"></span><strong>Ordering now? You’re in the next drop.</strong> Orders are counted ' +
        dayLong(w.closesAt) + ' at 6pm · delivery ' + dayLong(w.saturday) + ' or Sunday';
    document.querySelectorAll('[data-drop-status]').forEach(function (el) {
      el.classList.toggle('open', w.open);
      el.innerHTML = html;
    });
  }

  render();
  setInterval(render, 60000);
})();
