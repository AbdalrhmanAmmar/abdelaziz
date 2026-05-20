-- =============================================
-- Al Abdulghani Motors — Supabase Migration
-- Run this in: Supabase Dashboard > SQL Editor
-- =============================================


-- ─── 1. TABLES ───────────────────────────────

CREATE TABLE IF NOT EXISTS "User" (
  id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username  TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS warehouse (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS category (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  price       FLOAT8 NOT NULL,
  quantity    INTEGER NOT NULL DEFAULT 0,
  "categoryId"  UUID NOT NULL REFERENCES category(id)  ON DELETE CASCADE,
  "warehouseId" UUID NOT NULL REFERENCES warehouse(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── 2. AUTO-CREATE User PROFILE ON SIGNUP ───

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public."User" (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── 3. ROW LEVEL SECURITY ───────────────────

ALTER TABLE "User"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse  ENABLE ROW LEVEL SECURITY;
ALTER TABLE category   ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;


-- User: can read all, update own row only
CREATE POLICY "users_select" ON "User"
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "users_update_own" ON "User"
  FOR UPDATE TO authenticated USING (auth.uid() = id);


-- Warehouse: full CRUD for authenticated users
CREATE POLICY "warehouse_select" ON warehouse
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "warehouse_insert" ON warehouse
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "warehouse_update" ON warehouse
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "warehouse_delete" ON warehouse
  FOR DELETE TO authenticated USING (true);


-- Category: full CRUD for authenticated users
CREATE POLICY "category_select" ON category
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "category_insert" ON category
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "category_update" ON category
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "category_delete" ON category
  FOR DELETE TO authenticated USING (true);


-- Products: full CRUD for authenticated users
CREATE POLICY "products_select" ON products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "products_insert" ON products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "products_update" ON products
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "products_delete" ON products
  FOR DELETE TO authenticated USING (true);
