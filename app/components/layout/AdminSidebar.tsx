'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Briefcase,
  UserCheck,
  Building2,
  LogOut,
  ShieldCheck,
  Sparkles,
  Eye,
  ArrowUpRight
} from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [adminInfo, setAdminInfo] = useState<{ name: string; community: string; role: string }>({
    name: 'Community Admin',
    community: 'ICT Circle',
    role: 'admin'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cob_current_admin') || localStorage.getItem('cob_current_user')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setAdminInfo({
            name: parsed.full_name || 'Community Admin',
            community: parsed.community_name || 'ICT Circle',
            role: parsed.role || 'admin'
          })
        } catch (e) {
          console.warn('Error reading admin session:', e)
        }
      }
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cob_current_admin')
      localStorage.removeItem('cob_current_user')
    }
    router.push('/cob/admin/login')
  }

  const navItems = [
    {
      href: '/cob/admin/dash',
      label: 'Overview & Metrics',
      icon: LayoutDashboard,
      desc: 'Community statistics & feed'
    },
    {
      href: '/cob/admin/opportunities',
      label: 'Post Opportunity',
      icon: Briefcase,
      desc: 'Create & manage openings'
    },
    {
      href: '/cob/admin/applications',
      label: 'Review Applicants',
      icon: UserCheck,
      desc: 'Evaluate candidate submissions'
    }
  ]

  return (
    <div className="w-72 bg-slate-950 text-slate-100 h-screen p-5 flex flex-col justify-between border-r border-purple-900/30 shrink-0 sticky top-0 self-start">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="p-3.5 bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-800/40 rounded-2xl flex items-center gap-3 shadow-lg shadow-purple-950/20">
          <div className="p-2 bg-purple-600/30 rounded-xl border border-purple-400/30 text-purple-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white tracking-tight truncate">{adminInfo.name}</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-purple-300 font-semibold truncate">
              <Building2 className="w-3 h-3 text-purple-400 shrink-0" />
              <span className="truncate">{adminInfo.community}</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1">
            Community Management
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
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-bold'
                    : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                <div>
                  <span className="text-xs font-semibold block">{item.label}</span>
                  <span className={`text-[10px] block ${isActive ? 'text-purple-200' : 'text-slate-500'}`}>
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
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  )
}
