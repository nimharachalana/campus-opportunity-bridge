'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  PlusCircle,
  UserCheck,
  Eye,
  LogOut,
  ShieldCheck,
} from 'lucide-react'

export default function StaffSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cob_current_admin')
      localStorage.removeItem('cob_current_user')
    }
    router.push('/cob/admin/login')
  }

  const navItems = [
    {
      href: '/cob/staff/submit',
      label: 'Publishing & Communities',
      icon: PlusCircle,
      desc: 'Post roles, research & clubs'
    },
    {
      href: '/cob/staff/applications',
      label: 'Review Applicants',
      icon: UserCheck,
      desc: 'Evaluate student submissions'
    }
  ]

  return (
    <div className="w-72 bg-slate-950 text-slate-100 h-screen p-5 flex flex-col justify-between border-r border-slate-800/80 shrink-0">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-indigo-600/30 rounded-xl border border-indigo-400/30 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Staff Control Panel</h2>
            <span className="text-[11px] text-indigo-300 font-medium">Faculty & Research Tier</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1">
            Core Modules
          </span>

          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-3 rounded-2xl flex items-start gap-3 transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-bold'
                    : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                <div>
                  <span className="text-xs font-semibold block">{item.label}</span>
                  <span className={`text-[10px] block ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {item.desc}
                  </span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">


        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 p-2.5 text-rose-400 hover:bg-rose-950/30 rounded-xl text-xs font-semibold transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out from Staff Portal
        </button>
      </div>
    </div>
  )
}
