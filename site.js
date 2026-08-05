/* ============================================================
   GELATORCHARD, Componenti globali: <Nav> e <Footer>
   Iniettati su ogni pagina (equivalente HTML dei componenti
   React previsti dallo stack Next.js al momento del lancio).
   ============================================================ */
(function () {
  var page = (location.pathname.split('/').pop() || 'index.html');

  /* ---------- Logo (lockup ufficiale: la "O" è un'arancia con foglia
     sopra un cono a tratto, ricreato in SVG con i token del sito) ---------- */
  var LOGO_O =
    '<svg class="logo-o" viewBox="0 0 100 150" aria-hidden="true" focusable="false">' +
      '<path d="M28 82 L48 142 L68 82" fill="none" stroke="var(--green-deep)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="48" cy="58" r="32" fill="var(--orange)"/>' +
      '<path d="M52 26 C53 19 56 13 62 8" fill="none" stroke="var(--green)" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M56 14 C64 2 78 0 86 6 C80 18 64 22 56 14 Z" fill="var(--green)"/>' +
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
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150">' +
    '<path d="M28 82 L48 142 L68 82" fill="none" stroke="#1F5C37" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="48" cy="58" r="32" fill="#E8934A"/>' +
    '<path d="M52 26 C53 19 56 13 62 8" fill="none" stroke="#2D7A4A" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M56 14 C64 2 78 0 86 6 C80 18 64 22 56 14 Z" fill="#2D7A4A"/>' +
    '</svg>');
  document.head.appendChild(favicon);
  /* Le voci puntano alle sezioni della homepage: dalle altre pagine
     servono con il prefisso index.html */
  var pre = (page === 'index.html') ? '' : 'index.html';

  var NAV_LINKS = [
    { href: pre + '#flavors', label: 'Flavours' },
    { href: pre + '#formats', label: 'Formats' },
    { href: pre + '#season',  label: 'Season' },
    { href: pre + '#story',   label: 'Our Story' }
  ];

  /* ---------- Barra di scarsità (Cap. 10.7) ----------
     Sticky sopra la nav su ogni pagina pubblica. SOLO date di
     stagione reali da Gelatorchard.mostUrgentFruit(): mai un
     countdown a ore, mai numeri inventati. Si aggiorna da sola. */
  if (window.Gelatorchard && window.Gelatorchard.mostUrgentFruit) {
    var urgent = window.Gelatorchard.mostUrgentFruit();
    if (urgent) {
      var bar = document.createElement('div');
      bar.className = 'scarcity-bar';
      bar.innerHTML = urgent.type === 'ending'
        ? '<a href="order.html?flavours=' + urgent.id + '"><strong>' + urgent.name + ':</strong> ' +
          urgent.daysLeft + (urgent.daysLeft === 1 ? ' day' : ' days') + ' left this season · back ' +
          urgent.returnMonthYear + '. Order it while it exists</a>'
        : '<a href="calendario.html"><strong>Next into season:</strong> ' + urgent.name +
          ' · opens ' + urgent.startLabel + '</a>';
      document.body.insertBefore(bar, document.body.firstChild);
      document.body.classList.add('has-scarcity');
    }
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
        '<a class="pill pill-dark pill-sm" href="' + pre + '#flavors">Order</a>' +
      '</div>';
  }

  var footEl = document.getElementById('site-footer');
  if (footEl) {
    footEl.className = 'footer';
    footEl.innerHTML =
      '<div class="footer-grid">' +
        '<div>' +
          brandHTML() +
          '<p class="tagline">No Powders. Just Fruit. Every batch traced, every farmer with a name.</p>' +
        '</div>' +
        '<div><h4>Shop</h4><ul>' +
          '<li><a href="' + pre + '#flavors">Flavours</a></li>' +
          '<li><a href="' + pre + '#formats">Gelato Kit</a></li>' +
          '<li><a href="business.html">Corporate Gifts</a></li>' +
        '</ul></div>' +
        '<div><h4>Discover</h4><ul>' +
          '<li><a href="' + pre + '#story">Our Story</a></li>' +
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
