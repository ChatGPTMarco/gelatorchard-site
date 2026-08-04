/* ============================================================
   GELATORCHARD — /calendario · Capitolo 5
   <SeasonWheel> (ruota SVG 12 spicchi, polar/segPath) + pannello
   mese con narrativa, FOMO, stati frutta e gusti ordinabili.
   Fonte dati unica: Gelatorchard.FRUITS / FLAVORS / windowInfo /
   seasonStatus (flavors.js) — mai duplicare qui gli elenchi.
   ============================================================ */
(function () {
  'use strict';
  var G = window.Gelatorchard;
  var wheelEl = document.getElementById('season-wheel');
  var panelEl = document.getElementById('month-panel');
  if (!wheelEl || !panelEl) return;

  var TODAY = new Date();
  var THIS_YEAR = TODAY.getFullYear();
  var NOW_MONTH = TODAY.getMonth(); /* 0-11 */

  /* ---------- Dati mese (Cap. 5.4): hero, livello, frutti, narrativa, FOMO ---------- */
  var LEVELS = { min: 'Minimal choice', mid: 'Medium choice', peak: 'Peak season' };
  var MONTH_DATA = [
    { hero: 'rhubarb_forced', level: 'min', fruits: ['rhubarb_forced', 'apple', 'pear'],
      story: 'The Yorkshire Rhubarb Triangle. Grown in the dark, picked by candlelight — England’s most precious rhubarb.',
      fomo: 'January: only one fresh flavour is possible with real UK fruit. Anyone selling “strawberry” right now is using powder or imports.' },
    { hero: 'rhubarb_forced', level: 'min', fruits: ['rhubarb_forced', 'apple', 'pear'],
      story: 'The last full month of Yorkshire forced rhubarb before it turns scarce.',
      fomo: 'From March, forced rhubarb runs out. Book now, not once the season is over.' },
    { hero: 'rhubarb_forced', level: 'min', fruits: ['rhubarb_forced', 'rhubarb_field', 'apple'],
      story: 'The handover from forced to field rhubarb — the true start of the English spring.',
      fomo: 'Yorkshire forced rhubarb ends mid-March. Then you wait for December.' },
    { hero: 'rhubarb_field', level: 'min', fruits: ['rhubarb_field', 'gooseberry'],
      story: 'Field rhubarb at its peak. The real English spring, in gelato.',
      fomo: 'No shortcuts: we wait for the field to be ready, not the warehouse.' },
    { hero: 'strawberry', level: 'mid', fruits: ['rhubarb_field', 'strawberry', 'gooseberry'],
      story: 'The first English strawberries of the year arrive late this month — the most requested, gone in days.',
      fomo: 'The first strawberries of the season. Don’t wait for June: they go earlier.' },
    { hero: 'strawberry', level: 'peak', fruits: ['strawberry', 'cherry', 'gooseberry', 'raspberry', 'currant'],
      story: 'The official opening of the English summer. Wimbledon fortnight = strawberries at their peak.',
      fomo: 'The signature month of the UK summer. Every week a new fruit comes into season.' },
    { hero: 'raspberry', level: 'peak', fruits: ['strawberry', 'raspberry', 'currant', 'cherry', 'blueberry'],
      story: 'The richest month of the year: maximum variety, maximum production.',
      fomo: 'From August, summer fruit starts to finish, one by one. July is the absolute peak.' },
    { hero: 'plum', level: 'peak', fruits: ['raspberry', 'blackberry', 'blueberry', 'plum', 'greengage', 'damson', 'fig'],
      story: 'The Victoria Plum: the signature fruit of the UK August. 3–4 weeks, then it disappears for a year.',
      fomo: 'No import can replace the Victoria. It’s UK August, or it doesn’t exist.' },
    { hero: 'apple', level: 'peak', fruits: ['apple', 'pear', 'damson', 'blackberry', 'fig', 'elderberry'],
      story: 'The harvest month par excellence — dozens of English apple varieties, each one different.',
      fomo: 'Damsons: a 3-week window, then the chapter closes until ' + (THIS_YEAR + 1) + '.' },
    { hero: 'quince', level: 'peak', fruits: ['apple', 'pear', 'quince', 'damson', 'blackberry', 'medlar'],
      story: 'Quince opens the full autumn — an ancient, nearly forgotten fruit, perfect for a rediscovery.',
      fomo: 'The fresh quince window is tiny: October, and that’s it.' },
    { hero: 'pear', level: 'mid', fruits: ['apple', 'pear', 'quince'],
      story: 'The last month of fresh harvest before winter. From here on, everything we use was carefully stored in October.',
      fomo: 'The last fresh quince of the year. From December, only what’s been stored.' },
    { hero: 'rhubarb_forced', level: 'min', fruits: ['apple', 'pear', 'quince', 'rhubarb_forced'],
      story: 'Yorkshire forced rhubarb starts again late this month — the calendar bites its own tail.',
      fomo: 'No empty pause. Just the rhythm of the land starting over.' }
  ];

  /* ---------- Icone frutto hero (SVG minimali, colori coerenti) ---------- */
  var ICONS = {
    rhubarb_forced: '<rect x="-5" y="-8" width="4" height="16" rx="2" fill="#E06A78" transform="rotate(-6)"/><rect x="1" y="-8" width="4" height="16" rx="2" fill="#F4A0A8" transform="rotate(5)"/><path d="M-4 -9 Q0 -14 6 -11 Q2 -6 -4 -9 Z" fill="#2D7A4A"/>',
    rhubarb_field:  '<rect x="-5" y="-8" width="4" height="16" rx="2" fill="#C94E62" transform="rotate(-6)"/><rect x="1" y="-8" width="4" height="16" rx="2" fill="#E06A78" transform="rotate(5)"/><path d="M-4 -9 Q0 -14 6 -11 Q2 -6 -4 -9 Z" fill="#2D7A4A"/>',
    strawberry: '<path d="M0 9 C-8 3 -8 -6 0 -6 C8 -6 8 3 0 9 Z" fill="#E8536B"/><path d="M-4 -7 Q0 -11 4 -7 Q0 -4 -4 -7 Z" fill="#2D7A4A"/>',
    raspberry: '<circle cx="-3.4" cy="-1" r="3.4" fill="#A32348"/><circle cx="3.4" cy="-1" r="3.4" fill="#C23D6B"/><circle cx="0" cy="4.4" r="3.4" fill="#A32348"/><path d="M-3 -5 Q0 -9 4 -6 Q0 -3 -3 -5 Z" fill="#2D7A4A"/>',
    plum: '<ellipse cx="0" cy="1" rx="6.5" ry="7.5" fill="#7C4F9E"/><path d="M0 -6 Q1 -10 4 -11" stroke="#2D7A4A" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
    apple: '<circle cx="0" cy="1.5" r="7" fill="#A9C46A"/><path d="M0 -5 Q0.5 -9 3 -10" stroke="#6B4630" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M1 -8 Q6 -11 8 -7 Q4 -5 1 -8 Z" fill="#2D7A4A"/>',
    quince: '<path d="M0 -6 C6 -6 7.5 0 6 4 C4.5 8 -4.5 8 -6 4 C-7.5 0 -6 -6 0 -6 Z" fill="#DBB44E"/><path d="M0 -6 Q0.5 -9 3 -10" stroke="#6B4630" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
    pear: '<circle cx="0" cy="3.5" r="6" fill="#A9C46A"/><circle cx="0" cy="-3.5" r="3.8" fill="#B9D07A"/><path d="M0 -7 Q0.5 -10 3 -11" stroke="#6B4630" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
  };

  /* ---------- Geometria ruota (polar / segPath, dal prototipo) ---------- */
  var C = 210, R_OUT = 200, R_IN = 92, GAP = 1.4;
  function polar(r, deg) {
    var rad = (deg - 90) * Math.PI / 180;
    return [C + r * Math.cos(rad), C + r * Math.sin(rad)];
  }
  function segPath(i) {
    var a0 = i * 30 + GAP / 2, a1 = (i + 1) * 30 - GAP / 2;
    var p1 = polar(R_OUT, a0), p2 = polar(R_OUT, a1), p3 = polar(R_IN, a1), p4 = polar(R_IN, a0);
    return 'M' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) +
      ' A' + R_OUT + ' ' + R_OUT + ' 0 0 1 ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) +
      ' L' + p3[0].toFixed(1) + ' ' + p3[1].toFixed(1) +
      ' A' + R_IN + ' ' + R_IN + ' 0 0 0 ' + p4[0].toFixed(1) + ' ' + p4[1].toFixed(1) + ' Z';
  }

  /* ---------- <SeasonWheel> ---------- */
  function renderWheel(selected) {
    var segs = '';
    for (var i = 0; i < 12; i++) {
      var mid = i * 30 + 15;
      var tPos = polar(168, mid);
      var iPos = polar(126, mid);
      var cls = 'wheel-seg' + (i === NOW_MONTH ? ' now' : '') + (i === selected ? ' sel' : '');
      segs +=
        '<g class="' + cls + '" data-m="' + i + '" role="button" tabindex="0" aria-label="' + G.MONTHS[i] + '">' +
          '<path class="seg-bg" d="' + segPath(i) + '"/>' +
          '<text x="' + tPos[0].toFixed(1) + '" y="' + (tPos[1] + 4).toFixed(1) + '">' + G.MONTHS_SHORT[i] + '</text>' +
          '<g transform="translate(' + iPos[0].toFixed(1) + ' ' + iPos[1].toFixed(1) + ') scale(1.05)">' +
            ICONS[MONTH_DATA[i].hero] + '</g>' +
        '</g>';
    }
    wheelEl.innerHTML =
      '<svg viewBox="0 0 420 420" aria-label="UK season wheel, 12 months">' +
        segs +
        '<circle cx="' + C + '" cy="' + C + '" r="' + (R_IN - 10) + '" fill="var(--surface)" stroke="var(--line)"/>' +
        '<text class="wheel-center-t" x="' + C + '" y="' + (C - 2) + '">12 MONTHS</text>' +
        '<text class="wheel-center-s" x="' + C + '" y="' + (C + 18) + '">UK ONLY</text>' +
      '</svg>';

    wheelEl.querySelectorAll('.wheel-seg').forEach(function (g) {
      function pick() { select(+g.getAttribute('data-m')); }
      g.addEventListener('click', pick);
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
      });
    });
  }

  /* ---------- Data di riferimento: oggi per il mese corrente,
     giorno 15 per gli altri mesi (Cap. 5.5.3) ---------- */
  function refDate(m) {
    return m === NOW_MONTH ? TODAY : new Date(THIS_YEAR, m, 15);
  }

  /* ---------- Riga frutto con stato (Cap. 5.5/5.6) ---------- */
  function leftLabel(n) {
    return n === 0 ? 'last day' : (n === 1 ? '1 day left' : n + ' days left');
  }
  function opensLabel(n) {
    return n === 1 ? 'Opens tomorrow' : 'Opens in ' + n + ' days';
  }
  function fruitRow(key, ref) {
    var fr = G.FRUITS[key];
    var w = G.windowInfo(fr.start, fr.end, ref);
    var note = fr.note ? ' <span class="fr-note">· ' + fr.note + '</span>' : '';
    if (w.state === 'active') {
      var fillCls = w.pct > 90 ? ' hot' : (w.pct > 70 ? ' warn' : '');
      var stateCls = w.pct > 70 ? ' hot' : '';
      return '<li><div class="fr-top"><span class="fr-name">' + fr.name + note + '</span>' +
        '<span class="fr-state' + stateCls + '">' + leftLabel(w.daysLeft) + '</span></div>' +
        '<div class="season-bar"><span class="season-fill' + fillCls + '" style="width:' + w.pct + '%"></span></div></li>';
    }
    if (w.state === 'coming') {
      return '<li><div class="fr-top"><span class="fr-name">' + fr.name + note + '</span>' +
        '<span class="fr-state">' + opensLabel(w.daysToStart) + '</span></div></li>';
    }
    return '<li><div class="fr-top"><span class="fr-name">' + fr.name + note + '</span>' +
      '<span class="stamp-inline">Back ' + w.returnMonthYear + '</span></div></li>';
  }

  /* ---------- Riga gusto ordinabile (Cap. 5.8) — stessa fonte del picker ---------- */
  function flavourRow(f, ref) {
    var st = G.seasonStatus(f.id, ref);
    var dot = '<span class="fl-dot ' + f.sw + '"></span>';
    if (st.inSeason) {
      return '<li>' + dot + '<span class="fl-name">' + f.name + '</span>' +
        '<a class="pill pill-dark pill-xs" href="order.html?flavours=' + f.id + '">Order →</a></li>';
    }
    if (st.state === 'coming') {
      return '<li>' + dot + '<span class="fl-name">' + f.name + '</span>' +
        '<span class="fl-badge">Opens ' + st.startLabel + '</span></li>';
    }
    return '<li class="off">' + dot + '<span class="fl-name">' + f.name + '</span>' +
      '<span class="stamp-inline">Back ' + st.returnMonthYear + '</span></li>';
  }

  /* ---------- Pannello mese ---------- */
  function renderPanel(m) {
    var d = MONTH_DATA[m];
    var ref = refDate(m);
    var isNow = m === NOW_MONTH;
    panelEl.innerHTML =
      '<div class="cp-head">' +
        '<h3>' + G.MONTHS[m] + (isNow ? ' <span style="font-size:13px;color:var(--green);font-family:var(--sans);font-weight:700;letter-spacing:.06em">— NOW</span>' : '') + '</h3>' +
        '<span class="cp-level ' + d.level + '">' + LEVELS[d.level] + '</span>' +
      '</div>' +
      '<p class="cp-story">' + d.story + '</p>' +
      '<div class="cp-fomo">⏳ ' + d.fomo + '</div>' +
      '<h4>In season this month</h4>' +
      '<ul class="fruit-rows">' + d.fruits.map(function (k) { return fruitRow(k, ref); }).join('') + '</ul>' +
      '<h4>Flavours you can order in ' + G.MONTHS[m] + '</h4>' +
      '<ul class="flavour-rows">' + G.FLAVORS.fruit.map(function (f) { return flavourRow(f, ref); }).join('') + '</ul>';
  }

  function select(m) {
    wheelEl.querySelectorAll('.wheel-seg').forEach(function (g) {
      g.classList.toggle('sel', +g.getAttribute('data-m') === m);
    });
    /* Cap. 9: il pannello non "scatta" — fade-out 0.15s, poi fade-in+slide 0.25s */
    if (window.GelatorchardMotion) {
      window.GelatorchardMotion.swapPanel(panelEl, function () { renderPanel(m); });
    } else {
      renderPanel(m);
    }
  }

  renderWheel(NOW_MONTH);
  renderPanel(NOW_MONTH);
})();
