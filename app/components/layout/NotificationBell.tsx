'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Check, Info, FileCheck, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/app/lib/supabase'
import { fetchUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/app/lib/api/notifications'
import { Notification } from '@/app/types'
import { useRouter } from 'next/navigation'

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        async function loadNotifications() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const data = await fetchUserNotifications(user.id)
                setNotifications(data)
            }
            setLoading(false)
        }
        loadNotifications()

        // Close dropdown when clicking outside
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const unreadCount = notifications.filter(n => !n.is_read).length

    const handleNotificationClick = async (notif: Notification) => {
        if (!notif.is_read) {
            // Optimistically update UI
            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n))
            await markNotificationAsRead(notif.id)
        }
        setIsOpen(false)
        if (notif.link) {
            router.push(notif.link)
        }
    }

    const handleMarkAllRead = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        await markAllNotificationsAsRead(user.id)
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'application_update': return <FileCheck className="w-5 h-5 text-amber-500" />
            case 'new_opportunity': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            default: return <Info className="w-5 h-5 text-blue-500" />
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#0f172a]">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0b0f19] text-white rounded-2xl shadow-2xl border border-[#1e293b] z-50 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-[#1e293b] flex justify-between items-center bg-[#121826]">
                        <h3 className="font-bold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleMarkAllRead}
                                className="text-xs font-semibold text-teal-600 hover:text-teal-500 flex items-center gap-1"
                            >
                                <Check className="w-3.5 h-3.5" /> Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">You're all caught up!</div>
                        ) : (
                            <div className="flex flex-col">
                                {notifications.map(notif => (
                                    <button 
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`w-full text-left p-4 flex gap-4 transition-colors border-b border-[#1e293b] last:border-0 ${notif.is_read ? 'bg-[#0b0f19] opacity-70' : 'bg-[#121826] hover:bg-[#1e293b]'}`}
                                    >
                                        <div className="shrink-0 mt-1">
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex flex-col gap-1 w-full">
                                            <div className="flex justify-between items-start w-full gap-2">
                                                <h4 className={`text-sm font-semibold ${notif.is_read ? 'text-slate-400' : 'text-white'}`}>
                                                    {notif.title}
                                                </h4>
                                                {!notif.is_read && <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-1.5" />}
                                            </div>
                                            <p className={`text-xs ${notif.is_read ? 'text-slate-500' : 'text-slate-300'}`}>
                                                {notif.message}
                                            </p>
                                            <span className="text-[10px] font-medium text-slate-400 mt-1">
                                                {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
