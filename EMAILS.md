# Gelatorchard — Email System (Capitolo 7)

Template pronti da incollare in Brevo. Le email ai clienti sono in **inglese britannico**
(regola di lingua del sito). I segnaposto sono tra parentesi quadre: `[Name]`, `[N]`,
`[Fruit]`, `[Batch #0XX]` — Brevo li sostituisce con i campi contatto/automation.

## Regole di tono (7.5 — valgono per OGNI email)
1. Firma sempre **"— Marco"**, mai "The Gelatorchard team": voce personale, non aziendale.
2. Ogni email contiene almeno un dato specifico e verificabile (nome, luogo, orario, numero).
3. Nessuna email vende "il gelato": vendono la storia/relazione; il prodotto è la conseguenza.
4. P.S. quasi sempre presente — è il posto del dettaglio più umano.
5. MAI le parole "subscription", "sign up and save", "recurring plan" — solo
   "seasonal alerts", free, no commitment.

## Trigger (collegati al motore stagionale del sito)
`Gelatorchard.alertsDue(date)` in `flavors.js` restituisce ogni giorno:
- `lastCall`: gusti in stagione con **≤7 giorni rimasti** → email 7.3 agli iscritti che seguono quel frutto
- `seasonEntry`: gusti la cui stagione **apre oggi** → email 7.4 agli iscritti che seguono quel frutto

Al lancio: job giornaliero (Brevo automation / piccolo cron) che chiama questa logica
(stessa tabella stagionale del sito — non duplicare le date in Brevo) e smista sulle liste.
Modello dati iscrizioni (`alert_subscriptions`): `user_email`, `fruits_followed[]`
(slug inglesi: strawberry, raspberry, cherry, blueberry, blackcurrant, victoria-plum,
apple-pear, quince, rhubarb). Il form del sito (alerts.js) produce esattamente questo shape.

---

## EMAIL 1 — Meet the farmer (lunedì mattina)
**Subject:** Tom was up at 5 this morning picking your strawberries

Hi [Name],

At 5:30 this morning I met Tom Johnson at New Covent Garden market.

He'd been up since 5, picking strawberries on his farm in Kent.

"Best season in three years," he told me, holding a berry the size of a walnut.

I asked him: "Why are you here at 5:30 on a Monday?"

He said: "Because if the fruit isn't picked at peak ripeness, it isn't worth eating."

I bought all his best strawberries.

By 7 tonight, they'll be in your freezer.

THIS IS THE PROMISE:

You won't be buying "gelato". You'll be buying Tom's strawberries, frozen at the exact
moment of their ripeness. You'll know his name. You'll see his farm. You'll know exactly
when it was made.

[ORDER BATCH #042]

— Marco

P.S. — Strawberry season ends in September. If you love this batch, fill the freezer
while it lasts.

---

## EMAIL 2 — Feedback request (venerdì sera, dopo la consegna)
**Subject:** You might hate this batch. Please tell me.

[Name],

Your Batch #042 arrived about an hour ago.

Before you taste it, I want to tell you something:

If this isn't the best gelato you've ever tasted, tell me.

Not "it's fine". Not "nice".

I want to know: does it taste of real strawberry, or of sugar?

Is the texture right, or grainy?

Is the flavour intense, or flat?

Because I can improve. Tom can improve. I can improve. But only if you're honest.

SCAN THE QR and rate your batch.

5 stars? Perfect — I read every comment and reply.
4 stars? I look at your feedback and adjust the next recipe.
3 stars or less? I message you directly to make it right.

This isn't a business. It's a relationship.

— Marco

P.S. — Seriously. If it isn't perfect, say so. We'd rather fix it now than lose you later.

---

## EMAIL 3 — Next batch preview (domenica sera)
**Subject:** Next up: meet Louise (Raspberry, Scotland 🫐)

Hi [Name],

Batch #042 is done. [N] five-star ratings.

Thank you for tasting real fruit. Thank you for knowing Tom.

Next week, we introduce you to Louise.

LOUISE ANDERSON
Scottish Borders, raspberry farm (fourth generation)

"This year's crop has come in sweet and firm. Best yield in five years."

I'm meeting her Monday at 5:30 at the market.

Batch #045 — Glen Ample Raspberry — is on its way.

[PRE-ORDER BATCH #045]

Don't want to miss a fruit? Join the seasonal alerts — free, no commitment: [Join →]

— Marco

P.S. — Louise's raspberries have a shorter season than you'd think. When her last
pick happens, the alert list hears about it first. That's the whole system.

---

## EMAIL 7.3 — Last call (trigger: ≤7 giorni alla fine stagione di un frutto seguito)
**Subject:** Last week of English strawberries. Then: June [next year].

[Name],

Tom called me this morning.

"Last pick of the season," he said. "After this one, we wait for next June."

This is the last strawberry batch of [year].

There won't be any more until next summer. Not for a month. For eleven months.

If you want the taste of the English summer in your freezer, this is the last call.

[ORDER THE LAST BATCH — Kent Strawberry, final edition [year]]

— Marco

P.S. — Save one for Christmas. You'll remember today.

> Nota: oggetto e corpo vanno generati col frutto/farmer del trigger; l'anno di ritorno
> arriva da `seasonStatus().returnMonthYear` — mai hardcodare l'anno.

---

## EMAIL 7.4 — Season entry (trigger: giorno 1 di stagione di un frutto seguito)
**Subject:** 🍓 [Fruit] has just come into season

Hi [Name],

You follow [Fruit] on your alert list — and it's just arrived.

[Short farmer/farm intro, 2–3 sentences in Marco's voice — specific: name, place, time.]

[ORDER BATCH #0XX]

— Marco
