/* ============================================================
   GELATORCHARD, Story page · Capitolo 4
   Route dinamica su file statico: story.html?batch=042 | ?flavour=id
   - Sezione 0 (istruzioni) identica per ogni batch → serveBoxHTML()
   - 4 capitoli con header sticky + barra di progresso (scroll-spy)
   - Feedback form (stars + commento ≤250) in pre-launch preview
   - WhatsApp con messaggio precompilato dinamico (farmer + batch)
   - Gusti Classici: nessun batch → pagina semplice dedicata
   ============================================================ */
(function () {
  'use strict';
  var G = window.Gelatorchard;
  var root = document.getElementById('story-root');
  if (!root) return;

  var params = new URLSearchParams(location.search);
  var batchParam = params.get('batch');
  var flavourParam = params.get('flavour') || params.get('flavor');

  /* ---------- Sezione 0 — identica per ogni batch (componente) ---------- */
  function serveBoxHTML(farmerFirst) {
    return '<div class="serve-box">' +
      '<div class="sv-title">❄️ Storage &amp; perfect serving instructions</div>' +
      '<div class="serve-alert">⚠️ IMPORTANT: put your gelato straight into the freezer (-18°C)</div>' +
      '<ol class="serve-steps">' +
        '<li><span class="ss-name">1 · Rest</span><p>Take the piping bag out of the freezer and leave it at room temperature for 10–12 minutes before serving.</p></li>' +
        '<li><span class="ss-name">2 · Massage</span><p>Gently “massage” the bag with your hands for 15–20 seconds to bring back the creaminess of artisan gelato.</p></li>' +
        '<li><span class="ss-name">3 · Serve</span><p>Unscrew the protective cap, place the cone in the die-cut holder and squeeze from top to bottom in a circular motion.</p></li>' +
      '</ol>' +
      '<div class="video-ph">15-second tutorial video on loop, to upload</div>' +
      '<div class="serve-next"><span>Want to know more? Discover ' + farmerFirst + '’s story ↓</span>' +
      '<span class="sn-scroll">Scroll to continue →</span></div>' +
      '</div>';
  }

  /* ---------- Pagina batch completa ---------- */
  function renderStory(b) {
    var f = G.flavorById(b.flavour);
    var waText = encodeURIComponent('Hi ' + b.farmerFirst + '! I loved your ' +
      b.fruitName.toLowerCase() + ' in Batch #' + b.id + '. What’s growing next week?');
    /* Al lancio: wa.me/<numero di Tom>?text=... — senza numero usiamo il share link */
    var waHref = 'https://wa.me/?text=' + waText;
    var mapsDir = 'https://www.google.com/maps/dir/' +
      encodeURIComponent(b.location) + '/London+E14';

    document.title = 'Batch #' + b.id + ' · ' + b.fruitName + ' · Gelatorchard';

    root.innerHTML =
      /* Header sticky con progresso */
      '<div class="story-head">' +
        '<div class="story-head-inner">' +
          '<div class="sh-id">' +
            '<span class="sh-dot ' + f.sw + '"></span>' +
            '<span class="sh-batch">BATCH #' + b.id + '</span>' +
            '<span class="sh-meta">' + b.fruitName + ' · ' + b.produced + '</span>' +
          '</div>' +
          '<div class="sh-progress">' +
            '<div class="sh-bar">' +
              '<span class="sh-seg" data-seg="1"></span><span class="sh-seg" data-seg="2"></span>' +
              '<span class="sh-seg" data-seg="3"></span><span class="sh-seg" data-seg="4"></span>' +
            '</div>' +
            '<span class="sh-count" id="sh-count">0/4</span>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="story-wrap">' +

        /* Batch simulato (Cap. 10): dichiararlo, mai spacciarlo per reale */
        (b.fake ? '<div class="notice preview" data-fake="1" style="margin-top:24px">Sample batch: preview data only. At launch, every batch page is fed by the real production log.</div>' : '') +

        /* Sezione 0 */
        serveBoxHTML(b.farmerFirst) +

        /* Capitolo 1 — il contadino */
        '<section class="story-chapter" data-chapter="1">' +
          '<div class="sc-photo"><span class="photo-ph">Photo of ' + b.farmerFirst + ' in the field, to upload</span></div>' +
          '<span class="sc-kicker">Chapter 1 · The Farmer</span>' +
          '<h2>Meet ' + b.farmerFirst + '</h2>' +
          '<p class="sub" style="margin-top:14px">' + b.bio + '</p>' +
          '<blockquote class="story-quote">' + b.quote + '</blockquote>' +
          '<ul class="data-list">' +
            '<li><span class="dl-k">Farm</span><span class="dl-v">' + b.farmName + '</span></li>' +
            '<li><span class="dl-k">Location</span><span class="dl-v">' + b.location + '</span></li>' +
            '<li><span class="dl-k">Variety</span><span class="dl-v">' + b.variety + '</span></li>' +
            /* L'ora di raccolta è OPZIONALE: se il contadino non la manda,
               si mostra solo la data (mai inventarla — PRODUZIONE.md §7) */
            '<li><span class="dl-k">Harvest</span><span class="dl-v">' + b.harvest +
              (b.harvestTime ? ', ' + b.harvestTime : '') + '</span></li>' +
            '<li><span class="dl-k">Method</span><span class="dl-v">' + b.method + '</span></li>' +
            '<li><span class="dl-k">Certification</span><span class="dl-v">' + b.certification + '</span></li>' +
          '</ul>' +
          '<div style="margin-top:24px"><a class="pill pill-green" href="' + waHref + '" target="_blank" rel="noopener">Message ' + b.farmerFirst + ' on WhatsApp</a></div>' +
        '</section>' +

        /* Capitolo 2 — la produzione */
        '<section class="story-chapter" data-chapter="2">' +
          '<div class="sc-photo"><span class="photo-ph">Photo of Marco churning in the lab, to upload</span></div>' +
          '<span class="sc-kicker">Chapter 2 · The Making</span>' +
          '<h2>Made by ' + b.operator + '</h2>' +
          '<ul class="prod-log">' +
            b.log.map(function (row) {
              return '<li><span class="pl-t">' + row[0] + '</span><span>' + row[1] + '</span></li>';
            }).join('') +
          '</ul>' +
          '<div class="qc-row">' +
            '<span class="qc">colour ✓</span><span class="qc">texture ✓</span>' +
            '<span class="qc">flavour ✓</span><span class="qc">temperature ✓</span>' +
          '</div>' +
          '<blockquote class="story-quote">“' + b.marcoNote + '” <span style="font-family:var(--sans);font-size:13px;color:var(--ink-faint)">' + b.operator + '</span></blockquote>' +
          '<p class="sub" style="font-size:14px">Why 62°C and not hotter? Because past that point pasteurisation starts cooking the fruit. Safe is mandatory; boiled is not.</p>' +
        '</section>' +

        /* Capitolo 3 — il viaggio */
        '<section class="story-chapter" data-chapter="3">' +
          '<span class="sc-kicker">Chapter 3 · The Journey</span>' +
          '<h2>' + b.location.split(',')[1].trim() + ' → London E14</h2>' +
          '<div class="map-wrap"><iframe title="Route from ' + b.location + ' to London E14" loading="lazy" ' +
            'src="https://maps.google.com/maps?q=' + encodeURIComponent(b.mapQuery) + '&z=8&output=embed"></iframe></div>' +
          '<a class="map-link" href="' + mapsDir + '" target="_blank" rel="noopener">Open the full route in Google Maps →</a>' +
          /* Ritmo del drop settimanale (PRODUZIONE.md), non stesso-giorno */
          '<ul class="mini-journey">' +
            '<li><span class="mj-t">Thu</span>Harvest, then to the lab by evening</li>' +
            '<li><span class="mj-t">Fri</span>Churned fresh, batch by batch</li>' +
            '<li><span class="mj-t">Sat</span>Dispatch, dry ice packed</li>' +
            '<li><span class="mj-t">Sat</span>Your freezer</li>' +
          '</ul>' +
          '<div class="cold-grid">' +
            '<div class="cold-cell"><div class="cc-v">' + b.coldChain.distance + '</div><div class="cc-k">distance</div></div>' +
            '<div class="cold-cell"><div class="cc-v">' + b.coldChain.tempOut + '</div><div class="cc-k">leaving the lab</div></div>' +
            '<div class="cold-cell"><div class="cc-v">' + b.coldChain.tempIn + '</div><div class="cc-k">on arrival</div></div>' +
            '<div class="cold-cell"><div class="cc-v">' + b.coldChain.transit + '</div><div class="cc-k">in transit</div></div>' +
          '</div>' +
          '<p class="sub" style="font-size:14px;margin-top:20px">Packaging: compostable piping bag, insulated box, dry ice. Dry ice sits at -78°C: it is the only way a bag stays frozen through London traffic without a freezer van.</p>' +
        '</section>' +

        /* Capitolo 4 — la valutazione */
        '<section class="story-chapter" data-chapter="4" style="border-bottom:none">' +
          '<span class="sc-kicker">Chapter 4 · Your Verdict</span>' +
          '<h2>How was Batch #' + b.id + '?</h2>' +
          '<div id="fb-form">' +
            '<div class="stars-input" id="fb-stars" aria-label="Rate from 1 to 5 stars">' +
              '<span data-v="1">★</span><span data-v="2">★</span><span data-v="3">★</span>' +
              '<span data-v="4">★</span><span data-v="5">★</span>' +
            '</div>' +
            '<div style="margin-top:18px">' +
              '<textarea class="field-input" id="fb-comment" maxlength="250" placeholder="A comment for Marco and ' + b.farmerFirst + ' (optional)"></textarea>' +
              '<div class="char-count"><span id="fb-chars">0</span>/250</div>' +
            '</div>' +
            '<div class="step-ctas">' +
              '<button class="pill pill-dark" id="fb-send">Send to Marco &amp; ' + b.farmerFirst + '</button>' +
              '<span class="cta-hint" id="fb-hint"></span>' +
            '</div>' +
          '</div>' +
          '<div id="fb-done" hidden>' +
            '<p style="font-size:17px;font-weight:600;margin-top:18px" id="fb-done-msg"></p>' +
            '<div class="notice preview">Pre-launch preview: the feedback service connects at launch, so nothing was sent yet.</div>' +
          '</div>' +
          '<p class="review-note">Marco replies within 24 hours. 5 stars? A personal thank-you. 4 stars? Your comment helps tune the next batch. 3 stars or less? Marco messages you directly on WhatsApp to make it right.</p>' +
          '<div class="first-review">You’ll be the first to review this batch, public reviews arrive after the September launch.</div>' +
        '</section>' +

        /* CTA prossimo batch */
        '<div class="story-next">' +
          '<p class="serif" style="font-size:22px">The next farmer arrives Monday.</p>' +
          '<a class="pill pill-green" href="app.html">Join the Seasonal Alert List →</a>' +
        '</div>' +

      '</div>';

    wireProgress();
    wireFeedback(b);
  }

  /* ---------- Scroll-spy barra di progresso ---------- */
  function wireProgress() {
    var chapters = Array.prototype.slice.call(document.querySelectorAll('.story-chapter'));
    var current = -1;
    function update() {
      var line = window.innerHeight * 0.45;
      var n = 0;
      chapters.forEach(function (s) {
        if (s.getBoundingClientRect().top < line) n = +s.getAttribute('data-chapter');
      });
      if (n === current) return;
      current = n;
      document.querySelectorAll('.sh-seg').forEach(function (seg) {
        seg.classList.toggle('on', +seg.getAttribute('data-seg') <= n);
      });
      document.getElementById('sh-count').textContent = n + '/4';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Feedback (pre-launch preview) ---------- */
  function wireFeedback(b) {
    var rating = 0;
    var stars = document.getElementById('fb-stars');
    stars.addEventListener('click', function (e) {
      var s = e.target.closest('span[data-v]');
      if (!s) return;
      rating = +s.getAttribute('data-v');
      stars.querySelectorAll('span').forEach(function (el) {
        el.classList.toggle('on', +el.getAttribute('data-v') <= rating);
      });
      document.getElementById('fb-hint').textContent = '';
    });
    var comment = document.getElementById('fb-comment');
    comment.addEventListener('input', function () {
      document.getElementById('fb-chars').textContent = comment.value.length;
    });
    document.getElementById('fb-send').addEventListener('click', function () {
      if (rating === 0) {
        document.getElementById('fb-hint').textContent = 'Pick a star rating first';
        return;
      }
      document.getElementById('fb-form').hidden = true;
      var msg = comment.value.trim()
        ? 'Thanks! Your ' + rating + '-star rating and comment are on their way to Marco and ' + b.farmerFirst + '.'
        : 'Thanks! Your ' + rating + '-star rating is on its way to Marco and ' + b.farmerFirst + '.';
      document.getElementById('fb-done-msg').textContent = msg;
      document.getElementById('fb-done').hidden = false;

      /* Registro locale (dashboard admin) + invio a Supabase quando configurato */
      try {
        var fb = JSON.parse(localStorage.getItem('gc-feedback') || '[]');
        fb.push({ batch: b.id, rating: rating, comment: comment.value.trim(), date: new Date().toISOString() });
        localStorage.setItem('gc-feedback', JSON.stringify(fb));
      } catch (e) {}
      if (window.GelatorchardBackend) {
        window.GelatorchardBackend.submitFeedback(b.id, rating, comment.value.trim()).then(function (r) {
          if (r && r.live) {
            var n = document.querySelector('#fb-done .notice.preview');
            if (n) n.remove();
          }
        }).catch(function () {});
      }
    });
  }

  /* ---------- Gusto Classico: nessun batch, pagina semplice ---------- */
  function renderClassic(id) {
    var f = G.flavorById(id);
    root.innerHTML =
      '<section class="placeholder-hero"><div class="container">' +
        '<span class="badge-soon">Classics Collection</span>' +
        '<h1 class="h1 reveal">' + f.name + '</h1>' +
        '<p class="sub reveal">This classic is always available: real ingredients, never powders. ' +
        'There’s no single-batch seasonal story to tell: batch stories belong to the Fruit Collection, ' +
        'where every flavour follows the real UK harvest.</p>' +
        '<div class="reveal" style="margin-top:32px;display:flex;gap:12px;flex-wrap:wrap">' +
          '<a class="pill pill-dark" href="order.html?flavours=' + id + '">Order ' + f.name + '</a>' +
          '<a class="pill pill-ghost" href="index.html#flavors">See the Fruit Collection</a>' +
        '</div>' +
      '</div></section>';
  }

  /* ---------- Gusto frutta senza batch pubblicato ---------- */
  function renderComingSoon(id) {
    var f = G.flavorById(id);
    root.innerHTML =
      '<section class="placeholder-hero"><div class="container">' +
        '<span class="badge-soon">Fruit Collection</span>' +
        '<h1 class="h1 reveal">' + (f ? f.name : 'This flavour') + '</h1>' +
        '<p class="sub reveal">The story of the current batch is being written, every bag ships ' +
        'with a QR code that opens its own batch page: the farmer, the harvest time, the production log.</p>' +
        '<div class="reveal" style="margin-top:32px;display:flex;gap:12px;flex-wrap:wrap">' +
          '<a class="pill pill-dark" href="story.html?batch=042">See an example: Batch #042</a>' +
          '<a class="pill pill-ghost" href="app.html">Join the Seasonal Alert List</a>' +
        '</div>' +
      '</div></section>';
  }

  /* ---------- Nessun parametro: landing ---------- */
  function renderLanding() {
    root.innerHTML =
      '<section class="placeholder-hero"><div class="container">' +
        '<span class="badge-soon">Batch stories</span>' +
        '<h1 class="h1 reveal">Scan the QR on your pack</h1>' +
        '<p class="sub reveal">Every piping bag carries one QR code that opens the story of the exact ' +
        'batch in your hands: the farmer, the farm, the harvest time, the production log and the cold chain. ' +
        'One scan, the whole story, serving instructions included.</p>' +
        '<div class="reveal" style="margin-top:32px;display:flex;gap:12px;flex-wrap:wrap">' +
          '<a class="pill pill-dark" href="story.html?batch=042">See an example: Batch #042</a>' +
          '<a class="pill pill-ghost" href="index.html#flavors">Pick your flavour</a>' +
        '</div>' +
      '</div></section>';
  }

  /* ---------- Routing ---------- */
  var batch = null;
  if (batchParam) {
    var clean = batchParam.replace('#', '');
    batch = G.batchById(clean) ||
            (/^\d+$/.test(clean) ? G.batchById(('00' + parseInt(clean, 10)).slice(-3)) : null);
    if (batch) renderStory(batch);
    else renderLanding();
  } else if (flavourParam) {
    if (G.isClassic(flavourParam)) renderClassic(flavourParam);
    else if (G.BATCHES[flavourParam]) renderStory(G.BATCHES[flavourParam]);
    else renderComingSoon(flavourParam);
  } else {
    renderLanding();
  }
})();
