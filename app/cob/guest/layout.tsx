'use client'

import Link from 'next/link'
import { ShieldCheck, Compass } from 'lucide-react'

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Compass className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                        <span className="font-bold text-lg text-slate-900 dark:text-white">COB Guest Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/cob/auth/login"
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link 
                            href="/cob/auth/login"
                            className="text-sm font-semibold bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}
