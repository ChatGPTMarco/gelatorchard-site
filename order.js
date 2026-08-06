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

  /* ---------- 3.2 / 3.3 / 3.5 — formati ---------- */
  var FORMATS = {
    cup: {
      name: 'Cup', tabPrice: '£3.50', min: 1, max: 1, price: 3.5,
      priceLabel: '£3.50', desc: 'One flavour, ready in moments.',
      hint: 'Pick 1 flavour for your Cup'
    },
    bag: {
      name: 'Piping Bag', tabPrice: 'from £6.50', min: 1, max: 1, price: 6.5,
      priceLabel: 'from £6.50', desc: '500g, one flavour. Squeeze it straight onto cone or cup.',
      hint: 'One bag = one flavour'
    },
    kit: {
      name: 'Gelato Kit', tabPrice: '£28–34', min: 2, max: 2,
      price: 28, priceDelivery: 34,
      hint: 'Pick exactly 2 flavours, one per piping bag'
    },
    multipack: {
      name: 'Multipack', tabPrice: '£12', min: 1, max: 4, price: 12,
      priceLabel: '£12', desc: '4 cups, up to 4 flavours, one per cup.',
      hint: 'Up to 4 flavours, one per cup in the pack'
    },
    tub: {
      name: 'Family Tub', tabPrice: '£22', min: 1, max: 2, price: 22,
      priceLabel: '£22', desc: '1 litre. One flavour, or two half-and-half.',
      hint: '1 or 2 flavours, the 1L tub can hold two halves'
    }
  };
  var TAB_ORDER = ['cup', 'bag', 'kit', 'multipack', 'tub'];
  var activeFormat = 'kit'; /* prodotto di punta: default */

  function gbp(n) { return '£' + n.toFixed(2); }

  /* ---------- Stato basket (persistito) ---------- */
  var basket = [];
  var fulfilment = 'pickup';
  try {
    basket = JSON.parse(localStorage.getItem('gc-basket-v1') || '[]');
    fulfilment = localStorage.getItem('gc-fulfilment') || 'pickup';
  } catch (e) { basket = []; }
  function saveBasket() {
    try {
      localStorage.setItem('gc-basket-v1', JSON.stringify(basket));
      localStorage.setItem('gc-fulfilment', fulfilment);
    } catch (e) {}
  }
  function unitPrice(item) {
    var f = FORMATS[item.format];
    return (item.format === 'kit' && fulfilment === 'delivery') ? f.priceDelivery : f.price;
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
    return FORMATS[it.format].name + ', ' +
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
      /* Value stack: solo numeri reali già stabiliti (£28/£34, £4.50–7.50 a scoop) */
      return '<div class="price-block">' +
        '<div class="price-line">£28.00 pickup · £34.00 delivery</div>' +
        '<p class="price-anchor">A London gelato bar charges <strong>£4.50–7.50 a scoop</strong>. ' +
        'Your Kit: roughly 8 generous scoops (1kg, 2 flavours), under <strong>£3.50 a scoop</strong>, with the farmer’s story included.</p>' +
        '<ul class="value-stack">' +
        '<li>1kg of real gelato (2 × 500g piping bags, 2 flavours of your choice)</li>' +
        '<li>6–8 wafer cones, 6 kraft cups, 6 wooden spoons</li>' +
        '<li>Insulated dry-ice box (holds -18°C for 6+ hours)</li>' +
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
      add.textContent = 'Add the Kit · £28 / £34';
      hint.textContent = ok ? '' : 'Select 2 flavours to continue';
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
    var key = activeFormat + '|' + sel.slice().sort().join(',');
    var existing = basket.filter(function (it) { return it.key === key; })[0];
    if (existing) existing.qty += 1;
    else basket.push({ key: key, format: activeFormat, flavours: sel.slice(), qty: 1 });
    if (G.track) G.track('add_to_basket', { format: activeFormat, flavours: sel.join(',') });
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

  document.getElementById('ful-pickup').addEventListener('click', function () { setFulfilment('pickup'); });
  document.getElementById('ful-delivery').addEventListener('click', function () { setFulfilment('delivery'); });
  function setFulfilment(mode) {
    fulfilment = mode;
    document.getElementById('ful-pickup').classList.toggle('active', mode === 'pickup');
    document.getElementById('ful-delivery').classList.toggle('active', mode === 'delivery');
    saveBasket();
    renderBasket();
  }

  function renderBasket() {
    var box = document.getElementById('basket-items');
    if (basket.length === 0) {
      box.innerHTML = '<p class="basket-empty">Your basket is empty, pick a format and your flavours above.</p>';
    } else {
      box.innerHTML = basket.map(function (it, i) {
        return '<div class="basket-item">' +
          '<div><div class="bi-name">' + FORMATS[it.format].name + '</div>' +
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
    if (fulfilment === 'pickup') del.textContent = '£0.00 (pickup)';
    else del.textContent = hasKit() ? 'Included in Kit price' : 'To be confirmed';
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
    return fulfilment === 'delivery'
      ? 'Delivery: ' + etaDate() + ' (or Sunday, you pick the slot by email)'
      : 'Pickup: ' + etaDate() + ', we’ll confirm the exact time by email';
  }

  /* ---------- 3.8 Step A — conferma ordine ---------- */
  document.getElementById('go-checkout').addEventListener('click', function () {
    if (basket.length === 0) return;
    if (G.track) G.track('checkout_start', { items: basket.length, fulfilment: fulfilment });
    closeDrawer();
    var rows = basket.map(itemLabel);
    if (basketFruitIds().indexOf('strawberry') >= 0) {
      rows.push("Johnson's Farm, Kent. Picked 15 May");
    }
    rows.push('Made fresh Friday morning, from fruit that arrives Thursday evening');
    rows.push(etaLine());
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
    document.getElementById('pay-ice').hidden =
      !(fulfilment === 'delivery' && basketFruitIds().length > 0);
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
  setFulfilment(fulfilment);
  refresh();
  renderBasket();
})();
