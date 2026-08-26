'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { createOpportunity, fetchOpportunities, updateOpportunityStatus, deleteOpportunity } from '@/app/lib/api/opportunities'
import { Opportunity, OpportunityType } from '@/app/types'
import { INITIAL_COMMUNITIES } from '@/app/constants/communities'
import {
  Briefcase,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Building2,
  Clock,
  Filter,
  Search,
  Sparkles,
  Users,
  Eye,
  ArrowUpRight,
  XCircle,
  Tag
} from 'lucide-react'
import Link from 'next/link'

export default function AdminOpportunitiesPage() {
  const [adminCommunity, setAdminCommunity] = useState('ICT Circle')
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('Information & Communication Technology')
  const [type, setType] = useState<OpportunityType>('Internship')
  const [community, setCommunity] = useState('ICT Circle')
  const [skillsInput, setSkillsInput] = useState('')
  const [skillsList, setSkillsList] = useState<string[]>(['TypeScript', 'React'])
  const [seats, setSeats] = useState('2')
  const [maxApplicants, setMaxApplicants] = useState('')
  const [deadline, setDeadline] = useState('')
  const [description, setDescription] = useState('')

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cob_current_admin') || localStorage.getItem('cob_current_user')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed.community_name) {
            setAdminCommunity(parsed.community_name)
            setCommunity(parsed.community_name)
          }
        } catch (e) {
          console.warn('Admin session note:', e)
        }
      }
    }
  }, [])

  const loadData = async () => {
    const opps = await fetchOpportunities()
    setOpportunities(opps)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddSkill = () => {
    if (!skillsInput.trim()) return
    if (!skillsList.includes(skillsInput.trim())) {
      setSkillsList([...skillsList, skillsInput.trim()])
    }
    setSkillsInput('')
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      await createOpportunity({
        title,
        department,
        type,
        community_name: community || adminCommunity,
        required_skills: skillsList,
        seats: parseInt(seats) || 1,
        max_applicants: maxApplicants ? parseInt(maxApplicants) : null,
        deadline: deadline || null,
        description,
        posted_by: user?.id || 'admin-user',
        status: 'open',
      })

      setFeedback({
        type: 'success',
        message: `Opportunity "${title}" successfully published for ${community || adminCommunity}! Visible to students immediately.`,
      })

      // Reset form
      setTitle('')
      setDescription('')
      setDeadline('')
      setMaxApplicants('')
      loadData()
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to post opportunity' })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (opp: Opportunity) => {
    const nextStatus = opp.status === 'open' ? 'closed' : 'open'
    await updateOpportunityStatus(opp.id, nextStatus)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this opportunity?')) return
    await deleteOpportunity(id)
    loadData()
  }

  const filteredOpps = opportunities.filter((opp) => {
    if (statusFilter !== 'all' && opp.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = opp.title.toLowerCase().includes(q)
      const matchComm = opp.community_name?.toLowerCase().includes(q)
      const matchDept = opp.department.toLowerCase().includes(q)
      if (!matchTitle && !matchComm && !matchDept) return false
    }
    return true
  })

  return (
    <div className="flex flex-col flex-1 max-w-6xl mx-auto space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold mb-3">
              <Building2 className="w-3.5 h-3.5" /> {adminCommunity} Opportunity Management
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Community Opportunity Center
            </h1>
            <p className="text-purple-200/80 text-sm mt-1 max-w-2xl font-light">
              Publish internships, projects, and roles scoped to your student circle. Manage live statuses and student visibility.
            </p>
          </div>
          <Link
            href="/cob/student/opportunities"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 rounded-xl text-xs font-bold text-purple-200 transition-all shrink-0"
          >
            <Eye className="w-4 h-4 text-purple-400" /> Student View <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <XCircle className="w-5 h-5 shrink-0 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Grid: Form & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Create Form */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-purple-900/40 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-purple-400" /> Post Community Opportunity
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Visible to all students tagged with your circle.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Position Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Frontend Lead / Community Coordinator"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Opportunity Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as OpportunityType)}
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-xs sm:text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer"
                >
                  <option value="Internship">Campus Internship</option>
                  <option value="Project">Club / Project Lead</option>
                  <option value="TA">Teaching Assistant (TA)</option>
                  <option value="Lab Assistant">Lab Assistant</option>
                  <option value="Research">Academic Research</option>
                  <option value="Free Course">Free Course (Guest Available)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Community Tag
                </label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-xs sm:text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer"
                >
                  <option value={adminCommunity}>{adminCommunity} (Assigned)</option>
                  {INITIAL_COMMUNITIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Faculty Stream
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-xs sm:text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer"
                >
                  <option value="Information & Communication Technology">ICT</option>
                  <option value="Bio-Systems Technology">Bio-Systems (BST)</option>
                  <option value="Engineering Technology">Engineering (ET)</option>
                  <option value="General Faculty">Faculty Wide</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Open Seats
                </label>
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-xs sm:text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>
            </div>

            {/* Interactive Skill Tagging */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Prerequisite Skills
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Next.js, Figma, Python..."
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSkill()
                    }
                  }}
                  className="flex-1 p-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-purple-950 text-purple-300 border border-purple-800/60 font-mono"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-rose-400 transition-colors ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-xs sm:text-sm text-white outline-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Max Applicants Limit
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 50 (optional)"
                  value={maxApplicants}
                  onChange={(e) => setMaxApplicants(e.target.value)}
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-xs sm:text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Description & Member Responsibilities *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Explain the role, project goals, learning outcomes, and expected time commitment..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? 'Publishing...' : 'Publish to Student Feed'}
              {!loading && <Sparkles className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Right 7 Cols: Active List & Controls */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-400" /> Active Community Postings ({filteredOpps.length})
              </h2>
              <p className="text-xs text-slate-400">Toggle live visibility or delete expired postings.</p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  statusFilter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('open')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  statusFilter === 'open' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                Open
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('closed')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  statusFilter === 'closed' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                Closed
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by title, community, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
            />
          </div>

          {filteredOpps.length === 0 ? (
            <div className="p-12 text-center bg-slate-950/60 rounded-2xl border border-slate-800">
              <p className="text-slate-400 text-sm">No postings match your search filter.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredOpps.map((opp) => {
                const isOpen = opp.status === 'open'

                return (
                  <div
                    key={opp.id}
                    className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl hover:border-purple-500/40 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {opp.type}
                        </span>

                        {opp.community_name && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                            🏢 {opp.community_name}
                          </span>
                        )}

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isOpen ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          ● {isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{opp.title}</h4>
                      <p className="text-xs text-slate-400">{opp.department}</p>
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
                        {isOpen ? 'Close' : 'Reopen'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(opp.id)}
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
      </div>
    </div>
  )
}
