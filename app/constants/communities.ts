export const DEFAULT_COMMUNITIES = [
  'Career Circle',
  'Technobot',
  'ICT Circle',
  'Research Circle',
  'BITRAC Society',
  'Sports Club',
  'Media Club',
  'Cultural Circle',
  'Food Society',
] as const

export interface CommunityRecord {
  id: string
  name: string
  department: string
  category: string
  description: string
  lead_name: string
  lead_email: string
  created_at: string
}

export const INITIAL_COMMUNITIES: CommunityRecord[] = [
  {
    id: 'comm-1',
    name: 'Career Circle',
    department: 'Career Guidance Unit',
    category: 'Professional & Career',
    description: 'Empowering students with industry internships, CV clinics, and career mentorship fairs.',
    lead_name: 'Dr. Shantha Jayawardena',
    lead_email: 'career.lead@campusbridge.edu',
    created_at: new Date().toISOString(),
  },
  {
    id: 'comm-2',
    name: 'Technobot',
    department: 'Engineering Technology',
    category: 'Robotics & Hardware',
    description: 'Premier faculty robotics guild dedicated to autonomous robotics, IoT, and embedded competitions.',
    lead_name: 'Eng. Rohan Fernando',
    lead_email: 'technobot.lead@campusbridge.edu',
    created_at: new Date().toISOString(),
  },
  {
    id: 'comm-3',
    name: 'ICT Circle',
    department: 'Information & Communication Technology',
    category: 'Software & AI',
    description: 'Official society for software engineers, full-stack developers, and AI researchers across faculty streams.',
    lead_name: 'Dr. Niluka Silva',
    lead_email: 'ictcircle.lead@campusbridge.edu',
    created_at: new Date().toISOString(),
  },
  {
    id: 'comm-4',
    name: 'Research Circle',
    department: 'Faculty Graduate Studies',
    category: 'Academic Research',
    description: 'Coordinating interdisciplinary research grants, paper writing, and undergraduate research fellowships.',
    lead_name: 'Prof. Anura Weerasinghe',
    lead_email: 'research.circle@campusbridge.edu',
    created_at: new Date().toISOString(),
  },
  {
    id: 'comm-5',
    name: 'BITRAC Society',
    department: 'Bio-Systems Technology',
    category: 'Bio-Tech & Agriculture',
    description: 'Bio-systems innovation and sustainable food processing student research group.',
    lead_name: 'Dr. Kumudu Perera',
    lead_email: 'bitrac@campusbridge.edu',
    created_at: new Date().toISOString(),
  },
  {
    id: 'comm-6',
    name: 'Sports Club',
    department: 'Physical Education',
    category: 'Athletics & Fitness',
    description: 'Coordinating inter-faculty games, athletic training, and university sports tournaments.',
    lead_name: 'Coach Malith Bandara',
    lead_email: 'sports@campusbridge.edu',
    created_at: new Date().toISOString(),
  },
  {
    id: 'comm-7',
    name: 'Media Club',
    department: 'Corporate Communications',
    category: 'Media & Design',
    description: 'Official campus photography, videography, press coverage, and creative branding team.',
    lead_name: 'Saman Jayasuriya',
    lead_email: 'media@campusbridge.edu',
    created_at: new Date().toISOString(),
  },
  {
    id: 'comm-8',
    name: 'Cultural Circle',
    department: 'Student Affairs',
    category: 'Arts & Culture',
    description: 'Organizing annual drama festivals, musical nights, and cultural celebrations.',
    lead_name: 'Pravin Weerakoon',
    lead_email: 'cultural@campusbridge.edu',
    created_at: new Date().toISOString(),
  },
  {
    id: 'comm-9',
    name: 'Food Society',
    department: 'Food Science & Technology',
    category: 'Culinary & Nutrition',
    description: 'Promoting food innovation, nutrition awareness, and community food drives.',
    lead_name: 'Dr. Hiruni Abeyratne',
    lead_email: 'foodsoc@campusbridge.edu',
    created_at: new Date().toISOString(),
  }
]
