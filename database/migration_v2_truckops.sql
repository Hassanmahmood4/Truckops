-- TruckOps v2: load statuses, requests table, optional request→load link
-- Run in Supabase SQL editor after base schema.sql

-- Expand load statuses (replace CHECK constraint)
ALTER TABLE loads DROP CONSTRAINT IF EXISTS loads_status_check;
ALTER TABLE loads
  ADD CONSTRAINT loads_status_check
  CHECK (status IN ('pending', 'assigned', 'in_transit', 'delivered'));

-- Normalize any legacy values if present (optional)
UPDATE loads SET status = 'delivered' WHERE status NOT IN ('pending', 'assigned', 'in_transit', 'delivered');

-- Load requests (user submits; admin approves/rejects)
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  weight NUMERIC,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  load_id UUID REFERENCES loads(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_requests_user_id ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
