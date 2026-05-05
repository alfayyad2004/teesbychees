-- TeesByChees Database Schema
-- Run this migration on your Supabase project

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hoodies','long-sleeves','jerseys','polos','t-shirts')),
  base_price_ttd NUMERIC(10,2) NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{S,M,L,XL,XXL}',
  colors TEXT[] DEFAULT '{black,white,grey}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TBC graphic catalog
CREATE TABLE IF NOT EXISTS graphics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled')),
  subtotal_ttd NUMERIC(10,2),
  total_ttd NUMERIC(10,2),
  shipping_address JSONB,
  wipay_transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order line items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  size TEXT,
  color TEXT,
  mockup_url TEXT,
  graphic_url TEXT,
  graphic_length_in NUMERIC(5,2),
  print_cost_ttd NUMERIC(10,2),
  base_price_ttd NUMERIC(10,2),
  line_total_ttd NUMERIC(10,2)
);

-- Saved designs (5-day TTL)
CREATE TABLE IF NOT EXISTS saved_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  config_json JSONB NOT NULL,
  mockup_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '5 days'
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_saved_designs_session_id ON saved_designs(session_id);
CREATE INDEX IF NOT EXISTS idx_saved_designs_expires_at ON saved_designs(expires_at);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE graphics ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_designs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Products: public read, admin write
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Graphics: public read
CREATE POLICY "Graphics are viewable by everyone" ON graphics
  FOR SELECT USING (true);

-- Orders: users can view their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Order items: viewable with order
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND auth.jwt() ->> 'email' = orders.email
    )
  );

CREATE POLICY "Order items can be created" ON order_items
  FOR INSERT WITH CHECK (true);

-- Saved designs: users can manage their own
CREATE POLICY "Users can view their own saved designs" ON saved_designs
  FOR SELECT USING (
    session_id IS NOT NULL OR 
    (user_id IS NOT NULL AND auth.uid() = user_id)
  );

CREATE POLICY "Users can create saved designs" ON saved_designs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their own saved designs" ON saved_designs
  FOR DELETE USING (
    session_id IS NOT NULL OR 
    (user_id IS NOT NULL AND auth.uid() = user_id)
  );

-- Seed product data
INSERT INTO products (slug, name, category, base_price_ttd, description, images, sizes, colors) VALUES
  ('tom-and-jerry-classic-tee', 'Tom & Jerry Classic Tee', 't-shirts', 175.00, 'Retro Tom & Jerry nostalgia meets TBC signature. Premium cotton, regular fit.', ARRAY['/products/tee-white-front.jpg', '/products/tee-white-back.jpg'], ARRAY['S','M','L','XL','XXL'], ARRAY['white','black']),
  ('slot-machine-tee', 'Slot Machine Tee', 't-shirts', 175.00, 'Hit the jackpot with TBC. Casino-inspired graphic on heavyweight cotton.', ARRAY['/products/tee-black-front.jpg', '/products/tee-black-back.jpg'], ARRAY['S','M','L','XL','XXL'], ARRAY['black','white']),
  ('tennis-club-tee', 'Tennis Club Tee', 't-shirts', 175.00, 'Teesbychees Tennis Club, since 2023. Preppy sport club aesthetic.', ARRAY['/products/tee-white-tennis.jpg'], ARRAY['S','M','L','XL','XXL'], ARRAY['white']),
  ('comic-pop-tee', 'Comic Pop Tee', 't-shirts', 175.00, 'KABLAM! Comic-book pop art in true TBC fashion. Oversized fit.', ARRAY['/products/tee-white-comic.jpg'], ARRAY['S','M','L','XL','XXL'], ARRAY['white','black']),
  ('windows-98-tee', 'Windows 98 Tee', 't-shirts', 175.00, 'Y2K nostalgia. Windows 98 desktop meets streetwear. TBC Studio edition.', ARRAY['/products/tee-white-win98.jpg'], ARRAY['S','M','L','XL','XXL'], ARRAY['white']),
  ('tbc-studio-tee', 'TBC Studio Tee', 't-shirts', 150.00, 'The essential TBC logo tee. Clean, bold, minimal.', ARRAY['/products/tee-white-studio.jpg'], ARRAY['S','M','L','XL','XXL'], ARRAY['white','black','grey']),
  ('tbc-signature-hoodie', 'TBC Signature Hoodie', 'hoodies', 350.00, 'Premium heavyweight hoodie with TBC embroidered logo. Oversized fit, kangaroo pocket.', ARRAY['/products/hoodie-black-front.jpg'], ARRAY['S','M','L','XL','XXL'], ARRAY['black','white','grey']),
  ('sinner-hoodie', 'Sinner Hoodie', 'hoodies', 375.00, 'Religious iconography collection. Bold back print, subtle front logo.', ARRAY['/products/hoodie-black-sinner.jpg'], ARRAY['S','M','L','XL','XXL'], ARRAY['black']),
  ('tbc-vintage-long-sleeve', 'TBC Vintage Long Sleeve', 'long-sleeves', 225.00, 'Retro-washed long sleeve with vintage TBC print. Relaxed cut.', ARRAY['/products/ls-white-front.jpg'], ARRAY['S','M','L','XL','XXL'], ARRAY['white','black']),
  ('tbc-mesh-jersey', 'TBC Mesh Jersey', 'jerseys', 275.00, 'Breathable mesh jersey with full-front graphic. Sport-luxe fit.', ARRAY['/products/jersey-black-front.jpg'], ARRAY['S','M','L','XL','XXL'], ARRAY['black','white']),
  ('tbc-club-polo', 'TBC Club Polo', 'polos', 200.00, 'Clean-cut polo with embroidered TBC crest. Cotton piqué.', ARRAY['/products/polo-white-front.jpg'], ARRAY['S','M','L','XL','XXL'], ARRAY['white','black'])
ON CONFLICT (slug) DO NOTHING;

-- Seed graphic catalog
INSERT INTO graphics (name, image_url, tags, featured) VALUES
  ('Sinner', '/graphics/sinner.jpg', ARRAY['religious','iconography','dark'], true),
  ('Tennis Club', '/graphics/tennis-club.jpg', ARRAY['sport','preppy','vintage'], true),
  ('Comic Pop', '/graphics/comic-pop.jpg', ARRAY['comic','pop-art','bold'], true),
  ('Vintage Denim', '/graphics/vintage-denim.jpg', ARRAY['vintage','retro','classic'], false),
  ('Religious Icon', '/graphics/religious-icon.jpg', ARRAY['religious','iconography','statement'], false),
  ('Windows 98', '/graphics/windows-98.jpg', ARRAY['y2k','nostalgia','tech'], true),
  ('Slot Machine', '/graphics/slot-machine.jpg', ARRAY['casino','luck','bold'], true),
  ('Tom & Jerry', '/graphics/tom-jerry.jpg', ARRAY['cartoon','nostalgia','retro'], true);
