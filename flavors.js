/* ============================================================
   GELATORCHARD, Seasonal engine + <FlavorPicker> + <SeasonBadge>
   Cap. 2-3 · Shared across pages via window.Gelatorchard:
   - seasonStatus() and SeasonBadge return in /calendario (Cap. 5)
   - FlavorPicker is reused on / and /order (dynamic max, preselect)
   - BATCHES will be extended by the story system (Cap. 4)
   Site copy is British English (project rule).
   ============================================================ */
(function () {
  'use strict';
  var G = (window.Gelatorchard = window.Gelatorchard || {});

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  var MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* ---------- Real UK harvest calendar (source: founder, Cap. 5.3) ----------
     Finestre esatte MM-GG per i GUSTI del catalogo; start/end = [month, day];
     peak = mesi di picco; le stagioni possono scavalcare l'anno
     (rabarbaro forzato 20 Dic → 15 Mar). */
  var SEASONS = {
    strawberry:      { start: [5, 20],  end: [9, 15],  peak: [6, 7],   origin: 'Kent' },
    raspberry:       { start: [6, 1],   end: [10, 15], peak: [7, 8],   origin: 'Scotland' },
    cherry:          { start: [6, 1],   end: [7, 31],  peak: [7],      origin: 'Kent' },
    blueberry:       { start: [7, 1],   end: [9, 15],  peak: [7, 8],   origin: null },
    blackcurrant:    { start: [6, 15],  end: [7, 31],  peak: [6, 7],   origin: null },
    'victoria-plum': { start: [8, 1],   end: [9, 15],  peak: [8, 9],   origin: null },
    'apple-pear':    { start: [9, 1],   end: [11, 30], peak: [10],     origin: null },
    quince:          { start: [10, 1],  end: [11, 30], peak: [10, 11], origin: null },
    rhubarb:         { start: [12, 20], end: [3, 15],  peak: [1, 2],   origin: 'Yorkshire' }
  };
  G.SEASONS = SEASONS;
  G.MONTHS = MONTHS;
  G.MONTHS_SHORT = MONTHS_SHORT;

  /* Tabella FRUTTA completa del calendario (Cap. 5.3) — ingredienti,
     non gusti: alimenta la pagina /calendario. */
  var FRUITS = {
    rhubarb_forced: { name: 'Forced Rhubarb (Yorkshire)', start: [12, 20], end: [3, 15] },
    rhubarb_field:  { name: 'Field Rhubarb',              start: [3, 16],  end: [6, 15] },
    gooseberry:     { name: 'Gooseberries',               start: [4, 15],  end: [7, 31] },
    strawberry:     { name: 'Strawberries (Kent)',        start: [5, 20],  end: [9, 15] },
    cherry:         { name: 'Cherries (Kent)',            start: [6, 1],   end: [7, 31] },
    raspberry:      { name: 'Raspberries',                start: [6, 1],   end: [10, 15] },
    currant:        { name: 'Black & Red Currants',       start: [6, 15],  end: [7, 31] },
    blueberry:      { name: 'Blueberries',                start: [7, 1],   end: [9, 15] },
    plum:           { name: 'Victoria Plums',             start: [8, 1],   end: [9, 15] },
    greengage:      { name: 'Greengages',                 start: [8, 1],   end: [9, 10] },
    damson:         { name: 'Damsons',                    start: [8, 15],  end: [9, 30] },
    blackberry:     { name: 'Blackberries',               start: [8, 1],   end: [10, 15] },
    fig:            { name: 'Figs (South England)',       start: [8, 1],   end: [9, 30] },
    apple:          { name: 'English Apples',             start: [8, 1],   end: [11, 30], note: 'stored stock Dec–Jul' },
    pear:           { name: 'Pears (Conference/Comice)',  start: [9, 1],   end: [11, 30], note: 'stored stock Dec–Feb' },
    quince:         { name: 'Quince',                     start: [10, 1],  end: [11, 30], note: 'stored stock Dec–Jan' },
    medlar:         { name: 'Medlars',                    start: [10, 1],  end: [11, 15] },
    elderberry:     { name: 'Elderberries',               start: [9, 1],   end: [9, 30] }
  };
  G.FRUITS = FRUITS;

  /* windowInfo(start, end, ref) — core del calcolo stagionale (Cap. 5.5),
     wrap-around incluso. Stati: 'active' (pct% consumata + daysLeft),
     'coming' (il prossimo inizio cade nell'anno di ref → daysToStart),
     'finished' (il prossimo inizio è l'anno successivo → returnMonthYear). */
  G.windowInfo = function (start, end, ref) {
    function D(y, md) { return new Date(y, md[0] - 1, md[1]); }
    var DAY = 86400000;
    var y = ref.getFullYear();
    var wraps = (start[0] * 100 + start[1]) > (end[0] * 100 + end[1]);
    var wins = [];
    for (var k = -1; k <= 1; k++) {
      wins.push(wraps ? [D(y + k, start), D(y + k + 1, end)] : [D(y + k, start), D(y + k, end)]);
    }
    for (var i = 0; i < wins.length; i++) {
      var s0 = wins[i][0], e0 = wins[i][1];
      if (ref >= s0 && ref <= e0) {
        return {
          state: 'active',
          pct: Math.max(0, Math.min(100, Math.round((ref - s0) / (e0 - s0) * 100))),
          daysLeft: Math.ceil((e0 - ref) / DAY),
          returnMonthYear: MONTHS[start[0] - 1] + ' ' + (s0.getFullYear() + 1)
        };
      }
    }
    var next = null;
    for (i = 0; i < wins.length; i++) {
      if (wins[i][0] > ref) { next = wins[i][0]; break; }
    }
    return {
      state: next.getFullYear() === y ? 'coming' : 'finished',
      daysToStart: Math.ceil((next - ref) / DAY),
      startLabel: next.getDate() + ' ' + MONTHS_SHORT[next.getMonth()],
      returnMonthYear: MONTHS[next.getMonth()] + ' ' + next.getFullYear()
    };
  };

  /* Current batch registry — only founder-confirmed batches live here.
     Interim JSON store: at launch this gets fed from the Notion CMS
     (one Notion page per batch, see CLAUDE.md). Keyed by flavour id. */
  var BATCHES = {
    strawberry: {
      id: '042',
      status: 'disponibile',
      flavour: 'strawberry',
      fruitName: 'Strawberry',
      farm: "Johnson's Farm, Woodchurch (Kent)",
      farmName: "Johnson's Farm",
      farmerName: 'Tom Johnson',
      farmerFirst: 'Tom',
      location: 'Woodchurch, Kent',
      variety: 'Elsanta',
      harvest: '15 May 2026',
      harvestTime: '06:12',
      produced: '17 May 2026',
      operator: 'Marco',
      batchSize: '12L',
      method: 'Integrated Pest Management (IPM)',
      certification: 'Red Tractor Assurance',
      bio: 'Tom Johnson has been growing strawberries in Woodchurch, Kent, for three generations. His farm is certified by Red Tractor Assurance.',
      quote: '“Best season in three years,” says Tom, holding a strawberry the size of a walnut. “Every berry picked at peak ripeness. That’s the difference between field-to-freezer and supermarket-to-shelf.”',
      log: [
        ['06:00', 'Fruit received and inspected (HACCP checklist)'],
        ['06:30', 'Base prep: 8kg strawberries, 1.2kg sugar, water'],
        ['07:00', 'Trittico: pasteurisation at 62°C, 20 minutes'],
        ['07:20', 'Mixing and ageing, 40 minutes'],
        ['08:00', 'Churning'],
        ['08:20', 'Into the blast freezer'],
        ['08:30', 'BATCH COMPLETE']
      ],
      marcoNote: 'This strawberry had an incredible colour the moment it arrived, you could tell from the base alone this was going to be a good batch.',
      coldChain: { distance: '89 km', tempOut: '-20°C', tempIn: '-14°C', transit: '2 hours' },
      mapQuery: 'Woodchurch, Kent'
    }
  };
  G.BATCHES = BATCHES;
  G.batchById = function (id) {
    var found = null;
    Object.keys(BATCHES).forEach(function (k) {
      if (BATCHES[k].id === id) found = BATCHES[k];
    });
    return found;
  };

  /* seasonStatus(id[, date]) — Classics (ids without a season) get
     { inSeason:true, always:true }. Fruit Collection gets:
     in season → { inSeason:true, state:'active', peak, pct, daysLeft,
                   subtitle:"Kent · until mid-Sep", endLong, returnMonthYear }
     out       → { inSeason:false, state:'coming'|'finished', daysToStart,
                   startLabel, subtitle:"Out of season", stampLabel } */
  G.seasonStatus = function (id, date) {
    var s = SEASONS[id];
    if (!s) return { inSeason: true, always: true, subtitle: 'Always available' };
    var d = date || new Date();
    var w = G.windowInfo(s.start, s.end, d);

    if (w.state === 'active') {
      var peak = s.peak.indexOf(d.getMonth() + 1) >= 0;
      var half = s.end[1] <= 15 ? 'mid-' : 'end ';
      var endShort = half + MONTHS_SHORT[s.end[0] - 1];
      var endLong = half + MONTHS[s.end[0] - 1];
      return {
        inSeason: true,
        state: 'active',
        peak: peak,
        pct: w.pct,
        daysLeft: w.daysLeft,
        subtitle: (s.origin ? s.origin + ' · ' : '') + (peak ? 'at its peak' : 'until ' + endShort),
        endShort: endShort,
        endLong: endLong,
        returnMonthYear: w.returnMonthYear
      };
    }
    return {
      inSeason: false,
      state: w.state,
      daysToStart: w.daysToStart,
      startLabel: w.startLabel,
      subtitle: 'Out of season',
      returnMonthYear: w.returnMonthYear,
      stampLabel: 'Back ' + w.returnMonthYear
    };
  };

  /* alertsDue(date) — motore trigger della Seasonal Alert List (Cap. 7).
     lastCall: gusti frutta in stagione con ≤7 giorni rimasti (email 7.3);
     seasonEntry: gusti la cui stagione apre esattamente oggi (email 7.4).
     Al lancio: un job giornaliero (Brevo automation) legge questi elenchi
     e li incrocia con i frutti seguiti da ogni iscritto. */
  G.alertsDue = function (date) {
    var d = date || new Date();
    var due = { lastCall: [], seasonEntry: [] };
    FLAVORS.fruit.forEach(function (f) {
      var s = SEASONS[f.id];
      if (!s) return;
      var st = G.seasonStatus(f.id, d);
      if (st.inSeason && st.daysLeft <= 7) due.lastCall.push(f.id);
      if (d.getDate() === s.start[1] && d.getMonth() + 1 === s.start[0]) due.seasonEntry.push(f.id);
    });
    return due;
  };

  /* ---------- <SeasonBadge> — current month + harvest state ---------- */
  var MONTH_STATE = ['rhubarb season', 'rhubarb season', 'last rhubarb',
    'between harvests', 'between harvests', 'first berries',
    'peak season', 'peak season', 'last berries',
    'apples & quince', 'apples & quince', 'rhubarb returns'];

  G.renderSeasonBadge = function (el, date) {
    var d = date || new Date();
    el.innerHTML =
      '<span class="sb-month">' + MONTHS_SHORT[d.getMonth()].toUpperCase() + '</span>' +
      '<span class="sb-state">' + MONTH_STATE[d.getMonth()] + '</span>';
  };

  /* ---------- <FlavorPicker> ---------- */
  var FLAVORS = {
    fruit: [
      { id: 'strawberry',    name: 'Strawberry',    sw: 'sw-strawberry' },
      { id: 'raspberry',     name: 'Raspberry',     sw: 'sw-raspberry' },
      { id: 'cherry',        name: 'Cherry',        sw: 'sw-cherry' },
      { id: 'blueberry',     name: 'Blueberry',     sw: 'sw-blueberry' },
      { id: 'blackcurrant',  name: 'Blackcurrant',  sw: 'sw-blackcurrant' },
      { id: 'victoria-plum', name: 'Victoria Plum', sw: 'sw-victoria-plum' },
      { id: 'apple-pear',    name: 'Apple & Pear',  sw: 'sw-apple-pear' },
      { id: 'quince',        name: 'Quince',        sw: 'sw-quince' },
      { id: 'rhubarb',       name: 'Rhubarb',       sw: 'sw-rhubarb' }
    ],
    classics: [
      { id: 'chocolate',     name: 'Dark Chocolate', sw: 'sw-chocolate' },
      { id: 'pistachio',     name: 'Pistachio',      sw: 'sw-pistachio' },
      { id: 'stracciatella', name: 'Stracciatella',  sw: 'sw-stracciatella' },
      { id: 'hazelnut',      name: 'Hazelnut',       sw: 'sw-hazelnut' }
    ]
  };
  G.FLAVORS = FLAVORS;

  G.flavorById = function (id) {
    var all = FLAVORS.fruit.concat(FLAVORS.classics);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  };
  G.isClassic = function (id) {
    return FLAVORS.classics.some(function (f) { return f.id === id; });
  };

  function tileHTML(f) {
    var st = G.seasonStatus(f.id);
    if (!st.inSeason) {
      /* Out of season: grey, not selectable, stamp + pre-selected alert link */
      return '<div class="tile out" data-id="' + f.id + '">' +
        '<div class="swatch ' + f.sw + '"><span class="stamp">' + st.stampLabel + '</span></div>' +
        '<div class="t-name">' + f.name + '</div>' +
        '<div class="t-meta">' + st.subtitle + '</div>' +
        '<a class="t-link" href="app.html?fruit=' + f.id + '">Tell me when it’s back</a>' +
        '</div>';
    }
    var story = st.always ? '' :
      '<a class="t-link" href="story.html?flavour=' + f.id + '">Read the story</a>';
    return '<div class="tile" data-id="' + f.id + '">' +
      '<div class="swatch ' + f.sw + '"></div>' +
      '<div class="t-name">' + f.name + '</div>' +
      '<div class="t-meta">' + st.subtitle + '</div>' +
      story +
      '</div>';
  }

  /* renderFlavorPicker(root[, opts]) → controller { get, setMax, clear }
     opts: max (default 2, FIFO beyond it), preselect: [ids],
           summary: false hides the Kit summary box (used on /order),
           onChange(selection) fired after every change. */
  G.renderFlavorPicker = function (root, opts) {
    opts = opts || {};
    var max = opts.max != null ? opts.max : 2;
    var showSummary = opts.summary !== false;
    var selected = [];
    (opts.preselect || []).forEach(function (id) {
      var st = G.seasonStatus(id);
      if (G.flavorById(id) && st.inSeason && selected.indexOf(id) < 0 && selected.length < max) {
        selected.push(id);
      }
    });

    root.innerHTML =
      '<div class="flavor-tabs" role="tablist">' +
        '<button class="flavor-tab active" data-tab="fruit" role="tab" aria-selected="true">🍓 Seasonal Fruit</button>' +
        '<button class="flavor-tab" data-tab="classics" role="tab" aria-selected="false">🍫 Classics</button>' +
      '</div>' +
      '<div class="tile-grid" data-group="fruit" data-cascade>' + FLAVORS.fruit.map(tileHTML).join('') + '</div>' +
      '<div class="tile-grid" data-group="classics" data-cascade style="display:none">' + FLAVORS.classics.map(tileHTML).join('') + '</div>' +
      (showSummary ?
        '<div class="kit-summary card">' +
          '<div>' +
            '<div class="ks-label">Your Gelato Kit (pick up to 2 flavours)</div>' +
            '<div class="ks-value empty">Pick 1–2 flavours above</div>' +
          '</div>' +
          '<a class="pill pill-dark ks-cta" href="order.html">Continue · £28 pickup / £34 delivery</a>' +
        '</div>' : '');

    var valueEl = root.querySelector('.ks-value');
    var ctaEl = root.querySelector('.ks-cta');

    function showTab(name) {
      root.querySelectorAll('.flavor-tab').forEach(function (t) {
        var on = t.getAttribute('data-tab') === name;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      var inEl = null, outEl = null;
      root.querySelectorAll('.tile-grid').forEach(function (g) {
        if (g.getAttribute('data-group') === name) inEl = g; else outEl = g;
      });
      if (!inEl || inEl.style.display !== 'none') return; /* già visibile */
      /* Cap. 9: mai un cambio istantaneo — out .98/fade, in da .98 (0.35s) */
      if (window.GelatorchardMotion) window.GelatorchardMotion.swapGrids(outEl, inEl);
      else { outEl.style.display = 'none'; inEl.style.display = ''; }
    }

    function sync() {
      root.querySelectorAll('.tile').forEach(function (t) {
        t.classList.toggle('selected', selected.indexOf(t.getAttribute('data-id')) >= 0);
      });
      if (valueEl) {
        if (selected.length === 0) {
          valueEl.textContent = 'Pick 1–2 flavours above';
          valueEl.classList.add('empty');
          if (ctaEl) ctaEl.href = 'order.html';
        } else {
          valueEl.textContent = selected.map(function (id) { return G.flavorById(id).name; }).join(' + ');
          valueEl.classList.remove('empty');
          if (ctaEl) ctaEl.href = 'order.html?flavours=' + selected.join(',');
        }
      }
      if (opts.onChange) opts.onChange(selected.slice());
    }

    root.querySelectorAll('.flavor-tab').forEach(function (tab) {
      tab.addEventListener('click', function () { showTab(tab.getAttribute('data-tab')); });
    });

    root.querySelectorAll('.tile-grid').forEach(function (grid) {
      grid.addEventListener('click', function (e) {
        if (e.target.closest('a')) return; /* links inside tiles never select */
        var tile = e.target.closest('.tile');
        if (!tile || tile.classList.contains('out')) return;
        var id = tile.getAttribute('data-id');
        var idx = selected.indexOf(id);
        if (idx >= 0) selected.splice(idx, 1);
        else {
          selected.push(id);
          while (selected.length > max) selected.shift(); /* FIFO: oldest out */
        }
        sync();
      });
    });

    if (selected.length && G.isClassic(selected[0])) showTab('classics');
    sync();

    return {
      get: function () { return selected.slice(); },
      setMax: function (m) {
        max = m;
        if (selected.length > max) selected = selected.slice(-max); /* keep newest */
        sync();
      },
      clear: function () { selected = []; sync(); }
    };
  };

  /* Auto-init for pages with the default containers (homepage) */
  var pickerEl = document.getElementById('flavor-picker');
  if (pickerEl) G.renderFlavorPicker(pickerEl);
  var badgeEl = document.getElementById('season-badge');
  if (badgeEl) G.renderSeasonBadge(badgeEl);
})();
