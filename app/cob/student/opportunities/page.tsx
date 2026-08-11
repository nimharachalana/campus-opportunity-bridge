'use client'

import { useEffect, useState } from 'react'
import { fetchOpportunities } from '@/app/lib/api/opportunities'
import { applyToOpportunity } from '@/app/lib/api/applications'
import { useAuth } from '@/app/context/AuthContext'
import { Opportunity } from '@/app/types'
import { Briefcase, Building2, CheckCircle2, Clock, Sparkles } from 'lucide-react'

export default function StudentOpportunitiesPage() {
  const { session } = useAuth()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
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

  const handleApply = async (opportunityId: string) => {
    if (!session?.user?.id) {
      alert('Please sign in to apply')
      return
    }

    setApplyingId(opportunityId)
    setMessage(null)

    try {
      await applyToOpportunity(opportunityId, session.user.id)
      setAppliedSet((prev) => new Set(prev).add(opportunityId))
      setMessage('Application submitted successfully!')
    } catch (err: any) {
      alert(err.message || 'Failed to submit application')
    } finally {
      setApplyingId(null)
    }
  }

  return (
    <div className="flex flex-col flex-1 h-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Campus Opportunities <Sparkles className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Discover research positions, internships, and TA roles tailored for students.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          {message}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-48 bg-gray-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
          <p className="text-gray-500 dark:text-gray-400">No opportunities available right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opp) => {
            const isApplied = appliedSet.has(opp.id)

            return (
              <div
                key={opp.id}
                className="flex flex-col justify-between p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 rounded-full border border-blue-200 dark:border-blue-900">
                      {opp.type}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Open
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{opp.title}</h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-4">
                    <Building2 className="w-4 h-4 text-gray-400" /> {opp.department} Department
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>

                  {opp.required_skills && opp.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {opp.required_skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 text-xs bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-md font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleApply(opp.id)}
                  disabled={isApplied || applyingId === opp.id}
                  className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm flex justify-center items-center gap-2 transition-all ${
                    isApplied
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Applied
                    </>
                  ) : applyingId === opp.id ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Briefcase className="w-4 h-4" /> Apply Position
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
