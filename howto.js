/* ============================================================
   GELATORCHARD — /how-to-order · stato live del drop settimanale
   Riempie ogni [data-drop-status] leggendo G.orderWindow (flavors.js,
   unica fonte del ritmo). Countdown SOLO su scadenze reali (regola 4):
   la finestra lun 10:00 → mar 18:00 esiste davvero, quindi si conta.
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
      ? '<span class="ds-dot open"></span><strong>Orders are open.</strong> They close Tuesday 6pm, in ' +
        countdown(w.closesAt) + ' · delivery ' + dayLong(w.saturday) + ' or Sunday'
      : '<span class="ds-dot"></span><strong>Orders are closed.</strong> Next window: ' +
        dayLong(w.opensAt) + ', 10am, in ' + countdown(w.opensAt) +
        ' · delivery ' + dayLong(w.saturday) + ' or Sunday';
    document.querySelectorAll('[data-drop-status]').forEach(function (el) {
      el.classList.toggle('open', w.open);
      el.innerHTML = html;
    });
  }

  render();
  setInterval(render, 60000);
})();
