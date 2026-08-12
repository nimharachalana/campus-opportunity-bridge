'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from "@/app/components/layout/AdminSidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAuthRoute = pathname === '/cob/admin/login' || pathname === '/cob/auth/admin'

    if (isAuthRoute) {
        return <div className="min-h-screen w-full">{children}</div>
    }

    return (
        <div className="flex h-full min-h-screen bg-slate-950 text-white">
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
