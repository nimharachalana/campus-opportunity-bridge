'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import { fetchStudentApplications } from '@/app/lib/api/applications'
import { Profile } from '@/app/types'
import { FileCheck, Calendar, Briefcase, ChevronRight, Clock, CheckCircle, FolderOpen, GraduationCap, Building2, Star, UserCircle, X, Mail, Pencil } from 'lucide-react'

export default function StudentDashboard() {
    const [firstName, setFirstName] = useState('Student')
    const [greeting, setGreeting] = useState('Good morning')
    const [currentDate, setCurrentDate] = useState('')
    const [applications, setApplications] = useState<any[]>([])
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadDashboard() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            
            if (user) {
                if (user.user_metadata?.full_name) {
                    const nameParts = user.user_metadata.full_name.split(' ')
                    setFirstName(nameParts[0])
                }

                // Fetch profile
                const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                if (prof) {
                    setProfile(prof as Profile)
                    if (prof.full_name) setFirstName(prof.full_name.split(' ')[0])
                }
                
                // Fetch student applications
                const apps = await fetchStudentApplications(user.id)
                setApplications(apps || [])
            }
            setLoading(false)
        }
        loadDashboard()

        // Set dynamic date and greeting
        const now = new Date()
        const hour = now.getHours()
        
        if (hour < 12) setGreeting('Good morning')
        else if (hour < 18) setGreeting('Good afternoon')
        else setGreeting('Good evening')

        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        }
        setCurrentDate(now.toLocaleDateString('en-GB', options))
    }, [])

    return (
        <>
        <div className="flex flex-col gap-8 w-full max-w-6xl">
            {/* Welcome Banner */}
            <div className="bg-[#172554] rounded-3xl p-8 md:p-10 shadow-lg border border-[#1e3a8a]">
                <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
                    {/* Left: Text & Greeting */}
                    <div className="flex flex-col max-w-2xl">
                        <span className="text-teal-400 font-medium text-sm md:text-base tracking-wide mb-3">
                            {currentDate}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif tracking-tight">
                            {greeting}, {firstName}.
                        </h1>
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                            You have submitted <span className="text-teal-400 font-semibold">{applications.length} applications</span> so far. 
                            {applications.length > 0 && (
                                <>
                                    {' '}Currently, <span className="text-amber-400 font-semibold">{applications.filter(a => a.status === 'pending').length} are pending review</span> 
                                    {' '}and <span className="text-emerald-400 font-semibold">{applications.filter(a => a.status === 'accepted').length} have been accepted</span>.
                                </>
                            )}
                            {' '}Keep exploring to find more great matches!
                        </p>
                    </div>

                    {/* Right: Small Metric Blocks */}
                    <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0 overflow-x-auto pb-2 lg:pb-0">
                        {/* Total Applied */}
                        <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-6 min-w-[150px]">
                            <div className="flex items-center gap-3">
                                <FolderOpen className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-100 text-xs font-semibold uppercase tracking-wider">Applied</span>
                            </div>
                            <span className="text-xl font-bold text-white">{applications.length}</span>
                        </div>

                        {/* Pending */}
                        <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-6 min-w-[150px]">
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-amber-400" />
                                <span className="text-amber-100 text-xs font-semibold uppercase tracking-wider">Pending</span>
                            </div>
                            <span className="text-xl font-bold text-white">{applications.filter(a => a.status === 'pending').length}</span>
                        </div>

                        {/* Approved */}
                        <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-6 min-w-[150px]">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">Approved</span>
                            </div>
                            <span className="text-xl font-bold text-white">{applications.filter(a => a.status === 'accepted').length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Applications Section */}
            <div className="flex flex-col gap-5 mt-4">
                    <div className="flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-teal-400" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Applications</h2>
                    </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2].map(n => <div key={n} className="h-28 bg-[#121826] rounded-2xl animate-pulse border border-slate-800" />)}
                    </div>
                ) : applications.length === 0 ? (
                    <div className="p-8 text-center bg-[#121826] rounded-2xl border border-dashed border-slate-700 text-slate-500">
                        You haven't applied to any opportunities yet.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {applications.map((app: any) => (
                            <div key={app.id} className="p-5 bg-[#121826] rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-slate-700">
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-bold text-white text-base">
                                        {app.opportunity?.title || 'Unknown Opportunity'}
                                    </h3>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Briefcase className="w-3.5 h-3.5" /> 
                                            {app.opportunity?.organization || app.opportunity?.department || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" /> 
                                            Applied {new Date(app.applied_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                    <span className={`px-3 py-1 text-[10px] uppercase font-bold rounded-full border ${
                                        app.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                                        app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                        'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}>
                                        {app.status}
                                    </span>
                                    <button className="text-teal-500 hover:text-teal-400 bg-teal-900/20 hover:bg-teal-900/40 p-2 rounded-full transition-colors flex items-center justify-center">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                </div>
            </div>

        </>
    )
}
