-- Migration: Add Communities Table and Link Profiles

-- 1. Create Communities Table
CREATE TABLE IF NOT EXISTS public.communities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Seed Initial Communities Data
INSERT INTO public.communities (name) VALUES
    ('Career Circle'),
    ('Technobot'),
    ('ICT Circle'),
    ('Research Circle'),
    ('BITRAC Society'),
    ('Sports Club'),
    ('Media Club'),
    ('Cultural Circle'),
    ('Food Society')
ON CONFLICT (name) DO NOTHING;

-- 3. Alter Profiles Table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS community_name;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL;

-- 4. Update the Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, student_id, community_id, admin_type, must_change_password)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'student_id',
    (new.raw_user_meta_data->>'community_id')::UUID,
    new.raw_user_meta_data->>'admin_type',
    FALSE
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    community_id = EXCLUDED.community_id,
    admin_type = EXCLUDED.admin_type;
  RETURN new;
END;
$$;

-- 5. RLS Policies for Communities
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for communities" ON public.communities FOR SELECT USING (true);
GRANT SELECT ON public.communities TO anon, authenticated;
