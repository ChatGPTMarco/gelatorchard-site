-- ============================================================
-- GELATORCHARD — Schema PostgreSQL (Supabase) · Capitolo 8.1
-- Da eseguire nel SQL Editor di Supabase (progetto del founder).
-- Schema fedele alla spec; le aggiunte non-spec sono marcate [+].
-- ============================================================

-- Contadini/aziende agricole
CREATE TABLE farmers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,               -- "Tom Johnson"
  farm_name TEXT NOT NULL,          -- "Johnson's Farm"
  location TEXT NOT NULL,           -- "Woodchurch, Kent"
  certification TEXT,               -- "Red Tractor Assurance"
  bio TEXT,
  photo_url TEXT,
  whatsapp_number TEXT
);

-- Gusti (entrambe le collezioni)
CREATE TABLE flavors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,               -- "Strawberry" / "Pistachio" (nomi EN = sito)
  collection TEXT NOT NULL CHECK (collection IN ('frutta','classici')),
  fruit_key TEXT,                   -- slug stagionale del sito (flavors.js), NULL se classici
  swatch_gradient TEXT,             -- classe swatch del sito (es. "sw-strawberry")
  always_available BOOLEAN DEFAULT FALSE
);

-- Batch (solo collezione frutta ha batch)
CREATE TABLE batches (
  id SERIAL PRIMARY KEY,
  batch_number TEXT UNIQUE NOT NULL,  -- "042"
  flavor_id INT REFERENCES flavors(id),
  farmer_id INT REFERENCES farmers(id),
  harvest_date TIMESTAMP,
  harvest_time TEXT,                  -- "06:12"
  production_date TIMESTAMP,
  production_log JSONB,               -- array di step {time, action}
  batch_size_l NUMERIC,               -- 12
  notion_page_url TEXT,               -- link pagina Notion pubblicata
  qr_code_url TEXT,
  status TEXT CHECK (status IN ('produzione','disponibile','esaurito'))
);

-- Formati prodotto
CREATE TABLE product_formats (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,                 -- "Gelato Kit"
  max_flavors INT NOT NULL,           -- 2 per Kit, 1 per Coppetta
  price_pickup NUMERIC,
  price_delivery NUMERIC,
  cogs NUMERIC,
  cogs_verified BOOLEAN DEFAULT FALSE -- TRUE solo per Gelato Kit (doc fornitori)
);

-- Ordini (modello spec: 1 riga ordine = 1 formato)
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_email TEXT NOT NULL,
  format_id INT REFERENCES product_formats(id),
  fulfillment_type TEXT CHECK (fulfillment_type IN ('pickup','delivery')),
  total_price NUMERIC,
  gift_message TEXT,
  created_at TIMESTAMP DEFAULT now(),
  status TEXT CHECK (status IN ('confermato','in_produzione','spedito','consegnato'))
  -- [+] al collegamento Stripe conviene aggiungere:
  -- stripe_session_id TEXT UNIQUE
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  flavor_id INT REFERENCES flavors(id)
  -- una riga per ogni gusto scelto (Kit con 2 gusti = 2 righe)
  -- NB spec: la quantità non è modellata — il sito invia N righe orders
  -- per qty N; in futuro valutare una colonna quantity su orders.
);

