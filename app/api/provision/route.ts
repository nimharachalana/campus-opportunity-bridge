import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: This route requires SUPABASE_SERVICE_ROLE_KEY to be set in your .env
// It should only be called by an authenticated admin user, or a secure internal process.

export async function POST(request: Request) {
    try {
        const { studentId, role, defaultPassword } = await request.json()

        if (!studentId || !role || !defaultPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const normalizedId = studentId.trim().toUpperCase()
        const syntheticEmail = `${normalizedId}@campusbridge.local`.toLowerCase()

        // Initialize Supabase client with the Service Role Key to bypass RLS and allow user creation
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 1. Create the user in auth.users
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: syntheticEmail,
            password: defaultPassword,
            email_confirm: true,
        })

        if (authError || !authData.user) {
            return NextResponse.json({ error: authError?.message || 'Failed to create auth user' }, { status: 500 })
        }

        // 2. Insert into profiles table
        // Note: If you have a trigger on auth.users, it might have already created a row.
        // We will use an upsert to update the student_id and must_change_password just in case.
        const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
            id: authData.user.id,
            email: syntheticEmail,
            student_id: normalizedId,
            role: role,
            must_change_password: true
        })

        if (profileError) {
            return NextResponse.json({ error: profileError.message }, { status: 500 })
        }

        return NextResponse.json({ message: 'User provisioned successfully', user: authData.user }, { status: 201 })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
