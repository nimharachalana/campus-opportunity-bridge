'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { ROUTES } from '@/app/constants/routes'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap, ShieldCheck, Compass, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function StudentSignUp() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const validatePassword = (pass: string) => {
        if (pass.length > 0 && pass.length < 6) {
            return 'Password must be at least 6 characters long.'
        }
        return null
    }

    const passwordError = validatePassword(password)

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordError) {
            setError(passwordError)
            return
        }

        setLoading(true)
        setError(null)

        const trimmedEmail = email.trim().toLowerCase()
        const trimmedName = fullName.trim()

        // Call Supabase SDK SignUp passing metadata so Postgres trigger populates public.profiles
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: trimmedEmail,
            password,
            options: {
                data: {
                    full_name: trimmedName,
                    role: 'student',
                }
            }
        })

        if (signUpError) {
            setError(signUpError.message)
            setLoading(false)
            return
        }

        // Automatically assign role student and redirect to student profile
        router.push(ROUTES.STUDENT_DASH)
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen w-full bg-slate-950 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Left Side - Student Banner */}
            <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 justify-between p-12 border-r border-indigo-900/30">
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
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Student Registration
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                        Start Your Campus Journey Today.
                    </h1>
                    <p className="text-indigo-200/80 text-base leading-relaxed font-light">
                        Create your student account to apply for open research roles, TA positions, and internships matched to your skills.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-xs text-indigo-300/60 border-t border-indigo-900/40 pt-6">
                    <span>© {new Date().getFullYear()} COB Platform</span>
                    <span>•</span>
                    <span>Student Tier Auth</span>
                </div>
            </div>

            {/* Right Side - Student Registration Form */}
            <div className="flex flex-1 flex-col items-center justify-between p-6 sm:p-12 lg:p-16 relative bg-slate-900/90 text-slate-100 overflow-y-auto">
                <div className="w-full max-w-[440px] pt-4 my-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 lg:hidden">
                            <GraduationCap className="w-6 h-6 text-indigo-400" />
                            <span className="text-lg font-bold text-white tracking-tight">COB</span>
                        </div>
                        <Link
                            href="/cob/admin/login"
                            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors ml-auto flex items-center gap-1 bg-indigo-950/60 border border-indigo-800/40 px-3 py-1.5 rounded-full"
                        >
                            Admin / Staff Portal →
                        </Link>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Create Student Account</h2>
                        <p className="text-slate-400 text-sm">
                            Fill in your details below to register as a student on COB.
                        </p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    placeholder="Alex Morgan"
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    placeholder="name@gmail.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex justify-between">
                                <span>Password</span>
                                {password.length > 0 && (
                                    <span className={`text-[11px] ${password.length >= 6 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {password.length >= 6 ? '✓ Valid length' : `${password.length}/6 min chars`}
                                    </span>
                                )}
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
                                    className={`w-full pl-11 pr-11 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 transition-all ${
                                        passwordError
                                            ? 'border-amber-500/80 focus:ring-amber-500/30'
                                            : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/30'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {passwordError && (
                                <p className="text-[11px] text-amber-400 flex items-center gap-1 pt-0.5">
                                    <AlertCircle className="w-3 h-3" /> {passwordError}
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !!passwordError}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.01] mt-2"
                        >
                            {loading ? 'Creating Student Account...' : 'Create Student Account'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-slate-400">
                        Already have a student account?{' '}
                        <Link href="/cob/auth/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>

                {/* Instant Guest Access Link */}
                <div className="w-full max-w-[440px] mt-6 pt-5 border-t border-slate-800 flex flex-col items-center gap-2">
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
