-- Add guest profile fields: city, country, gender
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT;

-- Optionally set default empty values (left null to preserve existing semantics)
