'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { supabase } from '@/app/lib/supabase'
import { ROUTES } from '@/app/constants/routes'
import { User as UserIcon, Lock, ArrowRight, ShieldCheck } from 'lucide-react'

export default function Login() {
    const [studentId, setStudentId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { session, userRole } = useAuth()

    useEffect(() => {
        if (session && userRole) {
            if (userRole === 'student') router.push(ROUTES.STUDENT_DASH)
            else if (userRole === 'staff') router.push(ROUTES.STAFF_DASH)
            else if (userRole === 'admin') router.push(ROUTES.ADMIN_DASH)
        }
    }, [session, userRole, router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const normalizedId = studentId.trim()

        // 1. Lookup email by student_id (case-insensitive)
        const { data: profile, error: lookupError } = await supabase
            .from('profiles')
            .select('email')
            .ilike('student_id', normalizedId)
            .single()

        if (lookupError || !profile?.email) {
            console.error("Lookup error:", lookupError)
            setError('Invalid credentials')
            setLoading(false)
            return
        }

        // 2. Sign in with the resolved email
        const { error } = await supabase.auth.signInWithPassword({
            email: profile.email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full bg-zinc-50 dark:bg-black font-sans selection:bg-blue-200">
            {/* Left Side - Branding / Graphic */}
            <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-blue-900 justify-between p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90 mix-blend-multiply" />
                {/* Decorative circles */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-pulse" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-50" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <ShieldCheck className="w-8 h-8 text-blue-200" />
                        <span className="text-2xl font-bold text-white tracking-tight">COB Portal</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                        Empowering connections across the campus.
                    </h1>
                    <p className="text-blue-100 text-lg font-light leading-relaxed">
                        Access your dashboard to manage applications, track progress, and discover new opportunities bridged directly to you.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-1 flex-col items-center justify-center p-8 sm:p-12 lg:p-24 relative">
                {/* Mobile branding */}
                <div className="absolute top-8 left-8 flex items-center gap-2 lg:hidden">
                    <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">COB Portal</span>
                </div>

                <main className="w-full max-w-[420px] flex flex-col items-start">
                    <div className="mb-10 w-full">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Welcome back</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Please enter your credentials to sign in to your account.
                        </p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Student / Staff ID
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <input 
                                    type="text" 
                                    required
                                    value={studentId}
                                    placeholder="e.g. IT2022001"
                                    onChange={(e) => setStudentId(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none placeholder:text-gray-400 uppercase"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 mt-1 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg">
                                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                            </div>
                        )}
                        
                        <button 
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 mt-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-offset-black disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? 'Signing in...' : 'Sign in to account'}
                                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </button>
                    </form>
                    
                    <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 w-full">
                        Having trouble signing in?{' '}
                        <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                            Contact IT Support
                        </a>
                    </p>
                </main>
            </div>
        </div>
    )
}