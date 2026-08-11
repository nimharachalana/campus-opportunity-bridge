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
  department: string | null
  gpa: number | null
  skills: string[] | null
  must_change_password: boolean
  created_at: string
}

export interface Opportunity {
  id: string
  title: string
  description: string
  department: string
  type: OpportunityType
  required_skills: string[] | null
  posted_by: string | Profile | null
  status: OpportunityStatus
  created_at: string
}

export interface Application {
  id: string
  opportunity_id: string | Opportunity
  student_id: string | Profile
  status: ApplicationStatus
  notes: string | null
  applied_at: string
}
