'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Briefcase, User, Phone, Mail, MessageSquareHeart } from 'lucide-react'

export default function Sidebar() {
    const pathname = usePathname()

    const navItems = [
        { name: 'Dashboard', href: '/cob/student/dashboard', icon: Home },
        { name: 'Explore', href: '/cob/student/opportunities', icon: Search },
        { name: 'My Applications', href: '/cob/student/applications', icon: Briefcase },
        { name: 'My Profile', href: '/cob/student/profile', icon: User },
    ]

    return (
        <div className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col gap-4 border-r border-zinc-800 sticky top-0 self-start">
            <h2 className="text-xl font-bold mb-4 px-2 text-blue-400">Student Panel</h2>
            <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <div key={item.name} className="flex flex-col">
                            <Link 
                                href={item.href} 
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
                                    isActive 
                                    ? 'bg-[#1e293b] text-teal-400' 
                                    : 'hover:bg-slate-800/50 hover:text-white'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                                {item.name}
                            </Link>


                        </div>
                    )
                })}
            </nav>

            {/* Premium Support Card */}
            <div className="mt-auto relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-5 overflow-hidden group">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-teal-500/20 transition-colors"></div>
                
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center shrink-0 shadow-lg">
                            <MessageSquareHeart className="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-200 text-sm">Need Help?</h3>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Contact Admin</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-1">
                        <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 group/item hover:border-slate-600 hover:bg-slate-800 transition-all">
                            <Phone className="w-4 h-4 text-teal-400 shrink-0 group-hover/item:scale-110 transition-transform" />
                            <span className="font-medium">+1 (234) 567-890</span>
                        </div>
                        
                        <a href="mailto:support@university.edu" className="flex items-center gap-3 text-sm text-slate-300 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 group/item hover:border-slate-600 hover:bg-slate-800 transition-all">
                            <Mail className="w-4 h-4 text-teal-400 shrink-0 group-hover/item:scale-110 transition-transform" />
                            <span className="truncate font-medium">support@university.edu</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}