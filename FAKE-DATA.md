# DATI E IMMAGINI SIMULATI — DA RIMUOVERE PRIMA DEL LANCIO

⚠️ **IL SITO NON DEVE ANDARE ONLINE FINCHÉ QUESTA LISTA NON È VUOTA.**
Autorizzati dal founder SOLO per la mockup locale (Capitolo 10.0).
Ogni elemento è marcato `data-fake="1"` nel codice: la ricerca di `data-fake`
in tutto il progetto è l'elenco esatto di ciò che va sostituito o rimosso.

## Dati numerici e citazioni

| File | Elemento | Valore simulato | Fonte del dato reale |
|---|---|---|---|
| index.html | proof bar · batch prodotti | 45 | Marco (registro produzione) |
| index.html | proof bar · contadini con nome | 4 | Marco (elenco fornitori) |
| index.html | prova sociale · media raccolta→-18°C | 41h | Marco (log batch) |
| index.html | prova sociale · media campo→laboratorio | 92 km | Marco (log batch) |
| index.html | prova sociale · numero batch con log | 45 | Marco (registro produzione) |
| index.html | citazione panel su Batch #042, 19 May | intera citazione | panel di assaggio reale |
| index.html | citazione panel su Batch #045, 30 July | intera citazione | panel di assaggio reale |
| flavors.js | BATCHES.blueberry — Batch #043 | intero record (David Reid, Reid Berry Farm, Blairgowrie, date, log, cold chain) | registro produzione + fornitore reale |
| flavors.js | BATCHES['victoria-plum'] — Batch #044 | intero record (Sarah Wickham, Wickham Orchards, Pershore, date, log, cold chain) | registro produzione + fornitore reale |
| flavors.js | BATCHES.raspberry — Batch #045 | intero record (Louise Anderson, Anderson Berry Farm, Ettrickbridge, date, log, cold chain) | registro produzione + fornitore reale. NB: nome e citazione di Louise vengono dal template email del founder (EMAILS.md), ma azienda, luogo e date sono INVENTATI |
| how-to-order.html | proof · ordini dal lancio | 500+ | registro ordini reale |
| how-to-order.html | proof · reclami sull'attesa | 0 | registro feedback reale |
| index.html #testimonials | 4 citazioni panel con nomi/zone | Sarah M./James L./Lisa R./Tom S. (INVENTATI) | citazioni e nomi VERI del panel di assaggio; la nota "pre-launch tasting panel" sotto la griglia è OBBLIGATORIA finché non si lancia |
| flavors.js | date harvest/produced di TUTTI i batch | dinamiche: giovedì/venerdì dell'ultimo drop (demoBatchDates) | date dei batch veri dal CMS. NB le date REALI del batch #042: raccolto 15 May 2026 alle 06:12, prodotto 17 May 2026 |
(I prezzi del Kit NON sono più in questa lista: £25/30/38/50 delivered
CONFERMATI dal founder l'8 ago 2026 insieme al modello solo-delivery su
E14 — vedi COSTI.md. Restano da validare coi fornitori le STIME di costo
del §7 di COSTI.md, che non toccano i prezzi al cliente.)
| flavors.js | log e batchSize dei batch | riscritti sul piano reale (cicli 750g, fornello, gio sera→ven; quantità frutta/zucchero derivate da PRODUZIONE.md) | log di produzione veri |

I record fake in `flavors.js` hanno il campo `fake: true`: la story page e il
farmer-reveal del picker li mostrano con la nota "Sample batch". Al lancio:
sostituire i record e togliere il campo `fake`.

