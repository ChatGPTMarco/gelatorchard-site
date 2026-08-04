/* ============================================================
   GELATORCHARD — Illustrazioni prodotto in SVG (segnaposto)
   Disegni vettoriali di cono, coppetta e sacapoche con i colori
   VERI dei gusti (stessi gradienti del Flavor Picker).
   Servono a far capire a colpo d'occhio che il sito vende gelato
   finché non arrivano le fotografie reali del founder.
   ⚠️ TEMPORANEI: alla consegna delle foto, sostituire i blocchi
   che invocano Gelatorchard.gelatoScene() con <img>. Nessuna di
   queste immagini finge di essere una fotografia.
   ============================================================ */
(function () {
  'use strict';
  var G = (window.Gelatorchard = window.Gelatorchard || {});

  /* Palette per gusto: [chiaro, medio, scuro] — allineata ai .sw-* di style.css */
  var TONES = {
    strawberry:      ['#F4A6B4', '#E8536B', '#C1304A'],
    raspberry:       ['#D4658C', '#A32348', '#7A1A38'],
    cherry:          ['#C1567A', '#8B1E3F', '#5C1329'],
    blueberry:       ['#7B6BA5', '#3D2B56', '#241A38'],
    blackcurrant:    ['#6A5A85', '#2A1B3D', '#180F24'],
    'victoria-plum': ['#B08FC9', '#7C4F9E', '#5B3676'],
    'apple-pear':    ['#D6E3A3', '#A9C46A', '#7E9E45'],
    quince:          ['#F2D98B', '#DBB44E', '#B8912F'],
    rhubarb:         ['#F4A0A8', '#E06A78', '#C94E62'],
    chocolate:       ['#8A6247', '#4A2E1E', '#2E1B10'],
    pistachio:       ['#C3D69B', '#8FA85E', '#6B8442'],
    stracciatella:   ['#FBF6E9', '#F0E7D2', '#DDD0B4'],
    hazelnut:        ['#DDBB8B', '#B4824A', '#8A5E30']
  };
  G.flavourTones = function (id) { return TONES[id] || TONES.strawberry; };

  var uid = 0;
  function grad(tones, id) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0.4" y2="1">' +
      '<stop offset="0%" stop-color="' + tones[0] + '"/>' +
      '<stop offset="55%" stop-color="' + tones[1] + '"/>' +
      '<stop offset="100%" stop-color="' + tones[2] + '"/></linearGradient>';
  }

  /* Una pallina: cerchio morbido con luce in alto a sinistra */
  function scoop(cx, cy, r, gid, tones) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#' + gid + ')"/>' +
      '<ellipse cx="' + (cx - r * 0.3) + '" cy="' + (cy - r * 0.35) + '" rx="' + (r * 0.32) + '" ry="' + (r * 0.24) +
      '" fill="#fff" opacity=".28" transform="rotate(-25 ' + (cx - r * 0.3) + ' ' + (cy - r * 0.35) + ')"/>' +
      '<path d="M' + (cx - r * 0.72) + ' ' + (cy + r * 0.45) + ' Q' + cx + ' ' + (cy + r * 0.95) + ' ' +
      (cx + r * 0.72) + ' ' + (cy + r * 0.45) + '" fill="none" stroke="' + tones[2] + '" stroke-opacity=".25" stroke-width="1.5"/>';
  }

  /* Cialda del cono con reticolo inciso */
  function cone(cx, top, w, h) {
    var g = 'cone' + (++uid);
    var s = '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="0.6">' +
      '<stop offset="0%" stop-color="#E8B978"/><stop offset="45%" stop-color="#D49A54"/>' +
      '<stop offset="100%" stop-color="#A9712F"/></linearGradient></defs>';
    s += '<path d="M' + (cx - w / 2) + ' ' + top + ' L' + (cx + w / 2) + ' ' + top +
      ' L' + cx + ' ' + (top + h) + ' Z" fill="url(#' + g + ')"/>';
    for (var i = 1; i <= 3; i++) {
      var t = i / 4, y = top + h * t, hw = (w / 2) * (1 - t);
      s += '<line x1="' + (cx - hw) + '" y1="' + y + '" x2="' + (cx + hw) + '" y2="' + y +
        '" stroke="#8A5A22" stroke-opacity=".28" stroke-width="1.2"/>';
    }
    s += '<line x1="' + (cx - w / 2 + 4) + '" y1="' + (top + 3) + '" x2="' + (cx + w / 2 * 0.55) + '" y2="' + (top + h * 0.75) +
      '" stroke="#8A5A22" stroke-opacity=".2" stroke-width="1.2"/>';
    s += '<line x1="' + (cx + w / 2 - 4) + '" y1="' + (top + 3) + '" x2="' + (cx - w / 2 * 0.55) + '" y2="' + (top + h * 0.75) +
      '" stroke="#8A5A22" stroke-opacity=".2" stroke-width="1.2"/>';
    return s;
  }

  /* gelatoCone(flavourId) — cono con due palline, 220x300 */
  G.gelatoCone = function (id, id2) {
    var t1 = G.flavourTones(id), t2 = G.flavourTones(id2 || id);
    var g1 = 'sc' + (++uid), g2 = 'sc' + (++uid);
    return '<svg viewBox="0 0 220 300" class="gelato-svg" role="img" aria-label="Gelato cone illustration">' +
      '<defs>' + grad(t1, g1) + grad(t2, g2) + '</defs>' +
      cone(110, 150, 78, 132) +
      scoop(110, 148, 46, g2, t2) +
      scoop(110, 96, 44, g1, t1) +
      '</svg>';
  };

  /* gelatoTub(flavourId) — coppetta/vaschetta vista di tre quarti */
  G.gelatoTub = function (id, id2) {
    var t1 = G.flavourTones(id), t2 = G.flavourTones(id2 || id);
    var g1 = 'tb' + (++uid), g2 = 'tb' + (++uid);
    return '<svg viewBox="0 0 240 220" class="gelato-svg" role="img" aria-label="Gelato tub illustration">' +
      '<defs>' + grad(t1, g1) + grad(t2, g2) + '</defs>' +
      scoop(88, 92, 40, g1, t1) + scoop(150, 96, 36, g2, t2) +
      '<path d="M52 118 L188 118 L172 196 Q120 206 68 196 Z" fill="#FBF6EC" stroke="#E2D9C6" stroke-width="2"/>' +
      '<ellipse cx="120" cy="118" rx="68" ry="13" fill="#FFFDF7" stroke="#E2D9C6" stroke-width="2"/>' +
      '<path d="M62 140 Q120 150 178 140" fill="none" stroke="#E2D9C6" stroke-width="2" opacity=".7"/>' +
      '</svg>';
  };

  /* pipingBag(flavourId) — la sacapoche, formato firma del brand */
  G.pipingBag = function (id) {
    var t = G.flavourTones(id);
    var g = 'pb' + (++uid);
    return '<svg viewBox="0 0 200 280" class="gelato-svg" role="img" aria-label="Piping bag illustration">' +
      '<defs>' + grad(t, g) + '</defs>' +
      '<path d="M62 34 Q100 22 138 34 L124 232 Q100 250 76 232 Z" fill="url(#' + g + ')"/>' +
      '<path d="M62 34 Q100 22 138 34 L134 62 Q100 50 66 62 Z" fill="#fff" opacity=".22"/>' +
      '<rect x="58" y="20" width="84" height="16" rx="8" fill="#F3EDE1" stroke="#DFD5C2" stroke-width="1.5"/>' +
      '<path d="M76 232 Q100 250 124 232 L116 258 Q100 268 84 258 Z" fill="#E9E1D2"/>' +
      '<ellipse cx="100" cy="150" rx="18" ry="30" fill="#fff" opacity=".14"/>' +
      '</svg>';
  };

  /* gelatoScene(kind, flavourA, flavourB) → markup pronto per i segnaposto */
  G.gelatoScene = function (kind, a, b) {
    if (kind === 'tub') return G.gelatoTub(a, b);
    if (kind === 'bag') return G.pipingBag(a);
    return G.gelatoCone(a, b);
  };

  /* Riempie ogni [data-gelato="kind"] con il disegno del gusto richiesto */
  G.paintGelato = function (scope) {
    (scope || document).querySelectorAll('[data-gelato]').forEach(function (el) {
      if (el.getAttribute('data-painted')) return;
      el.innerHTML = G.gelatoScene(
        el.getAttribute('data-gelato'),
        el.getAttribute('data-flavour') || 'strawberry',
        el.getAttribute('data-flavour-b') || null
      ) + el.innerHTML;
      el.setAttribute('data-painted', '1');
    });
  };

  G.paintGelato(document);
})();
