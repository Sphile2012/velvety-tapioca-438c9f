-- Migration: create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event text,
  "userId" text,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

-- Optional index for querying by userId
CREATE INDEX IF NOT EXISTS analytics_userid_idx ON analytics ("userId");
