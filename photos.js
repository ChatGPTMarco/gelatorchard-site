/* ============================================================
   GELATORCHARD — Foto provvisorie (BOZZA)
   Aggancia le foto stock presenti in assets/ ai riquadri del sito.
   Se un file non esiste, lo slot resta col suo segnaposto: il sito
   non si rompe mai per una foto mancante.

   ⚠️ TUTTE LE IMMAGINI CARICATE DA QUI SONO PROVVISORIE.
   Ogni <img> viene marcata data-fake="1" e riceve l'etichetta
   "Stock photo · bozza". Prima del lancio: sostituire i file in
   assets/ con le fotografie originali del founder e rimuovere
   questo script insieme alle marcature (vedi FOTO-DA-SCARICARE.md
   e FAKE-DATA.md).
   ============================================================ */
(function () {
  'use strict';

  /* slot → file atteso in assets/. Aggiungere qui eventuali nuovi punti. */
  var SLOTS = [
    { sel: '.hero-visual',  file: 'hero-gelato.jpg',   alt: 'Strawberry gelato (stock photo, placeholder)' },
    { sel: '.unbox-visual', file: 'unboxing-box.jpg',  alt: 'Kraft box packaging (stock photo, placeholder)' },
    /* story page: i due riquadri sono renderizzati da story.js, in ordine */
    { sel: '.story-chapter[data-chapter="1"] .sc-photo', file: 'farmer-field.jpg', alt: 'Farmer in a strawberry field (stock photo, placeholder)' },
    { sel: '.story-chapter[data-chapter="2"] .sc-photo', file: 'lab-gelato.jpg',   alt: 'Artisan gelato lab (stock photo, placeholder)' }
  ];

  function attach(slot) {
    var host = document.querySelector(slot.sel);
    if (!host || host.querySelector('.photo-fill')) return;

    var img = new Image();
    img.onload = function () {
      img.className = 'photo-fill';
      img.setAttribute('data-fake', '1');   /* elenco unico dei provvisori */
      img.alt = slot.alt;
      host.insertBefore(img, host.firstChild);
      host.classList.add('has-photo');
      var tag = document.createElement('span');
      tag.className = 'photo-tag';
      tag.setAttribute('data-fake', '1');
      tag.textContent = 'Stock photo · bozza';
      host.appendChild(tag);
    };
    /* onerror: nessuna foto, resta il segnaposto esistente. Nessun errore in console. */
    img.onerror = function () {};
    img.src = 'assets/' + slot.file;
  }

  function run() { SLOTS.forEach(attach); }

  run();
  /* la story page renderizza il suo contenuto via JS: riprova poco dopo */
  setTimeout(run, 150);
  setTimeout(run, 600);
})();
