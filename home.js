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

  /* --- Hook + caroselli hero (spec founder 6-7 ago 2026) ---
     Due caroselli NARRATIVI consecutivi: il Diario del Raccolto
     risponde a "cosa c'è in stagione ora", Il Viaggio a "come arriva
     da lì a te" (sostituisce la vecchia sezione statica 2.5). Niente
     prezzi, niente CTA ordina: click/tap su una slide → scroll a
     #flavors + pulse sulla tile. Foto reali dalle convenzioni
     foto-gusti/ e foto-farmers/, fallback automatico ai gradienti. */
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fruitsInSeason() {
    return G.FLAVORS.fruit.filter(function (f) {
      var st = G.seasonStatus(f.id);
      return st.inSeason && !st.always;
    });
  }

  /* Badge REC: pallino rosso pulsante + orario monospace. SOLO orari
     reali dal batch; senza orario il badge non compare. */
  function recBadge(time, fake) {
    if (!time) return '';
    return '<span class="hc-rec"' + (fake ? ' data-fake="1"' : '') +
      '><span class="rec-dot"></span>REC ' + time + '</span>';
  }

  /* Motore condiviso dei due caroselli. items = array di stringhe
     .hc-slide (con data-id per il pulse e data-photo per la foto).
     opts.dotCount/dotFor/slideForDot: mappa pallini↔slide (Il Viaggio
     mostra 4 pallini-tappa anche con slide = frutti × 4). */
  function buildCarousel(root, items, opts) {
    opts = opts || {};
    var DELAY = 4500;
    var dotCount = opts.dotCount || items.length;
    var dotFor = opts.dotFor || function (i) { return i; };
    var slideForDot = opts.slideForDot || function (d) { return d; };
    var multi = items.length > 1;

    root.innerHTML =
      '<div class="hc-track">' + items.join('') + '</div>' +
      (multi
        ? '<button class="hc-arrow prev" aria-label="Previous">‹</button>' +
          '<button class="hc-arrow next" aria-label="Next">›</button>' +
          '<div class="hc-dots">' + Array.apply(null, Array(dotCount)).map(function (_, d) {
            return '<button class="hc-dot" data-d="' + d + '" aria-label="Slide ' + (d + 1) + '"></button>';
          }).join('') + '</div>'
        : '');

    /* Foto reale se esiste: quando Marco carica il file, sostituisce
       il gradiente da sola, senza toccare codice */
    root.querySelectorAll('.hc-slide[data-photo]').forEach(function (el) {
      var img = new Image();
      img.onload = function () {
        img.className = 'photo-fill';
        img.alt = '';
        el.insertBefore(img, el.firstChild);
        el.classList.add('has-photo');
      };
      img.onerror = function () {}; /* nessuna foto: resta il gradiente */
      img.src = el.getAttribute('data-photo');
    });

    var slides = root.querySelectorAll('.hc-slide');
    var dots = root.querySelectorAll('.hc-dot');
    var idx = 0;

    function show(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('active', k === idx); });
      var da = dotFor(idx);
      dots.forEach(function (d, k) { d.classList.toggle('active', k === da); });
    }

    /* Autoplay a loop infinito; la pausa (hover) conserva il tempo
       residuo e riprende da dove si era fermata */
    var timer = null, nextAt = 0, remaining = DELAY;
    function tick() { show(idx + 1); remaining = DELAY; schedule(); }
    function schedule() {
      if (!multi || REDUCED) return;
      clearTimeout(timer);
      nextAt = Date.now() + remaining;
      timer = setTimeout(tick, remaining);
    }
    function pause() {
      clearTimeout(timer); timer = null;
      remaining = Math.max(300, nextAt - Date.now());
    }
    function goto_(i) { show(i); remaining = DELAY; if (timer) schedule(); }

    root.addEventListener('mouseenter', pause);
    root.addEventListener('mouseleave', function () { schedule(); });

    root.addEventListener('click', function (e) {
      if (swiped) { swiped = false; return; }
      var dot = e.target.closest('.hc-dot');
      if (dot) { goto_(slideForDot(+dot.getAttribute('data-d'), idx)); return; }
      var arrow = e.target.closest('.hc-arrow');
      if (arrow) { goto_(idx + (arrow.classList.contains('prev') ? -1 : 1)); return; }
      /* Click/tap sulla slide (mouse e touch, identico): scroll al
         picker + pulse sulla tile corrispondente. Nessun modal. */
      var slide = e.target.closest('.hc-slide');
      if (!slide) return;
      var id = slide.getAttribute('data-id');
      if (G.track) G.track(opts.trackEvent || 'carousel_slide_click', { flavour: id });
      var picker = document.getElementById('flavor-picker');
      if (picker) picker.scrollIntoView(REDUCED ? {} : { behavior: 'smooth', block: 'start' });
      var tile = document.querySelector('#flavor-picker .tile[data-id="' + id + '"]');
      if (tile) {
        setTimeout(function () {
          tile.classList.add('pulse');
          tile.addEventListener('animationend', function done() {
            tile.classList.remove('pulse');
            tile.removeEventListener('animationend', done);
          });
          /* fallback se l'animazione è disattivata (reduced motion) */
          setTimeout(function () { tile.classList.remove('pulse'); }, 1800);
        }, REDUCED ? 0 : 450);
      }
    });

    /* Swipe touch: cambia slide e azzera il timer; sopprime il click
       sintetico successivo così lo swipe non scrolla al picker */
    var touchX = null, swiped = false;
    root.addEventListener('touchstart', function (e) {
      touchX = e.touches[0].clientX; pause();
    }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (touchX == null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 40) { swiped = true; show(idx + (dx < 0 ? 1 : -1)); }
      remaining = DELAY; schedule();
    }, { passive: true });

    show(0);
    schedule();
  }

  var inSeason = fruitsInSeason();

  /* --- Frase hook sopra il Diario del Raccolto: [N] calcolato live
     dalla stessa fonte del carosello (mai un numero fisso in codice) --- */
  var hookEl = document.getElementById('harvest-hook');
  if (hookEl && inSeason.length) {
    var n = inSeason.length;
    hookEl.innerHTML =
      '<h2 class="hook-title">Right Now, <span class="green">' + n + ' UK Fruit' + (n === 1 ? '' : 's') + '</span> ' +
      (n === 1 ? 'Is' : 'Are') + ' Ready to Pick.<br>Some Won’t Be Back Until Next Year.</h2>' +
      '<p class="hook-sub">No powders. No imports. Only what England grows right now.</p>';
  }

  /* --- Carosello 1 · Diario del Raccolto: una slide per frutto in
     stagione (il calendario decide l'inclusione, la scorta solo la
     riga in coda; la slide resta a colori pieni) --- */
  function harvestSlideHTML(f) {
    var st = G.seasonStatus(f.id);
    var b = G.BATCHES[f.id];
    var s = G.SEASONS[f.id];
    var confirmed = b && !b.fake; /* contadino confermato dal founder */
    var quote = (b && b.quote)
      ? '<p class="hc-quote"' + (confirmed ? '' : ' data-fake="1"') + '>' + b.quote + '</p>'
      : '';
    var meta = b
      ? f.name + ' · ' + b.farm + ' · picked ' + b.harvest +
        (b.harvestTime ? ' at ' + b.harvestTime : '')
      : f.name + ' · ' + ((s && s.origin) ? s.origin : 'Britain') + ' · in season now';
    var stock = (G.stockStatus(f.id) === 'esaurito')
      ? '<div class="hc-stock"' + (b && b.fake ? ' data-fake="1"' : '') +
        '>Already sold out this week: ask for the next harvest below</div>'
      : '';
    return '<div class="hc-slide ' + f.sw + '" data-id="' + f.id + '"' +
      ' data-photo="foto-gusti/frutta/' + f.id + '.jpg" role="group" ' +
      'aria-roledescription="slide" aria-label="' + f.name + ', ' + st.subtitle + '">' +
      recBadge(b && b.harvestTime, b && b.fake) +
      '<div class="hc-overlay">' + quote + '<div class="hc-meta">' + meta + '</div>' + stock + '</div>' +
      '</div>';
  }
  var car = document.getElementById('harvest-carousel');
  if (car) {
    if (inSeason.length) buildCarousel(car, inSeason.map(harvestSlideHTML), {});
    else car.style.display = 'none';
  }

  /* --- Carosello 2 · Il Viaggio: ESEMPIO FISSO (correzione founder,
     7 ago 2026). NIENTE rotazione sui frutti: quella la fa già il
     Diario, qui sarebbe duplicata. Sempre Fragola / Tom Johnson /
     Kent, l'unico batch con dati reali completi (citazione, orari,
     azienda), in loop infinito sulle sue 4 tappe. Il frutto specifico
     è irrilevante: è un esempio illustrativo costante. --- */
  /* Tappe ancorate ai giorni REALI del drop settimanale (orderWindow):
     le 48h sono frutta→freezer (gio→sab), MAI velocità di consegna
     dall'ordine — il sito non deve mai suonare Deliveroo. */
  var STAGES = [
    ['Thursday', 'The harvest'],
    ['Friday', 'The lab'],
    ['Saturday', 'Dispatch'],
    ['Saturday', 'Your freezer']
  ];
  /* NIENTE badge REC sulle tappe del Viaggio (scelta founder): solo
     l'icona casa sulla quarta. I REC restano sul Diario del Raccolto. */
  function journeySlideHTML(stage) {
    var f = G.flavorById('strawberry');
    var b = G.BATCHES.strawberry;
    var badge = '', body = '', photo = '';
    if (stage === 0) {
      body = '<p class="hc-quote">' + b.quote + '</p>' +
        '<div class="hc-meta">— ' + b.farmerName + ', ' + b.location + '</div>';
      photo = 'foto-farmers/' + b.farmerName.toLowerCase().replace(/[^a-z]+/g, '-') + '.jpg';
    } else if (stage === 1) {
      body = '<div class="hc-meta">Pasteurised, churned: ' + f.name + ' becomes gelato</div>';
      photo = 'foto-gusti/viaggio/laboratorio.jpg';
    } else if (stage === 2) {
      body = '<div class="hc-meta">On its way to you: cold chain guaranteed</div>';
      photo = 'foto-gusti/viaggio/spedizione.jpg';
    } else {
      /* destinazione, non "ripresa in corso": icona casa, seconda persona.
         48h dopo il raccolto, non dopo l'ordine. */
      badge = '<span class="hc-rec home">🏠</span>';
      body = '<div class="hc-meta">In YOUR freezer: 48 hours after the field, not 48 days in a warehouse</div>';
      photo = 'foto-gusti/viaggio/freezer.jpg';
    }
    return '<div class="hc-slide ' + f.sw + '" data-id="' + f.id + '"' +
      ' data-photo="' + photo + '" role="group" aria-roledescription="slide" ' +
      'aria-label="Step ' + (stage + 1) + ', ' + STAGES[stage][0] + ': ' + STAGES[stage][1] + '">' +
      badge +
      '<div class="hc-overlay">' +
        '<div class="hc-kicker">' + (stage + 1) + ' · ' + STAGES[stage][0] + ' · ' + STAGES[stage][1] + '</div>' +
        body +
      '</div></div>';
  }
  var jr = document.getElementById('journey-carousel');
  if (jr) {
    if (G.BATCHES.strawberry) {
      buildCarousel(jr, [0, 1, 2, 3].map(journeySlideHTML), { trackEvent: 'journey_slide_click' });
    } else jr.style.display = 'none';
  }

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
