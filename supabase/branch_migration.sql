-- Branch table
CREATE TABLE IF NOT EXISTS branch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE branch ENABLE ROW LEVEL SECURITY;

-- Authenticated users (admins) have full access
CREATE POLICY "Authenticated full access on branch" ON branch
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RPC function: verifies branch login without exposing the password column
CREATE OR REPLACE FUNCTION verify_branch_login(p_slug TEXT, p_password TEXT)
RETURNS TABLE(id UUID, name TEXT, slug TEXT, "createdAt" TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT b.id, b.name, b.slug, b."createdAt"
  FROM branch b
  WHERE b.slug = p_slug AND b.password = p_password;
END;
$$;

-- Allow both anonymous and authenticated users to call the login function
GRANT EXECUTE ON FUNCTION verify_branch_login TO anon;
GRANT EXECUTE ON FUNCTION verify_branch_login TO authenticated;
