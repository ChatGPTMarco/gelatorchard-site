/* ============================================================
   GELATORCHARD — home.js · Capitolo 10
   Logica solo-homepage: numeri stagionali vivi, ruota riusata
   (Gelatorchard.renderSeasonWheel, da calendar.js), registro
   batch, CTA band dinamica. REGOLA: ogni testo qui si GENERA
   dai dati di flavors.js — resta vero ogni giorno dell'anno
   senza interventi manuali (Cap. 10.5.5 / 10.5.9).
   ============================================================ */
(function () {
  'use strict';
  var G = window.Gelatorchard;
  if (!G) return;

  var TODAY = new Date();

  /* Frutti del calendario attivi a una certa data (fonte: FRUITS) */
  function activeFruitCount(date) {
    var n = 0;
    Object.keys(G.FRUITS).forEach(function (k) {
      var fr = G.FRUITS[k];
      if (G.windowInfo(fr.start, fr.end, date).state === 'active') n++;
    });
    return n;
  }

  /* --- Headline stagione (10.5.5): oggi vs gennaio, calcolata live --- */
  var seasonHead = document.getElementById('season-headline');
  if (seasonHead) {
    var now = activeFruitCount(TODAY);
    var jan = activeFruitCount(new Date(TODAY.getFullYear() + 1, 0, 15));
    var dateLabel = TODAY.getDate() + ' ' + G.MONTHS[TODAY.getMonth()];
    seasonHead.innerHTML = 'Today, ' + dateLabel + ', <strong>' + now +
      ' British fruits</strong> are in season. In January there will be <strong>' +
      jan + '</strong>.';
  }

  /* --- Ruota stagionale in homepage: click → calendario sul mese --- */
  var wheelEl = document.getElementById('home-wheel');
  if (wheelEl && G.renderSeasonWheel) {
    G.renderSeasonWheel(wheelEl, {
      onSelect: function (m) { location.href = 'calendario.html?month=' + m; }
    });
  }

  /* --- Registro batch (10.5.8) --- */
  var logEl = document.getElementById('batch-log');
  if (logEl && G.renderBatchLog) G.renderBatchLog(logEl);

  /* --- CTA band (10.5.9): ultima chiamata sul dato stagionale reale --- */
  var cta = document.getElementById('season-cta');
  if (cta && G.mostUrgentFruit) {
    var u = G.mostUrgentFruit(TODAY);
    var h = cta.querySelector('.cta-title');
    var p = cta.querySelector('.cta-sub');
    var a = cta.querySelector('.cta-order');
    if (u && u.type === 'ending') {
      h.textContent = u.name + ' has ' + u.daysLeft + (u.daysLeft === 1 ? ' day' : ' days') +
        ' left. Then: ' + u.returnMonthYear + '.';
      p.textContent = 'That is not a marketing countdown, it is a harvest one. Order it while it exists, or at least make sure you hear the last call.';
      a.href = 'order.html?flavours=' + u.id;
    } else if (u) {
      h.textContent = 'Next into season: ' + u.name + ', ' + u.startLabel + '.';
      p.textContent = 'Every fruit gets exactly one opening day a year. Join the alert list and you will not miss yours.';
      a.href = 'order.html';
    }
  }
})();
