/* ============================================================
   GELATORCHARD — Adapter backend (Supabase REST) · Capitolo 8
   Unico punto di contatto del sito col database. Finché le due
   costanti sotto sono vuote, ogni chiamata risolve in
   { preview:true } e il sito resta in pre-launch preview.
   AL LANCIO: compilare SUPABASE_URL e SUPABASE_ANON_KEY (progetto
   creato con backend/schema.sql) — nessun'altra modifica al sito.
   La anon key è pensata per essere pubblica: la sicurezza sta
   nelle policy RLS dello schema (insert-only per il pubblico).
   ============================================================ */
window.GelatorchardBackend = (function () {
  'use strict';

  var SUPABASE_URL = '';       /* es. 'https://xyzcompany.supabase.co' */
  var SUPABASE_ANON_KEY = '';  /* Settings → API → anon public key    */

  /* Webhook per le richieste B2B (Cap. 6.4 — nessuna tabella dedicata:
     notifica a Marco via email/Slack, es. Zapier/Make/Brevo webhook) */
  var ENQUIRY_WEBHOOK_URL = '';

  function isLive() { return !!(SUPABASE_URL && SUPABASE_ANON_KEY); }
  function preview() { return Promise.resolve({ preview: true, live: false }); }

  /* Hook analytics (Lista A.5): ogni submit passa di qui, quindi un solo
     punto di tracciamento per alert/feedback/enquiry. Gli ordini sono
     tracciati da order.js (submitOrder arriva già spezzato per riga). */
  function track(event, props) {
    if (window.Gelatorchard && window.Gelatorchard.track) window.Gelatorchard.track(event, props);
  }

  function rest(path, method, body, prefer) {
    var headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    };
    if (prefer) headers.Prefer = prefer;
    return fetch(SUPABASE_URL + '/rest/v1/' + path, {
      method: method || 'GET',
      headers: headers,
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error('Supabase ' + r.status + ' on ' + path);
      return r.status === 204 ? null : r.json();
    });
  }

  function idOf(table, col, val) {
    return rest(table + '?select=id&' + col + '=eq.' + encodeURIComponent(val))
      .then(function (rows) {
        if (!rows || !rows[0]) throw new Error(table + ' not found: ' + val);
        return rows[0].id;
      });
  }

  return {
    isLive: isLive,

    /* Cap. 7 → alert_subscriptions (una riga per frutto seguito) */
    subscribeAlerts: function (email, fruitKeys) {
      track('alert_subscribe', { fruits: fruitKeys.length });
      if (!isLive()) return preview();
      var rows = fruitKeys.map(function (k) { return { email: email, fruit_key: k }; });
      return rest('alert_subscriptions', 'POST', rows, 'resolution=ignore-duplicates')
        .then(function () { return { live: true }; });
    },

    /* Cap. 4 → feedback (lookup batch_number → batch_id) */
    submitFeedback: function (batchNumber, rating, comment) {
      track('feedback_submit', { batch: batchNumber, rating: rating });
      if (!isLive()) return preview();
      return idOf('batches', 'batch_number', batchNumber).then(function (bid) {
        return rest('feedback', 'POST', [{ batch_id: bid, rating: rating, comment: comment || null }]);
      }).then(function () { return { live: true }; });
    },

    /* Cap. 3 → orders + order_items.
       item: { email, formatName, fulfilment, linePrice, qty, gift, flavourNames[] }
       Modello spec: 1 riga orders = 1 formato; qty N → N righe orders. */
    submitOrder: function (item) {
      if (!isLive()) return preview();
      return idOf('product_formats', 'name', item.formatName).then(function (fid) {
        var one = {
          customer_email: item.email,
          format_id: fid,
          fulfillment_type: item.fulfilment,
          total_price: item.linePrice / (item.qty || 1),
          gift_message: item.gift || null,
          status: 'confermato'
        };
        var rows = [];
        for (var i = 0; i < (item.qty || 1); i++) rows.push(one);
        return rest('orders', 'POST', rows, 'return=representation');
      }).then(function (orders) {
        var jobs = [];
        orders.forEach(function (o) {
          item.flavourNames.forEach(function (name) {
            jobs.push(idOf('flavors', 'name', name).then(function (flid) {
              return rest('order_items', 'POST', [{ order_id: o.id, flavor_id: flid }]);
            }));
          });
        });
        return Promise.all(jobs);
      }).then(function () { return { live: true }; });
    },

    /* Contatore FOMO della pillola drop (howto.js): porzioni già
       ordinate nel drop corrente. AL LANCIO richiede una funzione RPC
       Supabase `drop_servings` che sommi le porzioni degli ordini
       arrivati dall'apertura della finestra corrente (42 = cap,
       PRODUZIONE.md). Finché non esiste o in preview: null → la
       pillola mostra il cap statico, MAI un numero inventato. */
    dropServingsOrdered: function () {
      if (!isLive()) return Promise.resolve(null);
      return rest('rpc/drop_servings', 'POST', {}).then(function (r) {
        return (typeof r === 'number') ? r
          : (r && typeof r.servings === 'number') ? r.servings : null;
      }).catch(function () { return null; });
    },

    /* Cap. 6 → webhook notifica (email/Slack di Marco) */
    sendEnquiry: function (payload) {
      track('enquiry_send', { type: payload && payload.type });
      if (!ENQUIRY_WEBHOOK_URL) return preview();
      return fetch(ENQUIRY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function () { return { live: true }; });
    }
  };
})();
