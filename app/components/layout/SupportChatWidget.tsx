'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/app/lib/supabase'
import { SupportMessage } from '@/app/types'
import { MessageCircle, X, Send, User, ShieldAlert } from 'lucide-react'

export default function SupportChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<SupportMessage[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function initChat() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
                fetchMessages(user.id)
            }
        }
        initChat()

        // Real-time subscription
        const subscription = supabase
            .channel('support_messages_changes')
            .on('postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'support_messages' },
                (payload) => {
                    const newMsg = payload.new as SupportMessage
                    setMessages(prev => {
                        // Prevent duplicates if we already added it optimistically
                        if (prev.some(m => m.id === newMsg.id)) return prev
                        return [...prev, newMsg]
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    useEffect(() => {
        if (isOpen) {
            scrollToBottom()
        }
    }, [messages, isOpen])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const fetchMessages = async (uid: string) => {
        const { data, error } = await supabase
            .from('support_messages')
            .select('*')
            .eq('student_id', uid)
            .order('created_at', { ascending: true })
        
        if (!error && data) {
            setMessages(data as SupportMessage[])
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !userId) return

        const msgText = newMessage.trim()
        setNewMessage('')
        setLoading(true)

        // Optimistic UI update
        const tempId = 'temp-' + Date.now()
        const optimisticMsg: SupportMessage = {
            id: tempId,
            student_id: userId,
            message: msgText,
            is_from_admin: false,
            is_read: false,
            created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, optimisticMsg])

        const { error, data } = await supabase
            .from('support_messages')
            .insert({
                student_id: userId,
                message: msgText,
                is_from_admin: false
            })
            .select()
            .single()
            
        if (error) {
            console.error('Error sending message:', error)
            // Remove optimistic message on error
            setMessages(prev => prev.filter(m => m.id !== tempId))
        } else if (data) {
            // Replace temp message with real one
            setMessages(prev => prev.map(m => m.id === tempId ? data as SupportMessage : m))
        }
        
        setLoading(false)
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white dark:bg-slate-900 w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5 duration-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <ShieldAlert className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Admin Support</h3>
                                <p className="text-teal-100 text-xs">We typically reply in a few hours</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto max-h-96 min-h-64 bg-slate-50 dark:bg-slate-950 flex flex-col gap-4">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 gap-2">
                                <MessageCircle className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                                <p className="text-sm">Send us a message if you need help with your applications or account.</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`flex w-full ${msg.is_from_admin ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                        msg.is_from_admin 
                                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none' 
                                        : 'bg-teal-600 text-white rounded-tr-none'
                                    }`}>
                                        <p>{msg.message}</p>
                                        <span className={`text-[10px] mt-1 block ${msg.is_from_admin ? 'text-slate-400' : 'text-teal-200'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-end gap-2">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 max-h-32 min-h-10 resize-none rounded-xl bg-slate-100 dark:bg-slate-800 border-transparent focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm px-4 py-2.5 dark:text-white"
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSendMessage(e)
                                }
                            }}
                        />
                        <button 
                            type="submit" 
                            disabled={!newMessage.trim() || loading}
                            className="p-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-teal-600 hover:bg-teal-500 text-white rounded-full shadow-lg shadow-teal-900/20 flex items-center justify-center hover:scale-105 transition-all animate-in zoom-in"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}
        </div>
    )
}
