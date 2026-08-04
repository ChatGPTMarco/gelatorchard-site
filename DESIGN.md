# Gelatorchard — Design System del sito

Decisione: 2026-08-04 · Fonte: analisi componenti 21st.dev + positioning map

## Verdetto
21st.dev non offre template completi ma ~30 categorie di componenti React/Tailwind (shadcn-based). Il "modello" scelto è un'architettura composta, stile **editoriale-fotografico** (non SaaS/tech): la fotografia della frutta vera è il design, coerente con il posizionamento "True Fruit Gelato / Radical Transparency".

## Stack componenti raccomandato

| Sezione | Componente 21st.dev | Ruolo |
|---|---|---|
| Hero | Responsive Hero Banner (full-bleed foto) — https://21st.dev/@sensewood8/components/responsive-hero-banner | Frutta fresca a schermo pieno + claim "No powders. No purees. No secrets." |
| Storia filiera | Timeline (Manu Arora, scroll-based) — https://21st.dev/@manuarora700/components/timeline | Narrazione "Field to freezer in 48 hours" |
| Gusti stagionali | Dynamic Frame Layout — https://21st.dev/@oeneco/components/dynamic-frame-layout | Griglia gusti con provenienza (Kent strawberries ecc.) |
| Social proof | Testimonial Cards — https://21st.dev/@vaib215/components/testimonial-cards | Recensioni + UGC #TrueFruitGelato |
| Partner agricoli | Marquee (categoria /s/marquee) | Loghi/nomi aziende agricole |
| Trasparenza | Comparison (categoria /s/comparison) | "Noi vs gelaterie tradizionali": etichetta 3 ingredienti |
| CTA/FAQ/Footer | Categorie /s/cta, /s/faq, /s/footer | Ordina/delivery, allergeni, HFSS |

## Da evitare
Shaders, gradient/glassmorphism, dark theme tech, 3D pesanti: linguaggio SaaS che contraddice naturalezza e colori autentici della frutta; penalizzano anche performance mobile (target Instagram/TikTok).

## Direzione visiva
- Sfondo chiaro caldo (crema `#FAF5EC` / carta `#F3ECDD`), testo inchiostro `#2B241E`
- Colori accent presi dalla frutta di stagione: fragola `#D94F35`, pesca `#E89A5B`, lampone `#B33A5B`, ribes nero `#4A3457`, foglia `#5A7A4F`, limone `#E5C34A`
- Tipografia: serif editoriale **Fraunces** per titoli e claim, **Inter** per testo
- Foto macro reali della frutta (no illustrazioni); il menu cambia palette con le stagioni — la stagionalità è una feature del design

## Stato attuale
- `index.html` = v1 one-page autonoma (implementa tutte le sezioni sopra)
- Segnaposto da sostituire con dati reali: nomi fattorie, % frutta, recensioni, indirizzo, link delivery/social

## Messaggi chiave del brand (dal positioning)
- USP: unica gelateria di Londra con FRUTTA FRESCA DI STAGIONE come ingrediente principale in ogni gusto
- "Others say fresh ingredients, we say FRUIT."
- Etichetta più corta di Londra: frutta fresca, zucchero di canna, acqua
- Sorbetti = naturally vegan, allergen-free by nature, non-HFSS
- "Field to freezer in 48 hours" · "When it's gone, it's gone" (FOMO stagionale)
