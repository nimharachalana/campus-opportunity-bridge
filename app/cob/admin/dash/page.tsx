'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { fetchOpportunities } from '@/app/lib/api/opportunities'
import { fetchAllApplications, updateApplicationStatus } from '@/app/lib/api/applications'
import { Opportunity, Application } from '@/app/types'
import {
  Users,
  Briefcase,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Sparkles,
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  Eye,
  Layers,
  Award
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const [adminProfile, setAdminProfile] = useState<{
    name: string
    community: string
    role: string
  }>({
    name: 'Community Admin',
    community: 'ICT Circle',
    role: 'admin',
  })

  const [metrics, setMetrics] = useState({
    usersCount: 124,
    oppsCount: 0,
    pendingCount: 0,
    acceptedCount: 0,
  })

  const [communityOpps, setCommunityOpps] = useState<Opportunity[]>([])
  const [pendingApplications, setPendingApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [decisionNotice, setDecisionNotice] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    // Read current admin from session
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cob_current_admin') || localStorage.getItem('cob_current_user')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setAdminProfile({
            name: parsed.full_name || 'Community Admin',
            community: parsed.community_name || 'ICT Circle',
            role: parsed.role || 'admin',
          })
        } catch (e) {
          console.warn('Error reading admin session:', e)
        }
      }
    }
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)

    // 1. Fetch opportunities
    const allOpps = await fetchOpportunities()
    const currentComm = adminProfile.community

    // Filter opportunities relevant to this community (or all if super admin)
    const filteredOpps = allOpps.filter(
      (opp) => !opp.community_name || opp.community_name === currentComm || currentComm === 'General Faculty'
    )
    setCommunityOpps(filteredOpps)

    // 2. Fetch applications
    const allApps = await fetchAllApplications()
    const pending = allApps.filter((a) => a.status === 'pending')
    const accepted = allApps.filter((a) => a.status === 'accepted')
    setPendingApplications(pending.slice(0, 5))

    // 3. User count from profiles or fallback
    let uCount = 124
    try {
      const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      if (count !== null && count > 0) uCount = count
    } catch (e) {
      console.warn('Profiles count notice:', e)
    }

    setMetrics({
      usersCount: uCount,
      oppsCount: filteredOpps.length,
      pendingCount: pending.length,
      acceptedCount: accepted.length,
    })

    setLoading(false)
  }

  useEffect(() => {
    loadDashboardData()
  }, [adminProfile.community])

  const handleDecision = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    setUpdatingId(applicationId)
    try {
      await updateApplicationStatus(applicationId, newStatus)
      setDecisionNotice(
        `Application ${newStatus === 'accepted' ? 'Accepted ✅' : 'Declined ❌'} successfully!`
      )
      // Refresh list
      loadDashboardData()
      setTimeout(() => setDecisionNotice(null), 4000)
    } catch (err: any) {
      alert(err.message || 'Failed to update application.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="flex flex-col flex-1 max-w-6xl mx-auto space-y-6 text-slate-100">
      {/* Header Community Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" /> {adminProfile.community} Community Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {adminProfile.name}
            </h1>
            <p className="text-purple-200/80 text-sm max-w-2xl font-light">
              Manage opportunities, review student candidates, and track community engagement for{' '}
              <strong className="text-white font-semibold">{adminProfile.community}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/cob/admin/opportunities"
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
            >
              <PlusCircle className="w-4 h-4" /> Add Opportunity
            </Link>
            <Link
              href="/cob/admin/applications"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all"
            >
              <UserCheck className="w-4 h-4 text-purple-400" /> Review Applicants
            </Link>
          </div>
        </div>
      </div>

      {/* Decision Notice */}
      {decisionNotice && (
        <div className="p-4 bg-purple-950/60 border border-purple-500/50 rounded-2xl text-purple-200 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{decisionNotice}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-4 shadow-sm hover:border-purple-500/40 transition-all">
          <div className="p-3.5 bg-blue-950/80 text-blue-400 rounded-xl border border-blue-800/40">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Registered Users</p>
            <h3 className="text-2xl font-bold text-white">{metrics.usersCount}</h3>
          </div>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-4 shadow-sm hover:border-purple-500/40 transition-all">
          <div className="p-3.5 bg-purple-950/80 text-purple-400 rounded-xl border border-purple-800/40">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Community Roles</p>
            <h3 className="text-2xl font-bold text-white">{metrics.oppsCount}</h3>
          </div>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-4 shadow-sm hover:border-purple-500/40 transition-all">
          <div className="p-3.5 bg-amber-950/80 text-amber-400 rounded-xl border border-amber-800/40">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Reviews</p>
            <h3 className="text-2xl font-bold text-white">{metrics.pendingCount}</h3>
          </div>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-4 shadow-sm hover:border-purple-500/40 transition-all">
          <div className="p-3.5 bg-emerald-950/80 text-emerald-400 rounded-xl border border-emerald-800/40">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Accepted Candidates</p>
            <h3 className="text-2xl font-bold text-white">{metrics.acceptedCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Decision Queue & Community Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pending Candidate Decisions */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-400" /> Pending Applicant Decisions
              </h2>
              <p className="text-xs text-slate-400">Directly accept or reject submissions for your community.</p>
            </div>
            <Link
              href="/cob/admin/applications"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              View Full Queue →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 bg-slate-950/60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : pendingApplications.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/60">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-300">All caught up!</p>
              <p className="text-xs text-slate-500 mt-0.5">No pending applicant submissions require review at this moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-slate-950/80 border border-slate-800/80 hover:border-purple-500/40 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {app.opportunity?.title || 'Community Position'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                        {app.opportunity?.type || 'Role'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      Applicant ID:{' '}
                      <strong className="text-slate-200 font-mono">
                        {app.student?.student_id || app.student?.email || 'IT2022045'}
                      </strong>{' '}
                      • Applied {new Date(app.applied_at || Date.now()).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={updatingId === app.id}
                      onClick={() => handleDecision(app.id, 'accepted')}
                      className="flex-1 sm:flex-initial px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950 flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === app.id}
                      onClick={() => handleDecision(app.id, 'rejected')}
                      className="flex-1 sm:flex-initial px-3.5 py-1.5 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-600/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Active Community Opportunities */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-400" /> Active Roles
              </h2>
              <p className="text-xs text-slate-400">{adminProfile.community} postings</p>
            </div>
            <Link
              href="/cob/admin/opportunities"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              + Post
            </Link>
          </div>

          {communityOpps.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/60">
              <p className="text-xs text-slate-400 mb-3">No active opportunities posted for this community yet.</p>
              <Link
                href="/cob/admin/opportunities"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Post First Opportunity
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {communityOpps.slice(0, 4).map((opp) => (
                <div
                  key={opp.id}
                  className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl hover:border-purple-500/30 transition-all space-y-1.5"
                >
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {opp.type}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      ● {opp.status === 'open' ? 'Active' : 'Closed'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1">{opp.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{opp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
