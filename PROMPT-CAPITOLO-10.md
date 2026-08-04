# CAPITOLO 10 — RISCRITTURA DIRECT RESPONSE
## Gelatorchard — Istruzioni di Build per Fable

Presuppone i Capitoli 1-9 già costruiti. Questo capitolo **non aggiunge pagine**: riscrive
il copy dell'intero sito e riordina la homepage applicando i principi del direct response
americano. Il design system (colori, font, componenti) resta quello del Capitolo 1: cambia
cosa dice il sito e in che ordine lo dice, non come è dipinto.

---

## 10.0 PREMESSA VINCOLANTE — LEGGERE PRIMA DI TUTTO

### Lo stato del progetto
Il sito è **pre-lancio** (lancio previsto settembre 2026). Non è online e non deve andarci
in questa fase: gira in locale per valutazione.

### Dati simulati: regola non negoziabile
Il founder ha autorizzato **esplicitamente e solo per questa mockup locale** l'inserimento
di dati numerici plausibili ma **non ancora verificati** (numero di batch, contadini, km,
valutazioni), allo scopo di vedere come risulterà il sito finito.

Ogni singolo dato non verificato che inserisci DEVE rispettare tutte e tre queste regole:

1. **Marcatura obbligatoria nel markup**: ogni elemento che contiene un numero o una
   citazione non verificata porta l'attributo `data-fake="1"`. Nessuna eccezione.
   Esempio: `<div class="proof-num" data-fake="1">47</div>`
2. **Commento HTML adiacente**: `<!-- DATO SIMULATO — sostituire con dato reale prima del lancio -->`
3. **Registrazione in `FAKE-DATA.md`** (file nuovo, nella radice): una riga per ogni dato
   simulato, con file, riga approssimativa, valore usato e chi deve fornire il dato reale.

Alla fine del capitolo (10.9) c'è la procedura di rimozione. Il sito **non deve andare
online finché quella procedura non è stata eseguita**. Scrivilo anche in cima a `FAKE-DATA.md`.

### Cosa NON è ammesso, nemmeno in mockup
- Countdown a tempo che non corrisponde a una scadenza stagionale reale calcolata da `flavors.js`
- Contatori di scorte ("ne restano 3!") che non leggono un magazzino vero
- Loghi o citazioni di testate giornalistiche ("As seen in...") mai avvenute
- Recensioni attribuite a persone reali identificabili senza il loro consenso
- Nomi di marchi concorrenti reali (vedi 10.2 per la strategia di attacco consentita)

Questi non sono ammessi perché sono **irreversibili nel danno**: un cliente che li verifica
e li trova falsi distrugge esattamente ciò che il brand vende, cioè la verificabilità. La
scarsità stagionale reale è più potente e non ha questo rischio.

---

## 10.1 LA SCUOLA DA APPLICARE

Applica fino in fondo i principi operativi di questi autori. Per ciascuno è indicato
**cosa** prendere e **dove** applicarlo su questo sito.

| Autore | Principio da applicare | Dove |
|---|---|---|
| **John Caples** | Headline che promettono un beneficio specifico o innescano curiosità; il titolo vale il 90% del risultato. Testabili, mai vaghi. | Tutte le H1/H2 del sito (10.4) |
| **Claude Hopkins** | "Reason why": ogni affermazione seguita dal motivo per cui è vera. Preminenza: descrivere il proprio processo in dettaglio anche se lo fanno tutti — chi lo dice per primo se lo prende. Tracciabilità di ogni claim. | Sezione processo produttivo (10.5.4), value stack |
| **David Ogilvy** | Copy lungo che argomenta; il fatto concreto batte l'aggettivo; il consumatore non è stupido. Headline che contengono una notizia. | Sezione Marco (10.5.3), story page |
| **Gary Halbert** | Apertura che afferra alla gola; conflitto esplicito con un nemico; tono di lettera personale, non di brochure aziendale; P.S. che rilancia. | Sezione lettera di Marco (10.5.3), email |
| **Dan Kennedy** | "No-BS": dire la verità scomoda, anche quando penalizza la vendita. Qualificare il cliente ed **escludere** chi non è adatto. Nessuno sconto: si difende il prezzo con il valore. | Manifesto in homepage (10.5.2), sezione prezzo |
| **Joe Sugarman** | "Slippery slide": ogni frase esiste per far leggere la successiva. Prima frase corta. Coinvolgimento sensoriale. Semi di curiosità che si raccolgono più avanti. | Struttura di tutta la homepage (10.5), transizioni tra sezioni |

