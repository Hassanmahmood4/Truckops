-- FleetFlow — run in Supabase SQL editor or via migration tooling

-- Drivers
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  license_number TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'busy'))
);

-- Loads (user_id stores Clerk user id as text)
CREATE TABLE IF NOT EXISTS loads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  weight NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'delivered')),
  user_id TEXT
);

-- Assignments (links driver to load)
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  load_id UUID NOT NULL REFERENCES loads(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled'))
);

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_id UUID NOT NULL REFERENCES loads(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  distance NUMERIC NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_loads_user_id ON loads(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_driver_id ON assignments(driver_id);
CREATE INDEX IF NOT EXISTS idx_assignments_load_id ON assignments(load_id);
CREATE INDEX IF NOT EXISTS idx_quotes_load_id ON quotes(load_id);
