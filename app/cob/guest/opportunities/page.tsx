'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchOpportunities } from '@/app/lib/api/opportunities'
import { Opportunity } from '@/app/types'
import { Briefcase, Building2, Clock, Compass, Sparkles, LogIn } from 'lucide-react'

export default function GuestOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await fetchOpportunities()
      setOpportunities(data)
      setLoading(false)
    }
    loadData()
  }, [])

  const handleApplyClick = () => {
      // Direct guest to login page if they try to apply
      router.push('/cob/auth/login')
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="bg-teal-900/5 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                Explore Opportunities <Compass className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                Browse through all open campus research positions, internships, and TA roles. Sign in or create an account to submit your applications.
            </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Compass className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">No public opportunities are available right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="flex flex-col justify-between p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 rounded-full border border-teal-200 dark:border-teal-900/60">
                      {opp.type}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5" /> Open
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {opp.title}
                  </h3>

                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-4">
                    <Building2 className="w-4 h-4 text-slate-400" /> {opp.department} Department
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={handleApplyClick}
                        className="w-full py-2.5 px-4 rounded-xl font-medium text-sm flex justify-center items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 dark:hover:text-white transition-all"
                    >
                        <LogIn className="w-4 h-4" /> Sign In to Apply
                    </button>
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  )
}
