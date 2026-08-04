# FOTO STOCK PROVVISORIE — lista di ricerca

⚠️ **Queste foto sono BOZZE.** Servono solo a valutare l'aspetto d'insieme del sito in
locale. Vanno tutte sostituite con le fotografie originali di Marco prima del lancio.
La procedura di sostituzione è in fondo a questo file.

## Dove scaricarle (gratuite, uso commerciale consentito)
- **Unsplash** — https://unsplash.com
- **Pexels** — https://pexels.com

Su entrambi: cerchi, apri la foto, tasto **Download**. Non serve registrarsi.
Scarica la dimensione **Large** (circa 1920px di larghezza): più che sufficiente e
non appesantisce il sito.

## Come salvarle
Metti tutti i file nella cartella:
```
C:\Users\User\OneDrive\Documenti\GELATORCHARD\assets\
```
**Rinominali esattamente come indicato nella colonna "Nome file"**: il codice cercherà
quei nomi precisi. Estensione `.jpg` (se scarichi un `.png` va bene lo stesso, ma
dimmelo così adatto il codice).

---

## LE 6 FOTO

### 1. Hero della homepage — la più importante
| | |
|---|---|
| **Nome file** | `hero-gelato.jpg` |
| **Dove appare** | Riquadro grande sotto il titolo della homepage |
| **Proporzioni** | Orizzontale (circa 2:1). Larga almeno 1600px |
| **Cosa cercare** | `strawberry gelato cone`, `pink ice cream cone`, `gelato scoop close up` |
| **Cosa serve** | Un cono o una coppetta di gelato alla fragola, colori vivi, sfondo semplice. Luce naturale. |
| **Attenzione** | Il testo bianco "Kentish Strawberry, Batch #042" va in basso a sinistra: evita foto con elementi importanti in quella zona. Preferisci uno sfondo uniforme nella metà inferiore. |

### 2. Unboxing — la box kraft
| | |
|---|---|
| **Nome file** | `unboxing-box.jpg` |
| **Dove appare** | Sezione "One Kraft Box. No Plastic." |
| **Proporzioni** | Orizzontale (circa 2:1). Larga almeno 1600px |
| **Cosa cercare** | `kraft box packaging open`, `brown paper box delivery`, `eco packaging flat lay` |
| **Cosa serve** | Una scatola di cartone kraft aperta, possibilmente vista dall'alto. Meglio se si intravede del contenuto. |
| **Attenzione** | Anche qui il testo bianco va in basso: serve spazio libero nella parte inferiore. |

### 3. Story page — il contadino nel campo
| | |
|---|---|
| **Nome file** | `farmer-field.jpg` |
| **Dove appare** | Capitolo 1 della story page (`story.html?batch=042`) |
| **Proporzioni** | Orizzontale (circa 16:9). Larga almeno 1200px |
| **Cosa cercare** | `strawberry farmer field`, `farmer harvesting berries`, `hands picking strawberries` |
| **Cosa serve** | Un contadino al lavoro in un campo di fragole. **Meglio se il viso non è riconoscibile** (di spalle, di profilo, o inquadratura sulle mani): eviti che sembri il vero Tom Johnson. |

### 4. Story page — il laboratorio
| | |
|---|---|
| **Nome file** | `lab-gelato.jpg` |
| **Dove appare** | Capitolo 2 della story page |
| **Proporzioni** | Orizzontale (circa 16:9). Larga almeno 1200px |
| **Cosa cercare** | `gelato making machine`, `artisan ice cream production`, `stainless steel kitchen gelato` |
| **Cosa serve** | Un laboratorio artigianale, macchinari in acciaio, ambiente di produzione. |
| **Attenzione** | Stessa regola: meglio senza volti riconoscibili, o di spalle. |

### 5. Frutta di stagione — opzionale ma consigliata
| | |
|---|---|
| **Nome file** | `fruit-seasonal.jpg` |
| **Dove appare** | La userò nella sezione calendario/stagionalità |
| **Proporzioni** | Orizzontale. Larga almeno 1400px |
| **Cosa cercare** | `british summer fruit basket`, `fresh berries harvest crate`, `seasonal fruit market` |
| **Cosa serve** | Frutta fresca in cassette o ceste, luce naturale, aspetto di mercato o raccolto. |

### 6. Ritratto per la lettera — solo se farai il Capitolo 10
| | |
|---|---|
| **Nome file** | `marco-portrait.jpg` |
| **Dove appare** | Sezione "lettera di Marco" (prevista nel Capitolo 10) |
| **Proporzioni** | Verticale o quadrata. Almeno 800px |
| **Cosa cercare** | `chef portrait apron`, `artisan food maker portrait` |
| **Attenzione** | Qui il rischio è più alto: una foto stock di una persona reale accanto al nome "Marco Castellano" fa sembrare che sia lui. **Consiglio di saltare questa** e lasciare il segnaposto finché non hai una foto vera di Marco. |

---

## Cosa succede quando le hai scaricate

Dimmi solo **"foto pronte"** e io:
1. Le collego a tutti gli slot giusti (homepage, story page, calendario)
2. Le marco tutte con `data-fake="1"` nel codice, come per gli altri dati provvisori
3. Aggiungo un'etichetta visibile sull'immagine: "Stock photo — bozza"
4. Le registro in `FAKE-DATA.md` così sono nell'elenco unico delle cose da rimuovere
5. Regolo il ritaglio perché il testo sovrapposto resti leggibile

Se un file manca, quello slot resta col segnaposto attuale: non si rompe nulla.

---

## PROCEDURA DI RIMOZIONE (prima di andare online)

⚠️ **Il sito non deve andare online con queste foto.** Sono immagini di altri autori usate
come bozza: pubblicarle significherebbe mostrare frutta e laboratori che non sono di
Gelatorchard, contraddicendo la promessa di tracciabilità su cui si regge tutto il brand.

Quando arriveranno le foto di Marco:
1. Cerca `data-fake` nel progetto: ogni occorrenza è un elemento provvisorio
2. Sostituisci il file in `assets/` mantenendo lo stesso nome, oppure dimmi il nuovo nome
3. Rimuovi l'attributo `data-fake` e l'etichetta "Stock photo, bozza"
4. Cancella dalla cartella le foto stock non più usate
5. Verifica finale: la ricerca di `data-fake` non deve restituire nulla

## Le 5 foto vere che servono a Marco (per il lancio)
1. Un cono o coppetta del gelato vero, luce naturale
2. La box kraft aperta col contenuto: 2 sacapoche, coni, coppette, palette
3. Tom nel campo, il lunedì mattina al mercato o in azienda
4. Marco in laboratorio, col Trittico sullo sfondo
5. Video di 15 secondi: come si serve la sacapoche (riposo, massaggio, erogazione)

Bastano uno smartphone recente e luce naturale. Non serve un fotografo.
