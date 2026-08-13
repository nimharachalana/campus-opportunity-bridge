'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Users, Briefcase, FileCheck, ShieldCheck } from 'lucide-react'

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        usersCount: 0,
        opportunitiesCount: 0,
        applicationsCount: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadMetrics() {
            setLoading(true)

            const [{ count: usersCount }, { count: oppsCount }, { count: appsCount }] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('opportunities').select('*', { count: 'exact', head: true }),
                supabase.from('applications').select('*', { count: 'exact', head: true }),
            ])

            setStats({
                usersCount: usersCount || 0,
                opportunitiesCount: oppsCount || 0,
                applicationsCount: appsCount || 0,
            })

            setLoading(false)
        }

        loadMetrics()
    }, [])

    return (
        <div className="flex flex-col flex-1 max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
            <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Administrator Metrics <ShieldCheck className="w-7 h-7 text-purple-500" />
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Live system stats powered directly by Supabase SDK.
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-36 bg-gray-100 dark:bg-zinc-900 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                        <div className="p-3.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Registered Users</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.usersCount}</h3>
                        </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                        <div className="p-3.5 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Open Opportunities</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.opportunitiesCount}</h3>
                        </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <FileCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Submitted Applications</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.applicationsCount}</h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