-- Feedback (Capitolo 4)
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  batch_id INT REFERENCES batches(id),
  order_id INT REFERENCES orders(id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  marco_replied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

-- Seasonal Alert List (Capitolo 7 — NON è un abbonamento: nessun campo di pagamento)
CREATE TABLE alert_subscriptions (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  fruit_key TEXT NOT NULL,
  subscribed_at TIMESTAMP DEFAULT now(),
  UNIQUE (email, fruit_key)           -- [+] evita doppie iscrizioni allo stesso frutto
);

-- ============================================================
-- [+] RLS minima per sito statico con anon key (vedi BACKEND.md):
--     il pubblico può solo INSERIRE ordini/feedback/iscrizioni e
--     LEGGERE gusti/formati/batch; tutto il resto solo service role.
-- ============================================================
ALTER TABLE farmers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavors            ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches            ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_formats    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback           ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_flavors  ON flavors         FOR SELECT TO anon USING (true);
CREATE POLICY public_read_formats  ON product_formats FOR SELECT TO anon USING (true);
CREATE POLICY public_read_batches  ON batches         FOR SELECT TO anon USING (status = 'disponibile');
CREATE POLICY public_read_farmers  ON farmers         FOR SELECT TO anon USING (true);
CREATE POLICY public_insert_orders   ON orders             FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY public_insert_items    ON order_items        FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY public_insert_feedback ON feedback           FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY public_insert_alerts   ON alert_subscriptions FOR INSERT TO anon WITH CHECK (true);

-- ============================================================
-- SEED — dati già stabiliti nei Capitoli 1-7 (nomi EN = sito)
-- ============================================================
INSERT INTO farmers (name, farm_name, location, certification, bio) VALUES
('Tom Johnson', 'Johnson''s Farm', 'Woodchurch, Kent', 'Red Tractor Assurance',
 'Tom Johnson has been growing strawberries in Woodchurch, Kent, for three generations. His farm is certified by Red Tractor Assurance.');

INSERT INTO flavors (name, collection, fruit_key, swatch_gradient, always_available) VALUES
('Strawberry',    'frutta',   'strawberry',    'sw-strawberry',    FALSE),
('Raspberry',     'frutta',   'raspberry',     'sw-raspberry',     FALSE),
('Cherry',        'frutta',   'cherry',        'sw-cherry',        FALSE),
('Blueberry',     'frutta',   'blueberry',     'sw-blueberry',     FALSE),
('Blackcurrant',  'frutta',   'blackcurrant',  'sw-blackcurrant',  FALSE),
('Victoria Plum', 'frutta',   'victoria-plum', 'sw-victoria-plum', FALSE),
('Apple & Pear',  'frutta',   'apple-pear',    'sw-apple-pear',    FALSE),
('Quince',        'frutta',   'quince',        'sw-quince',        FALSE),
('Rhubarb',       'frutta',   'rhubarb',       'sw-rhubarb',       FALSE),
('Dark Chocolate','classici', NULL,            'sw-chocolate',     TRUE),
('Pistachio',     'classici', NULL,            'sw-pistachio',     TRUE),
('Stracciatella', 'classici', NULL,            'sw-stracciatella', TRUE),
('Hazelnut',      'classici', NULL,            'sw-hazelnut',      TRUE);

INSERT INTO product_formats (name, max_flavors, price_pickup, price_delivery, cogs, cogs_verified) VALUES
('Cup',         1, 3.50,  NULL,  NULL, FALSE),
('Piping Bag',  1, 6.50,  NULL,  NULL, FALSE),
('Gelato Kit',  2, 28.00, 34.00, 8.50, TRUE),
('Multipack',   4, 12.00, NULL,  NULL, FALSE),
('Family Tub',  2, 22.00, NULL,  NULL, FALSE);

INSERT INTO batches (batch_number, flavor_id, farmer_id, harvest_date, harvest_time,
                     production_date, production_log, batch_size_l, status)
SELECT '042', f.id, fa.id, '2026-05-15', '06:12', '2026-05-17',
 '[{"time":"06:00","action":"Fruit received and inspected (HACCP checklist)"},
   {"time":"06:30","action":"Base prep: 8kg strawberries, 1.2kg sugar, water"},
   {"time":"07:00","action":"Trittico: pasteurisation at 62C, 20 minutes"},
   {"time":"07:20","action":"Mixing and ageing, 40 minutes"},
   {"time":"08:00","action":"Churning"},
   {"time":"08:20","action":"Into the blast freezer"},
   {"time":"08:30","action":"BATCH COMPLETE"}]'::jsonb,
 12, 'disponibile'
FROM flavors f, farmers fa
WHERE f.name = 'Strawberry' AND fa.name = 'Tom Johnson';
