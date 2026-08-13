'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { fetchOpportunities } from '@/app/lib/api/opportunities'
import { supabase } from '@/app/lib/supabase'
import { Opportunity } from '@/app/types'
import { Building2, Clock, Sparkles, ArrowRight } from 'lucide-react'

const CATEGORIES = [
    { label: 'Scholarship',      emoji: '🎓' },
    { label: 'Internship',       emoji: '💼' },
    { label: 'Competition',      emoji: '🏆' },
    { label: 'Research',         emoji: '🔬' },
    { label: 'Workshop',         emoji: '🛠️' },
    { label: 'Volunteering',     emoji: '🤝' },
    { label: 'Mentorship',       emoji: '👥' },
    { label: 'Part-time Job',    emoji: '💰' },
    { label: 'Exchange Program', emoji: '✈️' },
    { label: 'Entrepreneurship', emoji: '🚀' },
]
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  FlaskConical,
  Filter,
  Search,
  Award,
  Users,
  Calendar,
  DollarSign,
  GraduationCap
} from 'lucide-react'

export default function StudentOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Filter state
  const [activeCategories, setActiveCategories] = useState<string[]>([])
  const [paidOnly, setPaidOnly] = useState(false)
  const [remoteOnly, setRemoteOnly] = useState(false)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedDept, setSelectedDept] = useState<string>('all')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await fetchOpportunities()
      setOpportunities(data)
      setLoading(false)
    }
    loadData()
  }, [])

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      if (activeCategories.length > 0 && !activeCategories.includes(opp.type)) return false
      if (paidOnly && !opp.is_paid) return false
      if (remoteOnly && !opp.is_remote) return false
      return true
    })
  }, [opportunities, activeCategories, paidOnly, remoteOnly])

  return (
    <div className="flex gap-6 w-full">
      {/* ─── Left Sidebar Filters ─── */}
      <aside className="w-56 shrink-0 flex flex-col gap-8">
        {/* Categories */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Categories</p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setActiveCategories([])}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                activeCategories.length === 0
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <span>🔍</span> All
            </button>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategories.includes(cat.label)
              return (
                <button
                  key={cat.label}
                  onClick={() => toggleCategory(cat.label)}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2"><span>{cat.emoji}</span> {cat.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
  const handleApply = async (opportunityId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    const studentId = user?.id || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cob_current_student') || '{}')?.id : null)

    if (!studentId) {
      alert('Please sign in to apply')
      return
    }

    setApplyingId(opportunityId)
    setMessage(null)

    try {
      await applyToOpportunity(opportunityId, studentId)
      setAppliedSet((prev) => new Set(prev).add(opportunityId))
      setMessage('Application submitted successfully!')
    } catch (err: any) {
      alert(err.message || 'Failed to submit application')
    } finally {
      setApplyingId(null)
    }
  }

  const filteredList = opportunities.filter((opp) => {
    const isResearch = opp.type === 'Research' || opp.title.startsWith('[Research]')
    
    // Type filter
    if (selectedType === 'Research' && !isResearch) return false
    if (selectedType !== 'all' && selectedType !== 'Research' && opp.type !== selectedType) return false

    // Department filter
    if (selectedDept !== 'all' && opp.department !== selectedDept) return false

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = opp.title.toLowerCase().includes(q)
      const matchDept = opp.department.toLowerCase().includes(q)
      const matchDesc = opp.description.toLowerCase().includes(q)
      const matchComm = opp.community_name?.toLowerCase().includes(q)
      const matchSkills = opp.required_skills?.some((s) => s.toLowerCase().includes(q))
      if (!matchTitle && !matchDept && !matchDesc && !matchComm && !matchSkills) return false
    }

    return true
  })

  return (
    <div className="flex flex-col flex-1 h-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-slate-100">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Verified Campus Opportunities Feed
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Research & Positions
            </h1>
            <p className="text-indigo-200/80 text-sm mt-1 max-w-2xl">
              Browse faculty research projects, TA positions, lab assistantships, and student club openings published directly by university staff.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-indigo-800/30">
          <div className="relative">
            <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by title, skills, PI, or club..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-indigo-900/50 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-950/80 border border-indigo-900/50 rounded-xl text-xs sm:text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
            >
              <option value="all">All Opportunity Types</option>
              <option value="Research">🔬 Academic Research & Grants</option>
              <option value="TA">👨‍🏫 Teaching Assistant (TA)</option>
              <option value="Lab Assistant">🧪 Lab Assistant</option>
              <option value="Internship">💼 Campus Internship</option>
              <option value="Project">🚀 Club / Faculty Project</option>
            </select>
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-950/80 border border-indigo-900/50 rounded-xl text-xs sm:text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
            >
              <option value="all">All Faculty Streams</option>
              <option value="Information & Communication Technology">Information & Communication Technology</option>
              <option value="Bio-Systems Technology">Bio-Systems Technology</option>
              <option value="Engineering Technology">Engineering Technology</option>
            </select>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          {message}
        </div>

        {/* Filters */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Filters</p>
          <div className="flex flex-col gap-4">
            {/* Paid only toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Paid only</span>
              <button
                onClick={() => setPaidOnly(!paidOnly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  paidOnly ? 'bg-teal-500' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${paidOnly ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Remote only toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Remote only</span>
              <button
                onClick={() => setRemoteOnly(!remoteOnly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  remoteOnly ? 'bg-teal-500' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${remoteOnly ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              Explore <Sparkles className="w-6 h-6 text-amber-500" />
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {filtered.length} opportunit{filtered.length === 1 ? 'y' : 'ies'} available
              {activeCategories.length > 0 ? ` in ${activeCategories.join(', ')}` : ''}
            </p>
          </div>
        </div>



        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-48 bg-slate-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-slate-400">No opportunities found for the selected filters.</p>
            <button onClick={() => { setActiveCategories([]); setPaidOnly(false); setRemoteOnly(false) }} className="mt-4 text-teal-400 text-sm hover:underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((opp) => {
              return (
                <div key={opp.id} className="flex flex-col justify-between p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-sm hover:shadow-md transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 text-xs font-semibold text-teal-400 bg-teal-950/50 rounded-full border border-teal-900">
                        {opp.type}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Open
                      </span>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-56 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800">
          <p className="text-gray-500 dark:text-gray-400">No opportunities match your current filters. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((opp) => {
            const isApplied = appliedSet.has(opp.id)
            const isResearch = opp.type === 'Research' || opp.title.startsWith('[Research]')

            return (
              <div
                key={opp.id}
                className={`flex flex-col justify-between p-6 rounded-3xl border transition-all ${
                  isResearch
                    ? 'bg-slate-900/95 border-purple-800/40 hover:border-purple-600/60 shadow-lg shadow-purple-950/20'
                    : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:border-indigo-500/40 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full border ${
                          isResearch
                            ? 'text-purple-300 bg-purple-950/70 border-purple-700/50'
                            : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900'
                        }`}
                      >
                        {isResearch ? '🔬 Research Project' : opp.type}
                      </span>

                      {opp.community_name && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                          🏢 {opp.community_name}
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" /> Open
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {opp.title}
                  </h3>

                  <div className="space-y-1 mb-4 text-xs text-gray-500 dark:text-gray-400">
                    <p className="flex items-center gap-1.5 font-medium">
                      <Building2 className="w-4 h-4 text-gray-400" /> {opp.department}
                    </p>

                    {opp.supervisor && (
                      <p className="text-purple-400 font-medium">
                        • Lead Supervisor: {opp.supervisor}
                      </p>
                    )}

                    {opp.funding_type && (
                      <p className="text-emerald-400 font-medium">
                        • Funding: {opp.funding_type}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {opp.description}
                  </p>

                  {opp.required_skills && opp.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {opp.required_skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-lg font-mono font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{opp.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                      <Building2 className="w-4 h-4" /> {opp.department} Department
                    </p>
                    <p className="text-sm text-slate-300 mb-4 line-clamp-3 leading-relaxed">
                      {opp.description}
                    </p>
                    {opp.required_skills && opp.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {opp.required_skills.map((skill, i) => (
                          <span key={i} className="px-2.5 py-0.5 text-xs bg-slate-800 text-slate-300 rounded-md font-mono">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => router.push(`/cob/student/opportunities/${opp.id}`)}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-all hover:scale-[1.01]"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

                <button
                  onClick={() => handleApply(opp.id)}
                  disabled={isApplied || applyingId === opp.id}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all ${
                    isApplied
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 cursor-default'
                      : isResearch
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Application Submitted
                    </>
                  ) : applyingId === opp.id ? (
                    'Submitting Application...'
                  ) : (
                    <>
                      <Briefcase className="w-4 h-4" /> Apply for Position →
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
