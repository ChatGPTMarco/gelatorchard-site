/* ============================================================
   GELATORCHARD — Motion layer · Capitolo 9 (stile Apple, vanilla)
   Equivalente di useScrollReveal(): un modulo unico che gestisce
   TUTTE le animazioni del sito. Niente librerie: stesse curve e
   durate di Framer/GSAP (9.4) con IntersectionObserver + rAF.
   - .reveal / .reveal-fade / .reveal-zoom / .reveal-lift /
     .reveal-rotate  → fade+slide/zoom/lift/rotate all'ingresso
   - data-delay / data-dur="slow"  → stagger e durata per elemento
   - [data-cascade] (+"x" orizzontale, data-stagger) → figli in cascata
   - [data-countup] [data-suffix] → conteggio 0→N (1.2s, spec 9.3)
   - [data-parallax] → parallasse hero (0.18x + scale→1.05)
   - .journey-line → linea che si disegna con lo scroll (dashoffset)
   - swapGrids / swapPanel → transizioni tab picker e pannello mese
   prefers-reduced-motion: tutto statico e visibile, zero animazioni.
   Caricare DOPO gli script di pagina, PRIMA di site.js.
   ============================================================ */
(function () {
  'use strict';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var M = (window.GelatorchardMotion = { reduced: REDUCED });

  var SEL = '.reveal,.reveal-fade,.reveal-zoom,.reveal-lift,.reveal-rotate';

  function show(el) { el.classList.add('in'); }

  /* ---------- Cascata figli (tile picker, step journey) ---------- */
  function armCascade(el) {
    if (el.classList.contains('cascade-ready')) return;
    var st = parseFloat(el.getAttribute('data-stagger') || '0.14');
    var i = 0;
    Array.prototype.forEach.call(el.children, function (ch) {
      if (ch.classList.contains('journey-line')) return;
      ch.style.transitionDelay = (i++ * st).toFixed(2) + 's';
    });
    el.classList.add('cascade-ready');
  }
  M.cascade = function (el) {
    if (REDUCED) { el.classList.add('cascade-ready', 'cas-in'); return; }
    armCascade(el);
    el.classList.add('cas-in');
    /* Garanzia: i figli devono comparire anche se una regola CSS piu'
       specifica dovesse vincere sullo stato "entrato" (regola 9.4: il
       contenuto non resta mai nascosto). */
    Array.prototype.forEach.call(el.children, function (ch) {
      if (ch.classList.contains('journey-line')) return;
      ch.style.opacity = '1';
      ch.style.transform = 'none';
    });
  };

  /* ---------- Count-up (spec strip: 100%) ---------- */
  function finalText(el) {
    return el.getAttribute('data-countup') + (el.getAttribute('data-suffix') || '');
  }
  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-countup'));
    var suffix = el.getAttribute('data-suffix') || '';
    var t0 = null, DUR = 1800; /* conteggio 0→100 piu' disteso */
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / DUR, 1);
      p = 1 - Math.pow(1 - p, 3); /* ease-out */
      el.textContent = Math.round(end * p) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Scan iniziale (dopo il render degli script di pagina) ---------- */
  function scan() {
    var els = document.querySelectorAll(SEL);
    var cascades = document.querySelectorAll('[data-cascade]');
    var counts = document.querySelectorAll('[data-countup]');

    if (REDUCED || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, show);
      Array.prototype.forEach.call(cascades, M.cascade);
      Array.prototype.forEach.call(counts, function (el) { el.textContent = finalText(el); });
      return;
    }

    function fire(el) {
      if (el.getAttribute('data-fired')) return;
      el.setAttribute('data-fired', '1');
      if (el.hasAttribute('data-countup')) countUp(el);
      else if (el.hasAttribute('data-cascade')) M.cascade(el);
      else show(el);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        fire(e.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -28% 0px' }); /* l'elemento deve entrare davvero, non solo sbucare */

    /* Rete di sicurezza: se per qualsiasi motivo un elemento resta
       invisibile pur essendo entrato nel viewport, lo mostriamo allo
       scroll. Il contenuto non deve MAI restare nascosto (regola 9.4). */
    var pending = [];
    function sweep() {
      if (!pending.length) return;
      var line = window.innerHeight * 0.85;
      pending = pending.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < line && r.bottom > 0) { io.unobserve(el); fire(el); return false; }
        return true;
      });
    }
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep);
    setTimeout(sweep, 400);

    Array.prototype.forEach.call(els, function (el) {
      var d = el.getAttribute('data-delay');
      if (d) el.style.transitionDelay = d + 's';
      io.observe(el); pending.push(el);
    });
    Array.prototype.forEach.call(cascades, function (el) {
      armCascade(el); io.observe(el); pending.push(el);
    });
    Array.prototype.forEach.call(counts, function (el) {
      el.textContent = '0' + (el.getAttribute('data-suffix') || '');
      io.observe(el); pending.push(el);
    });
    sweep(); /* elementi gia' visibili al caricamento */
  }

  /* ---------- Cambio tab picker: out fade+scale .98, in da .98 (9.3) ----------
     Reflow forzato (offsetWidth) al posto di rAF: la transizione parte
     in modo deterministico anche in tab in background. */
  M.swapGrids = function (outEl, inEl) {
    if (REDUCED) {
      outEl.style.display = 'none';
      inEl.style.display = '';
      if (inEl.hasAttribute('data-cascade')) M.cascade(inEl);
      return;
    }
    outEl.classList.add('grid-out');
    setTimeout(function () {
      outEl.style.display = 'none';
      outEl.classList.remove('grid-out');
      inEl.style.display = '';
      if (inEl.hasAttribute('data-cascade')) M.cascade(inEl);
      inEl.classList.add('grid-pre');
      void inEl.offsetWidth; /* flush: lo stato .98/opacity 0 viene applicato */
      inEl.classList.add('grid-anim');
      inEl.classList.remove('grid-pre');
      setTimeout(function () { inEl.classList.remove('grid-anim'); }, 400);
    }, 150);
  };

  /* ---------- Cambio mese calendario: fade-out 0.15 → fade-in+slide 0.25 (9.3) ---------- */
  M.swapPanel = function (el, render) {
    if (REDUCED) { render(); return; }
    el.classList.add('panel-out');
    setTimeout(function () {
      render();
      el.classList.remove('panel-out');
      el.classList.add('panel-pre');
      void el.offsetWidth; /* flush prima di togliere lo stato iniziale */
      el.classList.remove('panel-pre');
    }, 150);
  };

  /* ---------- Parallax hero + linea journey, un solo rAF loop ---------- */
  function initScrollFx() {
    var pxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    var line = document.querySelector('.journey-line line');
    if (REDUCED) {
      if (line) line.style.strokeDashoffset = 0;
      return;
    }
    if (!pxEls.length && !line) return;
    var ticking = false;
    function update() {
      var y = window.scrollY, wh = window.innerHeight;
      pxEls.forEach(function (el) {
        var t = Math.min(y, 700);
        el.style.transform = 'translateY(' + (t * 0.18).toFixed(1) + 'px) scale(' + (1 + (t / 700) * 0.05).toFixed(4) + ')';
      });
      if (line) {
        /* la linea si disegna su un tratto di scroll piu' lungo: resta
           leggibile invece di completarsi in un attimo */
        var box = line.closest('svg').parentElement.getBoundingClientRect();
        var span = (box.height || 1) * 1.9;
        var p = Math.max(0, Math.min(1, (wh * 0.72 - box.top) / span));
        line.style.strokeDashoffset = (1 - p).toFixed(3);
      }
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; update(); });
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  scan();
  initScrollFx();
})();