Il **carosello hero "Diario del Raccolto"** (home.js) eredita gli stessi record
(il carosello "Il Viaggio" invece usa SOLO il batch reale #042, niente fake):
le citazioni dei batch fake (#043/#044/#045) compaiono nelle slide marcate
`data-fake` (contadino NON confermato → al lancio, senza record reale, la slide
mostra solo "frutto · regione · in season now", senza citazione). Lo stato
scorta viene dai batch: `G.stockStatus` in preview legge `BATCHES[id].status`,
al lancio andrà su `flavors.stock_status` (Supabase). Il mirtillo #043 era
`esaurito` come demo del terzo stato (tile grigio-caldo, riga "Already sold
out" nella slide); dall'8 ago 2026 è `disponibile` su richiesta del founder:
per rivedere la demo basta rimettere `status: 'esaurito'`.

## Immagini provvisorie (consegna founder 7 ago 2026 — stock/AI, TUTTE bozze)

Fonte: cartella `foto/` fornita dal founder. Sono immagini stock e generate
con AI, NON scatti reali di Gelatorchard: tutte marcate `data-fake` (photos.js
per assets/, home.js per i caroselli) e da sostituire con le foto vere a
parità di nome. La cartella `foto/` resta come archivio degli originali.

| File nel sito | Slot | Origine/nota |
|---|---|---|
| foto-gusti/frutta/strawberry.jpg | Diario · fragola | filari in tunnel |
| foto-gusti/frutta/raspberry.jpg | Diario · lampone | filari in tunnel |
| foto-gusti/frutta/tile/strawberry.jpg | Picker · tile fragola (primo piano) | frutti grandi ravvicinati |
| foto-gusti/frutta/tile/raspberry.jpg | Picker · tile lampone (primo piano) | frutti grandi ravvicinati |
| foto-gusti/frutta/cherry.jpg | Diario · ciliegia | cestino in mano — watermark AI "✦" |
| foto-gusti/frutta/blueberry.jpg | Diario · mirtillo | vaschetta in mano — watermark AI "✦" |
| foto-gusti/frutta/blackcurrant.jpg | Diario · ribes nero | raccolta a mano — watermark AI "✦" |
| foto-gusti/frutta/victoria-plum.jpg | Diario · susina | colapasta smaltato — watermark AI "✦" |
| foto-gusti/frutta/apple-pear.jpg | Diario · mela/pera | cassette di legno |
| foto-gusti/frutta/quince.jpg | Diario · cotogna | cassetta blu — bande nere da anteprima stock (il crop le nasconde quasi tutte) |
| foto-gusti/frutta/rhubarb.jpg | **MANCANTE** (resta il gradiente) | l'originale era un'anteprima Alamy CON WATERMARK visibile: inutilizzabile |
| foto-farmers/tom-johnson.jpg | Viaggio · tappa 1 | raccoglitori in tunnel, visi non riconoscibili (MAI usare visi altrui come "Tom") |
| foto-gusti/viaggio/laboratorio.jpg | Viaggio · tappa 2 | mantecatore, mani senza viso — bande nere da stock |
| foto-gusti/viaggio/confezione.jpg | Viaggio · tappa 3 | box brand "Gelato Orchard" GENERATA CON AI — NB mostra un vassoio simil-polistirolo, in contraddizione col claim "no polystyrene": non usare al lancio |
| foto-gusti/viaggio/servito.jpg | Viaggio · tappa 4 | coppetta kraft ai mirtilli, studio |
| assets/hero-gelato.jpg | og:image di tutte le pagine | stessa box AI di cui sopra |
| assets/unboxing-box.jpg | homepage unboxing | stessa box AI di cui sopra |
| assets/farmer-field.jpg | story cap. 1 | raccolta fragole, viso coperto dal cappello — bande nere da stock |
| assets/lab-gelato.jpg | story cap. 2 | stesso mantecatore della tappa 2 |

**File della cartella `foto/` NON usati (non usare mai):**
- `rhubarb.jpg` → watermark Alamy visibile (non licenziata)
- `Marco al Trittico….jpg` → gelatiere sconosciuto con grembiule del marchio
  reale "Crusio IJsmakers": viso altrui + brand terzo
- `fot farmer con cassetta….png` e `foto farmers che raccoglie….png` →
  marchio reale "Hugh Lowe Farms" (azienda vera del Kent) ben visibile;
  la seconda è uno screenshot di Instagram
- `Tom nel campo mentre raccoglie….jpg` → viso riconoscibile di uno
  sconosciuto + cassetta "PRODUCT OF USA" (il sito dice Kent)
- `blackberries.png`, `blackberries nel cespuglio .png` → la mora non è un
  gusto del catalogo (nessuno slot)
- scatti doppi di fragola/lampone e `gelato cono finito.jpg` → riserve

Slot ancora a segnaposto: video 15s (story sezione 0), ritratto lettera di
Marco (vietato per regola 10.9: mai una faccia altrui sotto la sua firma).

Al lancio: sostituire i file con le fotografie originali mantenendo il nome,
poi togliere le marcature data-fake in photos.js e home.js e le etichette.

## DA VERIFICARE (non rimuovere, ma validare col founder prima del lancio)

- **Etichetta industriale di esempio** (index.html, sezione #labels): è un esempio
  di categoria, non l'etichetta di un marchio. Il founder deve validare che la lista
  sia rappresentativa (idealmente fotografando etichette reali al supermercato).
- **Headline hero "16 ingredients"**: il 16 conta le voci dell'etichetta di esempio
  qui sopra. Se la lista cambia, aggiornare il numero.
- **Narrativa della lettera di Marco** (index.html, #letter): scritta nella sua voce
  sulla base del posizionamento; Marco deve leggerla e firmarla davvero.
- **Claim "about a third of a Kit's price is fruit and packaging"** (index.html,
  #formats): deriva dal COGS verificato £8.50 su £28 (≈30%), dato reale del Cap. 8.
- **Trust line di how-to-order.html** ("registered food business (Tower Hamlets) ·
  fully insured · Safer Food, Better Business compliant"): claim forniti dal founder
  nella spec; prima del lancio verificare registrazione (numero/borough), polizza
  attiva e pack SFBB compilato. Sono claim legali: se uno non è vero, va rimosso.
- **Numeri del processo in how-to-order.html** (750g per batch, 2 ore, quantità
  esempio "5kg strawberries, 3kg raspberries"): dalla spec del founder; confermare
  che rispecchino la produzione reale.

## Come rimuovere tutto

1. Cerca `data-fake` in tutti i file: ogni occorrenza è un elemento da sostituire.
2. **Dati**: se il valore reale è disponibile, sostituiscilo e togli `data-fake` e il
   commento. Se non è disponibile, rimuovi l'intero elemento: mai lasciare uno zero.
3. **Batch simulati**: sostituisci i record in `flavors.js` con quelli reali e togli
   `fake: true`. Se un gusto non ha ancora un batch reale, elimina il record: il sito
   gestisce da solo l'assenza (origine + "batch details on your bag").
4. **Immagini**: sostituisci il file in `assets/` mantenendo lo stesso nome, poi togli
   `data-fake` e l'etichetta "Stock photo · bozza" (photos.js). Se la foto reale non
   c'è, elimina il file: lo slot torna da solo al segnaposto testuale.
5. Verifica finale: la ricerca di `data-fake` deve restituire ZERO risultati.
