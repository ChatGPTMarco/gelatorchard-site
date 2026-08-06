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

  /* --- Diario del Raccolto (spec founder 6 ago 2026) ---
     Carosello NARRATIVO: niente prezzi, niente CTA ordina — la scelta
     vive solo nel picker #flavors. Una slide per ogni frutto con
     seasonStatus attivo OGGI, indipendentemente dalla scorta (il
     calendario decide l'inclusione, la scorta solo la riga in coda).
     Foto reale da foto-gusti/frutta/<id>.jpg se esiste, altrimenti
     fallback automatico al gradiente .sw-* del picker. */
  var car = document.getElementById('harvest-carousel');
  if (car) (function (root) {
    var DELAY = 4500;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var fruits = G.FLAVORS.fruit.filter(function (f) {
      var st = G.seasonStatus(f.id);
      return st.inSeason && !st.always;
    });
    if (!fruits.length) { root.style.display = 'none'; return; }

    function slideHTML(f) {
      var st = G.seasonStatus(f.id);
      var b = G.BATCHES[f.id];
      var s = G.SEASONS[f.id];
      var confirmed = b && !b.fake; /* contadino confermato dal founder */
      /* Citazione SOLO se il contadino è confermato; i batch fake la
         mostrano marcata data-fake (fase di build, FAKE-DATA.md) */
      var quote = (b && b.quote)
        ? '<p class="hc-quote"' + (confirmed ? '' : ' data-fake="1"') + '>' + b.quote + '</p>'
        : '';
      var meta = b
        ? f.name + ' · ' + b.farm + ' · picked ' + b.harvest +
          (b.harvestTime ? ' at ' + b.harvestTime : '')
        : f.name + ' · ' + ((s && s.origin) ? s.origin : 'Britain') + ' · in season now';
      /* Esaurito: SOLO la riga in coda, la slide resta a colori pieni
         (la scala di grigi a tre stati è del Flavor Picker) */
      var stock = (G.stockStatus(f.id) === 'esaurito')
        ? '<div class="hc-stock"' + (b && b.fake ? ' data-fake="1"' : '') +
          '>Already sold out this week: ask for the next harvest below</div>'
        : '';
      return '<div class="hc-slide ' + f.sw + '" data-id="' + f.id + '" role="group" ' +
        'aria-roledescription="slide" aria-label="' + f.name + ', ' + st.subtitle + '">' +
        '<div class="hc-overlay">' + quote + '<div class="hc-meta">' + meta + '</div>' + stock + '</div>' +
        '</div>';
    }

    root.innerHTML =
      '<div class="hc-track">' + fruits.map(slideHTML).join('') + '</div>' +
      (fruits.length > 1
        ? '<button class="hc-arrow prev" aria-label="Previous flavour">‹</button>' +
          '<button class="hc-arrow next" aria-label="Next flavour">›</button>' +
          '<div class="hc-dots" role="tablist">' + fruits.map(function (f, i) {
            return '<button class="hc-dot" data-i="' + i + '" aria-label="' + f.name + '"></button>';
          }).join('') + '</div>'
        : '');

    /* Foto reale se esiste (convenzione /foto-gusti/): sostituisce il
       gradiente da sola quando Marco carica il file, senza toccare codice */
    root.querySelectorAll('.hc-slide').forEach(function (el) {
      var img = new Image();
      img.onload = function () {
        img.className = 'photo-fill';
        img.alt = '';
        el.insertBefore(img, el.firstChild);
        el.classList.add('has-photo');
      };
      img.onerror = function () {}; /* nessuna foto: resta il gradiente */
      img.src = 'foto-gusti/frutta/' + el.getAttribute('data-id') + '.jpg';
    });

    var slides = root.querySelectorAll('.hc-slide');
    var dots = root.querySelectorAll('.hc-dot');
    var idx = 0;

    function show(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('active', k === idx); });
      dots.forEach(function (d, k) { d.classList.toggle('active', k === idx); });
    }

    /* Autoplay a loop infinito; la pausa (hover) conserva il tempo
       residuo e riprende da dove si era fermata */
    var timer = null, nextAt = 0, remaining = DELAY;
    function tick() { show(idx + 1); remaining = DELAY; schedule(); }
    function schedule() {
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
      if (dot) { goto_(+dot.getAttribute('data-i')); return; }
      if (e.target.closest('.hc-arrow')) {
        goto_(idx + (e.target.closest('.hc-arrow').classList.contains('prev') ? -1 : 1));
        return;
      }
      /* Click/tap sulla slide (mouse e touch, identico): scroll al
         picker + pulse sulla tile corrispondente. Nessun modal. */
      var slide = e.target.closest('.hc-slide');
      if (!slide) return;
      var id = slide.getAttribute('data-id');
      if (G.track) G.track('carousel_slide_click', { flavour: id });
      var picker = document.getElementById('flavor-picker');
      if (picker) picker.scrollIntoView(reduced ? {} : { behavior: 'smooth', block: 'start' });
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
        }, reduced ? 0 : 450);
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
    if (slides.length > 1 && !reduced) schedule();
  })(car);

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
