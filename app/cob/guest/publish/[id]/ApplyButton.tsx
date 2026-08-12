'use client'

import { useState } from 'react'
import { applyToOpportunity } from '@/app/lib/api/applications'
import { supabase } from '@/app/lib/supabase'

export default function ApplyButton({ opportunityId }: { opportunityId: string }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // For guests we check auth; if unauthenticated, call guest API to persist
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // Split name into first and last
        const parts = name.trim().split(/\s+/)
        const firstName = parts.shift() || ''
        const lastName = parts.join(' ') || ''

        const res = await fetch('/api/guest-apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            opportunityId,
            firstName,
            lastName,
            email,
            phone,
            city: null,
            country: null,
            gender: null,
            notes,
          }),
        })

        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Failed to submit')
        setMessage('Application submitted (guest).')
        setOpen(false)
        setLoading(false)
        return
      }

      await applyToOpportunity(opportunityId, user.id)
      setMessage('Application submitted successfully.')
      setOpen(false)
    } catch (err: any) {
      setMessage(err.message || 'Failed to apply')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-purple-600 text-white rounded-md cursor-pointer active:cursor-grabbing">
        Apply
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold text-black">Apply for this course</h3>
            <form onSubmit={handleApply} className="mt-4 space-y-3">
              <div>
                <label className="block text-sm text-black">Full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md bg-white text-black" />
              </div>
              <div>
                <label className="block text-sm text-black">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md bg-white text-black" />
              </div>
              <div>
                <label className="block text-sm text-black">Contact Number</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md bg-white text-black" />
              </div>
              <div>
                <label className="block text-sm text-black">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white text-black" />
              </div>

              <div className="flex items-center justify-between">
                <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 text-black cursor-pointer active:cursor-grabbing">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded-md cursor-pointer active:cursor-grabbing">{loading ? 'Applying...' : 'Submit Application'}</button>
              </div>
            </form>
            {message && <div className="mt-3 text-sm text-green-600">{message}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