**Regola di sintesi**: il sito attuale *afferma* di essere diverso. Dopo questo capitolo deve
**dimostrarlo nei primi dieci secondi**, con prove verificabili, prima che il visitatore
concluda che è l'ennesimo gelato artigianale con un bel sito.

---

## 10.2 STRATEGIA DI ATTACCO (autorizzata dal founder)

Applica **due livelli combinati**:

**Livello 1 — Le sostanze, non i marchi.**
Nomina gli ingredienti industriali reali e verificabili: glucose syrup, stabilizzante E410
(farina di semi di carrube), emulsionante E471, colorante E120 (cocciniglia, di origine
animale — insetti), "natural flavouring", basi in polvere. Questi sono fatti documentabili
su qualunque etichetta di categoria.

**Livello 2 — Attacco alla categoria, mai al singolo.**
Sono ammesse affermazioni sul settore: *"Most 'artisan' gelato in this city starts life as
flavour powder in a plastic bucket."* Usa sempre quantificatori onesti ("most", "much of",
"the majority of") e mai un nome proprio.

**Vietato**: nominare catene, negozi o marchi reali. In UK il rischio di diffamazione
commerciale è concreto e servirebbe prova documentale per ogni singola affermazione.

**Obbligatorio**: ogni affermazione sul settore deve essere difendibile. Se non sai
dimostrarla, riformulala come domanda al lettore ("Have you ever read the label of the
gelato you bought last week?") — la domanda ottiene lo stesso effetto senza esporre.

---

## 10.3 STRUTTURA NUOVA DELLA HOMEPAGE

Questo è il nuovo ordine delle sezioni di `index.html`. Le sezioni marcate NUOVA vanno
create; le altre esistono e vanno riscritte/spostate.

```
1.  HERO                        (riscritto — 10.5.1)
2.  MANIFESTO NOT/IS            (NUOVA — spostato qui dal checkout — 10.5.2)
3.  CONFRONTO ETICHETTE         (NUOVA — 10.5.2b)
4.  PROOF BAR                   (ex spec strip, riscritta con dati — 10.5.6)
5.  RUOTA STAGIONALE            (NUOVA in homepage — 10.5.5)
6.  FLAVOR PICKER               (riscritto + tile con farmer reveal — 10.6)
7.  LETTERA DI MARCO            (NUOVA — 10.5.3)
8.  PROCESSO / FIELD TO FREEZER (riscritto in chiave Hopkins — 10.5.4)
9.  FORMATI E PREZZO            (riscritto in chiave Kennedy — 10.5.7)
10. UNBOXING                    (invariato nella struttura, copy riscritto)
11. PROVA SOCIALE               (sostituisce testimonianze — 10.5.8)
12. SEASONAL ALERT LIST         (invariata)
13. CTA BAND                    (riscritta — 10.5.9)
```

**Barra di scarsità**: fissa in cima al sito, sopra la nav, su tutte le pagine (10.7).

---

## 10.4 REGOLE DI SCRITTURA PER TUTTE LE HEADLINE

Applica a ogni H1/H2/H3 del sito (Caples + Ogilvy):

1. **Mai una headline che descrive**: sempre una che promette, incuriosisce o annuncia una
   notizia. "Two Collections. One Rule." descrive. "In January, we can only make one fruit
   flavour. Here's why that's the point." annuncia.
2. **Specificità numerica ovunque possibile**: non "fresh fruit" ma "fruit picked 41 hours ago".
3. **Seconda persona**: il lettore deve comparire nella headline ("your", "you").
4. **Nessun gioco di parole**: il direct response non fa il simpatico, fa il chiaro.
5. **Lunghezza libera**: una headline lunga che dice qualcosa batte una corta che non dice nulla.

Sottotitolo di ogni sezione: deve **estendere** la headline, mai ripeterla. Sugarman: il
sottotitolo esiste per far leggere il primo paragrafo.

---

## 10.5 SEZIONE PER SEZIONE — COSA SCRIVERE

### 10.5.1 HERO (riscritto)

Struttura: eyebrow, H1, sottotitolo, due CTA, visual.

- **Eyebrow**: resta `No Powders. Just Fruit.`
- **H1**: deve contenere il conflitto o la notizia, non la descrizione del prodotto.
  Direzione: mettere in discussione ciò che il lettore crede di aver mangiato finora.
  Scrivi 3 varianti e usa la più forte, elencando le altre due in un commento HTML
  così il founder può testarle (Caples: le headline si testano, non si scelgono a gusto).
- **Sottotitolo**: massimo 2 frasi. La prima cortissima (Sugarman). Deve introdurre la
  promessa verificabile: nome del contadino, ora della raccolta, tre ingredienti.
- **CTA primaria**: verbo + beneficio, mai "Scopri". Es. "See what's in season today".
- **CTA secondaria**: rimanda alla prova ("Read the label first").

### 10.5.2 MANIFESTO NOT/IS (nuova sezione, spostata dal checkout)

Il blocco `This is NOT... / This IS...` oggi vive dentro `order.js` (checkout step B).
**Va replicato in homepage**, subito dopo l'hero, come sezione a piena larghezza, sfondo
scuro (usa `--ink` come fondo, testo `--bg`) per stacco visivo netto dal resto della pagina.

Mantieni la struttura a righe NOT/IS ma **espandila** con il tono Kennedy: aggiungi almeno
due righe NOT che escludono attivamente il cliente sbagliato. Esempio di direzione:
*"This is NOT for you if you want strawberry gelato in January. We won't make it."*

Sotto il manifesto, una riga di transizione (Sugarman, slippery slide) che porta alla
sezione successiva: qualcosa come *"Don't take our word for it. Read both labels."*

**Il blocco nel checkout resta dov'è**: serve ancora come attrito strategico del Capitolo 3.

### 10.5.2b CONFRONTO ETICHETTE (nuova sezione)

Due colonne affiancate (stack verticale sotto 760px).

- **Colonna sinistra**, intestata come etichetta industriale tipica di categoria: elenco
  lungo di ingredienti reali (glucose syrup, palm oil, E410, E471, E120, "natural
  flavouring", milk powder, dextrose...). Rendi visivamente pesante la lunghezza della
  lista. Gli E-number con una breve glossa fra parentesi, in particolare E120 =
  cochineal, di origine animale.
- **Colonna destra**, l'etichetta Gelatorchard: tre righe. Fruit. Cane sugar. Water.
  Enorme spazio bianco sotto: **il vuoto è l'argomento**.
- Nessun commento sarcastico sotto le colonne. Una sola riga fattuale, tipo
  *"Both are legally 'gelato'. Only one is fruit."*

Nota: la colonna sinistra è un **esempio di categoria**, non l'etichetta di un prodotto
specifico. Intestala in modo che questo sia chiaro ("A typical industrial gelato label")
per rispettare 10.2.

### 10.5.3 LETTERA DI MARCO (nuova sezione)

Formato lettera, non sezione istituzionale (Halbert). Larghezza di lettura stretta
(max 640px), testo allineato a sinistra, corpo 17-18px.

Contenuto obbligatorio:
- Apertura in prima persona che afferra: un dettaglio concreto, non una presentazione.
- Chi è Marco: gelatiere formato in Italia, fondatore, quello che ogni lunedì alle 5:30
  è al mercato.
- **Almeno una ammissione scomoda** (Kennedy). La più forte disponibile e vera:
  a gennaio il menù di frutta si riduce a un solo gusto. Trasformala da debolezza a prova.
- Il vincolo auto-imposto: nessuna polvere, mai, nemmeno a febbraio quando sarebbe comodo.
- Firma: `— Marco` (mai "il team").
- **P.S. obbligatorio** (Halbert): è il secondo elemento più letto di una lettera dopo la
  headline. Deve contenere l'argomento più umano o il rilancio più forte, non un riassunto.

Foto: usa il segnaposto già presente nel sistema (etichettato come da Capitolo 2), in
attesa della fotografia reale.

### 10.5.4 PROCESSO — FIELD TO FREEZER (riscritto)

Applica la **preminenza di Hopkins**: descrivi il processo produttivo con un livello di
dettaglio che nessun concorrente si prende la briga di pubblicare. I 4 step attuali
(5am/6am/5pm/7pm) restano come struttura, ma ogni step guadagna:
- un dato tecnico verificabile (temperatura, durata, tolleranza);
- il "reason why": perché quel passaggio è fatto così e cosa succederebbe altrimenti.

Esempio di direzione per lo step laboratorio: non "pastorizzato, mantecato", ma la
temperatura esatta, la durata, e perché quella soglia conta per il sapore.

Mantieni la linea che si disegna con lo scroll e la cascata dei 4 step (Capitolo 9).

### 10.5.5 RUOTA STAGIONALE IN HOMEPAGE (nuova collocazione)

La `SeasonWheel` di `calendar.js` va **riusata in homepage**, non duplicata: esporta il
componente e montalo anche qui (stessa fonte dati, regola del Capitolo 5.8).

Sopra la ruota, una headline che usa il dato del giorno calcolato in tempo reale.
Direzione: il numero di frutti realmente in stagione oggi contro quelli di gennaio.
Il testo deve **generarsi da `Gelatorchard.FRUITS` + `windowInfo()`**, mai essere scritto
a mano: deve restare vero ogni giorno dell'anno senza interventi.

Sotto la ruota, la CTA porta al calendario completo.

Il teaser attuale con il badge del mese viene **sostituito** da questa sezione.

### 10.5.6 PROOF BAR (ex spec strip)

Sostituisce la fascia attuale 100% / 3 / 48h, che resta ma si arricchisce.
Porta a 5 numeri, tutti con `data-fake="1"` dove non verificati:

| Numero | Etichetta | Stato |
|---|---|---|
| 3 | ingredients on the label | REALE |
| 100% | British seasonal fruit | REALE |
| 48h | field to freezer | REALE |
| [N] | batches produced, each one traceable | SIMULATO |
| [N] | farmers we know by name | SIMULATO |

Usa numeri **plausibili per un'attività pre-lancio**: non centinaia di batch. Un ordine di
grandezza credibile per chi produce dal maggio 2026 (es. decine di batch, pochi contadini).
Numeri gonfiati rendono il sito meno credibile, non più.

Mantieni il count-up del Capitolo 9 su tutti i numeri interi.

### 10.5.7 FORMATI E PREZZO (riscritto in chiave Kennedy)

Nessuno sconto, mai. Il prezzo si difende, non si abbassa.

- Ogni formato guadagna una riga di **qualificazione** che dice per chi è e per chi non è.
- Il Gelato Kit mantiene il value stack del Capitolo 3, ma riscritto con il price anchoring
  esplicito: confronto con il costo a pallina di una gelateria (£4.50–7.50, dato già
  stabilito), calcolo del costo a pallina del Kit, e cosa si ottiene in più (la storia).
- Aggiungi una riga che affronta l'obiezione prima che nasca (Hopkins): perché costa così,
  cosa c'è dentro quel prezzo. Onestà sul margine batte lo sconto.

### 10.5.8 PROVA SOCIALE (sostituisce le testimonianze)

**Rimuovi le 4 card di testimonianze attuali e la nota "pre-launch tasting panel".**

Al loro posto, prova verificabile e specifica. Struttura a tre blocchi:

1. **I numeri della tracciabilità** — quanti batch, quanti contadini, distanza media dal
   campo al laboratorio, tempo medio dalla raccolta al congelamento. Tutti `data-fake="1"`.
2. **Il registro dei batch** — un elenco compatto degli ultimi batch prodotti con numero,
   gusto, contadino, data. Deve leggere `Gelatorchard.BATCHES`. Oggi contiene solo il #042
   reale: aggiungi 3-4 batch simulati e marcali (`data-fake` sull'elemento e riga in
   `FAKE-DATA.md`), mantenendo la struttura dati del Capitolo 4 così che al lancio basti
   sostituire il registro.
3. **Citazioni dal panel** — se ne tieni, devono essere specifiche e riferite a un batch
   ("il #042, il 19 maggio"), non elogi generici. Marcate come simulate.

### 10.5.9 CTA BAND FINALE

Riscritta con la logica dell'ultima chiamata: non "Ready to trace your gelato?" (descrittiva)
ma un'ultima leva basata sul dato stagionale reale del giorno. Due CTA: ordine e alert list.

---

## 10.6 FLAVOR PICKER — FARMER REVEAL

Modifica il componente in `flavors.js` (che resta la fonte unica, Capitoli 2/3/5):

- **Alla selezione di un gusto di frutta**, la tile rivela i dati del contadino del batch
  corrente: nome, azienda, luogo, ora della raccolta. Deve leggere `Gelatorchard.BATCHES`.
  Per i gusti senza batch pubblicato mostra l'origine reale (`SEASONS[id].origin`) senza
  inventare un contadino.
- L'animazione della rivelazione usa le curve del Capitolo 9 (`--ease-apple`, max 0.8s).
- **Gusto appena finito**: se `seasonStatus()` restituisce `finished` e la stagione si è
  chiusa da meno di 30 giorni, la tile lo dichiara ("Cherry ended 12 days ago. Back June
  2027") invece del solo timbro generico. Serve un nuovo campo calcolato in `windowInfo()`:
  giorni trascorsi dalla fine.
- I gusti classici non cambiano comportamento.

Il link "Read the story" oggi è troppo piccolo per essere visto: va reso un elemento
riconoscibile (pillola piccola o riga con freccia), sempre secondario rispetto alla selezione.

---

## 10.7 BARRA DI SCARSITÀ (nuovo componente globale)

Barra sottile fissa **sopra la nav**, su tutte le pagine pubbliche. Va in `site.js`
(unico punto per gli elementi globali, regola di progetto).

Contenuto generato da `Gelatorchard.seasonStatus()` su tutti i gusti frutta:
- Se esiste un gusto in stagione con ≤45 giorni rimasti, mostra il più urgente:
  nome, giorni rimasti, mese di ritorno.
- Se nessuno è in scadenza, mostra il prossimo frutto che entra in stagione e fra quanto.
- Testo cliccabile che porta a `/order` con quel gusto preselezionato.

Vincoli: mai un countdown a ore/minuti (non c'è una scadenza oraria reale); il testo si
aggiorna da solo ogni giorno senza intervento manuale; altezza contenuta (max 38px) per
non rubare spazio all'hero; deve rispettare `prefers-reduced-motion` (nessun lampeggio).

---

## 10.8 COPY DELLE ALTRE PAGINE

Applica la stessa riscrittura, mantenendo intatte le funzionalità:

- **`/order`**: headline di ogni step del checkout riscritte in chiave direct response.
  I due step di attrito (Capitolo 3.8) restano e vanno **rafforzati**, non ammorbiditi.
- **`/story`**: la sezione 0 (istruzioni) resta invariata nella sostanza — è servizio, non
  vendita. I 4 capitoli guadagnano il "reason why" di Hopkins su ogni dato tecnico.
- **`/business`**: il tono resta professionale ma le headline seguono 10.4. La regola sul
  divieto assoluto delle parole abbonamento/subscription resta.
- **`/app`** (Seasonal Alert List): copy riscritto con la leva della perdita, non del
  guadagno (Kennedy): non "resta aggiornato" ma "non farti trovare impreparato quando la
  fragola sparisce per undici mesi".
- **`EMAILS.md`**: le 5 email esistenti vanno riviste con le stesse regole. Mantieni la
  struttura dei trigger del Capitolo 7.

---

## 10.9 PROCEDURA DI RIMOZIONE DATI SIMULATI (obbligatoria prima del lancio)

Crea `FAKE-DATA.md` nella radice con questa struttura:

```
# DATI SIMULATI — DA RIMUOVERE PRIMA DEL LANCIO

⚠️ IL SITO NON DEVE ANDARE ONLINE FINCHÉ QUESTA LISTA NON È VUOTA.

Ogni riga: file · cosa · valore simulato · chi fornisce il dato reale

| File | Elemento | Valore simulato | Fonte del dato reale |
|---|---|---|---|
| index.html | proof bar, batch prodotti | 47 | Marco (registro produzione) |
| ... | ... | ... | ... |

## Come rimuoverli tutti
1. Cerca `data-fake` in tutti i file: ogni occorrenza è un dato da sostituire.
2. Se il dato reale è disponibile: sostituisci il valore e togli `data-fake` e il commento.
3. Se NON è disponibile: rimuovi l'intero elemento, non lasciare un numero a zero.
4. Verifica finale: la ricerca di `data-fake` deve restituire zero risultati.
```

Aggiungi in `CLAUDE.md`, nella sezione "Stato build", una riga che segnala l'esistenza di
`FAKE-DATA.md` e il vincolo di pubblicazione.

---

## 10.10 VINCOLI TECNICI (invariati dai capitoli precedenti)

- HTML/CSS/JS puro, struttura piatta. Nessuna dipendenza esterna, nessun framework.
- Design system del Capitolo 1: non introdurre colori o font nuovi. Il fondo scuro del
  manifesto usa `--ink`, non un nero nuovo.
- Fonte dati unica: stagionalità e gusti solo da `flavors.js`. Mai duplicare elenchi.
- Motion: solo tramite `motion.js`, curve e durate del Capitolo 9, max 0.8s.
- `prefers-reduced-motion` rispettato su ogni nuova animazione.
- Inglese britannico ovunque (copy, slug, query param).
- Prezzi invariati: £3.50 · £5.50 · £8.50 · da £6.50 · £28/£34 · £12 · £22 · £28.50.
- Non toccare `demo-direzione-precedente.html`.
- Aggiornare la checklist "Stato build" in `CLAUDE.md` a fine capitolo.

---

## 10.11 COSA CONSEGNARE

1. `index.html` riordinato secondo 10.3 con tutte le sezioni nuove e il copy riscritto
2. Nuove regole CSS in `style.css` per: manifesto a fondo scuro, confronto etichette,
   lettera di Marco, proof bar a 5 numeri, registro batch, barra di scarsità
3. `flavors.js`: farmer reveal nel picker, campo "giorni dalla fine stagione" in
   `windowInfo()`, batch simulati marcati nel registro
4. `site.js`: barra di scarsità globale
5. Copy riscritto su `/order`, `/story`, `/business`, `/app` e in `EMAILS.md`
6. `FAKE-DATA.md` completo di ogni dato simulato inserito
7. `CLAUDE.md` aggiornato

**Criterio di accettazione**: un visitatore che apre la homepage e legge solo i primi due
schermi deve poter rispondere a tre domande — che cosa vendono, perché è diverso da tutto
il resto, e perché dovrebbe comprare adesso invece che fra un mese. Se una delle tre resta
senza risposta, il capitolo non è finito.

Fine Capitolo 10.
