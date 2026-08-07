# PIANO DI PRODUZIONE — situazione attuale (8 agosto 2026)

Base di calcolo REALE: niente Trittico. Una macchina professionale da banco
che manteca **750g di gelato per ciclo**. Tutto il piano (porzioni, formati,
capacità, tempi) discende da questo numero. I capitoli precedenti (batch da
12L ecc.) NON valgono più: fanno fede questo documento e il drop settimanale
(ordini lun 10:00 → mar 18:00, frutta gio sera, produzione ven, consegna sab/dom).

---

## 1. L'unità di misura: la porzione

**1 porzione = 125g** (due palline generose da gelateria).
Tutto il listino è costruito su multipli di 125g, e ogni ciclo da 750g
si divide esattamente:

- 750g = **6 porzioni** da 125g
- 750g = **3 sacapoche** da 250g
- 750g = **6 coppette** da 125g

Nessun formato "spezza" mai un ciclo: zero avanzi strutturali.

## 2. I formati di vendita

| Formato | Contenuto | Porzioni | Per chi | Prezzo |
|---|---|---|---|---|
| **Coppetta** | 125g, 1 gusto | 1 | entry level: "provami" | £3.50 (fisso) |
| **Sacapoche singola** | 250g, 1 gusto | 2 | chi sa già cosa vuole | from £6.50 (fisso) |
| **Multipack** | 4 coppette × 125g, fino a 4 gusti | 4 | assaggio famiglia | £12 (fisso) |
| **Family Tub** | 750g = 1 mantecata intera, 1-2 gusti | 6 | congelatore di casa | £22 (fisso) |
| **GELATO KIT** | vedi tabella sotto | — | il prodotto di punta | vedi sotto |

### Il Gelato Kit: taglie per persone (menu a tendina sul sito)
Regola: **250g a testa = 2 porzioni da 125g a persona** ("stasera e domani").
Massimo **2 gusti per box**, un gusto per sacapoche.

| Persone | Sacapoche | Gelato | Porzioni | Prezzo pickup | Prezzo delivery |
|---|---|---|---|---|---|
| 2 | 2 × 250g | 500g | 4 | £15 ⚠️ | £21 ⚠️ |
| 3 | 3 × 250g | 750g | 6 | £20 ⚠️ | £26 ⚠️ |
| **4** (standard) | 4 × 250g | 1kg | 8 | **£28 (fisso)** | **£34 (fisso)** |
| 6 | 6 × 250g | 1.5kg | 12 | £40 ⚠️ | £46 ⚠️ |

AGGIORNAMENTO 8 ago 2026: prezzi definitivi in COSTI.md (delivery =
pickup + £10, CONFERMATI dal founder). Modello SOLO DELIVERY su
Canary Wharf / Poplar / South Quay (E14), nessun minimo d'ordine;
ghiaccio secco solo nel Kit box, siberini per le consegne piccole.
Ancora prezzo: una gelateria di Londra chiede £4.50-7.50 a pallina;
qui una porzione da 125g (2 palline) costa £3.50-3.75.

## 3. Capacità produttiva (macchina da banco, 750g/ciclo)

**Tempi per ciclo** (da validare col cronometro alla prima produzione):
- mantecatura: ~40 min
- estrazione + riempimento sacapoche/coppette a caldo: ~10 min
- **totale: ~50 min/ciclo**; cambio gusto: +15 min di pulizia macchina

**Giornata di produzione = venerdì, 07:00–15:00 (8 ore):**
- tetto fisico: **8 cicli = 6.0kg**
- piano di vendita: **7 cicli = 5.25kg** (1 ciclo di margine per un
  ciclo fallito, assaggi QC, imprevisti)

**Cap ordini per drop (da far rispettare in aggregazione ordini):**
- 5.25kg = **42 porzioni** = 21 sacapoche
- equivalenze pratiche: ~5 Kit per 4 + 1 sacapoche di resto,
  oppure ~10 Kit per 2 + 2 coppette, oppure mix
- **massimo 6 gusti per drop** (ogni cambio gusto costa 15 min:
  5 cambi = 1h15 già inclusa nel conto delle 8 ore)

