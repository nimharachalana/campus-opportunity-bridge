'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { ROUTES } from '@/app/constants/routes'
import {
    ShieldCheck,
    Building2,
    UserCheck,
    Lock,
    Eye,
    EyeOff,
    Mail,
    User,
    ArrowRight,
    Compass,
    Sparkles,
    AlertCircle,
    GraduationCap
} from 'lucide-react'
import Link from 'next/link'

export default function AdminControlPortal() {
    const [adminRole, setAdminRole] = useState<'staff' | 'community'>('staff')
    const [isRegisterMode, setIsRegisterMode] = useState(false)

    // Common fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [communityId, setCommunityId] = useState('')
    const [communitiesList, setCommunitiesList] = useState<{ id: string, name: string }[]>([])

    useEffect(() => {
        const fetchCommunities = async () => {
            const { data } = await supabase.from('communities').select('id, name')
            if (data) {
                setCommunitiesList(data)
            }
        }
        fetchCommunities()
    }, [])

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const trimmedEmail = email.trim().toLowerCase()

        if (isRegisterMode) {
            // Validate password match
            if (password !== confirmPassword) {
                setError('Passwords do not match.')
                setLoading(false)
                return
            }

            if (password.length < 6) {
                setError('Password must be at least 6 characters long.')
                setLoading(false)
                return
            }

            // Staff email validation requirement (university email)
            if (adminRole === 'staff' && !trimmedEmail.includes('@')) {
                setError('Please provide a valid university email address.')
                setLoading(false)
                return
            }

            // Community Admin organization requirement
            if (adminRole === 'community' && !communityId) {
                setError('Please specify your Community or Organization.')
                setLoading(false)
                return
            }

            const targetRole = adminRole === 'staff' ? 'staff' : 'admin'

            const { data, error: signUpError } = await supabase.auth.signUp({
                email: trimmedEmail,
                password,
                options: {
                    data: {
                        full_name: fullName.trim(),
                        role: targetRole,
                        admin_type: adminRole,
                        community_id: adminRole === 'community' ? communityId : null,
                    }
                }
            })

            if (signUpError) {
                setError(signUpError.message)
                setLoading(false)
                return
            }

            // Redirect based on assigned role
            if (adminRole === 'staff') {
                router.push(ROUTES.STAFF_DASH)
            } else {
                router.push(ROUTES.ADMIN_DASH)
            }
        } else {
            // Sign In flow
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: trimmedEmail,
                password,
            })

            if (signInError) {
                if (signInError.message.includes('Invalid login credentials')) {
                    setError('Account not found or incorrect password. If you are new, please register first.')
                } else {
                    setError(signInError.message)
                }
                setLoading(false)
                return
            }

            const userRole = signInData?.user?.user_metadata?.role || (adminRole === 'staff' ? 'staff' : 'admin')
            if (userRole === 'staff') {
                router.push(ROUTES.STAFF_DASH)
            } else {
                router.push(ROUTES.ADMIN_DASH)
            }
        }

        setLoading(false)
    }

    return (
        <div className="flex min-h-screen w-full bg-slate-950 font-sans selection:bg-purple-500 selection:text-white">
            {/* Left Side - Dark Purple Aesthetic Branding Banner */}
            <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 justify-between p-12 border-r border-purple-900/30">
                <div className="absolute top-1/3 -left-20 w-96 h-96 bg-purple-600/25 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-indigo-600/25 rounded-full mix-blend-screen filter blur-[120px]" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-600/20 border border-purple-400/30 backdrop-blur-md rounded-2xl">
                            <ShieldCheck className="w-7 h-7 text-purple-400" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">COB Admin Control Portal</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/20 backdrop-blur-md text-xs font-semibold text-purple-300">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Staff & Community Management Tier
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                        Powering Opportunity Creation & Oversight.
                    </h1>
                    <p className="text-purple-200/80 text-base leading-relaxed font-light">
                        Post research grants, manage applicant reviews, and coordinate student communities across university departments.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-xs text-purple-300/60 border-t border-purple-900/40 pt-6">
                    <span>© {new Date().getFullYear()} Campus Opportunity Bridge</span>
                    <span>•</span>
                    <span>Admin Control Portal</span>
                </div>
            </div>

            {/* Right Side - Admin Control Form */}
            <div className="flex flex-1 flex-col items-center justify-between p-6 sm:p-12 lg:p-16 relative bg-slate-900/95 text-slate-100 overflow-y-auto">
                <div className="w-full max-w-[460px] pt-4 my-auto">
                    {/* Navigation Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 lg:hidden">
                            <ShieldCheck className="w-6 h-6 text-purple-400" />
                            <span className="text-lg font-bold text-white tracking-tight">COB Admin</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Admin & Staff</h2>
                        <p className="text-slate-400 text-sm">
                            Select your portal and enter your credentials to sign in.
                        </p>
                    </div>

                    {/* Role Switcher: Student vs Admin */}
                    <div className="mb-6 space-y-3">
                        <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider block">
                            Select Portal Tier
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
                            <button
                                type="button"
                                onClick={() => router.push('/cob/auth/login')}
                                className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all text-slate-400 hover:text-slate-200"
                            >
                                <GraduationCap className="w-4 h-4" /> Student Portal
                            </button>
                            <button
                                type="button"
                                className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                            >
                                <ShieldCheck className="w-4 h-4" /> Admin & Staff Portal
                            </button>
                        </div>
                    </div>

                    {/* Role Switcher: Staff vs Community Admin */}
                    <div className="mb-6 space-y-3">
                        <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider block">
                            Select Admin Portal Tier
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
                            <button
                                type="button"
                                onClick={() => setAdminRole('staff')}
                                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${adminRole === 'staff'
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                                        : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                <UserCheck className="w-4 h-4" /> University Staff
                            </button>
                            <button
                                type="button"
                                onClick={() => setAdminRole('community')}
                                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${adminRole === 'community'
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                                        : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                <Building2 className="w-4 h-4" /> Community Admin
                            </button>
                        </div>
                    </div>

                    {/* Register vs Sign In Toggle Header */}
                    <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                            <h2 className="text-2xl font-extrabold text-white tracking-tight">
                                {adminRole === 'staff' ? 'Staff Portal' : 'Community Admin Portal'}
                            </h2>
                            <p className="text-slate-400 text-xs mt-1">
                                {isRegisterMode
                                    ? adminRole === 'staff'
                                        ? 'Register with your university staff email.'
                                        : 'Register your organization or student club.'
                                    : 'Sign in to access your administrative dashboard.'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setIsRegisterMode(!isRegisterMode)
                                setError(null)
                            }}
                            className="text-xs font-semibold text-purple-400 hover:text-purple-300 underline underline-offset-4"
                        >
                            {isRegisterMode ? 'Sign In Instead' : 'Register Account'}
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleAuth} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-sm font-medium flex flex-col gap-2 mb-4 shadow-lg shadow-red-900/20">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                                {!isRegisterMode && error.includes('register first') && (
                                    <button 
                                        type="button" 
                                        onClick={() => { setIsRegisterMode(true); setError(null); }} 
                                        className="text-left text-xs text-red-200 underline underline-offset-2 hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        Click here to create a new account <ArrowRight className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        )}

                        {adminRole === 'community' && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Organization / Community Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <select
                                        required
                                        value={communityId}
                                        onChange={(e) => setCommunityId(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select your Community</option>
                                        {communitiesList.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isRegisterMode && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        placeholder="Prof. Sarah Jenkins"
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                {adminRole === 'staff' ? 'University Email Address' : 'Email Address'}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    placeholder={adminRole === 'staff' ? 'name@university.edu' : 'admin@org.com'}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {isRegisterMode && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        placeholder="••••••••"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        )}



                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 focus:ring-2 focus:ring-purple-500/40 disabled:opacity-60 transition-all shadow-lg shadow-purple-600/30 hover:scale-[1.01] mt-2"
                        >
                            {loading
                                ? 'Processing...'
                                : isRegisterMode
                                    ? adminRole === 'staff'
                                        ? 'Register Staff Account'
                                        : 'Register Organization'
                                    : 'Sign In to Control Portal'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                </div>

                {/* Instant Guest Access Footer Link */}
                <div className="w-full max-w-[460px] mt-6 pt-5 border-t border-slate-800 flex flex-col items-center gap-2">
                    <p className="text-xs text-slate-400">Want to view public student opportunities?</p>
                    <Link
                        href="/cob/guest/opportunities"
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-purple-500/30 bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 hover:text-white transition-all text-xs font-bold tracking-wide"
                    >
                        <Compass className="w-4 h-4 text-purple-400" /> Continue as Guest →
                    </Link>
                </div>
            </div>
        </div>
    )
}
