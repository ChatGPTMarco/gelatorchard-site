/* ============================================================
   GELATORCHARD — Componenti globali: <Nav> e <Footer>
   Iniettati su ogni pagina (equivalente HTML dei componenti
   React previsti dallo stack Next.js al momento del lancio).
   ============================================================ */
(function () {
  var page = (location.pathname.split('/').pop() || 'index.html');

  var NAV_LINKS = [
    { href: 'index.html',      label: 'Home' },
    { href: 'order.html',      label: 'Ordina' },
    { href: 'calendario.html', label: 'Calendario' },
    { href: 'business.html',   label: 'Business' }
  ];

  var navEl = document.getElementById('site-nav');
  if (navEl) {
    navEl.className = 'nav';
    navEl.innerHTML =
      '<div class="nav-inner">' +
        '<a class="brand" href="index.html">' +
          '<span class="brand-dot"></span>' +
          '<span class="brand-name">Gelatorchard</span>' +
        '</a>' +
        '<ul class="nav-links">' +
          NAV_LINKS.map(function (l) {
            var active = (page === l.href) ? ' class="active"' : '';
            return '<li><a href="' + l.href + '"' + active + '>' + l.label + '</a></li>';
          }).join('') +
        '</ul>' +
        '<a class="pill pill-green pill-sm" href="order.html">Ordina ora</a>' +
      '</div>';
  }

  var footEl = document.getElementById('site-footer');
  if (footEl) {
    footEl.className = 'footer';
    footEl.innerHTML =
      '<div class="footer-grid">' +
        '<div>' +
          '<a class="brand" href="index.html">' +
            '<span class="brand-dot"></span>' +
            '<span class="brand-name">Gelatorchard</span>' +
          '</a>' +
          '<p class="tagline">No Powders. Just Fruit.<br>London, UK.</p>' +
        '</div>' +
        '<div><h4>Shop</h4><ul>' +
          '<li><a href="order.html">Ordina</a></li>' +
          '<li><a href="order.html">Gelato Kit</a></li>' +
          '<li><a href="business.html">Corporate &amp; B2B</a></li>' +
        '</ul></div>' +
        '<div><h4>Scopri</h4><ul>' +
          '<li><a href="calendario.html">Calendario stagionale</a></li>' +
          '<li><a href="story.html">La storia di ogni batch</a></li>' +
          '<li><a href="app.html">App (in arrivo)</a></li>' +
        '</ul></div>' +
        '<div><h4>Seasonal Alerts</h4><ul>' +
          '<li><a href="#">Avvisami quando un frutto<br>entra in stagione — gratis</a></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="footer-legal">' +
        '<span>© 2026 Gelatorchard Ltd — London</span>' +
        '<span>Frutta 100% UK di stagione · Etichetta a 3 ingredienti</span>' +
      '</div>';
  }

  /* Scroll reveal */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.reveal');
  if (reduced) {
    targets.forEach(function (el) { el.classList.add('in'); });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* Flavor tile: selezione base (la logica checkout arriva col Capitolo 3) */
  document.querySelectorAll('.tile:not(.soldout)').forEach(function (tile) {
    tile.addEventListener('click', function () { tile.classList.toggle('selected'); });
  });
})();
