'use client'

import { useState } from 'react'
import { createOpportunity } from '@/app/lib/api/opportunities'
import { useAuth } from '@/app/context/AuthContext'
import { OpportunityType } from '@/app/types'
import { PlusCircle, CheckCircle2 } from 'lucide-react'

export default function StaffSubmitPage() {
  const { session } = useAuth()
  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('')
  const [type, setType] = useState<OpportunityType>('Research')
  const [description, setDescription] = useState('')
  const [skillsRaw, setSkillsRaw] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const required_skills = skillsRaw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    try {
      await createOpportunity({
        title,
        department,
        type,
        description,
        required_skills,
        posted_by: session?.user?.id || null,
        status: 'open',
      })

      setMessage('Opportunity published successfully!')
      setTitle('')
      setDepartment('')
      setDescription('')
      setSkillsRaw('')
    } catch (err: any) {
      alert(err.message || 'Failed to post opportunity')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Post New Opportunity <PlusCircle className="w-6 h-6 text-blue-500" />
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Create a research position, TA opening, or lab assistant role for campus students.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Position Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. AI Research Assistant"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Computer Science"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Opportunity Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as OpportunityType)}
              className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Research">Research</option>
              <option value="Internship">Internship</option>
              <option value="TA">Teaching Assistant (TA)</option>
              <option value="Lab Assistant">Lab Assistant</option>
              <option value="Project">Project</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Required Skills (comma-separated)
          </label>
          <input
            type="text"
            placeholder="e.g. Python, PyTorch, Communication"
            value={skillsRaw}
            onChange={(e) => setSkillsRaw(e.target.value)}
            className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            required
            rows={4}
            placeholder="Provide details about expectations, responsibilities, and time commitment..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Position'}
        </button>
      </form>
    </div>
  )
}
