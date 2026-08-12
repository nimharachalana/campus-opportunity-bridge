'use client'

import { useState } from 'react'
import { Role } from '@/app/types'
import { UserPlus, CheckCircle2 } from 'lucide-react'

export default function UserManagePage() {
  const [studentId, setStudentId] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [defaultPassword, setDefaultPassword] = useState('DefaultPass123!')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch('/api/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, role, defaultPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to provision user')
      }

      setMessage(`User ${studentId.toUpperCase()} provisioned successfully with role: ${role}!`)
      setStudentId('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          User Management <UserPlus className="w-6 h-6 text-indigo-500" />
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Provision student or staff accounts with default passwords.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleProvision} className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Student / Staff ID
          </label>
          <input
            type="text"
            required
            placeholder="e.g. IT2022005"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Default Password
            </label>
            <input
              type="text"
              required
              value={defaultPassword}
              onChange={(e) => setDefaultPassword(e.target.value)}
              className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? 'Provisioning Account...' : 'Provision User Account'}
        </button>
      </form>
    </div>
  )
}