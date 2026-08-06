# FOTO VERE — lista di scatto per Marco

Questa è la lista completa delle fotografie REALI che il sito aspetta,
con nome file esatto e descrizione di cosa deve mostrare ogni scatto.
(FOTO-DA-SCARICARE.md riguarda le stock provvisorie: altra cosa.)

**Come consegnarle:** metti i file in una cartella `foto/` dentro la
cartella GELATORCHARD, con qualsiasi nome. Poi dì a Fable "foto pronte":
le guarderà una per una, le rinominerà e le sposterà negli slot giusti.
Se preferisci, puoi già nominarle come nella colonna "Nome file".

**Regole generali:**
- Formato `.jpg`, orizzontali salvo dove indicato, larghezza minima 1600px
  (uno smartphone recente basta e avanza; luce naturale).
- Nei caroselli il testo bianco sta **in basso a sinistra**: lascia quella
  zona visivamente calma (no elementi importanti lì).
- Solo persone vere: il vero Tom, il vero Marco. Mai volti di sconosciuti
  accanto a nomi reali (promessa di tracciabilità).
- Se una foto manca, lo slot resta sul gradiente/segnaposto: nulla si rompe.

---

## A. Carosello "Diario del Raccolto" (hero homepage)
Cartella: `foto-gusti/frutta/` — una per frutto; appare SOLO quando quel
frutto è in stagione. Soggetto: la FRUTTA vera (in campo, in cassetta o
primo piano), non il gelato. Il badge REC sta in alto a sinistra.

| Nome file | Cosa deve mostrare |
|---|---|
| `strawberry.jpg` | Fragole appena raccolte: in cassetta o sulla pianta. Ideale: dal campo di Tom a Woodchurch, Kent |
| `raspberry.jpg` | Lamponi freschi (Scozia): cassetta o primo piano sul frutto |
| `cherry.jpg` | Ciliegie del Kent: sull'albero o in cassetta |
| `blueberry.jpg` | Mirtilli: cespuglio o mano che raccoglie |
| `blackcurrant.jpg` | Ribes nero: grappoli sul ramo o in ciotola |
| `victoria-plum.jpg` | Susine Victoria: sull'albero o in cesta (Vale of Evesham) |
| `apple-pear.jpg` | Mele e pere inglesi insieme: frutteto o cassetta mista |
| `quince.jpg` | Cotogne: frutti interi, gialli, rustici |
| `rhubarb.jpg` | Rabarbaro forzato dello Yorkshire: gambi rosa acceso (magari a lume di candela, come da tradizione dei forcing shed) |

## B. Carosello "Il Viaggio" (hero homepage, sotto il Diario)
Le 4 tappe dell'esempio fisso Fragola/Tom.

| Nome file | Tappa | Cosa deve mostrare |
|---|---|---|
| `foto-farmers/tom-johnson.jpg` | 1 · The harvest | Tom Johnson nel suo campo di fragole: mentre raccoglie, o con la cassetta in mano. Il viso si può vedere: è il punto (le facce costruiscono fiducia) |
| `foto-gusti/viaggio/laboratorio.jpg` | 2 · It becomes gelato | Marco in laboratorio: il Trittico in azione, frutta vera in lavorazione, acciaio. Niente polveri in vista, ovviamente |
| `foto-gusti/viaggio/confezione.jpg` | 3 · Ready for you | Il prodotto confezionato e pronto: sacapoche sigillate o box kraft chiusa col ghiaccio secco. "Confezionato per arrivare intatto" |
| `foto-gusti/viaggio/servito.jpg` | 4 · You eat it | Il gelato finito, servito: cono o coppetta in mano o porto verso l'obiettivo, rivolto a chi guarda. "Nel tuo cucchiaio" |

## C. Sostituzioni in `assets/` (stesso nome file = si aggiornano da sole)
Oggi sono foto stock marcate data-fake: sostituendo il file a parità di
nome, sito e anteprime social si sistemano senza toccare codice.

| Nome file | Dove appare | Cosa deve mostrare |
|---|---|---|
| `assets/hero-gelato.jpg` | SOLO anteprima link social/WhatsApp (og:image di tutte le pagine) | Il gelato VERO di Gelatorchard: cono o coppetta, colori vivi, sfondo semplice. Taglio ideale 1200×630 |
| `assets/unboxing-box.jpg` | Homepage, sezione "One Kraft Box. No Plastic." | La box kraft VERA aperta, vista dall'alto: 2 sacapoche, coni, coppette, palette di legno |
| `assets/farmer-field.jpg` | Story page, capitolo 1 | Tom nel campo (può essere la stessa sessione di tom-johnson.jpg, scatto diverso: più ampio, ambientato) |
| `assets/lab-gelato.jpg` | Story page, capitolo 2 (oggi slot vuoto) | Il laboratorio: macchine, banco, ambiente di produzione reale |

## D. Per dopo (non ancora agganciate nel codice, ma da mettere in lista scatti)
- **Ritratto di Marco** (verticale/quadrato, ≥800px): per la firma della
  lettera in homepage. Slot volutamente vuoto finché non c'è la foto vera
  (regola 10.9: mai una faccia altrui sotto la sua firma).
- **Video 15 secondi** della sacapoche (riposo 10 min → massaggio → erogazione
  sul cono): story page, sezione istruzioni.
- **Foto prodotto per i gusti del picker** (una per gusto, anche i 4 classici:
  chocolate, pistachio, stracciatella, hazelnut): oggi le tile usano i
  gradienti; quando ci saranno le foto si aggancia anche il picker.
- **Altri contadini** (`foto-farmers/<nome-cognome>.jpg`, es. louise-anderson.jpg):
  solo quando i fornitori veri saranno confermati coi loro batch.

---
**Priorità consigliata** (per lanciare con l'hero al completo):
1. B (le 4 del Viaggio) + `strawberry.jpg` — l'hero racconta tutto con 5 foto
2. C (le 4 di assets/, che tolgono altrettante voci da FAKE-DATA.md)
3. A (gli altri 8 frutti, man mano che entrano in stagione)
