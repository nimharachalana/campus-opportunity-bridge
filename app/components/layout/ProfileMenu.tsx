'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Profile } from '@/app/types'
import { X, Mail, Building2, GraduationCap, Star, Pencil, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProfileMenu() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [firstName, setFirstName] = useState('Student')
    const [showProfile, setShowProfile] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                if (user.user_metadata?.full_name) {
                    setFirstName(user.user_metadata.full_name.split(' ')[0])
                }
                const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                if (prof) {
                    setProfile(prof as Profile)
                    if (prof.full_name) setFirstName(prof.full_name.split(' ')[0])
                }
            }
        }
        loadProfile()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        localStorage.removeItem('cob_current_student')
        localStorage.removeItem('cob_current_user')
        router.push('/cob/auth/login')
    }

    return (
        <>
            {/* Trigger Button */}
            <button 
                onClick={() => setShowProfile(true)}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent hover:border-teal-500 transition-all flex items-center justify-center overflow-hidden ml-4"
            >
                {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        {firstName.charAt(0).toUpperCase()}
                    </div>
                )}
            </button>

            {/* Profile Slide-Over Panel */}
            {showProfile && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={() => setShowProfile(false)}
                    />
                    {/* Panel */}
                    <div className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Profile Details</h2>
                            <button
                                onClick={() => setShowProfile(false)}
                                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Avatar + Name */}
                        <div className="flex flex-col items-center gap-3 p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-teal-500/30 shadow-xl" />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                                    {firstName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profile?.full_name || firstName}</h3>
                                <span className="inline-block mt-1 px-3 py-0.5 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold rounded-full capitalize">
                                    {profile?.role || 'Student'}
                                </span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex flex-col gap-5 p-6">
                            {/* Email */}
                            <div className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
                                    <p className="text-sm text-slate-800 dark:text-white font-medium">{profile?.email || '—'}</p>
                                </div>
                            </div>

                            {/* Department */}
                            {profile?.department && (
                                <div className="flex items-start gap-3">
                                    <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Department</p>
                                        <p className="text-sm text-slate-800 dark:text-white font-medium">{profile.department}</p>
                                    </div>
                                </div>
                            )}

                            {/* GPA */}
                            {profile?.gpa != null && (
                                <div className="flex items-start gap-3">
                                    <GraduationCap className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">GPA</p>
                                        <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">{profile.gpa}</p>
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            {(profile?.skills ?? []).length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Star className="w-3.5 h-3.5" /> Skills
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(profile?.skills ?? []).map(skill => (
                                            <span key={skill} className="px-2.5 py-1 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-full text-xs font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer actions */}
                        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                            <a
                                href="/cob/student/profile"
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition-all shadow-md shadow-teal-900/20"
                            >
                                <Pencil className="w-4 h-4" /> Edit Profile
                            </a>
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-600 hover:text-red-600 font-bold text-sm transition-all"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
