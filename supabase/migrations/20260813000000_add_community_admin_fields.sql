-- Migration: Add Community Admin fields to public.profiles

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS community_name TEXT,
ADD COLUMN IF NOT EXISTS admin_type TEXT;

-- Update trigger function to handle community_name and admin_type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, student_id, community_name, admin_type, must_change_password)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'student_id',
    new.raw_user_meta_data->>'community_name',
    new.raw_user_meta_data->>'admin_type',
    FALSE
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    community_name = EXCLUDED.community_name,
    admin_type = EXCLUDED.admin_type;
  RETURN new;
END;
$$;

-- Allow anon to read opportunities for guest browsing
DROP POLICY IF EXISTS "Authenticated users can read opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Public & authenticated users can read opportunities" ON public.opportunities;

CREATE POLICY "Public & authenticated users can read opportunities" 
ON public.opportunities FOR SELECT USING (true);
