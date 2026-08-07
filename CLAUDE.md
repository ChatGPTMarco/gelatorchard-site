# GELATORCHARD — Istruzioni progetto (leggere prima di ogni modifica)

## Cos'è
Sito di Gelatorchard — gelato artigianale, Londra. Tagline: "No Powders. Just Fruit."
Founder: Marco Castellano. Posizionamento: l'unico gelato a Londra dove conosci il nome
del contadino prima di assaggiare la frutta. Etichetta 3 ingredienti: frutta, zucchero di canna, acqua.

## LINGUA DEL SITO (vincolante, dal Capitolo 3)
Le specifiche dei capitoli arrivano in italiano, ma TUTTO il sito è in INGLESE BRITANNICO:
copy, nav/footer, slug e query param (flavours=strawberry,...), lang="en-GB".
British spelling: flavour, colour, basket (non cart), pickup/delivery, £.
I nomi file restano quelli storici (calendario.html non si rinomina).

## Stato build (a capitoli, forniti dal founder)
- ✅ Capitolo 1 — Fondamenta: design system, componenti globali, 6 pagine skeleton
- ✅ Capitolo 2 — Homepage completa (11 sezioni + FlavorPicker/SeasonBadge in flavors.js)
- ✅ Capitolo 3 — /order: tab formati, FlavorPicker con max dinamico, ticket batch, value stack,
  basket drawer, checkout a 2 conferme + conferma ordine. Pagamento in "pre-launch preview":
  Stripe/Apple Pay/Google Pay da agganciare al lancio (banner onesto, nessun pagamento preso).
  Sito interamente tradotto in inglese britannico.
- ✅ Capitolo 4 — story page QR-linked: route dinamica story.html?batch=042 / ?flavour=id,
  Sezione 0 istruzioni (componente identico per ogni batch), 4 capitoli con progress bar
  sticky, feedback form (pre-launch preview), WhatsApp share precompilato (al lancio:
  wa.me/<numero farmer>), pagine dedicate per Classici / frutta senza batch / landing.
- ✅ Capitolo 5 — /calendario: SeasonWheel SVG 12 spicchi (mese corrente pulsante, click →
  pannello), narrativa+FOMO per mese, stati frutta (barra %, "Opens in N days", timbro
  "Back Month Year"), gusti ordinabili per mese dalla stessa fonte del picker.
  FLAVORS.fruit esteso a 9 gusti (aggiunti victoria-plum, apple-pear, quince, rhubarb:
  compaiono anche nel picker di home/order). Finestre stagionali esatte da spec 5.3.
- ✅ Capitolo 6 — /business: hero + 4 tab (Event Catering, Corporate Gifts/Premium Gift Box,
  Office Stock come riordino manuale — MAI parole abbonamento/subscription/piano —,
  Wholesale) + form preventivi condiviso con preselezione tipo dai CTA delle tab.
  Nessun checkout: tutto a preventivo. Form in pre-launch preview (endpoint al lancio).
- ✅ Capitolo 7 — Seasonal Alert List: componente iscrizione condiviso (alerts.js) su
  app.html + homepage #alerts + calendario, checklist 9 frutti con finestre, follow-all,
  preselezione ?fruit=, motore trigger Gelatorchard.alertsDue (lastCall ≤7gg / seasonEntry
  giorno 1), template email en-GB in EMAILS.md. Invio reale = Brevo al lancio (preview).
  App waitlist resta fase 2 (nota su app.html).
- ✅ Capitolo 8 — Backend: schema Supabase completo con RLS+seed (backend/schema.sql),
  adapter unico backend.js (submitOrder/submitFeedback/subscribeAlerts/sendEnquiry —
  preview finché SUPABASE_URL/ANON_KEY vuote, poi live senza altre modifiche), touchpoint
  cablati in order/story/alerts/business, dashboard interna admin.html+admin.js (batch,
  ordini con carico assemblaggio Kit 8-10min, feedback ≤4★, domanda alert). Doc: BACKEND.md.
- ✅ Capitolo 10 — Riscrittura direct response (Caples/Hopkins/Ogilvy/Halbert/Kennedy/
  Sugarman): homepage riordinata in 13 sezioni (manifesto NOT/IS scuro, confronto
  etichette 16-vs-3, proof bar a 5 numeri, ruota stagionale in home, lettera di Marco,
  prova sociale col registro batch al posto delle testimonianze), barra di scarsità
  globale sopra la nav (site.js, da mostUrgentFruit), farmer reveal nel picker, headline
  riscritte su order/app/business, nav Season → #season.
  ⚠️ CONTIENE DATI E FOTO SIMULATI marcati data-fake: vedere FAKE-DATA.md.
  IL SITO NON VA PUBBLICATO finché quella lista non è vuota.
