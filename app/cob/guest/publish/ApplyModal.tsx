'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { applyToOpportunity } from '@/app/lib/api/applications'
import { Opportunity } from '@/app/types'

export default function ApplyModal({
  opportunity,
  open,
  onClose,
}: {
  opportunity: Opportunity | null
  open: boolean
  onClose: () => void
}) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [gender, setGender] = useState<'Male' | 'Female'>('Male')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (!open || !opportunity) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      // Submit to server API which uses the service role key to create a guest user/profile and application
      const res = await fetch('/api/guest-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          firstName,
          lastName,
          email,
          phone,
          city,
          country,
          gender,
          notes: null,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to submit')
      setMessage('Application received. We will contact you at ' + email + '.')
      setLoading(false)
      setTimeout(() => onClose(), 1200)
    } catch (err: any) {
      setMessage(err.message || 'Failed to apply')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black">Apply — {opportunity.title}</h2>
          <span className="text-sm px-3 py-1 bg-purple-600 text-white rounded">{String(opportunity.id).slice(0,8)}</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="p-2 border border-gray-300 rounded bg-white text-black w-full placeholder-gray-500" />
            <input required placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="p-2 border border-gray-300 rounded bg-white text-black w-full placeholder-gray-500" />
          </div>

          <div>
            <input required type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 border border-gray-300 rounded bg-white text-black w-full placeholder-gray-500" />
          </div>

          <div>
            <input required placeholder="Contact number" value={phone} onChange={(e) => setPhone(e.target.value)} className="p-2 border border-gray-300 rounded bg-white text-black w-full placeholder-gray-500" />
          </div>

          <div>
            <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="p-2 border border-gray-300 rounded bg-white text-black w-full placeholder-gray-500" />
          </div>

          <div>
            <input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="p-2 border border-gray-300 rounded bg-white text-black w-full placeholder-gray-500" />
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setGender('Male')} className={"px-4 py-2 rounded-full border cursor-pointer active:cursor-grabbing " + (gender === 'Male' ? 'bg-purple-600 text-white border-transparent' : 'bg-white text-black border-gray-300')}>Male</button>
            <button type="button" onClick={() => setGender('Female')} className={"px-4 py-2 rounded-full border cursor-pointer active:cursor-grabbing " + (gender === 'Female' ? 'bg-purple-600 text-white border-transparent' : 'bg-white text-black border-gray-300')}>Female</button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded text-black cursor-pointer active:cursor-grabbing">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-3 bg-purple-700 text-white rounded font-semibold cursor-pointer active:cursor-grabbing">{loading ? 'Submitting...' : 'Register Now'}</button>
          </div>
        </form>

        {message && <div className="mt-3 text-sm text-green-600">{message}</div>}
      </div>
    </div>
  )
}
