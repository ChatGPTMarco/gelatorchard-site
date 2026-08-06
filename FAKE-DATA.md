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

I record fake in `flavors.js` hanno il campo `fake: true`: la story page e il
farmer-reveal del picker li mostrano con la nota "Sample batch". Al lancio:
sostituire i record e togliere il campo `fake`.

I **caroselli hero "Diario del Raccolto" e "Il Viaggio"** (home.js) ereditano gli stessi record:
le citazioni dei batch fake (#043/#044/#045) compaiono nelle slide marcate
`data-fake` (contadino NON confermato → al lancio, senza record reale, la slide
mostra solo "frutto · regione · in season now", senza citazione). Anche lo stato
"esaurito" del mirtillo (riga "Already sold out this week" nella slide, tile
grigio-caldo nel picker) viene dal batch fake #043: `G.stockStatus` in preview
legge `BATCHES[id].status`, al lancio andrà su `flavors.stock_status` (Supabase).

## Immagini stock provvisorie (Unsplash, licenza standard gratuita)

| File immagine | Slot occupato | Origine (ID Unsplash) | Foto reale attesa |
|---|---|---|---|
| assets/hero-gelato.jpg | SOLO `og:image` di tutte le pagine (anteprima link WhatsApp/social); dal 6 ago 2026 l'hero è il carosello Diario del Raccolto, non usa più questa foto | T0cT79FV6Ig | cono/coppetta del gelato VERO di Gelatorchard |
| assets/farmer-field.jpg | story, capitolo 1 | E80rnzCWCPk | Tom Johnson nel campo (o al mercato) |
| assets/unboxing-box.jpg | sezione unboxing | bYhDEWgqYLM | la box kraft VERA aperta col contenuto |

Slot rimasti a segnaposto (nessuna immagine adeguata trovata senza loghi/volti):
laboratorio (story cap. 2), video 15s (story sezione 0), ritratto lettera di Marco
(vietato per regola 10.9: mai una faccia altrui sotto la sua firma).

Le immagini sono agganciate da `photos.js`, che le marca `data-fake` e mostra
l'etichetta "Stock photo · bozza". Al lancio: sostituire i file in `assets/`
con le fotografie originali mantenendo il nome, poi togliere marcature ed etichette.

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
