/* ============================================================
   GELATORCHARD, /order · Capitolo 3
   Format tabs, FlavorPicker riusato (max dinamico), ticket batch,
   value stack, basket drawer, checkout a 2 conferme + pagamento.
   Il pagamento è in "pre-launch preview": Stripe si aggancia al
   lancio, nessun pagamento reale viene preso oggi.
   ============================================================ */
(function () {
  'use strict';
  var G = window.Gelatorchard;

  /* ---------- 3.2 / 3.3 / 3.5 — formati ----------
     PIANO DI PRODUZIONE (8 ago 2026, vedi PRODUZIONE.md): la macchina
     da banco manteca 750g a ciclo. 1 porzione = 125g. Ogni formato è
     un multiplo esatto: 750g = 6 coppette = 3 sacapoche da 250g.
     Il Kit si taglia PER PERSONE: 250g a testa (2 porzioni ciascuno),
     massimo 2 gusti per box. */
  var FORMATS = {
    cup: {
      name: 'Cup', tabPrice: '£3.50', min: 1, max: 1, price: 3.5,
      priceLabel: '£3.50', desc: '125g, one honest portion (two proper scoops). The cheapest way to try us.',
      hint: 'Pick 1 flavour for your Cup'
    },
    bag: {
      name: 'Piping Bag', tabPrice: 'from £6.50', min: 1, max: 1, price: 6.5,
      priceLabel: 'from £6.50', desc: '250g, one flavour: two 125g servings. Squeeze it straight onto cone or cup.',
      hint: 'One bag = one flavour'
    },
    kit: {
      name: 'Gelato Kit', tabPrice: 'from £25', min: 1, max: 2,
      hint: 'Pick 1 or 2 flavours, one per piping bag'
    },
    multipack: {
      name: 'Multipack', tabPrice: '£12', min: 1, max: 4, price: 12,
      priceLabel: '£12', desc: '4 cups of 125g, up to 4 flavours, one per cup.',
      hint: 'Up to 4 flavours, one per cup in the pack'
    },
    tub: {
      name: 'Family Tub', tabPrice: '£22', min: 1, max: 2, price: 22,
      priceLabel: '£22', desc: '750g, one full churn (about a litre): six 125g servings. One flavour, or two half-and-half.',
      hint: '1 or 2 flavours, the tub can hold two halves'
    }
  };

  /* Taglie del Kit per numero di persone (menu a tendina).
     250g a testa = 2 porzioni da 125g a persona. PREZZI dall'analisi
     dei costi (COSTI.md, 8 ago 2026): pickup con food cost 33-44%,
     delivery = pickup + £10 (EPS + ghiaccio secco + giro costano ~£12:
     il vecchio +£6 vendeva in perdita). NB il per-4 delivery passa da
     £34 storico a £38: cambo segnalato al founder (FAKE-DATA.md). */
  var KIT_SIZES = {
    2: { bags: 2, grams: 500,  price: 15, priceDelivery: 25 },
    3: { bags: 3, grams: 750,  price: 20, priceDelivery: 30 },
    4: { bags: 4, grams: 1000, price: 28, priceDelivery: 38 },
    6: { bags: 6, grams: 1500, price: 40, priceDelivery: 50 }
  };
  var kitPeople = 4; /* default: il formato di punta */
  var TAB_ORDER = ['cup', 'bag', 'kit', 'multipack', 'tub'];
  var activeFormat = 'kit'; /* prodotto di punta: default */
  /* CRO message match (8 ago 2026): ?format=cup|bag|kit|multipack|tub
     apre il catalogo sul tab giusto (card formati in home, CTA lettera) */
  var fmtParam = new URLSearchParams(location.search).get('format');
  if (fmtParam && FORMATS[fmtParam]) activeFormat = fmtParam;

  function gbp(n) { return '£' + n.toFixed(2); }

  /* ---------- Stato basket (persistito) ----------
     DECISIONE FOUNDER (8 ago 2026): SOLO DELIVERY, niente pickup.
     Giro del sabato su Canary Wharf, Poplar e South Quay (E14),
     nessun minimo d'ordine (zona corta). Ghiaccio secco SOLO nel
     Kit box; il resto viaggia in borsa frigo coi siberini. I prezzi
     pickup restano in KIT_SIZES per un eventuale ritiro futuro. */
  var basket = [];
  var fulfilment = 'delivery';
  try {
    basket = JSON.parse(localStorage.getItem('gc-basket-v1') || '[]');
  } catch (e) { basket = []; }
  function saveBasket() {
    try {
      localStorage.setItem('gc-basket-v1', JSON.stringify(basket));
    } catch (e) {}
  }
  function unitPrice(item) {
    if (item.format === 'kit') {
      var s = KIT_SIZES[item.people] || KIT_SIZES[4];
      return fulfilment === 'delivery' ? s.priceDelivery : s.price;
    }
    return FORMATS[item.format].price;
  }
  /* Nome visibile: il Kit porta la taglia ("Gelato Kit for 4") */
  function displayName(it) {
    return it.format === 'kit'
      ? 'Gelato Kit for ' + (it.people || 4)
      : FORMATS[it.format].name;
  }
  function basketCount() {
    return basket.reduce(function (n, it) { return n + it.qty; }, 0);
  }
  function hasKit() { return basket.some(function (it) { return it.format === 'kit'; }); }
  function basketFruitIds() {
    var ids = [];
    basket.forEach(function (it) {
      it.flavours.forEach(function (id) {
        if (!G.isClassic(id) && ids.indexOf(id) < 0) ids.push(id);
      });
    });
    return ids;
  }
  function itemLabel(it) {
    return displayName(it) + ', ' +
      it.flavours.map(function (id) { return G.flavorById(id).name; }).join(' + ') +
      (it.qty > 1 ? ' ×' + it.qty : '');
  }

  /* ---------- Viste ---------- */
  var VIEWS = ['view-catalog', 'view-confirm', 'view-manifesto', 'view-payment', 'view-done'];
  function showView(id) {
    VIEWS.forEach(function (v) { document.getElementById(v).hidden = (v !== id); });
    document.getElementById('basket-fab').hidden = !(id === 'view-catalog' && basketCount() > 0);
    window.scrollTo({ top: 0 });
  }

  /* ---------- Tabs formato ---------- */
  var tabsEl = document.getElementById('op-tabs');
  tabsEl.innerHTML = TAB_ORDER.map(function (key) {
    var f = FORMATS[key];
    return '<button class="fmt-tab' + (key === activeFormat ? ' active' : '') + '" data-fmt="' + key + '" role="tab">' +
      f.name + '<span class="ft-price">' + f.tabPrice + '</span></button>';
  }).join('');
  tabsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.fmt-tab');
    if (!btn) return;
    activeFormat = btn.getAttribute('data-fmt');
    tabsEl.querySelectorAll('.fmt-tab').forEach(function (t) {
      t.classList.toggle('active', t === btn);
    });
    picker.setMax(FORMATS[activeFormat].max); /* fa scattare refresh() via onChange */
  });

  /* Menu a tendina taglia Kit (delegato: op-price si ri-renderizza) */
  document.getElementById('op-price').addEventListener('change', function (e) {
    if (e.target && e.target.id === 'kit-people') {
      kitPeople = +e.target.value;
      if (G.track) G.track('kit_people_select', { people: kitPeople });
      refresh();
    }
  });

  /* ---------- FlavorPicker riusato (preselezione da ?flavours=) ---------- */
  var preselect = [];
  var qs = new URLSearchParams(location.search).get('flavours');
  if (qs) preselect = qs.split(',').filter(Boolean);

  var picker = G.renderFlavorPicker(document.getElementById('op-picker'), {
    max: FORMATS[activeFormat].max,
    summary: false,
    preselect: preselect,
    onChange: refresh
  });

  /* ---------- 3.4 ticket batch/classico ---------- */
  function ticketHTML(id) {
    var f = G.flavorById(id);
    var st = G.seasonStatus(id);
    if (st.always) {
      return '<div class="ticket">' +
        '<span class="tk-dot ' + f.sw + '"></span>' +
        '<div><div class="tk-title">' + f.name + '</div>' +
        '<div class="tk-farm">Always available: real ingredients, never powders</div></div></div>';
    }
    var b = G.BATCHES[id];
    if (b) {
      return '<div class="ticket">' +
        '<span class="tk-dot ' + f.sw + '"></span>' +
        '<div><div class="tk-title">' + f.name + ' · Batch #' + b.id + '</div>' +
        '<div class="tk-farm">' + b.farm + '</div>' +
        '<div class="tk-dates">Picked: ' + b.harvest + ' · Produced: ' + b.produced + '</div>' +
        '<a class="tk-link" href="story.html?batch=' + b.id + '">Read the full story →</a></div></div>';
    }
    var origin = (G.SEASONS[id] && G.SEASONS[id].origin) || 'British farms';
    return '<div class="ticket">' +
      '<span class="tk-dot ' + f.sw + '"></span>' +
      '<div><div class="tk-title">' + f.name + '</div>' +
      '<div class="tk-farm">' + origin + ', in season now</div>' +
      '<div class="tk-dates">Current batch details arrive with your delivery, every bag carries a QR.</div>' +
      '<a class="tk-link" href="story.html?flavour=' + id + '">Read the story →</a></div></div>';
  }

  /* ---------- 3.5 blocco prezzo ---------- */
  function priceHTML() {
    var f = FORMATS[activeFormat];
    if (activeFormat === 'kit') {
      /* Taglia per persone (PRODUZIONE.md): 250g a testa = 2 porzioni
         da 125g a persona. Prezzo UNICO consegnato (delivery-only).
         Accessori: 1 cono + 1 coppetta + 1 cucchiaino A PORZIONE. */
      var s = KIT_SIZES[kitPeople];
      var servings = s.grams / 125;
      var perServing = (s.priceDelivery / servings).toFixed(2);
      return '<div class="price-block">' +
        '<label class="kit-people-label" for="kit-people">Who’s it for?</label>' +
        '<select id="kit-people" class="kit-people">' +
          [2, 3, 4, 6].map(function (p) {
            var k = KIT_SIZES[p];
            return '<option value="' + p + '"' + (p === kitPeople ? ' selected' : '') + '>' +
              p + ' people · ' + (k.grams >= 1000 ? (k.grams / 1000) + 'kg' : k.grams + 'g') +
              ' · ' + (k.grams / 125) + ' servings</option>';
          }).join('') +
        '</select>' +
        '<div class="price-line">£' + s.priceDelivery.toFixed(2) + ' delivered</div>' +
        '<p class="price-anchor">A London gelato bar charges <strong>£4.50–7.50 a scoop</strong>. ' +
        'Here a full 125g serving (two proper scoops) works out at <strong>£' + perServing + ' delivered</strong>, with the farmer’s story included.</p>' +
        '<ul class="value-stack">' +
        '<li>' + s.bags + ' piping bags of 250g: ' + (s.grams >= 1000 ? (s.grams / 1000) + 'kg' : s.grams + 'g') +
          ' of real gelato, ' + servings + ' × 125g servings (two each)</li>' +
        '<li>Up to 2 flavours, one per piping bag</li>' +
        '<li>' + servings + ' wafer cones, ' + servings + ' kraft cups, ' + servings + ' wooden spoons: one of each per serving</li>' +
        '<li>Insulated dry-ice box (holds -18°C for 6+ hours)</li>' +
        '<li>Saturday delivery to Canary Wharf, Poplar &amp; South Quay, included</li>' +
        '<li>Full traceability: a QR to the batch story</li>' +
        '</ul></div>';
    }
    return '<div class="price-block">' +
      '<div class="price-line">' + f.name + ' · ' + f.priceLabel + '</div>' +
      '<p class="price-anchor">' + f.desc + '</p></div>';
  }

  /* ---------- refresh catalogo (ticket, prezzo, CTA, scarcity) ---------- */
  function refresh(selection) {
    selection = selection || picker.get();
    var f = FORMATS[activeFormat];

    document.getElementById('op-tickets').innerHTML = selection.map(ticketHTML).join('');
    document.getElementById('op-price').innerHTML = priceHTML();

    var add = document.getElementById('op-add');
    var hint = document.getElementById('op-hint');
    var ok = selection.length >= f.min;
    add.disabled = !ok;
    add.classList.toggle('disabled', !ok);
    if (activeFormat === 'kit') {
      var ks = KIT_SIZES[kitPeople];
      add.textContent = 'Add the Kit for ' + kitPeople + ' · £' + ks.priceDelivery + ' delivered';
      hint.textContent = ok ? '' : 'Select 1–2 flavours to continue';
    } else {
      add.textContent = 'Add to Basket · ' + f.priceLabel;
      hint.textContent = ok ? '' : 'Select a flavour to continue';
    }
    if (ok) hint.textContent = f.hint;

    /* 3.6 scarcity reale: solo gusti frutta con stagione in chiusura (≤45 giorni) */
    var lines = [];
    selection.forEach(function (id) {
      var st = G.seasonStatus(id);
      if (!st.always && st.inSeason && st.daysLeft <= 45) {
        lines.push('⏳ ' + G.flavorById(id).name + ': season ends ' + st.endLong +
          '. Then: ' + st.returnMonthYear + '.');
      }
    });
    document.getElementById('op-scarcity').innerHTML =
      lines.map(function (l) { return '<p class="scarcity">' + l + '</p>'; }).join('');
  }

  /* ---------- 3.6 aggiungi al basket ---------- */
  document.getElementById('op-add').addEventListener('click', function () {
    var sel = picker.get();
    if (sel.length < FORMATS[activeFormat].min) return;
    var people = activeFormat === 'kit' ? kitPeople : null;
    var key = activeFormat + (people ? '|' + people : '') + '|' + sel.slice().sort().join(',');
    var existing = basket.filter(function (it) { return it.key === key; })[0];
    if (existing) existing.qty += 1;
    else basket.push({ key: key, format: activeFormat, people: people, flavours: sel.slice(), qty: 1 });
    if (G.track) G.track('add_to_basket', { format: activeFormat, people: people, flavours: sel.join(',') });
    saveBasket();
    renderBasket();
    openDrawer();
  });

  /* ---------- 3.7 basket drawer ---------- */
  var drawer = document.getElementById('basket-drawer');
  var overlay = document.getElementById('drawer-overlay');
  function openDrawer() { drawer.classList.add('open'); overlay.classList.add('open'); }
  function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('open'); }
  overlay.addEventListener('click', closeDrawer);
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  document.getElementById('basket-fab').addEventListener('click', openDrawer);

  /* Quantità e rimozione righe: gestore delegato sul contenitore,
     così sopravvive a ogni ri-render del basket */
  document.getElementById('basket-items').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-i]');
    if (!btn) return;
    var i = +btn.getAttribute('data-i');
    var d = +btn.getAttribute('data-d');
    if (!basket[i]) return;
    if (d === 0) basket.splice(i, 1);            /* remove */
    else {
      basket[i].qty += d;                        /* +1 / −1 */
      if (basket[i].qty <= 0) basket.splice(i, 1);
    }
    saveBasket();
    renderBasket();
  });

  /* (toggle pickup/delivery rimosso: si consegna e basta, vedi sopra) */

  function renderBasket() {
    var box = document.getElementById('basket-items');
    if (basket.length === 0) {
      box.innerHTML = '<p class="basket-empty">Your basket is empty, pick a format and your flavours above.</p>';
    } else {
      box.innerHTML = basket.map(function (it, i) {
        return '<div class="basket-item">' +
          '<div><div class="bi-name">' + displayName(it) + '</div>' +
          '<div class="bi-flavours">' + it.flavours.map(function (id) { return G.flavorById(id).name; }).join(' + ') + '</div>' +
          '<div class="bi-qty">' +
            '<button class="qty-btn" data-i="' + i + '" data-d="-1" aria-label="Decrease">−</button>' +
            '<span>' + it.qty + '</span>' +
            '<button class="qty-btn" data-i="' + i + '" data-d="1" aria-label="Increase">+</button>' +
            '<button class="bi-remove" data-i="' + i + '" data-d="0">remove</button>' +
          '</div></div>' +
          '<div class="bi-price">' + gbp(unitPrice(it) * it.qty) + '</div></div>';
      }).join('');
    }
    var sub = basket.reduce(function (n, it) { return n + unitPrice(it) * it.qty; }, 0);
    document.getElementById('tot-sub').textContent = gbp(sub);
    var del = document.getElementById('tot-del');
    del.textContent = 'Included · Saturday round, E14';
    document.getElementById('tot-grand').textContent = gbp(sub);
    var fab = document.getElementById('basket-fab');
    document.getElementById('fab-count').textContent = basketCount();
    fab.hidden = !(basketCount() > 0 && !document.getElementById('view-catalog').hidden);
    document.getElementById('go-checkout').disabled = basket.length === 0;
    return sub;
  }

  /* ---------- data stimata: il sabato del drop settimanale ----------
     Fonte unica G.orderWindow (flavors.js): niente più "domani",
     il modello è ordina questa settimana → mangi sabato/domenica. */
  function etaDate() {
    return G.orderWindow().saturday
      .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  function etaLine() {
    return 'Delivery: ' + etaDate() + ' (or Sunday, you pick the slot by email)';
  }

  /* ---------- 3.8 Step A — conferma ordine ---------- */
  document.getElementById('go-checkout').addEventListener('click', function () {
    if (basket.length === 0) return;
    if (G.track) G.track('checkout_start', { items: basket.length, fulfilment: fulfilment });
    closeDrawer();
    var rows = basket.map(itemLabel);
    if (basketFruitIds().indexOf('strawberry') >= 0 && G.BATCHES.strawberry) {
      rows.push("Johnson's Farm, Kent. Picked " + G.BATCHES.strawberry.harvest);
    }
    /* Opzione B (founder, 6 ago 2026): fuori finestra non si blocca nulla,
       l'ordine si accoda al drop successivo e il riepilogo lo dice chiaro. */
    var w = G.orderWindow();
    rows.push(w.open
      ? 'You’re in this week’s drop: fruit ordered from the farm Tuesday evening, made fresh Friday morning'
      : 'This week’s window has passed, so you join the next drop: counted Tuesday 6pm, made fresh Friday morning');
    rows.push(etaLine());
    rows.push('Delivery round: Canary Wharf, Poplar & South Quay (E14), included in the price');
    rows.push('You’ll receive a QR to scan on arrival');
    rows.push('We’ll ask you for a review, Marco reads every comment');
    document.getElementById('cf-list').innerHTML =
      rows.map(function (r) { return '<li>' + r + '</li>'; }).join('');
    showView('view-confirm');
  });
  document.getElementById('cf-edit').addEventListener('click', function () {
    showView('view-catalog');
    renderBasket();
    openDrawer();
  });
  document.getElementById('cf-yes').addEventListener('click', function () {
    showView('view-manifesto');
  });

  /* ---------- 3.8 Step B → dettagli/pagamento ---------- */
  document.getElementById('mf-ok').addEventListener('click', function () {
    document.getElementById('pay-gift').hidden = !hasKit();
    /* Ghiaccio secco SOLO nel Kit box; il resto viaggia in borsa
       frigo coi siberini (decisione founder 8 ago 2026) */
    document.getElementById('pay-ice').hidden = !hasKit();
    var sub = basket.reduce(function (n, it) { return n + unitPrice(it) * it.qty; }, 0);
    document.getElementById('pay-go').textContent = 'Pay ' + gbp(sub) + ' (preview)';
    showView('view-payment');
  });
  document.getElementById('pay-back').addEventListener('click', function () {
    showView('view-manifesto');
  });

  /* ---------- 3.9 / 3.10 pagamento (preview) → conferma ---------- */
  document.getElementById('pay-go').addEventListener('click', function () {
    var email = document.getElementById('pay-email').value.trim();
    var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    document.getElementById('pay-email-err').style.display = valid ? 'none' : 'block';
    if (!valid) return;

    var b = G.BATCHES.strawberry;
    document.getElementById('done-title').textContent =
      (basketFruitIds().indexOf('strawberry') >= 0 && b)
        ? 'Order confirmed · Batch #' + b.id
        : 'Order confirmed';
    var what = basket.map(itemLabel).join('; ');
    document.getElementById('done-sub').textContent =
      'Your ' + what + ', ' + etaLine().charAt(0).toLowerCase() + etaLine().slice(1) + '.';

    /* Registro locale (dashboard admin) + invio a Supabase quando configurato */
    var gift = (document.getElementById('gift-msg') || {}).value || '';
    var record = {
      date: new Date().toISOString(),
      email: email,
      fulfilment: fulfilment,
      total: basket.reduce(function (n, it) { return n + unitPrice(it) * it.qty; }, 0),
      giftMessage: gift,
      items: basket.map(function (it) {
        return {
          format: FORMATS[it.format].name,
          flavours: it.flavours.map(function (id) { return G.flavorById(id).name; }),
          qty: it.qty,
          linePrice: unitPrice(it) * it.qty
        };
      })
    };
    try {
      var hist = JSON.parse(localStorage.getItem('gc-orders') || '[]');
      hist.push(record);
      localStorage.setItem('gc-orders', JSON.stringify(hist));
    } catch (e) {}
    if (G.track) G.track('order_submitted', { total: record.total, fulfilment: fulfilment, items: record.items.length });
    if (window.GelatorchardBackend) {
      record.items.forEach(function (it) {
        window.GelatorchardBackend.submitOrder({
          email: email, formatName: it.format, fulfilment: fulfilment,
          linePrice: it.linePrice, qty: it.qty, gift: gift, flavourNames: it.flavours
        }).then(function (r) {
          if (r && r.live) {
            var n = document.querySelector('#view-done .notice.preview');
            if (n) n.remove();
          }
        }).catch(function () {});
      });
    }

    basket = [];
    saveBasket();
    showView('view-done');
  });

  /* ---------- init ---------- */
  refresh();
  renderBasket();
})();