Oltre il cap: gli ordini in eccesso scalano al drop successivo
(già gestito dall'opzione B: il checkout non chiude, accoda).

## 4. La settimana tipo (timeline operativa)

| Quando | Cosa |
|---|---|
| Lun 10:00 – Mar 18:00 | Finestra ordini |
| **Mar sera** | Conta ordini con la formula (sotto). Messaggio a Tom con i kg di frutta per gusto |
| Gio sera (18–21) | Arrivo frutta: controllo temperatura/ammaccature, registrazione. Lavaggio, pulizia, **preparazione basi** (frutta frullata + zucchero + acqua), pastorizzazione sul fuoco a 62°C dove serve, abbattimento e **riposo in frigo a 4°C per la notte** |
| **Ven 07:00–15:00** | Mantecatura: cicli da 750g in sequenza, stesso gusto back-to-back, pulizia a ogni cambio gusto. Riempimento di sacapoche e coppette all'estrazione, subito in freezer a −18°C |
| Ven 15:00–19:00 | Indurimento a −18°C. Etichette + QR batch |
| Sab 07:30–09:30 | Assemblaggio box (ghiaccio secco), carico |
| Sab/Dom | Consegne e ritiri su slot |

## 5. La formula del martedì sera (aggregazione ordini)

1. **Grammi per gusto** = (sacapoche ordinate × 250g) + (coppette × 125g)
   + (tub × 750g), sommando Kit, singole e multipack
2. **Cicli per gusto** = grammi ÷ 750, arrotondato in SU
3. **Se Σ cicli > 7** → gli ordini più recenti scalano al drop successivo
   (avvisare il cliente via email: "sei nel drop del [sabato dopo]")
4. **Frutta da ordinare a Tom, per gusto** = cicli × 0.42kg × 1.10
   (una base frutta è ~55% frutta: 410g per ciclo, +10% di margine scarto)
5. Zucchero: ~135g per ciclo (18%). Acqua: il resto.

Esempio: 3 Kit per 4 (fragola+lampone) + 5 coppette fragola =
fragola 3×500+5×125 = 2125g → 3 cicli; lampone 1500g → 2 cicli.
Totale 5 cicli ✓ (entro 7). Frutta: fragola 1.4kg, lampone 0.9kg.

## 6. Percorso di crescita

| Livello | Setup | Capacità/settimana |
|---|---|---|
| **1 — ORA** | 1 macchina, ven mattina | 5.25kg · 42 porzioni |
| 2 | + sessione ven pomeriggio (15–19) | +4 cicli → 8.25kg · 66 porzioni |
| 3 | + seconda macchina da banco in parallelo | ~12-15kg |
| 4 | Trittico (pastorizza + manteca 2-5kg/ciclo) | 30kg+, e i log "12L" tornano veri |

## 7. REGISTRO BATCH — definizione, numerazione, ciclo di vita

> **1 batch = 1 gusto × 1 drop.** Tutti i cicli da 750g dello stesso gusto
> mantecati lo stesso venerdì sono UN batch: un numero, una story page,
> un QR (identico su tutte le sacapoche e coppette di quel gusto, quella
> settimana). Mai per-ciclo, mai per-settimana-intera.

**Numerazione**: progressiva globale (#046, #047, #048…), mai riciclata.
Continua la sequenza esistente (#042 = primo batch reale). La data del
drop vive nel registro, non nel numero.

**Ciclo di vita:**

| Momento | Evento |
|---|---|
| Mar 18:00 | **NASCE il numero**: chiusa la conta, si sa quali gusti si producono → si assegnano i progressivi |
| Gio sera | Entrano i dati frutta: messaggio del contadino + controllo all'arrivo |
| Ven | Entrano i dati di produzione (cicli, orari, kg) → si stampano le etichette QR |
| Sab/Dom | **SI CHIUDE**: consegnata l'ultima confezione (o "sold out" se finisce prima del cap) |
| Per sempre | La story page resta online: il QR nel freezer del cliente deve funzionare anche fra mesi. I batch chiusi si archiviano, mai cancellati |

### Le due metà del log (chi scrive cosa)

**Metà del contadino** — ora di raccolta, varietà, appezzamento.
Canale PRIMARIO (idea founder, 8 ago 2026): la **BATCH CARD nella
cassetta** — un blocchetto di schede precompilate che Marco stampa e
lascia all'azienda; Tom ne riempie una mentre chiude la cassetta
(20 secondi, niente telefono, niente memoria richiesta) e la firma.
All'arrivo del giovedì sera: FOTOGRAFARE la scheda (archivio batch,
la carta può perdersi) e ricopiare i dati nel registro. La foto della
nota scritta a mano è anche materiale per story page/social.

```
GELATORCHARD · BATCH CARD
Frutto: ____________  Varietà: ____________
Raccolto il: ____/____  alle ore: ______
Campo/appezzamento: ____________
Firma: ____________
```

Canale di RISERVA: WhatsApp — promemoria del giovedì mattina se la
cassetta arriva senza scheda (e il template d'ordine del martedì, sotto).
Le aziende raccolgono all'alba e tracciano già i lotti (Red Tractor):
è una scheda da 20 secondi, non un favore.

**Metà di Marco** — tutto dal momento in cui la frutta arriva: ora
d'arrivo e temperatura (gio sera), controllo ammaccature, orari basi,
cicli di mantecatura, ora in freezer (ven). Si compila con l'orologio
in mano: sono gli stessi campi del log già sul sito.

**Regola d'onestà**: la precisione del log = la precisione della filiera,
mai di più. Se una settimana si compra da intermediario (New Covent
Garden), l'ora di raccolta NON esiste → il log dice ciò che si sa
("consegnata gio 19:40, lotto X, azienda Y da etichetta") e la story
page di quel batch non mostra l'ora di raccolta. L'intermediario è
l'eccezione: il posizionamento del sito regge solo con la filiera diretta.

### Template WhatsApp del martedì sera (ordine + dati)

```
Ciao Tom! Ordine per questa settimana:
– [X] kg di fragole, consegna giovedì sera come sempre.
Quando raccogli giovedì mandami per favore:
1. ora di raccolta
2. varietà
3. campo/appezzamento
Va nel batch log dei clienti (#0XX). Grazie!
```

Registro: al lancio una pagina Notion per batch (già previsto), che
alimenta story page e QR. La dashboard admin.html si aspetta questa
struttura.

## 8. Da validare alla prima produzione reale (poi aggiornare qui)

- Tempo vero di mantecatura di un ciclo da 750g con base a 4°C
- Capienza reale del freezer per l'indurimento (quanti cicli in parallelo)
- Resa vera: i 750g dichiarati escono tutti? (se 700g, ricalibrare qui)
- % frutta per gusto (il rabarbaro non è la fragola): tabella per-gusto
- I prezzi ⚠️ delle taglie 2/3/6
