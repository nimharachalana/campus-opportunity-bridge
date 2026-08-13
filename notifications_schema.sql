-- ==========================================
-- NOTIFICATIONS SYSTEM
-- ==========================================

-- 1. Create the notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'application_update', 'new_opportunity', 'deadline_reminder'
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own notifications
CREATE POLICY "Users can view their own notifications." 
ON public.notifications FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update (mark as read) their own notifications
CREATE POLICY "Users can update their own notifications." 
ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- 3. Trigger: Application Status Change
CREATE OR REPLACE FUNCTION public.handle_application_update() 
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger if the status has changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.notifications (user_id, title, message, type, link)
        VALUES (
            NEW.student_id,
            'Application Update',
            'Your application status has been updated to: ' || NEW.status,
            'application_update',
            '/cob/student/dashboard'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_application_status_update ON public.applications;
CREATE TRIGGER on_application_status_update
    AFTER UPDATE ON public.applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_application_update();


-- 4. Trigger: New Opportunity Created
CREATE OR REPLACE FUNCTION public.handle_new_opportunity() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, title, message, type, link)
    SELECT 
        p.id, 
        'New Opportunity: ' || NEW.title,
        'A new opportunity matching your profile has been posted.',
        'new_opportunity',
        '/cob/student/opportunities/' || NEW.id
    FROM public.profiles p
    WHERE p.role = 'student';
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_opportunity_created ON public.opportunities;
CREATE TRIGGER on_opportunity_created
    AFTER INSERT ON public.opportunities
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_opportunity();
