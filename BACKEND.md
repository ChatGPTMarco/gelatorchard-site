# Gelatorchard — Backend e integrazione operativa (Capitolo 8)

Il sito è statico (GitHub Pages): il backend è Supabase, agganciato tramite
`backend.js` (adapter unico). Finché le costanti non sono compilate, il sito
gira in "pre-launch preview" e nulla viene inviato.

## Attivazione (checklist per Marco, ~15 minuti)
1. Creare il progetto su https://supabase.com (account del founder).
2. SQL Editor → incollare ed eseguire `backend/schema.sql` (tabelle + RLS + seed
   già pronti: 13 gusti, 5 formati, Tom Johnson, Batch #042).
3. Settings → API → copiare Project URL e anon public key.
4. In `backend.js` compilare `SUPABASE_URL` e `SUPABASE_ANON_KEY`. Push. Fine:
   ordini, feedback e iscrizioni alert scrivono nelle tabelle e i banner
   "pre-launch preview" spariscono da soli sulle conferme.
5. (B2B) Compilare `ENQUIRY_WEBHOOK_URL` con un webhook Zapier/Make/Brevo che
   inoltra a email/Slack di Marco — il form /business non ha tabella (per spec).

Sicurezza: la anon key è pubblica per design; le policy RLS nello schema
limitano il pubblico a INSERT (orders, order_items, feedback, alert_subscriptions)
e SELECT dei soli dati di catalogo (flavors, product_formats, farmers, batches
disponibili). Letture admin → SOLO service role key, mai nel frontend.

## Mappa touchpoint → tabelle
| Touchpoint sito | Adapter | Tabelle |
|---|---|---|
| /order conferma (order.js) | submitOrder | orders + order_items (1 riga orders per formato; qty N = N righe) |
| /story feedback (story.js) | submitFeedback | feedback (lookup batch_number → batch_id) |
| Alert list (alerts.js) | subscribeAlerts | alert_subscriptions (1 riga per frutto) |
| /business form (business.js) | sendEnquiry | nessuna tabella → webhook notifica |

Limite noto del modello spec: `orders` non ha quantità né `order_items` — il sito
invia N righe `orders` per qty N. Se diventa un problema, aggiungere `quantity`.

## Integrazione Notion (8.2 — CMS story page)
- Database Notion con le stesse proprietà di `batches` (batch_number, frutto,
  farm ecc.); ogni riga = 1 pagina con Sezione 0 + 4 capitoli (Cap. 4).
- Flusso: Marco pubblica la pagina Notion → webhook/polling aggiorna `batches`
  (`notion_page_url`, `status='disponibile'`) → QR generato dall'URL → etichetta.
- Il frontend oggi legge da `Gelatorchard.BATCHES` (flavors.js): al lancio quel
  registro va alimentato da `batches` (fetch alla pagina story) o rigenerato in
  build. Preferire la cache locale a chiamate Notion runtime (velocità).
- ⚠️ Vincolo del giovedì: la pagina Notion DEVE essere pubblicata e il QR
  generato PRIMA dell'assemblaggio del giovedì pomeriggio, o l'etichetta non
  ha destinazione.

## Ritmo settimanale (8.3) — cosa tocca il sito
- LUN 5:30–9:30: mercato + produzione → nessuna azione sito (lavoro fisico/Notion).
- GIO pomeriggio: QR + etichette + assemblaggio Kit. Collo di bottiglia reale:
  8–10 min a Kit → oltre ~25 Kit/settimana si sfora la finestra di 2 ore.
  La dashboard admin lo calcola e lo segnala (admin.html).
- VEN: consegne + email 2 (feedback) + scansioni QR → tabella feedback si popola.

## Dashboard admin (8.4 — admin.html, NON linkata dalla nav)
Viste: batch della settimana, ordini (con contatore assemblaggio Kit del
giovedì), feedback da rispondere (≤4 stelle evidenziati), iscritti alert per
frutto (segnale di domanda pre-ordine dal contadino).
Oggi legge i dati di test locali (localStorage); al lancio: collegarla a
Supabase (service role via piccolo backend o Supabase Auth) e metterla dietro
login. NON pubblicarla così com'è con dati reali.

## Riepilogo cablaggi al lancio (tutti i capitoli)
1. Supabase: costanti in backend.js (questo doc).
2. Stripe su /order (Cap. 3) — sostituire il Pay preview + rimuovere i 2 banner.
3. Brevo: liste + job giornaliero su `Gelatorchard.alertsDue()` (Cap. 7, EMAILS.md).
4. Webhook enquiries B2B (Cap. 6).
5. Numero WhatsApp di Tom in story.js (wa.me/<numero>?text=...).
6. Foto reali: hero fragola, box kraft, Tom nel campo, Marco in lab, video 15s.
7. Notion CMS batch + QR (questo doc, sezione Notion).
8. Proteggere admin.html.
