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
    /* Cap. 10.6: giorni trascorsi dalla FINE dell'ultima stagione chiusa
       (serve per "Cherry ended 12 days ago") */
    var prevEnd = null;
    for (i = 0; i < wins.length; i++) {
      if (wins[i][1] < ref && (!prevEnd || wins[i][1] > prevEnd)) prevEnd = wins[i][1];
    }
    return {
      state: next.getFullYear() === y ? 'coming' : 'finished',
      daysToStart: Math.ceil((next - ref) / DAY),
      daysSinceEnd: prevEnd ? Math.floor((ref - prevEnd) / DAY) : null,
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
    },

    /* ⚠️ BATCH SIMULATI (Cap. 10.5.8) — dati NON reali, solo mockup.
       Marcati fake:true; elencati in FAKE-DATA.md; al lancio vanno
       sostituiti con i batch veri dal registro di produzione. */
    blueberry: {
      fake: true,
      id: '043',
      /* era 'esaurito' come demo del terzo stato del picker; il founder
         l'ha voluto disponibile (8 ago 2026) per mostrare la foto.
         Rimettere 'esaurito' per rivedere la demo scorta finita. */
      status: 'disponibile',
      flavour: 'blueberry',
      fruitName: 'Blueberry',
      farm: 'Reid Berry Farm, Blairgowrie, Perthshire',
      farmName: 'Reid Berry Farm',
      farmerName: 'David Reid',
      farmerFirst: 'David',
      location: 'Blairgowrie, Perthshire',
      variety: 'Duke',
      harvest: '20 July 2026',
      harvestTime: '05:47',
      produced: '22 July 2026',
      operator: 'Marco',
      batchSize: '12L',
      method: 'Integrated Pest Management (IPM)',
      certification: 'Red Tractor Assurance',
      bio: 'David Reid grows blueberries on the slopes above Blairgowrie, the soft-fruit capital of Scotland. His bushes are twelve years old, right in their prime.',
      quote: '“Cold nights, slow sugar. That’s why a Scottish blueberry tastes of something.”',
      log: [
        ['06:10', 'Fruit received and inspected (HACCP checklist)'],
        ['06:40', 'Base prep: 8kg blueberries, 1.1kg sugar, water'],
        ['07:10', 'Trittico: pasteurisation at 62°C, 20 minutes'],
        ['07:30', 'Mixing and ageing, 40 minutes'],
        ['08:10', 'Churning'],
        ['08:30', 'Into the blast freezer'],
        ['08:40', 'BATCH COMPLETE']
      ],
      marcoNote: 'Smaller berries than May strawberries, ten times the perfume. I churned this one slightly warmer to keep the skins whole.',
      coldChain: { distance: '694 km', tempOut: '-20°C', tempIn: '-13°C', transit: '11 hours' },
      mapQuery: 'Blairgowrie, Perthshire'
    },
    'victoria-plum': {
      fake: true,
      id: '044',
      status: 'disponibile',
      flavour: 'victoria-plum',
      fruitName: 'Victoria Plum',
      farm: 'Wickham Orchards, Pershore, Worcestershire',
      farmName: 'Wickham Orchards',
      farmerName: 'Sarah Wickham',
      farmerFirst: 'Sarah',
      location: 'Pershore, Worcestershire',
      variety: 'Victoria',
      harvest: '3 August 2026',
      harvestTime: '06:05',
      produced: '4 August 2026',
      operator: 'Marco',
      batchSize: '12L',
      method: 'Integrated Pest Management (IPM)',
      certification: 'Red Tractor Assurance',
      bio: 'Sarah Wickham runs the orchard her grandfather planted in the Vale of Evesham, where the Victoria plum has been picked since the 1840s.',
      quote: '“Three good weeks. That’s the whole Victoria season. You don’t waste a single morning of it.”',
      log: [
        ['06:00', 'Fruit received and inspected (HACCP checklist)'],
        ['06:30', 'Base prep: 8.5kg plums, 1.2kg sugar, water'],
        ['07:00', 'Trittico: pasteurisation at 62°C, 20 minutes'],
        ['07:20', 'Mixing and ageing, 40 minutes'],
        ['08:00', 'Churning'],
        ['08:20', 'Into the blast freezer'],
        ['08:30', 'BATCH COMPLETE']
      ],
      marcoNote: 'The first Victorias of the year. Stone out, skin in: the skin is where all the colour and the sharpness live.',
      coldChain: { distance: '176 km', tempOut: '-20°C', tempIn: '-15°C', transit: '3 hours' },
      mapQuery: 'Pershore, Worcestershire'
    },
    raspberry: {
      fake: true,
      id: '045',
      status: 'disponibile',
      flavour: 'raspberry',
      fruitName: 'Raspberry',
      farm: 'Anderson Berry Farm, Ettrickbridge, Scottish Borders',
      farmName: 'Anderson Berry Farm',
      farmerName: 'Louise Anderson',
      farmerFirst: 'Louise',
      location: 'Ettrickbridge, Scottish Borders',
      variety: 'Glen Ample',
      harvest: '27 July 2026',
      harvestTime: '05:58',
      produced: '29 July 2026',
      operator: 'Marco',
      batchSize: '12L',
      method: 'Integrated Pest Management (IPM)',
      certification: 'Red Tractor Assurance',
      bio: 'Louise Anderson is the fourth generation on her family’s raspberry farm in the Scottish Borders.',
      quote: '“This year’s crop has come in sweet and firm. Best yield in five years.”',
      log: [
        ['06:05', 'Fruit received and inspected (HACCP checklist)'],
        ['06:35', 'Base prep: 8kg raspberries, 1.15kg sugar, water'],
        ['07:05', 'Trittico: pasteurisation at 62°C, 20 minutes'],
        ['07:25', 'Mixing and ageing, 40 minutes'],
        ['08:05', 'Churning'],
        ['08:25', 'Into the blast freezer'],
        ['08:35', 'BATCH COMPLETE']
      ],
      marcoNote: 'Glen Ample berries barely need me. I kept the sugar low and let the fruit argue its own case.',
      coldChain: { distance: '552 km', tempOut: '-20°C', tempIn: '-13°C', transit: '9 hours' },
      mapQuery: 'Ettrickbridge, Scottish Borders'
    }
  };
  G.BATCHES = BATCHES;

  /* Registro batch per la prova sociale in homepage (Cap. 10.5.8).
     Legge SOLO Gelatorchard.BATCHES: nessun elenco duplicato. */
  G.renderBatchLog = function (el) {
    var rows = Object.keys(BATCHES).map(function (k) { return BATCHES[k]; })
      .sort(function (a, b) { return b.id.localeCompare(a.id); });
    el.innerHTML = rows.map(function (b) {
      return '<li' + (b.fake ? ' data-fake="1"' : '') + '>' +
        '<span class="bl-id">#' + b.id + '</span>' +
        '<span class="bl-main">' + b.fruitName + (b.variety ? ' · ' + b.variety : '') +
          ' · ' + b.farmerName + ', ' + b.location + '</span>' +
        '<span class="bl-date">picked ' + b.harvest + '</span>' +
        '<a class="bl-link" href="story.html?batch=' + b.id + '">log →</a></li>';
    }).join('');
  };
  /* stockStatus(id) — scorta della settimana (spec carosello, 6 ago 2026).
     In preview legge lo status del batch corrente in BATCHES ('esaurito'
     = Marco ha venduto tutta la produzione della settimana). Al lancio:
     alimentato da Supabase flavors.stock_status via backend.js. La
     stagionalità NON c'entra: prima si controlla seasonStatus, poi
     (solo se in stagione) la scorta. I Classici non hanno stagione ma
     possono comunque esaurirsi. */
  G.stockStatus = function (id) {
    var b = BATCHES[id];
    return (b && b.status === 'esaurito') ? 'esaurito' : 'disponibile';
  };

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
      daysSinceEnd: w.daysSinceEnd,
      startLabel: w.startLabel,
      subtitle: 'Out of season',
      returnMonthYear: w.returnMonthYear,
      stampLabel: 'Back ' + w.returnMonthYear
    };
  };

  /* mostUrgentFruit(date) — la leva di scarsità condivisa (Cap. 10.7):
     il gusto in stagione più vicino alla fine (≤45 giorni), altrimenti
     il prossimo che apre. Usata da barra di scarsità e CTA band. */
  G.mostUrgentFruit = function (date) {
    var d = date || new Date();
    var ending = null, coming = null;
    FLAVORS.fruit.forEach(function (f) {
      var st = G.seasonStatus(f.id, d);
      if (st.inSeason) {
        if (st.daysLeft <= 45 && (!ending || st.daysLeft < ending.daysLeft)) {
          ending = { type: 'ending', id: f.id, name: f.name, daysLeft: st.daysLeft,
                     peak: st.peak, endLong: st.endLong, returnMonthYear: st.returnMonthYear };
        }
      } else if (st.daysToStart != null) {
        if (!coming || st.daysToStart < coming.daysToStart) {
          coming = { type: 'coming', id: f.id, name: f.name,
                     daysToStart: st.daysToStart, startLabel: st.startLabel };
        }
      }
    });
    return ending || coming;
  };

  /* orderWindow(date) — il drop settimanale (pagina How to Order).
     Ritmo confermato dal founder: ordini lunedì 10:00 → martedì 18:00,
     frutta dalla farm giovedì sera, produzione venerdì mattina,
     consegna/ritiro sabato-domenica. Un'unica fonte per la pagina
     how-to-order, l'ETA del checkout (order.js) e ogni countdown:
     il countdown è lecito SOLO perché la scadenza è reale (regola 4). */
  G.orderWindow = function (ref) {
    var d = ref || new Date();
    var dow = (d.getDay() + 6) % 7; /* 0 = lunedì */
    var mon = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dow);
    var opens = new Date(mon); opens.setHours(10, 0, 0, 0);
    var closes = new Date(mon); closes.setDate(mon.getDate() + 1); closes.setHours(18, 0, 0, 0);
    if (d > closes) { /* finestra passata: la prossima è la settimana dopo */
      opens.setDate(opens.getDate() + 7);
      closes.setDate(closes.getDate() + 7);
    }
    var saturday = new Date(closes.getFullYear(), closes.getMonth(), closes.getDate() + 4);
    var sunday = new Date(saturday.getFullYear(), saturday.getMonth(), saturday.getDate() + 1);
    return {
      open: d >= opens && d <= closes,
      opensAt: opens,     /* prossima apertura (o quella in corso) */
      closesAt: closes,   /* chiusura della finestra corrente/prossima */
      saturday: saturday, /* giorno di consegna del drop */
      sunday: sunday
    };
  };

  /* DATE DEMO (founder, 8 ago 2026): via il badge REC "in diretta",
     le date dei batch mostrati come "correnti" seguono l'ULTIMO DROP
     (frutta giovedì, produzione venerdì): plausibili ogni giorno senza
     manutenzione. SOLO demo pre-lancio: al lancio le date arrivano dai
     batch veri (CMS Notion). Le date VERE del batch #042 sono in
     FAKE-DATA.md (raccolto 15 May 2026 06:12, prodotto 17 May 2026). */
  (function demoBatchDates() {
    var now = new Date();
    var backToFri = (now.getDay() - 5 + 7) % 7;
    var fri = new Date(now.getFullYear(), now.getMonth(), now.getDate() - backToFri);
    var thu = new Date(fri.getFullYear(), fri.getMonth(), fri.getDate() - 1);
    function fmt(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
    Object.keys(BATCHES).forEach(function (k) {
      BATCHES[k].harvest = fmt(thu);
      BATCHES[k].produced = fmt(fri);
    });
  })();

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
      /* Fuori stagione: grigio, non selezionabile. Se la stagione è
         finita da ≤30 giorni lo dichiara (Cap. 10.6): la perdita è
         la leva, non va nascosta dietro un timbro generico. */
      var meta = (st.state === 'finished' && st.daysSinceEnd != null && st.daysSinceEnd <= 30)
        ? 'Ended ' + st.daysSinceEnd + (st.daysSinceEnd === 1 ? ' day' : ' days') + ' ago'
        : st.subtitle;
      return '<div class="tile out" data-id="' + f.id + '" aria-disabled="true">' +
        '<div class="swatch ' + f.sw + '"><span class="stamp">' + st.stampLabel + '</span></div>' +
        '<div class="t-name">' + f.name + '</div>' +
        '<div class="t-meta">' + meta + '</div>' +
        '<a class="t-link" href="app.html?fruit=' + f.id + '">Tell me when it’s back →</a>' +
        '</div>';
    }
    /* Terzo stato (spec 6 ago 2026): in stagione MA scorta esaurita.
       Controllo in sequenza: prima la stagione (sopra), poi la scorta.
       Grigio CALDO distinto dal grigio fuori-stagione, NESSUN timbro
       con data (non sappiamo quando Marco rifornisce). La storia resta
       consultabile: un batch è esistito, è per questo che è esaurito.
       Vale anche per i Classici (niente stagione, ma si esauriscono). */
    if (G.stockStatus(f.id) === 'esaurito') {
      var bs = G.BATCHES[f.id];
      return '<div class="tile out sold" data-id="' + f.id + '" aria-disabled="true"' +
        (bs && bs.fake ? ' data-fake="1"' : '') + '>' +
        '<div class="swatch ' + f.sw + '"></div>' +
        '<div class="t-name">' + f.name + '</div>' +
        '<div class="t-meta">Sold out: more fruit on order, back soon</div>' +
        (bs ? '<a class="t-link" href="story.html?batch=' + bs.id + '">Read the story →</a>' : '') +
        (st.always ? '' : '<a class="t-link" href="app.html?fruit=' + f.id + '">Tell me when it’s back →</a>') +
        '</div>';
    }

    /* Farmer reveal (Cap. 10.6): alla selezione la tile mostra chi ha
       coltivato il batch corrente. Fonte: BATCHES; se il batch non è
       pubblicato, solo l'origine reale — mai inventare un contadino. */
    var reveal = '';
    if (!st.always) {
      var b = G.BATCHES[f.id];
      var s = SEASONS[f.id];
      reveal = b
        ? '<div class="t-farmer"' + (b.fake ? ' data-fake="1"' : '') + '><span class="tf-k">Grown by</span>' +
          b.farmerName + ' · ' + b.location + '<br>picked ' + b.harvest +
          (b.harvestTime ? ' at ' + b.harvestTime : '') + '</div>'
        : '<div class="t-farmer"><span class="tf-k">Grown in</span>' +
          ((s && s.origin) ? s.origin : 'Britain') + ' · batch details ship on your bag</div>';
    }
    var story = st.always ? '' :
      '<a class="t-link" href="story.html?flavour=' + f.id + '">Read the story →</a>';
    /* Tastiera (Lista A.1): la tile è un checkbox focusabile — il toggle
       via Enter/Spazio vive nel gestore keydown del picker */
    return '<div class="tile" data-id="' + f.id + '" role="checkbox" aria-checked="false" tabindex="0"' +
      ' aria-label="' + f.name + ', ' + st.subtitle + '">' +
      '<div class="swatch ' + f.sw + '"></div>' +
      '<div class="t-name">' + f.name + '</div>' +
      '<div class="t-meta">' + st.subtitle + '</div>' +
      reveal +
      story +
      '</div>';
  }

  /* Foto prodotto sulle tile della Collezione Frutta: prova
     foto-gusti/frutta/<id>.jpg (stessa convenzione dei caroselli),
     fallback automatico al gradiente .sw-*. Le foto attuali sono
     BOZZE stock/AI → swatch marcato data-fake (FAKE-DATA.md).
     Niente foto su: Classici (non consegnate) e tile "sold" (il
     grigio caldo È il segnale di scorta esaurita). Le tile fuori
     stagione mostrano la foto in scala di grigi (filter esistente). */
  var TILE_PHOTOS = {};
  function applyTilePhotos(root) {
    root.querySelectorAll('.tile').forEach(function (t) {
      if (t.classList.contains('sold')) return;
      var id = t.getAttribute('data-id');
      if (G.isClassic(id)) return;
      var sw = t.querySelector('.swatch');
      function apply(url) {
        sw.classList.add('has-photo');
        sw.setAttribute('data-fake', '1'); /* bozza: togliere con le foto vere */
        sw.style.backgroundImage = 'url("' + url + '")';
      }
      /* Nella tile serve il frutto RICONOSCIBILE (scelta founder):
         prima il primo piano dedicato in frutta/tile/, poi la foto
         standard del carosello, poi resta il gradiente. */
      var cached = TILE_PHOTOS[id];
      if (cached === false) return;
      if (cached) { apply(cached); return; }
      var candidates = [
        'foto-gusti/frutta/tile/' + id + '.jpg',
        'foto-gusti/frutta/' + id + '.jpg'
      ];
      (function tryNext(i) {
        if (i >= candidates.length) { TILE_PHOTOS[id] = false; return; }
        var img = new Image();
        img.onload = function () { TILE_PHOTOS[id] = candidates[i]; apply(candidates[i]); };
        img.onerror = function () { tryNext(i + 1); };
        img.src = candidates[i];
      })(0);
    });
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
      if (G.flavorById(id) && st.inSeason && G.stockStatus(id) !== 'esaurito' &&
          selected.indexOf(id) < 0 && selected.length < max) {
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
          '<a class="pill pill-dark ks-cta" data-track="picker_continue" href="order.html">Continue · £28 pickup / £34 delivery</a>' +
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
        var on = selected.indexOf(t.getAttribute('data-id')) >= 0;
        t.classList.toggle('selected', on);
        if (t.hasAttribute('role')) t.setAttribute('aria-checked', on ? 'true' : 'false');
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

    function toggleTile(tile) {
      var id = tile.getAttribute('data-id');
      var idx = selected.indexOf(id);
      if (idx >= 0) selected.splice(idx, 1);
      else {
        selected.push(id);
        while (selected.length > max) selected.shift(); /* FIFO: oldest out */
      }
      if (G.track) G.track('picker_select', { flavour: id, on: idx < 0 });
      sync();
    }

    root.querySelectorAll('.tile-grid').forEach(function (grid) {
      grid.addEventListener('click', function (e) {
        if (e.target.closest('a')) return; /* links inside tiles never select */
        var tile = e.target.closest('.tile');
        if (!tile || tile.classList.contains('out')) return;
        toggleTile(tile);
      });
      /* Lista A.1: Enter/Spazio selezionano come il click */
      grid.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
        var tile = e.target.closest('.tile');
        if (!tile || tile.classList.contains('out')) return;
        e.preventDefault(); /* Spazio non deve scrollare la pagina */
        toggleTile(tile);
      });
    });

    if (selected.length && G.isClassic(selected[0])) showTab('classics');
    applyTilePhotos(root);
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
