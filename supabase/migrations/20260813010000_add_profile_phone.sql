-- Add phone column to profiles for guest contact numbers
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT;
