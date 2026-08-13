export type Role = 'student' | 'staff' | 'admin'
export type OpportunityType = 'Research' | 'Internship' | 'TA' | 'Lab Assistant' | 'Project'
export type OpportunityStatus = 'open' | 'closed'
export type ApplicationStatus = 'pending' | 'under_review' | 'accepted' | 'rejected'

export interface Profile {
  id: string
  student_id: string | null
  email: string
  full_name: string | null
  role: Role
  community_name?: string | null
  admin_type?: string | null
  department: string | null
  gpa: number | null
  skills: string[] | null
  must_change_password: boolean
  avatar_url: string | null
  created_at: string
}

export interface Opportunity {
  id: string
  title: string
  description: string
  department: string
  type: string
  required_skills: string[] | null
  posted_by: string | Profile | null
  status: string
  created_at: string
  // extended fields
  is_paid?: boolean
  is_remote?: boolean
  benefits?: string | null
  eligibility?: string | null
  deadline?: string | null
  start_date?: string | null
  location?: string | null
  faculty?: string | null
  sources?: string | null
  organization?: string | null
}

export interface Application {
  id: string
  opportunity_id: string
  student_id: string
  status: 'pending' | 'under_review' | 'accepted' | 'rejected'
  notes: string | null
  applied_at: string
  // extended fields if joined
  opportunity?: Opportunity
  student?: Profile
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  link: string | null
  is_read: boolean
  created_at: string
}

export interface SupportMessage {
  id: string
  student_id: string
  message: string
  is_from_admin: boolean
  is_read: boolean
  created_at: string
}
