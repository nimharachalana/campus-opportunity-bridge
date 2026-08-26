'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { fetchOpportunities } from '@/app/lib/api/opportunities'
import { Opportunity } from '@/app/types'
import { Building2, Clock, Compass, LogIn, X, Loader2, CheckCircle2 } from 'lucide-react'

export default function GuestOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Modal State
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await fetchOpportunities()
      // Only show free courses for guests
      setOpportunities(data.filter((opp) => opp.type === 'Free Course'))
      setLoading(false)
    }
    loadData()
  }, [])

  const submitGuestApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOpp || !guestName || !guestEmail) return
    
    setSubmitting(true)
    setMessage(null)
    
    try {
      // 1. Check max applicants limit
      if (selectedOpp.max_applicants) {
        const { count: regCount } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('opportunity_id', selectedOpp.id)
        const { count: guestCount } = await supabase.from('guest_applications').select('*', { count: 'exact', head: true }).eq('opportunity_id', selectedOpp.id)
        
        const total = (regCount || 0) + (guestCount || 0)
        
        if (total >= selectedOpp.max_applicants) {
          setMessage({ text: 'Sorry, this course has reached its maximum capacity.', type: 'error' })
          setSubmitting(false)
          return
        }
      }

      // 2. Submit application
      const { error } = await supabase.from('guest_applications').insert([{
        opportunity_id: selectedOpp.id,
        guest_name: guestName,
        guest_email: guestEmail
      }])
      
      if (error) throw error
      
      setMessage({ text: 'Application submitted successfully! Check your email for updates.', type: 'success' })
      setTimeout(() => {
        setSelectedOpp(null)
        setGuestName('')
        setGuestEmail('')
        setMessage(null)
      }, 3000)

    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to submit application. Please try again.', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col space-y-8 relative">
      <div className="bg-teal-900/5 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                Free Community Courses <Compass className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                Browse and apply to free courses offered by our university communities. No account required!
            </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Compass className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">No free courses are available right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="flex flex-col justify-between p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 rounded-full border border-teal-200 dark:border-teal-900/60">
                      {opp.type}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5" /> Open
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {opp.title}
                  </h3>

                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-4">
                    <Building2 className="w-4 h-4 text-slate-400" /> {opp.community_name || opp.department}
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setSelectedOpp(opp)}
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-sm flex justify-center items-center gap-2 bg-teal-600 text-white hover:bg-teal-700 transition-all shadow-md shadow-teal-900/20"
                    >
                        Apply Now
                    </button>
                </div>
              </div>
          ))}
        </div>
      )}

      {/* Guest Application Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Apply for Course</h3>
                    <button onClick={() => setSelectedOpp(null)} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                        <X className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    </button>
                </div>
                <div className="p-6">
                    <h4 className="font-bold text-teal-600 dark:text-teal-400 mb-1">{selectedOpp.title}</h4>
                    <p className="text-xs text-slate-500 mb-6">Offered by {selectedOpp.community_name || selectedOpp.department}</p>

                    {message && (
                        <div className={`p-3 rounded-xl mb-4 text-sm font-medium flex gap-2 items-start ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400'}`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <X className="w-5 h-5 shrink-0 mt-0.5" />}
                            <p>{message.text}</p>
                        </div>
                    )}

                    <form onSubmit={submitGuestApplication} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                            <input 
                                type="text" 
                                required
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <p className="text-[10px] text-slate-400 mt-1.5 ml-1">We will notify you via email regarding your application status.</p>
                        </div>

                        <button 
                            type="submit" 
                            disabled={submitting || message?.type === 'success'}
                            className="w-full mt-4 py-3 rounded-xl font-bold text-sm bg-teal-600 text-white hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Application'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}
