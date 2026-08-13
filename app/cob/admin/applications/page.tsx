'use client'

import { useEffect, useState } from 'react'
import { fetchAllApplications, updateApplicationStatus } from '@/app/lib/api/applications'
import { ApplicationStatus } from '@/app/types'
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  Building2,
  Layers,
  Award,
  AlertCircle
} from 'lucide-react'

export default function AdminApplicationsReviewPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    const data = await fetchAllApplications()
    setApplications(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    if (newStatus === 'pending') return // pending is not a valid transition target
    setUpdatingId(id)
    try {
      await updateApplicationStatus(id, newStatus)
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      )
      setFeedback(`Status updated to "${newStatus.replace('_', ' ').toUpperCase()}" successfully!`)
      setTimeout(() => setFeedback(null), 3500)
    } catch (err: any) {
      alert(err.message || 'Failed to update application status')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredApps = applications.filter((app) => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = app.opportunity?.title?.toLowerCase().includes(q)
      const matchDept = app.opportunity?.department?.toLowerCase().includes(q)
      const matchStudentId = app.student?.student_id?.toLowerCase().includes(q)
      const matchEmail = app.student?.email?.toLowerCase().includes(q)
      const matchName = app.student?.full_name?.toLowerCase().includes(q)
      if (!matchTitle && !matchDept && !matchStudentId && !matchEmail && !matchName) return false
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
              <UserCheck className="w-3.5 h-3.5" /> Candidate Evaluation & Decision Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Review Community Applicants
            </h1>
            <p className="text-purple-200/80 text-sm mt-1 max-w-2xl font-light">
              Evaluate student profiles, review academic qualifications, and manage admission or hiring decisions.
            </p>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-purple-800/30">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by Student ID, Name, Email, or Position Title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-purple-900/50 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-purple-900/50 text-xs overflow-x-auto">
            {(['all', 'pending', 'under_review', 'accepted', 'rejected'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-purple-950/60 border border-purple-500/50 rounded-2xl text-purple-200 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-slate-900/60 rounded-3xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-sm">No applications found matching your current filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const isAccepted = app.status === 'accepted'
            const isRejected = app.status === 'rejected'
            const isReview = app.status === 'under_review'

            return (
              <div
                key={app.id}
                className="p-6 bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800">
                      {app.opportunity?.title || 'Community Position'}
                    </span>

                    {app.opportunity?.department && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-950 text-slate-300 border border-slate-800">
                        {app.opportunity?.department}
                      </span>
                    )}

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isAccepted
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : isRejected
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : isReview
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      ● Status: {app.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                    <p>
                      <strong>Applicant ID:</strong>{' '}
                      <span className="font-mono text-purple-300 font-bold">
                        {app.student?.student_id || app.student?.email || 'IT2022091'}
                      </span>
                    </p>
                    {app.student?.full_name && (
                      <p>
                        <strong>Name:</strong> {app.student?.full_name}
                      </p>
                    )}
                    <p className="text-slate-400">
                      <strong>Applied Date:</strong> {new Date(app.applied_at || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Decision Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
                  <button
                    type="button"
                    disabled={updatingId === app.id || isAccepted}
                    onClick={() => handleStatusChange(app.id, 'accepted')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                      isAccepted
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accept
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === app.id || isReview}
                    onClick={() => handleStatusChange(app.id, 'under_review')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                      isReview
                        ? 'bg-amber-950 text-amber-400 border border-amber-800/80 cursor-default'
                        : 'bg-amber-600 hover:bg-amber-500 text-white'
                    }`}
                  >
                    <Clock className="w-4 h-4" /> Under Review
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === app.id || isRejected}
                    onClick={() => handleStatusChange(app.id, 'rejected')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                      isRejected
                        ? 'bg-rose-950 text-rose-400 border border-rose-800/80 cursor-default'
                        : 'bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-600/40'
                    }`}
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
