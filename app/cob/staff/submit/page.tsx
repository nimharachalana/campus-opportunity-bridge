'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createOpportunity, fetchOpportunities, updateOpportunityStatus, deleteOpportunity } from '@/app/lib/api/opportunities'
import { supabase } from '@/app/lib/supabase'
import { OpportunityType, Opportunity } from '@/app/types'
import { INITIAL_COMMUNITIES, CommunityRecord } from '@/app/constants/communities'
import {
  PlusCircle,
  CheckCircle2,
  FlaskConical,
  Building2,
  Users,
  Sparkles,
  Layers,
  GraduationCap,
  Calendar,
  DollarSign,
  Award,
  BookOpen,
  Trash2,
  Eye,
  ArrowUpRight,
  Filter,
  CheckCircle,
  XCircle,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'

const COMMUNITIES_STORAGE_KEY = 'cob_all_communities'

function StaffPublishingContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<'opportunity' | 'research' | 'community' | 'manage'>('opportunity')

  useEffect(() => {
    if (tabParam && ['opportunity', 'research', 'community', 'manage'].includes(tabParam)) {
      setActiveTab(tabParam as any)
      setFeedback(null)
    }
  }, [tabParam])

  // --- 1. General Opportunity Form State ---
  const [oppTitle, setOppTitle] = useState('')
  const [oppDepartment, setOppDepartment] = useState('Information & Communication Technology')
  const [oppType, setOppType] = useState<OpportunityType>('TA')
  const [oppCommunity, setOppCommunity] = useState('')
  const [oppSkills, setOppSkills] = useState('')
  const [oppSeats, setOppSeats] = useState('2')
  const [oppDeadline, setOppDeadline] = useState('')
  const [oppDescription, setOppDescription] = useState('')
  const [oppImage, setOppImage] = useState<string | null>(null)

  // --- 2. Research Project Form State ---
  const [researchTitle, setResearchTitle] = useState('')
  const [researchPI, setResearchPI] = useState('')
  const [researchDepartment, setResearchDepartment] = useState('Information & Communication Technology')
  const [researchDomain, setResearchDomain] = useState('Artificial Intelligence & ML')
  const [researchFunding, setResearchFunding] = useState('Funded Grant ($500/mo Stipend)')
  const [researchMinGpa, setResearchMinGpa] = useState('3.50')
  const [researchSkills, setResearchSkills] = useState('Python, PyTorch, Data Analysis')
  const [researchSeats, setResearchSeats] = useState('2')
  const [researchDeadline, setResearchDeadline] = useState('')
  const [researchAbstract, setResearchAbstract] = useState('')
  const [researchImage, setResearchImage] = useState<string | null>(null)

  // --- 3. Community Registration State ---
  const [communities, setCommunities] = useState<CommunityRecord[]>([])
  const [newCommName, setNewCommName] = useState('')
  const [newCommDept, setNewCommDept] = useState('Information & Communication Technology')
  const [newCommCategory, setNewCommCategory] = useState('Software & AI')
  const [newCommLeadName, setNewCommLeadName] = useState('')
  const [newCommLeadEmail, setNewCommLeadEmail] = useState('')
  const [newCommDescription, setNewCommDescription] = useState('')
  const [commImage, setCommImage] = useState<string | null>(null)

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) setter(event.target.result as string)
    }
    reader.readAsDataURL(file)
  }

  // --- 4. Published List State ---
  const [publishedItems, setPublishedItems] = useState<Opportunity[]>([])
  const [manageFilter, setManageFilter] = useState<'all' | 'opportunities' | 'research'>('all')

  // Status & Feedback
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Load Communities from Storage & Initial List
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(COMMUNITIES_STORAGE_KEY)
      if (stored) {
        try {
          setCommunities(JSON.parse(stored))
        } catch (e) {
          setCommunities(INITIAL_COMMUNITIES)
        }
      } else {
        setCommunities(INITIAL_COMMUNITIES)
        localStorage.setItem(COMMUNITIES_STORAGE_KEY, JSON.stringify(INITIAL_COMMUNITIES))
      }
    }
  }, [])

  // Load Published Opportunities
  const loadPublished = async () => {
    const opps = await fetchOpportunities()
    setPublishedItems(opps)
  }

  useEffect(() => {
    loadPublished()
  }, [])

  // --- Handlers ---
  const handlePublishOpportunity = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const required_skills = oppSkills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      await createOpportunity({
        title: oppTitle,
        department: oppDepartment,
        type: oppType,
        community_name: oppCommunity || null,
        seats: parseInt(oppSeats) || 1,
        deadline: oppDeadline || null,
        description: oppDescription,
        required_skills,
        posted_by: user?.id || 'staff-user',
        status: 'open',
        image_url: oppImage,
      })

      setFeedback({ type: 'success', message: `Opportunity "${oppTitle}" published successfully and is now visible to all students!` })
      setOppTitle('')
      setOppSkills('')
      setOppDescription('')
      setOppDeadline('')
      setOppImage(null)
      loadPublished()
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to publish opportunity.' })
    } finally {
      setLoading(false)
    }
  }

  const handlePublishResearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const required_skills = researchSkills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      await createOpportunity({
        title: `[Research] ${researchTitle}`,
        department: researchDepartment,
        type: 'Research',
        supervisor: researchPI || 'Faculty Principal Investigator',
        funding_type: researchFunding,
        min_gpa: parseFloat(researchMinGpa) || null,
        seats: parseInt(researchSeats) || 1,
        deadline: researchDeadline || null,
        description: `Research Field: ${researchDomain}\nPrincipal Investigator: ${researchPI}\nFunding/Stipend: ${researchFunding}\n\nAbstract & Objectives:\n${researchAbstract}`,
        required_skills,
        posted_by: user?.id || 'faculty-staff',
        status: 'open',
        image_url: researchImage,
      })

      setFeedback({ type: 'success', message: `Research Project "${researchTitle}" published and highlighted on the Student Portal!` })
      setResearchTitle('')
      setResearchPI('')
      setResearchAbstract('')
      setResearchDeadline('')
      setResearchImage(null)
      loadPublished()
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to publish research.' })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCommunity = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommName.trim()) return

    const newRecord: CommunityRecord = {
      id: 'comm-' + Date.now(),
      name: newCommName.trim(),
      department: newCommDept,
      category: newCommCategory,
      lead_name: newCommLeadName.trim() || 'Staff Coordinator',
      lead_email: newCommLeadEmail.trim() || 'coordinator@campusbridge.edu',
      description: newCommDescription.trim() || 'Faculty recognized student organization.',
      created_at: new Date().toISOString(),
      image_url: commImage || undefined,
    }

    const updated = [newRecord, ...communities]
    setCommunities(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(COMMUNITIES_STORAGE_KEY, JSON.stringify(updated))
    }

    setFeedback({ type: 'success', message: `Community "${newCommName}" successfully added and registered!` })
    setNewCommName('')
    setNewCommLeadName('')
    setNewCommLeadEmail('')
    setNewCommDescription('')
    setCommImage(null)
  }

  const handleDeleteCommunity = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return
    const updated = communities.filter((c) => c.id !== id)
    setCommunities(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(COMMUNITIES_STORAGE_KEY, JSON.stringify(updated))
    }
  }

  const handleToggleStatus = async (opp: Opportunity) => {
    const nextStatus = opp.status === 'open' ? 'closed' : 'open'
    await updateOpportunityStatus(opp.id, nextStatus)
    loadPublished()
  }

  const handleDeleteOpp = async (id: string) => {
    if (!confirm('Are you sure you want to delete this position?')) return
    await deleteOpportunity(id)
    loadPublished()
  }

  const filteredOpps = publishedItems.filter((opp) => {
    if (manageFilter === 'research') return opp.type === 'Research' || opp.title.startsWith('[Research]')
    if (manageFilter === 'opportunities') return opp.type !== 'Research' && !opp.title.startsWith('[Research]')
    return true
  })

  return (
    <div className="flex flex-col flex-1 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Staff Management & Publishing Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Publish Opportunities & Communities
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Publish student positions, launch faculty research projects, and register campus communities. All entries are instantly visible to students.
            </p>
          </div>
          <Link
            href="/cob/student/opportunities"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 rounded-xl text-xs font-bold text-indigo-200 transition-all shadow-md shrink-0"
          >
            <Eye className="w-4 h-4 text-indigo-400" /> View Student Feed <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="space-y-6">

      {/* Global Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" /> : <XCircle className="w-5 h-5 shrink-0 text-rose-400" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ================= TAB 1: POST OPPORTUNITY ================= */}
      {activeTab === 'opportunity' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" /> Publish Student Opportunity
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Create TA roles, lab assistant positions, campus internships, or club projects for students.
            </p>
          </div>

          <form onSubmit={handlePublishOpportunity} className="space-y-5">
            <div className="flex flex-col gap-2 border border-dashed border-slate-700 bg-slate-950/50 p-4 rounded-xl items-center justify-center relative overflow-hidden group min-h-[140px]">
              {oppImage ? (
                <>
                  <img src={oppImage} alt="Cover" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => setOppImage(null)} className="px-3 py-1.5 bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-bold rounded-lg backdrop-blur-sm transition-all shadow-lg z-10">Remove Image</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-1 border border-slate-800">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="text-sm text-slate-300 font-medium">Upload Cover Image</p>
                  <p className="text-[10px] text-slate-500 mb-2">Recommended: 1200x400 (Optional)</p>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setOppImage)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                </>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Position Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Web Developer TA / Lab Demonstrator"
                  value={oppTitle}
                  onChange={(e) => setOppTitle(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Opportunity Type *
                </label>
                <select
                  value={oppType}
                  onChange={(e) => setOppType(e.target.value as OpportunityType)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                >
                  <option value="TA">Teaching Assistant (TA)</option>
                  <option value="Lab Assistant">Lab Assistant</option>
                  <option value="Internship">Campus Internship</option>
                  <option value="Project">Club / Faculty Project</option>
                  <option value="Research">Academic Research</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Faculty Stream / Department *
                </label>
                <select
                  value={oppDepartment}
                  onChange={(e) => setOppDepartment(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                >
                  <option value="Information & Communication Technology">Information & Communication Technology (ICT)</option>
                  <option value="Bio-Systems Technology">Bio-Systems Technology (BST)</option>
                  <option value="Engineering Technology">Engineering Technology (ET)</option>
                  <option value="General Faculty">Faculty Wide / Multidisciplinary</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Associated Community / Organization
                </label>
                <select
                  value={oppCommunity}
                  onChange={(e) => setOppCommunity(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                >
                  <option value="">-- Faculty Department (No Club) --</option>
                  {communities.map((comm) => (
                    <option key={comm.id} value={comm.name}>
                      {comm.name} ({comm.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Open Positions (Seats)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={oppSeats}
                  onChange={(e) => setOppSeats(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Required Skills (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Next.js, Git, Communication"
                  value={oppSkills}
                  onChange={(e) => setOppSkills(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={oppDeadline}
                  onChange={(e) => setOppDeadline(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Description & Student Responsibilities *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Outline student duties, weekly workload, learning benefits, and eligibility criteria..."
                value={oppDescription}
                onChange={(e) => setOppDescription(e.target.value)}
                className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? 'Publishing Opportunity...' : 'Publish Opportunity to Students'}
              {!loading && <CheckCircle className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}

      {/* ================= TAB 2: PUBLISH RESEARCH ================= */}
      {activeTab === 'research' && (
        <div className="bg-slate-900/90 border border-purple-900/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <FlaskConical className="w-4 h-4" /> Academic Research & Grant Publisher
            </div>
            <h2 className="text-xl font-bold text-white">Publish Faculty Research Project</h2>
            <p className="text-xs text-slate-400 mt-1">
              Recruit student research assistants, co-authors, and lab fellows for funded grants or faculty investigations.
            </p>
          </div>

          <form onSubmit={handlePublishResearch} className="space-y-5">
            <div className="flex flex-col gap-2 border border-dashed border-slate-700 bg-slate-950/50 p-4 rounded-xl items-center justify-center relative overflow-hidden group min-h-[140px]">
              {researchImage ? (
                <>
                  <img src={researchImage} alt="Cover" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => setResearchImage(null)} className="px-3 py-1.5 bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-bold rounded-lg backdrop-blur-sm transition-all shadow-lg z-10">Remove Image</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-1 border border-slate-800">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="text-sm text-slate-300 font-medium">Upload Project Image</p>
                  <p className="text-[10px] text-slate-500 mb-2">Recommended: 1200x400 (Optional)</p>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setResearchImage)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                </>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Research Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Learning Approaches to Bio-Agricultural Crop Yield Prediction"
                  value={researchTitle}
                  onChange={(e) => setResearchTitle(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Principal Investigator (PI) / Supervisor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Anura Weerasinghe / Dr. Kumudu Perera"
                  value={researchPI}
                  onChange={(e) => setResearchPI(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Faculty Stream / Lab *
                </label>
                <select
                  value={researchDepartment}
                  onChange={(e) => setResearchDepartment(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer"
                >
                  <option value="Information & Communication Technology">Information & Communication Technology (ICT)</option>
                  <option value="Bio-Systems Technology">Bio-Systems Technology (BST)</option>
                  <option value="Engineering Technology">Engineering Technology (ET)</option>
                  <option value="Multidisciplinary Research Lab">Multidisciplinary Research Lab</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Research Domain
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Vision, Robotics, IoT, Bio-Informatics"
                  value={researchDomain}
                  onChange={(e) => setResearchDomain(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Funding & Stipend Package
                </label>
                <select
                  value={researchFunding}
                  onChange={(e) => setResearchFunding(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer"
                >
                  <option value="Funded Grant ($500/mo Stipend)">Funded Grant (Monthly Stipend)</option>
                  <option value="University Research Fellowship">University Research Fellowship</option>
                  <option value="Academic Course Credit (3-Credits)">Academic Course Credit</option>
                  <option value="Industry Sponsored Fellowship">Industry Sponsored Fellowship</option>
                  <option value="Volunteer / Co-Authorship">Volunteer / Co-Authorship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Minimum GPA Requirement
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="2.00"
                  max="4.00"
                  value={researchMinGpa}
                  onChange={(e) => setResearchMinGpa(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Prerequisite Research Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, PyTorch, MATLAB, Paper Writing"
                  value={researchSkills}
                  onChange={(e) => setResearchSkills(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Open Assistant Seats
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={researchSeats}
                  onChange={(e) => setResearchSeats(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Project Abstract & Student Research Goals *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Detail research scope, methodologies to be explored, publication goals, and expectations from the student..."
                value={researchAbstract}
                onChange={(e) => setResearchAbstract(e.target.value)}
                className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? 'Publishing Research...' : 'Publish Research Grant & Open Positions'}
              {!loading && <FlaskConical className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}

      {/* ================= TAB 3: ADD COMMUNITIES ================= */}
      {activeTab === 'community' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-cyan-900/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Building2 className="w-4 h-4" /> Faculty Community & Club Registry
              </div>
              <h2 className="text-xl font-bold text-white">Add New Student Community / Circle</h2>
              <p className="text-xs text-slate-400 mt-1">
                Register new faculty clubs, research circles, and student chapters to enable scoped opportunity posting.
              </p>
            </div>

            <form onSubmit={handleAddCommunity} className="space-y-5">
              <div className="flex flex-col gap-2 border border-dashed border-slate-700 bg-slate-950/50 p-4 rounded-xl items-center justify-center relative overflow-hidden group min-h-[140px]">
                {commImage ? (
                  <>
                    <img src={commImage} alt="Cover" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => setCommImage(null)} className="px-3 py-1.5 bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-bold rounded-lg backdrop-blur-sm transition-all shadow-lg z-10">Remove Image</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-1 border border-slate-800">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-sm text-slate-300 font-medium">Upload Community Logo/Banner</p>
                    <p className="text-[10px] text-slate-500 mb-2">Recommended: 800x400 (Optional)</p>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setCommImage)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  </>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Community / Club Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Innovation Hub / Green Tech Guild"
                    value={newCommName}
                    onChange={(e) => setNewCommName(e.target.value)}
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Faculty Department *
                  </label>
                  <select
                    value={newCommDept}
                    onChange={(e) => setNewCommDept(e.target.value)}
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/30 cursor-pointer"
                  >
                    <option value="Information & Communication Technology">Information & Communication Technology</option>
                    <option value="Bio-Systems Technology">Bio-Systems Technology</option>
                    <option value="Engineering Technology">Engineering Technology</option>
                    <option value="Career Guidance Unit">Career Guidance Unit</option>
                    <option value="Student Affairs">Student Affairs</option>
                    <option value="Corporate Communications">Corporate Communications</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Category / Focus Area
                  </label>
                  <select
                    value={newCommCategory}
                    onChange={(e) => setNewCommCategory(e.target.value)}
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/30 cursor-pointer"
                  >
                    <option value="Software & AI">Software & AI</option>
                    <option value="Robotics & Hardware">Robotics & Hardware</option>
                    <option value="Academic Research">Academic Research</option>
                    <option value="Bio-Tech & Agriculture">Bio-Tech & Agriculture</option>
                    <option value="Professional & Career">Professional & Career</option>
                    <option value="Media & Design">Media & Design</option>
                    <option value="Arts & Culture">Arts & Culture</option>
                    <option value="Athletics & Fitness">Athletics & Fitness</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Lead Coordinator / Advisor Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Kasun Jayawardena"
                    value={newCommLeadName}
                    onChange={(e) => setNewCommLeadName(e.target.value)}
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Coordinator Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. lead@campusbridge.edu"
                    value={newCommLeadEmail}
                    onChange={(e) => setNewCommLeadEmail(e.target.value)}
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Community Description & Mission
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the community's objective, upcoming events, and scope for students..."
                  value={newCommDescription}
                  onChange={(e) => setNewCommDescription(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Register New Faculty Community
              </button>
            </form>
          </div>

          {/* Active Communities Directory */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Active Registered Communities ({communities.length})</h3>
                <p className="text-xs text-slate-400">All student organizations currently registered on Campus Opportunity Bridge.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {communities.map((comm) => (
                <div
                  key={comm.id}
                  className="p-5 bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                        {comm.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCommunity(comm.id, comm.name)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Remove community"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {comm.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{comm.department}</p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{comm.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 flex justify-between items-center">
                    <span>Lead: <strong className="text-slate-200">{comm.lead_name}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: MANAGE PUBLISHED ================= */}
      {activeTab === 'manage' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" /> Published Opportunities & Research ({filteredOpps.length})
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Toggle open/closed status, inspect applicant visibility, and manage all postings live.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setManageFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  manageFilter === 'all' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({publishedItems.length})
              </button>
              <button
                type="button"
                onClick={() => setManageFilter('opportunities')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  manageFilter === 'opportunities' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Opportunities
              </button>
              <button
                type="button"
                onClick={() => setManageFilter('research')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  manageFilter === 'research' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Research
              </button>
            </div>
          </div>

          {filteredOpps.length === 0 ? (
            <div className="p-12 text-center bg-slate-950/60 rounded-2xl border border-slate-800">
              <p className="text-slate-400 text-sm">No postings match your filter. Use the tabs above to publish a position or research project!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOpps.map((opp) => {
                const isResearch = opp.type === 'Research' || opp.title.startsWith('[Research]')
                const isOpen = opp.status === 'open'

                return (
                  <div
                    key={opp.id}
                    className="p-5 sm:p-6 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            isResearch
                              ? 'bg-purple-950 text-purple-300 border-purple-800'
                              : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                          }`}
                        >
                          {isResearch ? '🔬 Research Project' : opp.type}
                        </span>

                        {opp.community_name && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                            🏢 {opp.community_name}
                          </span>
                        )}

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isOpen ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          ● {isOpen ? 'Student Visible (Open)' : 'Closed'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white">{opp.title}</h3>

                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <span>{opp.department}</span>
                        {opp.supervisor && <span>• Supervisor: {opp.supervisor}</span>}
                        {opp.funding_type && <span>• {opp.funding_type}</span>}
                      </p>

                      <p className="text-xs text-slate-400 line-clamp-2">{opp.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(opp)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isOpen
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isOpen ? 'Close Application' : 'Reopen Position'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteOpp(opp.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-all"
                        title="Delete posting"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  )
}

export default function StaffPublishingHub() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading...</div>}>
      <StaffPublishingContent />
    </Suspense>
  )
}
