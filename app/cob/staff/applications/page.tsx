'use client'

import { useEffect, useState } from 'react'
import { fetchAllApplications, updateApplicationStatus } from '@/app/lib/api/applications'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'

export default function StaffApplicationsReviewPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await fetchAllApplications()
      setApplications(data)
      setLoading(false)
    }
    loadData()
  }, [])

  const handleStatusChange = async (id: string, newStatus: 'accepted' | 'rejected') => {
    setUpdatingId(id)
    try {
      await updateApplicationStatus(id, newStatus)
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      )
    } catch (err: any) {
      alert(err.message || 'Failed to update application status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="flex flex-col flex-1 max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Review Student Applicants</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Approve or decline student submissions for campus positions.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-gray-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800">
          <p className="text-gray-500 dark:text-gray-400">No applications have been submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {app.opportunity?.title || 'Position'}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                    {app.opportunity?.department}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Applicant Student ID:</strong>{' '}
                  <span className="font-mono">{app.student?.student_id || app.student?.email || 'Student'}</span>
                </p>
                <p className="text-xs text-gray-400">Applied on {new Date(app.applied_at).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-2">
                {app.status === 'accepted' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 text-xs font-semibold flex items-center gap-1 border border-emerald-200 dark:border-emerald-900">
                    <CheckCircle2 className="w-4 h-4" /> Accepted
                  </span>
                ) : app.status === 'rejected' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 text-xs font-semibold flex items-center gap-1 border border-rose-200 dark:border-rose-900">
                    <XCircle className="w-4 h-4" /> Declined
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(app.id, 'accepted')}
                      disabled={updatingId === app.id}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(app.id, 'rejected')}
                      disabled={updatingId === app.id}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