- ✅ Capitolo 9 — Motion stile Apple in vanilla (niente Framer/GSAP: vietate dipendenze):
  motion.js = unico gestore animazioni (reveal/fade/zoom/lift/rotate, data-delay/data-dur,
  cascade tile/journey, count-up 100%, parallax hero, linea journey scroll-drawn,
  swapGrids tab picker, swapPanel mese calendario). Curve/durate standard in :root
  (--ease-apple, --dur-fast/med/slow). prefers-reduced-motion rispettato ovunque.

- ✅ How to Order (spec founder 6 ago 2026): pagina conversion sul drop settimanale
  (ordina lun-mar → mangi sab/dom), 6 sezioni direct response (hero, problema,
  processo in 5 step, obiezioni, proof, close), stato finestra + countdown reale,
  ETA del checkout allineata al sabato del drop. In nav e footer.

## Struttura file (HTML puro, struttura PIATTA — conversione a Next.js solo al lancio, non ora)
- index.html, order.html, calendario.html, business.html, story.html, app.html, how-to-order.html
- style.css (nella radice) → TUTTI i token e componenti del design system. Non inventare colori/font nuovi.
- site.js (nella radice) → Nav e Footer globali iniettati su ogni pagina. Modificare SOLO qui nav/footer.
  Contiene anche il LOGO ufficiale: lockup "GELAT + mark + RCHARD" dove la O è il mark SVG
  (arancia --orange, foglia --green, cono a tratto --green-deep) — ricreato dal logo del founder.
  La favicon (stesso mark, data URI) è iniettata da site.js: non aggiungere <link rel="icon"> negli HTML.
