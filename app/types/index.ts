export type Role = 'student' | 'staff' | 'admin'
export type OpportunityType = 'Research' | 'Internship' | 'TA' | 'Lab Assistant' | 'Project' | 'Free Course'
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
  skills: any[] | null
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
  community_name?: string | null
  supervisor?: string | null
  funding_type?: string | null
  seats?: number | null
  deadline?: string | null
  max_applicants?: number | null
  min_gpa?: number | null
  required_skills: string[] | null
  posted_by: string | Profile | null
  status: string
  created_at: string
  image_url?: string | null
  // extended fields
  is_paid?: boolean
  is_remote?: boolean
  benefits?: string | null
  eligibility?: string | null
  start_date?: string | null
  location?: string | null
  faculty?: string | null
  sources?: string | null
  organization?: string | null
}

export interface Application {
  id: string
  opportunity_id: string | Opportunity
  opportunity?: Opportunity
  student_id: string | Profile
  student?: Profile
  status: ApplicationStatus
  notes: string | null
  applied_at: string
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

export interface GuestApplication {
  id: string
  opportunity_id: string
  guest_name: string
  guest_email: string
  status: ApplicationStatus
  applied_at: string
}
