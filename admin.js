/* ============================================================
   GELATORCHARD — Dashboard interna · Capitolo 8.4
   Preview: legge i dati di test locali (gc-orders, gc-feedback,
   gc-alerts) + il registro batch (flavors.js). Al lancio: stesse
   viste alimentate da Supabase (orders/feedback/alert_subscriptions)
   e pagina protetta da login.
   Nota operativa 8.3: assemblaggio Kit = 8-10 min l'uno → il vero
   collo di bottiglia del giovedì, evidenziato qui sotto.
   ============================================================ */
(function () {
  'use strict';
  var G = window.Gelatorchard;

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
  }
  function row(left, right, cls) {
    return '<li><span class="dl-k">' + left + '</span><span class="dl-v"' +
      (cls ? ' style="color:var(--stamp)"' : '') + '>' + right + '</span></li>';
  }
  function empty(msg) { return '<li><span class="dl-k">' + msg + '</span></li>'; }

  /* ---------- Batch della settimana ---------- */
  var batchesEl = document.getElementById('ad-batches');
  var ids = Object.keys(G.BATCHES);
  batchesEl.innerHTML = ids.length
    ? ids.map(function (k) {
        var b = G.BATCHES[k];
        return row('#' + b.id + ' — ' + b.fruitName + ' (' + b.farmName + ')',
          (b.status || 'disponibile') + ' · produced ' + b.produced);
      }).join('')
    : empty('No batches in the registry');

  /* ---------- Ordini + carico assemblaggio giovedì ---------- */
  var orders = read('gc-orders') || [];
  var ordersEl = document.getElementById('ad-orders');
  ordersEl.innerHTML = orders.length
    ? orders.map(function (o) {
        var items = o.items.map(function (it) {
          return it.format + (it.qty > 1 ? ' ×' + it.qty : '') + ' (' + it.flavours.join(' + ') + ')';
        }).join('; ');
        return row(new Date(o.date).toLocaleDateString('en-GB') + ' · ' + o.email,
          items + ' — £' + o.total.toFixed(2) + ' · ' + o.fulfilment);
      }).join('')
    : empty('No test orders yet — place one from /order');

  var kits = 0;
  orders.forEach(function (o) {
    o.items.forEach(function (it) { if (it.format === 'Gelato Kit') kits += it.qty; });
  });
  var minutes = kits * 9; /* 8-10 min per Kit (nota 8.3) — media 9 */
  var over = minutes > 120;
  document.getElementById('ad-assembly').innerHTML =
    '<strong>Thursday assembly:</strong> ' + kits + ' Gelato Kit' + (kits === 1 ? '' : 's') +
    ' ≈ ' + minutes + ' min (8–10 min each). ' +
    (over
      ? '<strong style="color:var(--stamp)">Over the 2-hour window — plan a second slot or an extra pair of hands.</strong>'
      : 'Fits the 2-hour window.');

  /* ---------- Feedback non risposti (≤4 stelle evidenziati) ---------- */
  var fb = read('gc-feedback') || [];
  var fbEl = document.getElementById('ad-feedback');
  fbEl.innerHTML = fb.length
    ? fb.map(function (f) {
        var stars = '★★★★★'.slice(0, f.rating) + '☆☆☆☆☆'.slice(0, 5 - f.rating);
        var label = stars + (f.comment ? ' — “' + f.comment + '”' : '');
        return row('Batch #' + f.batch + ' · ' + new Date(f.date).toLocaleDateString('en-GB'),
          label + (f.rating <= 4 ? ' · needs reply' : ''), f.rating <= 4);
      }).join('')
    : empty('No feedback yet');

  /* ---------- Iscritti alert per frutto (segnale di domanda) ---------- */
  var alerts = read('gc-alerts');
  var alertsEl = document.getElementById('ad-alerts');
  if (alerts && alerts.fruits && alerts.fruits.length) {
    var counts = {};
    alerts.fruits.forEach(function (id) { counts[id] = (counts[id] || 0) + 1; });
    alertsEl.innerHTML = Object.keys(counts).map(function (id) {
      var f = G.flavorById(id);
      var st = G.seasonStatus(id);
      return row((f ? f.name : id),
        counts[id] + ' follower' + (counts[id] === 1 ? '' : 's') + ' · ' + st.subtitle);
    }).join('');
  } else {
    alertsEl.innerHTML = empty('No alert sign-ups yet');
  }
})();
