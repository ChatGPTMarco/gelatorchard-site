/* ============================================================
   GELATORCHARD — Hook analytics (Lista A.5) · stub locale
   Unico punto eventi del sito. Due vie di ingresso:
   1. dichiarativa: qualsiasi elemento con data-track="nome_evento"
      viene tracciato al click (gestore delegato qui sotto);
   2. programmatica: Gelatorchard.track('nome_evento', { ...props })
      dai punti chiave di order.js / backend.js / flavors.js.
   PRE-LANCIO: gli eventi finiscono solo in localStorage 'gc-analytics'
   (ring buffer, max 300) e in console.debug. Nessun dato lascia il
   browser. AL LANCIO: scegliere il provider (es. Plausible/GA4) e
   implementare send() qui — nessun'altra modifica alle pagine.
   ============================================================ */
(function () {
  'use strict';
  var G = (window.Gelatorchard = window.Gelatorchard || {});
  var KEY = 'gc-analytics';
  var MAX = 300;

  function send(evt) {
    /* AL LANCIO: chiamata al provider qui, es.
       plausible(evt.event, { props: evt.props });
       Finché resta vuota, vale solo il registro locale. */
  }

  G.track = function (event, props) {
    var evt = {
      t: new Date().toISOString(),
      page: location.pathname.split('/').pop() || 'index.html',
      event: event,
      props: props || {}
    };
    try {
      var log = JSON.parse(localStorage.getItem(KEY) || '[]');
      log.push(evt);
      if (log.length > MAX) log = log.slice(-MAX);
      localStorage.setItem(KEY, JSON.stringify(log));
    } catch (e) {}
    if (window.console && console.debug) console.debug('[gc-track]', event, evt.props);
    send(evt);
  };

  /* Via dichiarativa: click su qualunque [data-track] (capture: parte
     anche se il click naviga via subito dopo) */
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (!el) return;
    G.track(el.getAttribute('data-track'), el.href ? { href: el.getAttribute('href') } : {});
  }, true);
})();
