'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { ROUTES } from '@/app/constants/routes'
import { User, Lock, ArrowRight, ShieldCheck, BadgeCheck, IdCard } from 'lucide-react'
import Link from 'next/link'

export default function SignUp() {
    const [fullName, setFullName] = useState('')
    const [studentId, setStudentId] = useState('')
    const [role, setRole] = useState<'student' | 'staff'>('student')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const normalizedId = studentId.trim()
        const syntheticEmail = `${normalizedId}@campusbridge.local`.toLowerCase()

        // Call Supabase SDK SignUp passing metadata so the Postgres trigger populates public.profiles
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: syntheticEmail,
            password,
            options: {
                data: {
                    full_name: fullName,
                    student_id: normalizedId,
                    role: role,
                }
            }
        })

        if (signUpError) {
            setError(signUpError.message)
            setLoading(false)
            return
        }

        // Automatic redirect based on selected role
        if (role === 'student') {
            router.push(ROUTES.STUDENT_DASH)
        } else {
            router.push(ROUTES.STAFF_DASH)
        }

        setLoading(false)
    }

    return (
        <div className="flex h-screen w-full bg-zinc-50 dark:bg-black font-sans selection:bg-blue-200">
            {/* Left Side - Branding / Graphic */}
            <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-indigo-950 justify-between p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-900 opacity-90 mix-blend-multiply" />
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-pulse" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-50" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <ShieldCheck className="w-8 h-8 text-indigo-200" />
                        <span className="text-2xl font-bold text-white tracking-tight">COB Portal</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                        Join Campus Opportunity Bridge.
                    </h1>
                    <p className="text-indigo-100 text-lg font-light leading-relaxed">
                        Create an account to browse research roles, lab positions, and campus opportunities directly mapped to your skills.
                    </p>
                </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="flex flex-1 flex-col items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-y-auto">
                <div className="absolute top-8 left-8 flex items-center gap-2 lg:hidden">
                    <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">COB Portal</span>
                </div>

                <main className="w-full max-w-[420px] flex flex-col items-start my-auto">
                    <div className="mb-8 w-full">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create an account</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Enter your details to register as a student or staff member.
                        </p>
                    </div>
                    
                    <form onSubmit={handleSignUp} className="w-full flex flex-col gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input 
                                    type="text" 
                                    required
                                    value={fullName}
                                    placeholder="Jane Doe"
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="block w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Student / Staff ID
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <IdCard className="w-4 h-4" />
                                </div>
                                <input 
                                    type="text" 
                                    required
                                    value={studentId}
                                    placeholder="e.g. IT2022001"
                                    onChange={(e) => setStudentId(e.target.value)}
                                    className="block w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                I am registering as
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setRole('student')}
                                    className={`py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                                        role === 'student'
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                                            : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400'
                                    }`}
                                >
                                    <BadgeCheck className="w-3.5 h-3.5" /> Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('staff')}
                                    className={`py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                                        role === 'staff'
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                                            : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400'
                                    }`}
                                >
                                    <BadgeCheck className="w-3.5 h-3.5" /> Staff
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg">
                                <p className="text-red-600 dark:text-red-400 text-xs font-medium">{error}</p>
                            </div>
                        )}
                        
                        <button 
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center items-center gap-2 py-2.5 px-4 mt-2 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-70 transition-all shadow-sm"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? 'Creating account...' : 'Create Account'}
                                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </button>
                    </form>
                    
                    <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 w-full">
                        Already have an account?{' '}
                        <Link href="/cob/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors">
                            Sign in instead
                        </Link>
                    </p>
                </main>
            </div>
        </div>
    )
}
