'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { fetchAllApplications } from '@/app/lib/api/applications'
import { Users, Briefcase, FileCheck, ShieldCheck, ChevronRight, Calendar, UserCircle } from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    usersCount: 0,
    opportunitiesCount: 0,
    applicationsCount: 0,
  })
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        usersCount: 0,
        opportunitiesCount: 0,
        applicationsCount: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadMetrics() {
            setLoading(true)

      const [{ count: usersCount }, { count: oppsCount }, { count: appsCount }, appsData] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('opportunities').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        fetchAllApplications(),
      ])

      setApplications(appsData || [])

      setStats({
        usersCount: usersCount || 0,
        opportunitiesCount: oppsCount || 0,
        applicationsCount: appsCount || 0,
      })
            const [{ count: usersCount }, { count: oppsCount }, { count: appsCount }] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('opportunities').select('*', { count: 'exact', head: true }),
                supabase.from('applications').select('*', { count: 'exact', head: true }),
            ])

            setStats({
                usersCount: usersCount || 0,
                opportunitiesCount: oppsCount || 0,
                applicationsCount: appsCount || 0,
            })

            setLoading(false)
        }

        loadMetrics()
    }, [])

    return (
        <div className="flex flex-col flex-1 max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
            <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Administrator Metrics <ShieldCheck className="w-7 h-7 text-purple-500" />
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Live system stats powered directly by Supabase SDK.
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-36 bg-gray-100 dark:bg-zinc-900 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                        <div className="p-3.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Registered Users</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.usersCount}</h3>
                        </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                        <div className="p-3.5 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Open Opportunities</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.opportunitiesCount}</h3>
                        </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <FileCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Submitted Applications</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.applicationsCount}</h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
      )}

      {/* Applications List */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Applications</h2>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(n => <div key={n} className="h-32 bg-gray-100 dark:bg-zinc-900 rounded-2xl animate-pulse" />)}
          </div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 text-gray-500">
            No applications received yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app: any) => (
              <div key={app.id} className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:border-teal-500/50">
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between sm:justify-start sm:gap-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {app.opportunity?.title || 'Unknown Opportunity'}
                    </h3>
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full border ${
                      app.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/50 dark:border-amber-900/50' : 
                      app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-900/50' : 
                      'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <UserCircle className="w-4 h-4" /> 
                      {app.student?.full_name || app.student?.email || 'Unknown Student'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> 
                      {new Date(app.applied_at).toLocaleDateString()}
                    </div>
                  </div>

                  {app.notes && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Student Skills (Self-Assessed):</p>
                      <pre className="text-xs text-gray-500 dark:text-gray-400 font-sans whitespace-pre-wrap leading-relaxed">
                        {app.notes}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex items-center justify-end sm:flex-col gap-2">
                   <button className="px-4 py-2 text-sm font-semibold bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 rounded-xl transition-colors">
                     Review Application
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
    )
}
