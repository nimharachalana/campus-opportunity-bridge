'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { supabase } from '@/app/lib/supabase'

import { ROUTES } from '@/app/constants/routes'

interface user {
    id: number;
    email: string;
    role: 'student' | 'staff' | 'admin';
    password: string;
}

const User: user[] = [
    {
        id: 1,
        email: "student@gmail.com",
        role: 'student',
        password: "123456"
    },
    {
        id: 2,
        email: "staff@gmail.com",
        role: 'staff',
        password: "123456"
    },
    {
        id: 3,
        email: "admin@gmail.com",
        role: 'admin',
        password: "123456"
    }
]

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { session } = useAuth()

    useEffect(() => {
        if (session) {
            // Redirect if already logged in
            router.push('/cob/student/profile')
        }
    }, [session, router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Test login logic using the default User array
        const foundUser = User.find(u => u.email === email && u.password === password)

        if (foundUser) {
            if (foundUser.role === 'student') {
                router.push(ROUTES.STUDENT_DASH)
            } else if (foundUser.role === 'staff') {
                router.push(ROUTES.STAFF_DASH)
            } else if (foundUser.role === 'admin') {
                router.push(ROUTES.ADMIN_DASH)
            }
        } else {
            setError('Invalid login credentials (Test Mode)')
        }
        
        setLoading(false)
    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black h-screen">
            <main className="flex w-full max-w-md flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Login</h1>
                
                <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full border-1 rounded-md px-4 py-2 mt-4 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loading ? 'Logging in...' : 'LOGIN'}
                    </button>
                </form>
            </main>
        </div>
    )
}