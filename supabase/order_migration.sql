-- ─────────────────────────────────────────────────────
-- Orders system: orders, order_items, notification
-- ─────────────────────────────────────────────────────

-- Orders submitted by branches
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "branchId" TEXT NOT NULL,
  "branchName" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | approved | modified | rejected
  notes TEXT,
  "adminNotes" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon insert orders"    ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon read orders"      ON orders FOR SELECT TO anon USING (true);
CREATE POLICY "Auth full access orders" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Items inside each order
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "orderId" UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  "productId" TEXT NOT NULL,
  "productName" TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  "approvedQuantity" INTEGER,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anon insert order items"   ON order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon read order items"     ON order_items FOR SELECT TO anon USING (true);
CREATE POLICY "Auth full access order items" ON order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Notifications (target = 'admin' | branchId)
CREATE TABLE IF NOT EXISTS notification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target TEXT NOT NULL,
  message TEXT NOT NULL,
  "orderId" UUID REFERENCES orders(id) ON DELETE SET NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE notification ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read notification"   ON notification FOR SELECT USING (true);
CREATE POLICY "Anyone insert notification" ON notification FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update notification" ON notification FOR UPDATE USING (true) WITH CHECK (true);

-- Enable Realtime on notification table
ALTER PUBLICATION supabase_realtime ADD TABLE notification;
