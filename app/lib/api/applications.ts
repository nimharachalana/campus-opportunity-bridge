import { supabase } from '@/app/lib/supabase'
import { Application } from '@/app/types'

const LOCAL_APPLICATIONS_KEY = 'cob_local_applications'

export async function applyToOpportunity(opportunityId: string, studentId: string, notes?: string) {
  const newApp: Application = {
    id: 'app-' + Date.now(),
    opportunity_id: opportunityId,
    student_id: studentId,
    status: 'pending',
    notes: notes || null,
    applied_at: new Date().toISOString(),
  }

  // Cache locally
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_APPLICATIONS_KEY)
      const list: Application[] = stored ? JSON.parse(stored) : []
      localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify([newApp, ...list]))
    } catch (e) {
      console.warn('Failed storing application locally:', e)
    }
  }

  try {
    const { data, error } = await supabase
      .from('applications')
      .insert([
        {
          opportunity_id: opportunityId,
          student_id: studentId,
          status: 'pending',
          notes: notes || null,
        },
      ])
      .select()

    if (!error && data && data[0]) {
      return data[0] as Application
    }
  } catch (err: any) {
    console.warn('Supabase application submission note:', err.message)
  }

  return newApp
}

export async function fetchStudentApplications(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, opportunity:opportunity_id(*)')
      .eq('student_id', studentId)
      .order('applied_at', { ascending: false })

    if (!error && data) {
      return data
    }
  } catch (e) {
    console.warn('Fetch student applications note:', e)
  }

  // Fallback to local
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_APPLICATIONS_KEY)
      if (stored) {
        const list: Application[] = JSON.parse(stored)
        return list.filter((app) => (typeof app.student_id === 'string' ? app.student_id === studentId : (app.student_id as any)?.id === studentId))
      }
    } catch (e) {
      console.warn('Local read error:', e)
    }
  }

  return []
}

export async function fetchAllApplications() {
  let list: any[] = []

  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('applied_at', { ascending: false })

    if (!error && data) {
      list = data
    }
  } catch (e) {
    console.warn('DB read all applications note:', e)
  }

  // Merge with local applications
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_APPLICATIONS_KEY)
      if (stored) {
        const localList: any[] = JSON.parse(stored)
        const map = new Map<string, any>()
        for (const item of [...localList, ...list]) {
          if (item && item.id) map.set(item.id, item)
        }
        list = Array.from(map.values())
      }
    } catch (e) {
      console.warn('Local read error:', e)
    }
  }

  return list
}

export async function updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected' | 'under_review') {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_APPLICATIONS_KEY)
      if (stored) {
        const list: Application[] = JSON.parse(stored)
        const updated = list.map((a) => (a.id === applicationId ? { ...a, status } : a))
        localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(updated))
      }
    } catch (e) {
      console.warn('Local update error:', e)
    }
  }

  try {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select()

    if (!error && data && data[0]) {
      return data[0] as Application
    }
  } catch (e) {
    console.warn('Supabase status update error:', e)
  }

  return { id: applicationId, status } as any
}
