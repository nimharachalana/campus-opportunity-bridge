import { supabase } from '@/app/lib/supabase'
import { Application } from '@/app/types'

export async function applyToOpportunity(opportunityId: string, studentId: string) {
  const { data, error } = await supabase
    .from('applications')
    .insert([
      {
        opportunity_id: opportunityId,
        student_id: studentId,
        status: 'pending',
      },
    ])
    .select()

  if (error) {
    throw new Error(error.message)
  }
  return data[0] as Application
}

export async function fetchStudentApplications(studentId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*, opportunity:opportunity_id(*)')
    .eq('student_id', studentId)
    .order('applied_at', { ascending: false })

  if (error) {
    console.error('Error fetching student applications:', error)
    return []
  }
  return data
}

export async function fetchAllApplications() {
  const { data, error } = await supabase
    .from('applications')
    .select('*, opportunity:opportunity_id(*), student:student_id(*)')
    .order('applied_at', { ascending: false })

  if (error) {
    console.error('Error fetching all applications:', error)
    return []
  }
  return data
}

export async function updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected' | 'under_review') {
  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', applicationId)
    .select()

  if (error) {
    throw new Error(error.message)
  }
  return data[0] as Application
}
