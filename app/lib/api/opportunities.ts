import { supabase } from '@/app/lib/supabase'
import { Opportunity } from '@/app/types'

const LOCAL_STORAGE_KEY = 'cob_published_opportunities'

export async function fetchOpportunities(): Promise<Opportunity[]> {
  let dbData: Opportunity[] = []
  
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      dbData = data as Opportunity[]
    }
  } catch (err) {
    console.warn('Database fetch warning, reading local cache:', err)
  }

  // Also read locally cached opportunities
  let localData: Opportunity[] = []
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        localData = JSON.parse(stored)
      }
    } catch (e) {
      console.warn('Failed reading local opportunities:', e)
    }
  }

  // Merge unique by ID
  const map = new Map<string, Opportunity>()
  for (const item of [...localData, ...dbData]) {
    if (item && item.id) {
      map.set(item.id, item)
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function createOpportunity(opportunity: Partial<Opportunity>): Promise<Opportunity> {
  const newId = opportunity.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'opp-' + Date.now())
  const newOpp: Opportunity = {
    id: newId,
    title: opportunity.title || 'Untitled Opportunity',
    description: opportunity.description || '',
    department: opportunity.department || 'General',
    type: opportunity.type || 'Research',
    community_name: opportunity.community_name || null,
    supervisor: opportunity.supervisor || null,
    funding_type: opportunity.funding_type || 'Funded',
    seats: opportunity.seats || 1,
    deadline: opportunity.deadline || null,
    min_gpa: opportunity.min_gpa || null,
    required_skills: opportunity.required_skills || [],
    posted_by: opportunity.posted_by || null,
    status: opportunity.status || 'open',
    created_at: opportunity.created_at || new Date().toISOString(),
  }

  // Save to local storage for immediate visibility
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      const currentList: Opportunity[] = stored ? JSON.parse(stored) : []
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newOpp, ...currentList]))
    } catch (e) {
      console.warn('Failed to cache opportunity locally:', e)
    }
  }

  // Attempt to save to Supabase
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .insert([{
        id: newOpp.id,
        title: newOpp.title,
        description: newOpp.description,
        department: newOpp.department,
        type: newOpp.type,
        required_skills: newOpp.required_skills,
        posted_by: typeof newOpp.posted_by === 'string' ? newOpp.posted_by : null,
        status: newOpp.status,
      }])
      .select()

    if (error) {
      console.warn('Supabase DB insert notice (cached locally):', error.message)
    } else if (data && data[0]) {
      return data[0] as Opportunity
    }
  } catch (err: any) {
    console.warn('Supabase DB connection notice (cached locally):', err.message)
  }

  return newOpp
}

export async function updateOpportunityStatus(id: string, status: 'open' | 'closed'): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        const list: Opportunity[] = JSON.parse(stored)
        const updated = list.map((opp) => (opp.id === id ? { ...opp, status } : opp))
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      }
    } catch (e) {
      console.warn('Error updating status locally:', e)
    }
  }

  try {
    await supabase.from('opportunities').update({ status }).eq('id', id)
  } catch (e) {
    console.warn('Supabase update status failed:', e)
  }
}

export async function deleteOpportunity(id: string): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        const list: Opportunity[] = JSON.parse(stored)
        const updated = list.filter((opp) => opp.id !== id)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      }
    } catch (e) {
      console.warn('Error deleting locally:', e)
    }
  }

  try {
    await supabase.from('opportunities').delete().eq('id', id)
  } catch (e) {
    console.warn('Supabase delete failed:', e)
  }
}
