import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Create notifications table via raw SQL
  const { error } = await supabaseAdmin.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        link TEXT,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

      DO $$ BEGIN
        CREATE POLICY "Users can view their own notifications." 
        ON public.notifications FOR SELECT USING (auth.uid() = user_id);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      DO $$ BEGIN
        CREATE POLICY "Users can update their own notifications." 
        ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      DO $$ BEGIN
        CREATE POLICY "Service can insert notifications." 
        ON public.notifications FOR INSERT WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Notifications table created!' })
}
