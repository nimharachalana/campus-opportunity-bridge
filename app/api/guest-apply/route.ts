import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { opportunityId, firstName, lastName, email, phone, city, country, gender, notes } = body

    if (!opportunityId || !email || !firstName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if profile already exists for this email
    const { data: existingProfiles } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .limit(1)

    let profileId: string | null = null

    if (existingProfiles && existingProfiles.length > 0) {
      profileId = existingProfiles[0].id
    } else {
      // Create a new auth user for the guest (synthetic password)
      const randomPass = Math.random().toString(36).slice(-8) + 'A1!'
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: randomPass,
        email_confirm: true,
        user_metadata: { full_name: `${firstName} ${lastName}` }
      })

      if (authError || !authData.user) {
        return NextResponse.json({ error: authError?.message || 'Failed to create guest user' }, { status: 500 })
      }

      profileId = authData.user.id
    }

    // Upsert profile details (ensure phone/city/country/gender are saved or updated)
    const { error: upsertErr } = await supabaseAdmin.from('profiles').upsert({
      id: profileId,
      email,
      full_name: `${firstName} ${lastName}`,
      phone: phone || null,
      city: city || null,
      country: country || null,
      gender: gender || null,
      created_at: new Date().toISOString(),
    })

    if (upsertErr) {
      return NextResponse.json({ error: upsertErr.message }, { status: 500 })
    }

    // Create application row
    const { data: appData, error: appErr } = await supabaseAdmin.from('applications').insert([
      {
        opportunity_id: opportunityId,
        student_id: profileId,
        status: 'pending',
        notes: notes || null,
      },
    ]).select()

    if (appErr) {
      return NextResponse.json({ error: appErr.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Application received', application: appData?.[0] }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
