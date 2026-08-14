/* ============================================================
   GELATORCHARD, Componenti globali: <Nav> e <Footer>
   Iniettati su ogni pagina (equivalente HTML dei componenti
   React previsti dallo stack Next.js al momento del lancio).
   ============================================================ */
(function () {
  var page = (location.pathname.split('/').pop() || 'index.html');

  /* ---------- Logo (lockup ufficiale v2, design founder 14 ago 2026:
     la "O" è un'arancia con foglia appoggiata su un CONO DORATO a
     retino waffle che scende sotto la riga; lettere in maiuscoletto
     serif verde — vedi .brand-word in style.css. Ricreato in SVG coi
     token del sito: la bozza Canva del founder aveva il watermark). ---------- */
  /* Proporzioni corrette (fix founder 14 ago): l'arancia è GRANDE
     quanto le maiuscole — deve leggersi come la O della parola — e il
     cono è corto, per metà nascosto dietro l'arancia, che spunta
     appena sotto la riga. Mai più "iconcina tra due parole". */
  /* viewBox STRETTO sull'arancia (14..86): zero aria interna ai lati,
     l'arancia sta alle stesse distanze di una lettera. Foglia grande e
     leggibile, retino del cono a 2+2 tratti (a 20px sei tratti sono
     rumore, non waffle). */
  var LOGO_O =
    '<svg class="logo-o" viewBox="13 -7 78 147" aria-hidden="true" focusable="false">' +
      '<clipPath id="gc-cone"><path d="M33 82 L50 130 L67 82 Z"/></clipPath>' +
      '<g clip-path="url(#gc-cone)" stroke="var(--gold)" stroke-width="3">' +
        '<path d="M45 82 L61 126 M59 82 L69 108" fill="none"/>' +
        '<path d="M55 82 L39 126 M41 82 L31 108" fill="none"/>' +
      '</g>' +
      '<path d="M33 82 L50 130 L67 82 Z" fill="none" stroke="var(--gold)" stroke-width="4.5" stroke-linejoin="round"/>' +
      '<circle cx="50" cy="52" r="36" fill="var(--orange)"/>' +
      '<path d="M54 20 C55 13 58 7 64 1" fill="none" stroke="var(--green)" stroke-width="4.5" stroke-linecap="round"/>' +
      '<path d="M56 8 C66 -4 82 -6 90 2 C83 14 66 18 56 8 Z" fill="var(--green)"/>' +
    '</svg>';
  function brandHTML() {
    return '<a class="brand" href="index.html" aria-label="Gelatorchard, home">' +
      '<span class="brand-word">GELAT</span>' + LOGO_O + '<span class="brand-word">RCHARD</span></a>';
  }

  /* Favicon: stesso mark, colori hardcoded (le CSS var non valgono nei data URI) */
  var favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/svg+xml';
  favicon.href = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="13 -7 78 147">' +
    '<path d="M33 82 L50 130 L67 82 Z" fill="none" stroke="#BA9C57" stroke-width="7" stroke-linejoin="round"/>' +
    '<circle cx="50" cy="52" r="36" fill="#E8934A"/>' +
    '<path d="M54 20 C55 13 58 7 64 1" fill="none" stroke="#2D7A4A" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M56 8 C66 -4 82 -6 90 2 C83 14 66 18 56 8 Z" fill="#2D7A4A"/>' +
    '</svg>');
  document.head.appendChild(favicon);
  /* Le voci puntano alle sezioni della homepage: dalle altre pagine
     servono con il prefisso index.html */
  var pre = (page === 'index.html') ? '' : 'index.html';

  var NAV_LINKS = [
    { href: pre + '#flavors', label: 'Flavours' },
    { href: pre + '#formats', label: 'Formats' },
    { href: pre + '#season',  label: 'Season' },
    { href: 'how-to-order.html', label: 'How to Order' },
    { href: pre + '#letter',  label: 'Our Story' }
  ];

  /* ---------- Barra di scarsità (Cap. 10.7 + Lista A.2) ----------
     Sticky sopra la nav su ogni pagina pubblica. SOLO date di
     stagione reali da Gelatorchard.mostUrgentFruit(): mai un
     countdown a ore, mai numeri inventati.
     Soglie (Lista A.2): >21 giorni tono "picco" (nessuna pressione),
     8–21 countdown in giorni, ≤7 rosso ruggine perentorio.
     Rifinitura 15: si RICALCOLA ogni 30 minuti, così una tab lasciata
     aperta oltre mezzanotte non mente mai di un giorno. */
  if (window.Gelatorchard && window.Gelatorchard.mostUrgentFruit) {
    var scarcityBar = null;
    var renderScarcity = function () {
      var urgent = window.Gelatorchard.mostUrgentFruit();
      if (!urgent) {
        if (scarcityBar) { scarcityBar.remove(); scarcityBar = null; }
        document.body.classList.remove('has-scarcity');
        return;
      }
      if (!scarcityBar) {
        scarcityBar = document.createElement('div');
        document.body.insertBefore(scarcityBar, document.body.firstChild);
        document.body.classList.add('has-scarcity');
      }
      scarcityBar.className = 'scarcity-bar' +
        (urgent.type === 'ending' && urgent.daysLeft <= 7 ? ' sb-last' : '');
      var msg;
      if (urgent.type !== 'ending') {
        msg = '<a data-track="scarcity_bar" href="calendario.html"><strong>Next into season:</strong> ' +
          urgent.name + ' · opens ' + urgent.startLabel + '</a>';
      } else if (urgent.daysLeft <= 7) {
        /* goto=format (8 ago sera): il gusto è nel link, il formato no —
           si atterra sulle linguette di /order col gusto preselezionato */
        msg = '<a data-track="scarcity_bar" href="order.html?flavours=' + urgent.id + '&goto=format"><strong>' +
          urgent.name + ': ' + urgent.daysLeft + (urgent.daysLeft === 1 ? ' day' : ' days') +
          ' left.</strong> Then gone until ' + urgent.returnMonthYear + '. Order now or wait a year</a>';
      } else if (urgent.daysLeft <= 21) {
        msg = '<a data-track="scarcity_bar" href="order.html?flavours=' + urgent.id + '&goto=format"><strong>' +
          urgent.name + ':</strong> ' + urgent.daysLeft + ' days left this season · back ' +
          urgent.returnMonthYear + '. Order it while it exists</a>';
      } else {
        msg = '<a data-track="scarcity_bar" href="order.html?flavours=' + urgent.id + '&goto=format"><strong>' +
          urgent.name + ' is in season' + (urgent.peak ? ', at its peak' : '') + '</strong> · until ' +
          urgent.endLong + '. Order it at its best</a>';
      }
      scarcityBar.innerHTML = msg;
      /* Fix founder (mobile): su schermi stretti la frase va a capo e la
         barra è più alta di 38px — gli offset sticky di nav e story-head
         leggono l'altezza VERA da --sb-h, mai un numero fisso. */
      document.documentElement.style.setProperty('--sb-h', scarcityBar.offsetHeight + 'px');
    };
    renderScarcity();
    setInterval(renderScarcity, 30 * 60 * 1000);
    window.addEventListener('resize', function () {
      if (scarcityBar) document.documentElement.style.setProperty('--sb-h', scarcityBar.offsetHeight + 'px');
    });
  }

  var navEl = document.getElementById('site-nav');
  if (navEl) {
    navEl.className = 'nav';
    navEl.innerHTML =
      '<div class="nav-inner">' +
        brandHTML() +
        '<ul class="nav-links">' +
          NAV_LINKS.map(function (l) {
            return '<li><a href="' + l.href + '">' + l.label + '</a></li>';
          }).join('') +
        '</ul>' +
        '<div class="nav-right">' +
          /* CRO 8 ago sera (ok founder): chi clicca Order ha già deciso —
             dritto a /order (linguette + picker), niente giro per la home */
          '<a class="pill pill-dark pill-sm" data-track="nav_order" href="order.html">Order</a>' +
          /* Hamburger (8 ago 2026): sotto i 760px i link centrali
             spariscono, senza questo il mobile non aveva navigazione */
          '<button class="nav-burger" aria-label="Open menu" aria-expanded="false" aria-controls="nav-mobile">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="nav-mobile" id="nav-mobile" hidden>' +
        '<ul>' +
          NAV_LINKS.map(function (l) {
            return '<li><a href="' + l.href + '">' + l.label + '</a></li>';
          }).join('') +
          '<li><a href="calendario.html">Season Calendar</a></li>' +
          '<li><a href="business.html">Business &amp; Gifts</a></li>' +
        '</ul>' +
      '</div>';

    var burger = navEl.querySelector('.nav-burger');
    var mobileMenu = navEl.querySelector('#nav-mobile');
    function closeMobile() {
      mobileMenu.setAttribute('hidden', '');
      burger.setAttribute('aria-expanded', 'false');
      burger.classList.remove('open');
    }
    burger.addEventListener('click', function () {
      var opening = mobileMenu.hasAttribute('hidden');
      if (opening) {
        mobileMenu.removeAttribute('hidden');
        burger.setAttribute('aria-expanded', 'true');
        burger.classList.add('open');
      } else closeMobile();
    });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMobile(); /* naviga e richiudi */
    });
  }

  var footEl = document.getElementById('site-footer');
  if (footEl) {
    footEl.className = 'footer';
    footEl.innerHTML =
      '<div class="footer-grid">' +
        '<div>' +
          brandHTML() +
          /* Lockup completo (design founder 14 ago 2026): filetto oro
             con punto arancio tra marchio e tagline, come nella bozza */
          '<div class="brand-rule" aria-hidden="true"><span></span><i></i><span></span></div>' +
          '<p class="tagline">No Powders. Just Fruit. Every batch traced, every farmer with a name.</p>' +
        '</div>' +
        '<div><h4>Shop</h4><ul>' +
          '<li><a href="' + pre + '#flavors">Flavours</a></li>' +
          '<li><a href="' + pre + '#formats">Gelato Kit</a></li>' +
          '<li><a href="how-to-order.html">How to Order</a></li>' +
          '<li><a href="business.html">Corporate Gifts</a></li>' +
        '</ul></div>' +
        '<div><h4>Discover</h4><ul>' +
          '<li><a href="' + pre + '#letter">Our Story</a></li>' +
          '<li><a href="story.html">The Farmers</a></li>' +
          '<li><a href="calendario.html">Season Calendar</a></li>' +
        '</ul></div>' +
        '<div><h4>Contact</h4><ul>' +
          '<li><a href="#">WhatsApp</a></li>' +
          '<li><a href="#">Email</a></li>' +
          '<li><a href="#">Instagram</a></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="footer-legal">' +
        '<span>© 2026 Gelatorchard Ltd, London</span>' +
        '<span>No Powders. Just Fruit.</span>' +
      '</div>';
  }

  /* Scroll reveal: dal Cap. 9 vive in motion.js (GelatorchardMotion).
     Fallback: se motion.js non è caricato su una pagina, rendi
     comunque visibile tutto ciò che ha classi reveal. */
  if (!window.GelatorchardMotion) {
    document.querySelectorAll('.reveal,.reveal-fade,.reveal-zoom,.reveal-lift,.reveal-rotate')
      .forEach(function (el) { el.classList.add('in'); });
  }
})();
