'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { fetchOpportunities } from '@/app/lib/api/opportunities'
import { applyToOpportunity } from '@/app/lib/api/applications'
import { supabase } from '@/app/lib/supabase'
import { Opportunity } from '@/app/types'
import { Building2, Clock, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'

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

export default function StudentOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Filter state
  const [activeCategories, setActiveCategories] = useState<string[]>([])
  const [paidOnly, setPaidOnly] = useState(false)
  const [remoteOnly, setRemoteOnly] = useState(false)

  // Apply state
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const [appliedSet, setAppliedSet] = useState<Set<string>>(new Set())
  const [message, setMessage] = useState<string | null>(null)

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
      const opp = opportunities.find(o => o.id === opportunityId)
      if (opp && opp.max_applicants) {
        const { count: regCount } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('opportunity_id', opportunityId)
        const { count: guestCount } = await supabase.from('guest_applications').select('*', { count: 'exact', head: true }).eq('opportunity_id', opportunityId)
        
        const total = (regCount || 0) + (guestCount || 0)
        
        if (total >= opp.max_applicants) {
          alert('Sorry, this opportunity has reached its maximum number of applicants.')
          setApplyingId(null)
          return
        }
      }

      await applyToOpportunity(opportunityId, studentId)
      setAppliedSet((prev) => new Set(prev).add(opportunityId))
      setMessage('Application submitted successfully!')
    } catch (err: any) {
      alert(err.message || 'Failed to submit application')
    } finally {
      setApplyingId(null)
    }
  }

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

        {message && (
          <div className="flex items-center gap-2 p-3 bg-emerald-950/50 border border-emerald-700/40 rounded-xl text-emerald-300 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            {message}
          </div>
        )}

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
              const alreadyApplied = appliedSet.has(opp.id)
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/cob/student/opportunities/${opp.id}`)}
                      className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-all hover:scale-[1.01]"
                    >
                      View Details <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApply(opp.id)}
                      disabled={alreadyApplied || applyingId === opp.id}
                      className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        alreadyApplied
                          ? 'bg-slate-700 text-slate-400 cursor-default'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      {alreadyApplied ? '✓ Applied' : applyingId === opp.id ? 'Applying…' : 'Apply'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
