'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { ROUTES } from '@/app/constants/routes'
import { User, Lock, Eye, EyeOff, ArrowRight, GraduationCap, ShieldCheck, Compass, AlertCircle, X } from 'lucide-react'
import Link from 'next/link'

export default function StudentLogin() {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const inputVal = identifier.trim()
        let loginEmail = inputVal

        // If input does NOT look like an email address, treat as student ID and lookup email from public.profiles
        if (!inputVal.includes('@')) {
            const { data: profile, error: lookupError } = await supabase
                .from('profiles')
                .select('email')
                .ilike('student_id', inputVal)
                .single()

            if (lookupError || !profile?.email) {
                setToastMessage('No student account found. Please click "Create Account" to register.')
                setTimeout(() => setToastMessage(null), 5000)
                setLoading(false)
                return
            }
            loginEmail = profile.email
        }

        // Sign in using Supabase Auth SDK
        const { data: signInData, error: authError } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password,
        })

        if (authError) {
            if (authError.message.toLowerCase().includes('invalid login credentials')) {
                setToastMessage('Account not found. Please click "Create Account" to register.')
                setTimeout(() => setToastMessage(null), 5000)
            } else {
                setError(authError.message)
            }
            setLoading(false)
            return
        }

        // Direct student to profile page as specified
        const role = signInData?.user?.user_metadata?.role || 'student'
        if (role === 'staff') {
            router.push(ROUTES.STAFF_DASH)
        } else if (role === 'admin') {
            router.push(ROUTES.ADMIN_DASH)
        } else {
            router.push(ROUTES.STUDENT_DASH)
        }

        setLoading(false)
    }

    return (
        <div className="flex min-h-screen w-full bg-slate-950 font-sans selection:bg-indigo-500 selection:text-white relative">
            {toastMessage && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 border border-indigo-500/30 text-indigo-200 px-5 py-3 rounded-2xl shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-8 duration-300">
                    <div className="p-1.5 bg-indigo-500/20 rounded-full">
                        <AlertCircle className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
                    <button type="button" onClick={() => setToastMessage(null)} className="ml-4 text-indigo-400/60 hover:text-indigo-300 hover:bg-indigo-500/10 p-1.5 rounded-full transition-all">
                        <X className="w-4 h-4"/>
                    </button>
                </div>
            )}
            {/* Left Side - Modern Indigo Graphic Banner */}
            <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 justify-between p-12 border-r border-indigo-900/30">
                {/* Micro-animated glows */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[120px]" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600/20 border border-indigo-400/30 backdrop-blur-md rounded-2xl">
                            <GraduationCap className="w-7 h-7 text-indigo-400" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">Campus Opportunity Bridge</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 backdrop-blur-md text-xs font-semibold text-indigo-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Student Access Portal
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                        Unlock Campus Research & Internships.
                    </h1>
                    <p className="text-indigo-200/80 text-base leading-relaxed font-light">
                        Connect with faculty labs, student organizations, and research projects directly aligned with your major and skill set.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-xs text-indigo-300/60 border-t border-indigo-900/40 pt-6">
                    <span>© {new Date().getFullYear()} COB Platform</span>
                    <span>•</span>
                    <span>Student Tier Auth</span>
                </div>
            </div>

            {/* Right Side - Student Sign In Form */}
            <div className="flex flex-1 flex-col items-center justify-between p-6 sm:p-12 lg:p-16 relative bg-slate-900/90 text-slate-100">
                <div className="w-full max-w-[440px] pt-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 lg:hidden">
                            <GraduationCap className="w-6 h-6 text-indigo-400" />
                            <span className="text-lg font-bold text-white tracking-tight">COB</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-slate-400 text-sm">
                            Select your portal and enter your credentials to sign in.
                        </p>
                    </div>

                    {/* Role Switcher: Student vs Admin */}
                    <div className="mb-6 space-y-3">
                        <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">
                            Select Portal Tier
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
                            <button
                                type="button"
                                className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                            >
                                <GraduationCap className="w-4 h-4" /> Student Portal
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/cob/admin/login')}
                                className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all text-slate-400 hover:text-slate-200"
                            >
                                <ShieldCheck className="w-4 h-4" /> Admin & Staff Portal
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={identifier}
                                    placeholder="name@gmail.com"
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-11 py-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60 transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.01]"
                        >
                            {loading ? 'Authenticating...' : 'Sign In to Student Account'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-slate-400">
                        Don&apos;t have a student account?{' '}
                        <Link href="/cob/auth/signup" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                            Create Account
                        </Link>
                    </p>
                </div>

                {/* Instant Guest Access Footer Link */}
                <div className="w-full max-w-[440px] mt-8 pt-6 border-t border-slate-800 flex flex-col items-center gap-2">
                    <p className="text-xs text-slate-400">Want to explore opportunities first without logging in?</p>
                    <Link
                        href="/cob/guest/opportunities"
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/50 hover:text-white transition-all text-xs font-bold tracking-wide"
                    >
                        <Compass className="w-4 h-4 text-indigo-400" /> Continue as Guest →
                    </Link>
                </div>
            </div>
        </div>
    )
}