'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { applyToOpportunity } from '@/app/lib/api/applications'
import { Opportunity, Profile } from '@/app/types'
import {
    ArrowLeft, CheckCircle2, Building2, Calendar, MapPin,
    Users, Clock, Briefcase, Star, BadgeCheck, Zap
} from 'lucide-react'

// Circular progress SVG
function CircleProgress({ pct }: { pct: number }) {
    const r = 44
    const circ = 2 * Math.PI * r
    const dash = (pct / 100) * circ
    return (
        <svg width={112} height={112} viewBox="0 0 112 112" className="rotate-[-90deg]">
            <circle cx={56} cy={56} r={r} fill="none" stroke="#1e293b" strokeWidth={10} />
            <circle
                cx={56} cy={56} r={r} fill="none"
                stroke="#14b8a6" strokeWidth={10}
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
        </svg>
    )
}


export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [opp, setOpp] = useState<Opportunity | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [applying, setApplying] = useState(false)
    const [applied, setApplied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    
    // Skill ratings state
    const [skillRatings, setSkillRatings] = useState<Record<string, number>>({})

    // Calculated match score from skill ratings
    const [matchScore, setMatchScore] = useState(0)

    useEffect(() => {
        async function load() {
            setLoading(true)
            // Fetch opportunity
            const { data: oppData } = await supabase
                .from('opportunities')
                .select('*')
                .eq('id', id)
                .single()

            if (oppData) setOpp(oppData as Opportunity)

            // Fetch current user profile
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: prof } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                if (prof) setProfile(prof as Profile)

                // Check if already applied
                const { data: existing } = await supabase
                    .from('applications')
                    .select('id')
                    .eq('opportunity_id', id)
                    .eq('student_id', user.id)
                    .single()
                if (existing) setApplied(true)
            }
            setLoading(false)
        }
        load()
    }, [id])

    // Initialize skill ratings and calculate average
    useEffect(() => {
        if (!opp) return
        const required = opp.required_skills ?? []
        
        // Initialize ratings if empty
        if (required.length > 0 && Object.keys(skillRatings).length === 0) {
            const initial: Record<string, number> = {}
            required.forEach(s => { initial[s] = 50 })
            setSkillRatings(initial)
            setMatchScore(50)
            return
        }

        // Calculate average
        const keys = Object.keys(skillRatings)
        if (keys.length === 0) {
            setMatchScore(85) // Default if no skills required
        } else {
            const sum = keys.reduce((acc, k) => acc + skillRatings[k], 0)
            setMatchScore(Math.round(sum / keys.length))
        }
    }, [opp, skillRatings])



    const submitApplication = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/cob/auth/login'); return }
        setApplying(true)
        setError(null)
        
        let notes = ''
        if (Object.keys(skillRatings).length > 0) {
            notes = "Student Self-Assessed Skill Levels:\n" + 
                    Object.entries(skillRatings).map(([skill, pct]) => `- ${skill}: ${pct}%`).join('\n')
        }

        try {
            await applyToOpportunity(id, user.id, notes)
            setApplied(true)
        } catch (e: unknown) {
            setError((e as Error).message || 'Failed to apply. Please try again.')
        } finally {
            setApplying(false)
        }
    }

    const formatDate = (d?: string | null) => {
        if (!d) return '—'
        return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    const daysLeft = (deadline?: string | null) => {
        if (!deadline) return null
        const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
        return diff > 0 ? `${diff} days left` : 'Expired'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!opp) {
        return (
            <div className="text-center py-20 text-slate-400">
                <p>Opportunity not found.</p>
                <button onClick={() => router.back()} className="mt-4 text-teal-400 hover:underline text-sm">Go back</button>
            </div>
        )
    }

    const studentSkills = (profile?.skills ?? []).map((s: string) => s.toLowerCase())
    const required = opp.required_skills ?? []

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Back button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors w-fit"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Explore
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Left Column ── */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    {/* Main Info Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="px-3 py-1 text-xs font-bold text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/40 rounded-full flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5" /> {opp.type}
                            </span>
                            <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/40 rounded-full flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5" /> Active
                            </span>
                            <span className="px-3 py-1 text-xs font-bold text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800 rounded-full flex items-center gap-1.5">
                                <BadgeCheck className="w-3.5 h-3.5 text-teal-500" /> Org Verified
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{opp.title}</h1>
                        <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-5 flex items-center gap-1.5">
                            <Building2 className="w-4 h-4" />
                            {opp.organization || opp.department}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{opp.description}</p>
                    </div>

                    {/* Eligibility & Requirements */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Eligibility & Requirements</h2>

                        {opp.eligibility && (
                            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 mb-5 text-sm text-slate-600 dark:text-slate-300">
                                {opp.eligibility}
                            </div>
                        )}

                        {required.length > 0 && (
                            <div className="mb-5">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Required Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {required.map((skill, i) => {
                                        const matched = studentSkills.includes(skill.toLowerCase())
                                        return (
                                            <span
                                                key={i}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${
                                                    matched
                                                        ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                                }`}
                                            >
                                                {matched && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                {skill}
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {opp.benefits && (
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Benefits</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{opp.benefits}</p>
                            </div>
                        )}
                    </div>

                    {/* Logistics */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Logistics</h2>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
                            {[
                                { label: 'Deadline', icon: Clock, value: opp.deadline ? `${formatDate(opp.deadline)} (${daysLeft(opp.deadline)})` : '—' },
                                { label: 'Start Date', icon: Calendar, value: formatDate(opp.start_date) },
                                { label: 'Location', icon: MapPin, value: opp.location || 'Not specified' },
                                { label: 'Faculty', icon: Users, value: opp.faculty || 'Any' },
                                { label: 'Posted', icon: Calendar, value: formatDate(opp.created_at) },
                                { label: 'Sources', icon: Star, value: opp.sources || opp.department },
                            ].map(({ label, icon: Icon, value }) => (
                                <div key={label}>
                                    <p className="text-xs text-slate-400 mb-1">{label}</p>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-start gap-1.5">
                                        <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" /> {value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Match Score ── */}
                <div className="flex flex-col gap-5">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sticky top-24">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">Your Match Score</h2>

                        {/* Circle + callouts */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative shrink-0">
                                <CircleProgress pct={matchScore} />
                                <div className="absolute inset-0 flex items-center justify-center rotate-0">
                                    <span className="text-2xl font-extrabold text-teal-400">{matchScore}%</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-medium">
                                {required.length > 0 && profile?.skills && (
                                    <p className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 px-2.5 py-1.5 rounded-lg">
                                        Your skills match {required.filter(s => studentSkills.includes(s.toLowerCase())).length}/{required.length} skills
                                    </p>
                                )}
                                <p className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 px-2.5 py-1.5 rounded-lg">
                                    {opp.type} matches preferred types
                                </p>
                                <p className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 px-2.5 py-1.5 rounded-lg">
                                    Meets eligibility requirements
                                </p>
                            </div>
                        </div>

                        {/* Score breakdown bars */}
                        <div className="flex flex-col gap-4">
                            {Object.keys(skillRatings).length > 0 ? (
                                Object.keys(skillRatings).map((skill) => (
                                    <div key={skill} className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">{skill}</span>
                                            <span className="text-teal-600 dark:text-teal-400 font-bold">{skillRatings[skill]}%</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="100" 
                                            step="5"
                                            value={skillRatings[skill]}
                                            onChange={(e) => setSkillRatings(prev => ({ ...prev, [skill]: parseInt(e.target.value) }))}
                                            className="w-full accent-teal-500 h-1.5"
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400">No specific skills required.</p>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-950/40 border border-red-800 rounded-xl text-red-300 text-xs">
                                {error}
                            </div>
                        )}

                        {/* Apply Now button */}
                        <button
                            onClick={submitApplication}
                            disabled={applied || applying}
                            className={`mt-6 w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                                applied
                                    ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800 cursor-default'
                                    : 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/40 hover:scale-[1.01] disabled:opacity-60'
                            }`}
                        >
                            {applied ? (
                                <><CheckCircle2 className="w-5 h-5" /> Applied!</>
                            ) : applying ? 'Submitting...' : (
                                <>Apply Now ↗</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
