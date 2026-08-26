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

  let merged = Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  // Ensure at least one Free Course exists for demonstration
  if (!merged.some(opp => opp.type === 'Free Course')) {
    merged.push({
      id: 'mock-free-course-1',
      title: 'Introduction to Web Development',
      description: 'A comprehensive free course covering HTML, CSS, and basic JavaScript. Perfect for absolute beginners.',
      department: 'Computer Science',
      type: 'Free Course',
      community_name: 'General Faculty',
      supervisor: 'Prof. Smith',
      funding_type: 'Unfunded',
      seats: 100,
      max_applicants: 100,
      deadline: '2027-01-01',
      min_gpa: null,
      required_skills: ['None'],
      posted_by: 'system',
      status: 'open',
      created_at: new Date().toISOString()
    })
    merged.push({
      id: 'mock-free-course-2',
      title: 'Data Science Fundamentals',
      description: 'Learn the basics of data analysis using Python and Pandas. A great starting point for aspiring data scientists.',
      department: 'Information Technology',
      type: 'Free Course',
      community_name: 'Data Community',
      supervisor: 'Dr. Alan',
      funding_type: 'Unfunded',
      seats: 50,
      max_applicants: 50,
      deadline: '2027-02-15',
      min_gpa: null,
      required_skills: ['Python Basics'],
      posted_by: 'system',
      status: 'open',
      created_at: new Date(Date.now() - 86400000).toISOString()
    })
    merged.push({
      id: 'mock-free-course-3',
      title: 'UI/UX Design Masterclass',
      description: 'Master Figma and learn how to create stunning, user-friendly interfaces for web and mobile applications.',
      department: 'Design',
      type: 'Free Course',
      community_name: 'Design Circle',
      supervisor: 'Ms. Sarah',
      funding_type: 'Unfunded',
      seats: 75,
      max_applicants: 75,
      deadline: '2027-03-10',
      min_gpa: null,
      required_skills: ['Creative Thinking'],
      posted_by: 'system',
      status: 'open',
      created_at: new Date(Date.now() - 172800000).toISOString()
    })
  }

  return merged
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
    max_applicants: opportunity.max_applicants || null,
    deadline: opportunity.deadline || null,
    min_gpa: opportunity.min_gpa || null,
    required_skills: opportunity.required_skills || [],
    posted_by: opportunity.posted_by || null,
    status: opportunity.status || 'open',
    created_at: opportunity.created_at || new Date().toISOString(),
    image_url: opportunity.image_url || null,
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
        max_applicants: newOpp.max_applicants,
        posted_by: typeof newOpp.posted_by === 'string' ? newOpp.posted_by : null,
        status: newOpp.status,
        image_url: newOpp.image_url,
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
