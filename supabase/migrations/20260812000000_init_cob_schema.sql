-- Initial Schema for Campus Opportunity Bridge (COB)

-- 1. PROFILES TABLE (Users & Roles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    student_id TEXT UNIQUE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('student', 'staff', 'admin')) DEFAULT 'student',
    community_name TEXT,
    admin_type TEXT,
    department TEXT,
    gpa NUMERIC(3, 2),
    skills TEXT[],
    must_change_password BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AUTOMATIC PROFILE CREATION TRIGGER
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. OPPORTUNITIES TABLE (Posted by Staff/Admin)
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    department TEXT NOT NULL,
    type TEXT CHECK (type IN ('Research', 'Internship', 'TA', 'Lab Assistant', 'Project')) DEFAULT 'Project',
    required_skills TEXT[],
    posted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT CHECK (status IN ('open', 'closed')) DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. APPLICATIONS TABLE (Submitted by Students)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected')) DEFAULT 'pending',
    notes TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(opportunity_id, student_id)
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for login lookup" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public & authenticated users can read opportunities" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Staff can manage opportunities" ON public.opportunities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Students can manage applications" ON public.applications FOR ALL USING (auth.role() = 'authenticated');

-- 6. GRANT PRIVILEGES TO AUTHENTICATED & ANON ROLES
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
