'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { supabase } from '@/app/lib/supabase'

export default function StudentProfile() {
    const { session, userRole, mustChangePassword } = useAuth()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setMessage('')

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        // Update password via Auth API
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (updateError) {
            setError(updateError.message)
            setLoading(false)
            return
        }

        // Update profiles table flag
        if (session?.user?.id) {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ must_change_password: false })
                .eq('id', session.user.id)
            
            if (profileError) {
                console.error('Failed to update must_change_password flag', profileError)
            }
        }

        setMessage('Password updated successfully. You can now access your dashboard.')
        setLoading(false)
        window.location.reload()
    }

    if (mustChangePassword) {
        return (
            <div className="flex flex-col items-center justify-center p-8 h-full rounded-lg">
                <main className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-xl shadow border border-gray-200 dark:border-zinc-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Change Password Required</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                        You are using a default password. Please update your password to continue.
                    </p>
                    
                    <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                            <input 
                                type="password" 
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                            <input 
                                type="password" 
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        {message && <p className="text-green-500 text-sm font-medium">{message}</p>}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </main>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 items-start justify-start h-full">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Student Profile</h1>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 w-full border border-gray-200 dark:border-gray-800">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Role:</strong> <span className="capitalize">{userRole || 'Unknown'}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                    <strong>Synthetic Email:</strong> {session?.user?.email}
                </p>
            </div>
        </div>
    )
}