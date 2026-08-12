'use client'

import { useEffect, useState } from 'react'
import { fetchStudentApplications } from '@/app/lib/api/applications'
import { supabase } from '@/app/lib/supabase'
import { Building2, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadApplications() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id) {
        setLoading(true)
        const data = await fetchStudentApplications(user.id)
        setApplications(data)
        setLoading(false)
      }
    }
    loadApplications()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
            <XCircle className="w-3.5 h-3.5" /> Declined
          </span>
        )
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            <AlertCircle className="w-3.5 h-3.5" /> Under Review
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        )
    }
  }

  return (
    <div className="flex flex-col flex-1 h-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Applications</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Track the status of positions you have applied for across departments.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-gray-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">You haven't submitted any applications yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm gap-4"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {app.opportunity?.title || 'Position'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> {app.opportunity?.department || 'Department'}
                </p>
                <p className="text-xs text-gray-400">
                  Applied on {new Date(app.applied_at).toLocaleDateString()}
                </p>
              </div>

              <div>{getStatusBadge(app.status)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
