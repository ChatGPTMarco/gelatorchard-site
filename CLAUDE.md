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
- ✅ Capitolo 9 — Motion stile Apple in vanilla (niente Framer/GSAP: vietate dipendenze):
  motion.js = unico gestore animazioni (reveal/fade/zoom/lift/rotate, data-delay/data-dur,
  cascade tile/journey, count-up 100%, parallax hero, linea journey scroll-drawn,
  swapGrids tab picker, swapPanel mese calendario). Curve/durate standard in :root
  (--ease-apple, --dur-fast/med/slow). prefers-reduced-motion rispettato ovunque.

## Struttura file (HTML puro, struttura PIATTA — conversione a Next.js solo al lancio, non ora)
- index.html, order.html, calendario.html, business.html, story.html, app.html
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
- story.js (nella radice) → logica story page (story.html?batch=… / ?flavour=…). I dati batch
  vivono SOLO in Gelatorchard.BATCHES (flavors.js): registro JSON provvisorio, al lancio
  alimentato dal CMS Notion del founder (1 pagina Notion per batch → QR sull'etichetta).
  Mai inventare batch: si aggiungono solo con dati confermati dal founder.
- demo-direzione-precedente.html → vecchia direzione archiviata. NON toccare, NON imitare.
- Deploy: GitHub Pages dal branch main → ogni push è live su https://chatgptmarco.github.io/gelatorchard-site/

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

## Regole di copy (VINCOLANTI)
1. Specificità, non aggettivi: "Tom Johnson, Woodchurch, Kent, raccolto 15 maggio 06:12" — mai "ingredienti freschi".
2. NIENTE numeri inventati (pre-lancio): no recensioni finte, no "X ordini", no press bar fake.
   Solo claim verificabili: 3 ingredienti, 100% frutta UK di stagione, tracciabilità batch.
3. Il cliente è l'eroe; Marco e i contadini sono personaggi di supporto.
4. Scarsità solo se ancorata a date/stagioni reali. Mai countdown finti.
5. VIETATE le parole "abbonamento/subscription/member" → usare "Seasonal Alert List" (notifica gratuita).

## Metodo di lavoro
- Modifiche chirurgiche, mai rigenerare file interi senza necessità.
- Ogni capitolo nuovo arriva come specifica dal founder: implementarlo senza stravolgere i precedenti.
- Mantenere aggiornata la checklist "Stato build" qui sopra a fine capitolo.