- flavors.js (nella radice) → motore stagionale (Gelatorchard.seasonStatus, calendario raccolto UK),
  <FlavorPicker> (opts: max/preselect/summary/onChange → controller get/setMax/clear),
  <SeasonBadge>, dati BATCHES (solo batch confermati dal founder: #042 strawberry).
  Caricarlo PRIMA di site.js nelle pagine che li usano. La logica stagionale vive SOLO qui.
  Slug gusti in inglese: strawberry, raspberry, cherry, blueberry, blackcurrant,
  victoria-plum, apple-pear, quince, rhubarb, chocolate, pistachio, stracciatella, hazelnut.
  Dal Cap. 5 contiene anche: FRUITS (18 frutti del calendario, chiavi tipo rhubarb_forced)
  e windowInfo(start,end,ref) — core stagionale con wrap-around e stati
  active/coming/finished. seasonStatus è costruito sopra windowInfo.
- calendar.js (nella radice) → SeasonWheel + pannello mese di calendario.html.
  I testi narrativa/FOMO per mese vivono qui (MONTH_DATA); i dati stagionali NO (flavors.js).
  Dal Cap. 10 esporta Gelatorchard.renderSeasonWheel (riusata in homepage) e supporta
  il deep-link calendario.html?month=N (0-11).
- home.js (nella radice) → logica solo-homepage (Cap. 10): headline stagione generata
  live, mount della ruota, registro batch, CTA band dinamica. Mai testi statici dove
  esiste il dato calcolato. Dal 6 ago 2026 contiene anche il carosello hero
  "Diario del Raccolto" (#harvest-carousel): NARRATIVO, niente prezzi/CTA ordina,
  una slide per frutto in stagione (seasonStatus decide l'inclusione, la scorta
  solo la riga in coda), citazione contadino solo se batch confermato (fake →
  data-fake), foto da foto-gusti/frutta/<id>.jpg con fallback gradiente .sw-*,
  autoplay 4.5s con pausa hover che conserva il tempo residuo, click/tap slide →
  scroll a #flavors + pulse sulla tile. Scorta: G.stockStatus (flavors.js, in
  preview legge BATCHES.status, al lancio Supabase flavors.stock_status).
  Il picker ha il terzo stato "sold" (grigio caldo #C9C4BC→#A8A296, niente
  timbro, storia consultabile + alert): prima si controlla la stagione, poi
  la scorta. photos.js non riempie più l'hero.
  Dal 7 ago 2026: frase hook sopra il Diario ("Right Now, [N] UK Fruits…",
  N live dalla stessa fonte del carosello) + secondo carosello "Il Viaggio"
  (#journey-carousel) che SOSTITUISCE la vecchia sezione statica journey
  (2.5/10.5.4, rimossa da index.html): ESEMPIO FISSO Fragola/Tom Johnson
  (unico batch reale completo), NESSUNA rotazione sui frutti (la fa già
  il Diario). SEMPLIFICATO il 7 ago 2026: 4 tappe (The harvest / It
  becomes gelato / Ready for you / You eat it), una riga di testo
  ciascuna (.hc-line), NIENTE badge/REC/icone, NIENTE timestamp e
  NESSUNA claim di ore o giorni in questo carosello (il "48h" vive solo
  in proof bar/manifesto, sempre ancorato al campo). Il badge REC con
  orari reali resta esclusivo del Diario. Hook proprio in index.html
  ("From a Real Field to Your Spoon."), approvato dal founder 7 ago 2026.
  REGOLA 48h (resto del sito): le 48 ore sono SEMPRE frutta→freezer,
  mai velocità di consegna dall'ordine — ogni claim va ancorato al campo
  ("from the field"), il sito non deve mai suonare Deliveroo.
  Motore condiviso buildCarousel in home.js. Foto: foto-farmers/<slug>.jpg
  (tappa 1) e foto-gusti/viaggio/{laboratorio,confezione,servito}.jpg.
  Nav/footer "Our Story" → #letter (id story non esiste più).
- photos.js (nella radice) → aggancia foto da assets/ agli slot (hero, unboxing, story);
  segna tutto data-fake + etichetta "Stock photo · bozza". Se il file manca resta il
  segnaposto. FAKE-DATA.md elenca le foto provvisorie e la procedura di rimozione.
- business.js (nella radice) → tab B2B + form preventivi di business.html.
- alerts.js (nella radice) → componente Seasonal Alert List (renderAlertSignup), auto-init
  su #alert-signup (app.html) e #alert-signup-embed (index, calendario). Storage provvisorio
  localStorage gc-alerts {email, fruits[]}; al lancio → Brevo.
- EMAILS.md → template email Brevo (en-GB) + regole di tono 7.5 + doc trigger alertsDue.
- backend.js (nella radice) → adapter Supabase REST, unico punto di contatto col DB.
  Caricato su tutte le pagine dopo flavors.js. Al lancio: compilare SUPABASE_URL,
  SUPABASE_ANON_KEY, ENQUIRY_WEBHOOK_URL (vedi BACKEND.md). Mai chiamare Supabase
  direttamente dalle altre pagine: sempre via GelatorchardBackend.
- backend/schema.sql → schema PostgreSQL/Supabase (Cap. 8.1) + RLS + seed. BACKEND.md
  è la guida di attivazione e la checklist cablaggi al lancio.
- admin.html + admin.js → dashboard interna (8.4), NON linkata dalla nav, noindex.
  In preview legge localStorage (gc-orders/gc-feedback/gc-alerts); al lancio va protetta.
- motion.js (nella radice) → TUTTE le animazioni del sito (Cap. 9). Caricarlo su ogni
  pagina pubblica DOPO gli script di pagina e PRIMA di site.js (scansiona il DOM già
  renderizzato). Nuove animazioni: solo qui, con --ease-apple e le durate standard;
  max 0.8s (unica eccezione: count-up 1.2s da spec). Niente librerie motion esterne.
- order.js (nella radice) → logica di /order: formati (FORMATS con min/max gusti), basket
  (localStorage gc-basket-v1 + gc-fulfilment), checkout. Solo per order.html.
  ETA = sabato del drop settimanale via G.orderWindow (NON più "domani").
- how-to-order.html + howto.js → pagina "How to Order" (drop settimanale, direct
  response): finestra ordini lun 10:00 → mar 18:00, frutta gio sera, produzione ven
  mattina, consegna sab/dom. Il ritmo vive SOLO in Gelatorchard.orderWindow
  (flavors.js): howto.js e order.js lo leggono da lì. Countdown ammesso perché la
  scadenza è reale. Proof numbers marcati data-fake (FAKE-DATA.md); trust line
  Tower Hamlets/SFBB in DA VERIFICARE.
  DECISIONE FOUNDER (opzione B, 6 ago 2026): fuori finestra il checkout NON si
  blocca mai — l'ordine si accoda al drop successivo e il copy lo dichiara
  (pillola [data-drop-status] su how-to-order, /order e picker in home).
  howto.js è condiviso: caricato da order.html e index.html.
  Mai scrivere "closed"/"chiuso" come se il negozio fosse chiuso: è chiusa
  solo la conta della settimana.
  PILLOLA FOMO (scelta founder 8 ago 2026, "combo"): loss-frame con le due
  date reali ("Saturday 15 or Saturday 22: your call" + countdown vivo alla
  chiusura, lecito perché la scadenza è vera), stato .hot ruggine sotto le
  6 ore, riga cap "42 servings per drop · first come, first served".
  AL LANCIO il contatore reale "X of 42 servings left" + barra si accende
  da solo via GelatorchardBackend.dropServingsOrdered (serve la RPC
  Supabase drop_servings, vedi commento in backend.js). MAI numeri
  inventati nel contatore: senza dato reale mostra solo il cap.
- story.js (nella radice) → logica story page (story.html?batch=… / ?flavour=…). I dati batch
  vivono SOLO in Gelatorchard.BATCHES (flavors.js): registro JSON provvisorio, al lancio
  alimentato dal CMS Notion del founder (1 pagina Notion per batch → QR sull'etichetta).
  Mai inventare batch: si aggiungono solo con dati confermati dal founder.
- demo-direzione-precedente.html → vecchia direzione archiviata. NON toccare, NON imitare.
- demo-registro.html → DEMO della direzione di stile "Il Registro" (documentary/
  spec-sheet, 8 ago 2026): una sezione (picker-schedario + drop docket), self-
  contained, dati reali da flavors.js, IBM Plex Mono per i dati.

## MIGRAZIONE STILE "IL REGISTRO" — APPROVATA (founder, 8 ago 2026)
Il founder ha approvato la migrazione del sito alla direzione della demo
(demo-registro.html) con un vincolo ASSOLUTO: **COPY CONGELATO — nessuna
parola dei testi va cambiata in questa fase**, solo pelle (CSS, markup
minimo, font). STATO: MIGRAZIONE COMPLETATA — tutte e 3 le tappe fatte
e PUSHATE l'8 ago 2026 (live su GitHub Pages; remote riallineato:
origin era uno snapshot manuale del 4 ago, sostituito con force-push
autorizzato dal founder; URL repo ora ChatGPTMarco/gelatorchard-site).
Piano a 3 tappe, checkpoint col founder dopo ognuna:
1. ✅ Fondamenta globali (fatta, zero testi toccati): token in style.css
   (--bg → carta #FAF8F2, --mono IBM Plex Mono aggiunto al link Google
   Fonts di tutte le 8 pagine incluso admin, --radius → 0, --line → .16,
   --shadow → piastra 5px 5px 0, trama millimetrata sul body), .pill →
   bottone da modulo (mono uppercase, bordo 1.5px, niente scale hover;
   classi invariate), .card e hero-visual/unbox-visual bordo ink e
   angoli netti (cta-band squadrata), nav → carta intestata (fondo
   carta pieno senza blur, riga ink 1.5px, link mono uppercase, menu
   mobile allineato), barra scarsità in mono (colori/soglie invariati),
   drop docket [data-drop-status] → documento (bordo ink, orologio
   mono, riga cap mono uppercase con riga tratteggiata). howto.js,
   site.js e tutti i motori JS INTOCCATI.
2. ✅ Picker → schedario (fatta): .tile = specimen card (scheda bianca
   bordo ink, foto con riga di separazione, nome Fraunces, meta/farmer
   reveal in mono, casella di spunta ::before con ✕, link a striscia
   in fondo, hover lift + ombra dura, timbro double-border ruggine);
   griglia auto-fill minmax(230px,1fr); tab Frutta/Classici a
   linguette mono. UNICI testi toccati (autorizzati dal piano, come
   in demo): link scheda → "Full record #NNN →" quando il batch è
   pubblicato (href ?batch=) e "Alert me when it returns →" al posto
   di "Tell me when it's back →"; tutto il resto del copy intatto.
   Formati home → listino (tag tratteggiato mono, prezzo mono su riga
   tratteggiata), prova sociale → registro (batch-log libro mastro
   ink+mono, cold-cell tratteggiate con numeri mono, t-who mono),
   caroselli → schede (kicker/meta/scorta in mono, citazioni e righe
   del Viaggio restano serif, frecce/dot squadrati). Motori JS intatti
   salvo le 3 stringhe-link in tileHTML (flavors.js).
3. ✅ order.html → modulo d'ordine (fatta, solo CSS, zero testi):
   fmt-tab linguette mono, ticket batch a riga di registro, price-block
   bordo ink con prezzo mono, basket drawer (item squadrati, qty-btn
   quadrati, fulfilment mono, totali mono con riga tratteggiata),
   checkout-card bordo ink, field-label mono uppercase, field-input
   caselle 1.5px ink, notice tratteggiate, paybtn mono, done-steps
   quadrati, select Kit mono. Story → FULL RECORD: story-head carta
   con riga ink (via blur), sh-* mono e segmenti quadrati, data-list
   tabella campi mono k/v, prod-log orari mono, .qc timbrini quadrati,
   sc-kicker mono, foto/mappa bordo ink. Calendario: cp-level/h4/
   fr-state/fl-badge mono, stamp-inline double-border, barre squadrate,
   testi ruota SVG in mono. Business: eredita flavor-tab/checkout-card/
   field. Alerts: fcheck squadrate, fc-range mono. How-to-order:
   drop-step bordo ink, ds-num quadrato, ds-day mono. Globali: eyebrow
   e mf-kicker in mono, badge-soon e photo-tag squadrati. Citazioni,
   lettera e story-quote restano serif (guardia anti-freddezza).
Principi: Fraunces resta la voce umana (lettera, headline), monospace SOLO
per i dati, frutta unico colore saturo, timbri --stamp per stagioni/urgenza,
guardia anti-freddezza (se sembra una bolletta, scaldare). Tutti i motori
JS restano intoccati. La demo è il riferimento visivo vincolante.
- Deploy: GitHub Pages dal branch main → ogni push è live su https://chatgptmarco.github.io/gelatorchard-site/
- CACHE-BUSTING (8 ago 2026, obbligatorio): tutti i <script src> e il
  <link> di style.css portano ?v=rN (ora r3). GitHub Pages serve i file
  con max-age=600 e i telefoni tengono i .js vecchi anche oltre: senza
  bump i fix arrivano tardi o mai. QUANDO SI DEPLOYA una modifica a
  js/css, INCREMENTARE la versione in TUTTE le 8 pagine (perl one-liner:
  s/v=r3/v=r4/g). I nomi file restano invariati.

## Design system (vincolante)
- Stile: Apple minimal, light mode. bg #FBFBF9, verde brand #2D7A4A, arancio #E8934A, ink #1D1D1F.
- Font: Fraunces (titoli) + Inter (UI). Bottoni a pillola (radius 100px). Card radius 22px.
- Niente dark theme, niente kraft/rustico, niente glassmorphism/shaders.
- Flavor Picker = elemento signature: tile con gradienti colore-vero (classi .sw-* in style.css),
  da sostituire con foto prodotto reali quando disponibili.

## Due collezioni (mai separarle su pagine diverse — sempre tab nello stesso posto)
- FRUTTA: solo stagione UK, il gusto sparisce a fine stagione (scarsità reale).
  Fragola giu-set, Lampone giu-ott, Ciliegia giu-lug, Mirtillo lug-set, Ribes Nero giu-lug,
  Susina Victoria ago-set, Mela/Pera set-nov, Cotogna ott-nov, Rabarbaro forzato dic-mar.
- CLASSICI: Cioccolato Fondente, Pistacchio, Stracciatella, Nocciola — sempre disponibili.

## Prezzi (fissi, non inventarne altri)
Coppetta £3.50 · Pallina 120g £5.50 · Doppia 240g £8.50 · Sacapoche da £6.50 ·
GELATO KIT (prodotto di punta) £28 pickup / £34 delivery · Multipack 4 £12 · Family Tub 1L £22 ·
Premium Gift Box £28.50

## PIANO DI PRODUZIONE (8 ago 2026 — vedi PRODUZIONE.md, che PREVALE sui capitoli)
Situazione reale: NIENTE Trittico, macchina professionale da banco da 750g/ciclo.
- 1 porzione = 125g. Moduli esatti del ciclo: 750g = 6 coppette = 3 sacapoche da 250g.
- Formati: Cup 125g · Sacapoche 250g (2 porzioni) · Multipack 4×125g ·
  Family Tub 750g (una mantecata) · KIT per persone: 250g a testa, max 2 gusti,
  taglie 2/3/4/6 (menu a tendina in order.js, KIT_SIZES; default per 4).
- Prezzi Kit dall'ANALISI COSTI (COSTI.md): £25/30/38/50 DELIVERED,
  CONFERMATI dal founder l'8 ago 2026 (il £38 per-4 incluso). Coppetta
  £3.50 confermata (food cost 15%). IVA: gelato sempre standard-rated
  20%, ma sotto soglia £90k non si applica.
- DECISIONI FOUNDER 8 ago 2026 (vincolanti): SOLO DELIVERY, niente
  pickup (toggle rimosso da order); giro del SABATO su Canary Wharf,
  Poplar e South Quay (E14) — risponde alla vecchia domanda aperta
  sulle zone; NESSUN minimo d'ordine; ghiaccio secco SOLO nel Kit box,
  borsa frigo + siberini per le consegne piccole. Cap onesto dichiarato
  sul sito: 42 porzioni per drop (how-to-order, step 1).
- Capacità: ven 07-15, tetto 8 cicli, piano vendita 7 cicli = 5.25kg = 42
  porzioni/drop; max 6 gusti per drop; eccedenze → drop successivo (opzione B).
- Formula del martedì sera e timeline gio-sab in PRODUZIONE.md.
- REGISTRO BATCH (PRODUZIONE.md §7): 1 batch = 1 gusto × 1 drop; numero
  progressivo assegnato mar 18:00, chiuso all'ultima consegna, story page
  eterna. Log a due metà: dati raccolta dal contadino via WhatsApp
  (template nel §7), dati lab da Marco. Precisione log = precisione
  filiera, mai di più (niente ora di raccolta se si compra da intermediario).
- Log batch in flavors.js riscritti sul piano reale (cicli 750g, fornello,
  gio sera→ven). "12L"/Trittico non esistono più finché non arriva il Trittico.

## Regole di copy (VINCOLANTI)
0. DECISIONE FOUNDER (8 ago 2026): sul sito pubblico MAI specificare la
   capacità produttiva per ciclo ("750g alla volta", "bench machine",
   "N cycles") — suona amatoriale. Il cap "42 servings per drop" RESTA
   (scarsità vera). Il 750g sopravvive solo come taglia del Family Tub
   (spec di prodotto). Vale per copy, log batch e story page; i numeri
   veri restano in PRODUZIONE.md/COSTI.md (interni).
1. Specificità, non aggettivi: "Tom Johnson, Woodchurch, Kent, raccolto 15 maggio 06:12" — mai "ingredienti freschi".
2. NIENTE numeri inventati (pre-lancio): no recensioni finte, no "X ordini", no press bar fake.
   Solo claim verificabili: 3 ingredienti, 100% frutta UK di stagione, tracciabilità batch.
3. Il cliente è l'eroe; Marco e i contadini sono personaggi di supporto.
4. Scarsità solo se ancorata a date/stagioni reali. Mai countdown finti.
5. VIETATE le parole "abbonamento/subscription/member" → usare "Seasonal Alert List" (notifica gratuita).

## PROSSIMI PASSI (stato al 5 agosto 2026 — aggiornare man mano)
Lista A: fatti i punti 1, 2, 4, 5, 6 (5 agosto 2026, "vai" del founder, FAQ rimandate):
1. ✅ Picker da tastiera: tile role="checkbox" tabindex=0, Enter/Spazio, aria-checked,
   focus ring in style.css; tile fuori stagione aria-disabled e non focusabili.
2. ✅ Barra di scarsità a soglie (site.js): >21gg tono "picco" (endLong, flag peak da
   mostUrgentFruit), 8–21gg countdown in giorni, ≤7gg classe .sb-last rosso ruggine
   (--stamp) con copy perentorio. Sempre e solo date reali.
3. ⏳ Scheletro FAQ/consegna/allergeni (risposte vere di Marco = campi "da confermare";
   allergeni COMPLETI = bloccante per il lancio, obbligo UK vendita a distanza) — DA FARE
4. ✅ Open Graph su tutte le pagine pubbliche (admin escluso): og:title/description/url/
   locale/site_name + twitter:card + canonical. og:image = assets/hero-gelato.jpg (stock,
   annotato in FAKE-DATA.md: si sistema sostituendo il file a parità di nome).
5. ✅ Hook analytics: analytics.js (stub locale gc-analytics max 300 eventi, console.debug,
   send() vuota da compilare col provider al lancio). Via dichiarativa [data-track] su CTA
   chiave (hero, nav, cta band, barra scarsità, picker continue) + via programmatica
   Gelatorchard.track in order.js (add_to_basket/checkout_start/order_submitted),
   flavors.js (picker_select) e backend.js (alert_subscribe/feedback_submit/enquiry_send).
6. ✅ Contrasto manifesto: .mf-no a opacità .72 (home, ~9:1) e .no-line a --ink-soft
   (checkout, ~5.9:1), entrambi sopra WCAG AA.
Decisione rimandata dal founder: "dieta homepage" 13→9 sezioni, claim deduplicati,
manifesto checkout differenziato da quello in home (farla come mini-capitolo a parte).
Domande aperte per Marco: matrice allergeni + contaminazione incrociata, zone/giorni
consegna Londra, contatti reali footer (ora #), account analytics, numero vero batch.
Server locale: python -m http.server 8000 nella cartella; ricordare Ctrl+F5 (cache).

## Interventi dell'8 agosto 2026 (dalla critica spietata, approvati dal founder)
- Badge REC ELIMINATO (suggeriva "in diretta" su date vecchie); date batch ora
  DEMO DINAMICHE: demoBatchDates in flavors.js le riallinea all'ultimo drop
  (gio raccolta / ven produzione). Date vere del #042 in FAKE-DATA.md.
- Dieta hero: headline + UN hook + Diario. Il Viaggio vive nella sezione
  #journey (ex journey statica), con il suo hook.
- Pillola stato drop [data-drop-status] anche nella sec-head del picker in
  home (howto.js caricato pure su index.html).
- Panel pre-lancio (spec 2.9) reintrodotto: #testimonials dopo #proof, 4 card
  data-fake + nota obbligatoria "pre-launch tasting panel".
- MOBILE: hamburger in site.js (.nav-burger + pannello .nav-mobile <760px).
- Caroselli: foto lazy + autoplay solo in viewport (IntersectionObserver),
  Enter/Spazio sulla slide attiva = click (tabindex sulla slide visibile).
- SEO: sitemap.xml + robots.txt (admin esclusa) + JSON-LD (IceCreamShop in
  home, Product Gelato Kit su /order — MAI rating finti).
- Barra scarsità: ricalcolo ogni 30 minuti (tab aperte a cavallo di mezzanotte).
- CHECKLIST LANCIO: canonical, og:url, sitemap.xml e JSON-LD url puntano a
  chatgptmarco.github.io/gelatorchard-site → sostituire TUTTI col dominio vero.
- Classici senza foto nel picker: scelta founder, per ora restano gradienti.
- DIETA HOMEPAGE 14→9 (approvata e applicata 8 ago 2026): etichette DENTRO
  il manifesto scuro (ancora #labels sulla labels-grid), proof bar a 5
  numeri FUSA in #proof (cold-grid a 8 celle senza duplicati), panel
  testimonials FUSO in #proof (ancora #testimonials sulla testi-grid,
  blockquote assorbite nelle card), sezione #alerts RIMOSSA dalla home
  (iscrizione su app.html/calendario; CTA band → app.html), unboxing
  DENTRO #formats. Sezioni finali: hero, manifesto, season, flavors,
  letter, journey, formats, proof, cta band.
- REGOLA ACCENTI (in :root di style.css): verde = azione/stato, arancio =
  identità/calore (logo, mf-kicker, IS, stelle), stamp = urgenza/scarsità.
  Eccezione: scale semaforiche data-viz (.season-fill). Barra porzioni
  drop card ora verde; .cp-fomo ora stamp; .tile.soldout (morta) rimossa.
- MANDATO CRO (8 ago 2026, "applica come skill il CRO Designer"): HERO
  FLIP fatto — ordine: eyebrow, H1, sub, CTA (primaria → #flavors,
  data-track hero_cta_flavours) + riga fiducia .hero-trust (soli claim
  reali), carosello DENTRO la piega (margin 34px), hook a didascalia
  sotto. Deep-link ?format=cup|bag|kit|multipack|tub su /order (message
  match dalle card formati e dalla CTA post-lettera "a Cup is £3.50").
  Card bag in home corretta a 250g.
- Restano compiti del founder (asset fisici): video 15s, foto vere,
  contatti reali footer.
- ETICHETTE REALI (fix founder, 8 ago sera): il confronto etichette in
  #labels è ora un VERO back label UK — "Ingredients:" in paragrafo
  fitto giustificato (non elenco puntato), allergeni (milk) in
  grassetto da norma EU, righe Storage/Best before, piede con
  "500ml ℮"+barcode CSS (industriale) vs "Batch & farmer: on every
  bag"+QR CSS (nostra). NIENTE tabella nutrizionale: numeri inventati
  vietati. Copy aggiunto dal redesign (approvabile dal founder):
  "Storage: keep frozen at −18°C." / "Best before: see base of tub."
  / "Best before: this weekend." / "Batch & farmer: on every bag".
  I tre lo-word grandi e la lo-note restano identici.
- MOBILE UX PICKER (fix founder, post-migrazione): (1) barra scarsità
  mai troncata su mobile — va a capo, site.js pubblica l'altezza vera
  in --sb-h e nav/story-head la usano per gli offset sticky; (2) campo
  "Grown by…" (.t-farmer) SEMPRE visibile sulle schede, non più
  reveal-alla-selezione (il contadino è la promessa, non un premio);
  (3) .picker-dock: su <760px al primo gusto scelto sale una barra
  fissa in basso (stile .form-action della demo, NIENTE popup) con
  gusti selezionati live e la stessa CTA del riepilogo — stringhe
  riusate, zero copy nuovo; solo home (showSummary), aria-live.
  NB: il dock viene SPOSTATO su <body> da renderFlavorPicker — dentro
  #flavor-picker il transform della .reveal (motion.js) diventa il
  containing block del position:fixed e il dock si incolla alla
  sezione invece che allo schermo (bug intermittente trovato dal
  founder). Se si tocca il render del picker, il dock deve restare
  figlio diretto di <body>.
- ATTERRAGGIO goto=size (fix founder, post-migrazione): le CTA del
  riepilogo picker e del dock mobile linkano order.html?flavours=…
  &goto=size; order.js con quel parametro (e gusti preselezionati)
  scrolla su #op-price ("Who's it for?") con pulse verde sul menu
  taglie (.kit-people.pulse, keyframes tile-pulse riusati; rispetta
  prefers-reduced-motion). La barra scarsità continua a linkare senza
  goto: chi arriva da lì non ha ancora confermato i gusti.
  RAFFINATO (8 ago sera, fix founder): block:'start' + scroll-margin-top
  su #op-price (nav+barra via --sb-h) così la sezione parte dall'INIZIO
  con la domanda in vista, non centrata sul prezzo. Il dock vive ANCHE
  su /order (opts.dock + opts.onDockCta in renderFlavorPicker): chi
  cambia gusti dopo l'atterraggio ritrova la barra, la cui CTA lì non
  naviga ma scrolla al modulo taglia (jumpToPrice, smooth per i click,
  instant per gli atterraggi automatici). Visibile solo sul tab Kit
  (syncDockFormat). Con dock aperto il basket-fab si alza
  (.gc-dock-on su body, settato da updateDock() in flavors.js).
  ANTI-RIDONDANZA (fix founder, 8 ago sera): il dock SPARISCE quando
  il suo bersaglio è già in vista — su /order #op-price
  (opts.dockHideNear), in home il riepilogo .kit-summary — e riappare
  risalendo al picker. Scroll listener passivo + getBoundingClientRect
  (niente IntersectionObserver: #op-price viene ri-renderizzato a ogni
  refresh e l'observer perderebbe il nodo).
  TUTTI I FORMATI (fix founder, 8 ago sera): il dock vive anche su
  Cup/Piping Bag/Multipack/Family Tub — etichetta = FORMATS[..].name,
  CTA generica "Continue →" (unico copy nuovo), atterraggio su
  #op-tickets (gusti scelti) con riquadro formato e Add to Basket
  sotto, pulse su #op-add invece che sul menu taglie. Il Kit tiene
  etichetta/CTA/atterraggio suoi (taglia). syncDockFormat non nasconde
  più il dock fuori dal Kit: aggiorna etichetta e CTA.
- ADD ≠ CHECKOUT (fix founder, 8 ago sera): l'Add to Basket NON apre
  più il drawer (anti-pattern: sbatteva l'utente sul checkout dopo un
  solo Cup). Dopo l'Add: selezione svuotata via picker.clear() (la
  hint torna "Select a flavour to continue", si può scegliere il
  prossimo gusto/formato), fab Basket col conteggio + pulse. Il
  drawer si apre SOLO dal bottone Basket.
- TIMBRI PICKER (fix founder, post-migrazione): il timbro delle tile
  fuori stagione vive FUORI dalla .swatch (dentro ereditava grayscale
  +opacity della foto e spariva); niente mix-blend, inchiostro ruggine
  su tassello carta .94, centrato sulla fascia foto (top 60px). Le
  tile sold ora hanno il timbro "Sold out" (senza data: la regola
  resta che non si promette una data di rifornimento ignota).

## Metodo di lavoro
- Modifiche chirurgiche, mai rigenerare file interi senza necessità.
- Ogni capitolo nuovo arriva come specifica dal founder: implementarlo senza stravolgere i precedenti.
- Mantenere aggiornata la checklist "Stato build" qui sopra a fine capitolo.
