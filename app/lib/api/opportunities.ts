import { supabase } from '@/app/lib/supabase'
import { Opportunity } from '@/app/types'

export async function fetchOpportunities() {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching opportunities:', error)
    return []
  }
  return data as Opportunity[]
}

export async function createOpportunity(opportunity: Partial<Opportunity>) {
  const { data, error } = await supabase
    .from('opportunities')
    .insert([opportunity])
    .select()

  if (error) {
    throw new Error(error.message)
  }
  return data[0] as Opportunity
}

export async function getOpportunityById(id: string) {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching opportunity by id:', error)
    return null
  }
  return data as Opportunity
}
