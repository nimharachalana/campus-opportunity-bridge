"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ApplyModal from './ApplyModal'
import { fetchOpportunities } from '@/app/lib/api/opportunities'
import { Opportunity } from '@/app/types'

export default function GuestPublishPage() {
  const [items, setItems] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Opportunity | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const data = await fetchOpportunities()
      if (mounted) setItems(data)
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [])

  const defaultItems: Opportunity[] = [
    {
      id: 'temp-general-ict',
      title: 'General ICT',
      description: 'Hands-on General ICT course covering basics of computers, internet and productivity tools. Free for guests.',
      department: 'Community Education',
      type: 'Project',
      required_skills: ['Basic Computer', 'Typing'],
      posted_by: null,
      status: 'open',
      created_at: new Date().toISOString(),
    },
    {
      id: 'temp-web-development',
      title: 'Web Development',
      description: 'Introductory Web Development course covering HTML, CSS and JavaScript. Free for guests.',
      department: 'Community Education',
      type: 'Project',
      required_skills: ['HTML', 'CSS', 'JavaScript'],
      posted_by: null,
      status: 'open',
      created_at: new Date().toISOString(),
    },
    {
      id: 'temp-english',
      title: 'English',
      description: 'English conversation and writing course to improve communication skills. Free for guests.',
      department: 'Languages',
      type: 'Project',
      required_skills: ['Communication', 'Listening'],
      posted_by: null,
      status: 'open',
      created_at: new Date().toISOString(),
    },
    {
      id: 'temp-photoshop',
      title: 'Photoshop',
      description: 'Basic Photoshop course covering image editing, layers, and compositing. Free for guests.',
      department: 'Design',
      type: 'Project',
      required_skills: ['Creativity', 'Basic Design'],
      posted_by: null,
      status: 'open',
      created_at: new Date().toISOString(),
    },
    {
      id: 'temp-skill-development',
      title: 'Skill Development',
      description: 'Workshops focused on soft skills, productivity, and career readiness. Free for guests.',
      department: 'Career Services',
      type: 'Project',
      required_skills: ['Communication', 'Time Management'],
      posted_by: null,
      status: 'open',
      created_at: new Date().toISOString(),
    },
    {
      id: 'temp-video-editing',
      title: 'Video Editing',
      description: 'Hands-on Video Editing course covering cutting, color grading, and export best practices. Free for guests.',
      department: 'Media',
      type: 'Project',
      required_skills: ['Storytelling', 'Basic Editing'],
      posted_by: null,
      status: 'open',
      created_at: new Date().toISOString(),
    },
  ]

  return (
    <div className="flex flex-col flex-1 max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div className="inline-block bg-purple-800 rounded-md px-4 py-2">
          <h1 className="text-3xl font-bold text-white">Available Free Courses</h1>
        </div>
        <p className="text-purple-200 dark:text-purple-400 text-sm mt-4">Guests can view course details here.</p>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div className="rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-700 to-purple-800 p-8">
              <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {(items.length > 0 ? items : defaultItems).map((op) => (
                  <article key={op.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden flex flex-col h-full transform transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:ring-4 hover:ring-purple-400/30 cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-300/40">
                    <div className="h-56 sm:h-64 bg-gray-100 dark:bg-zinc-800 rounded-t-xl overflow-hidden">
                      <img
                        src={getImageFor(op.id)}
                        alt={op.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{op.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3 min-h-[6rem]">{op.description}</p>
                      <div className="flex items-center justify-between mt-auto gap-4 py-2">
                        <div className="text-sm text-purple-600 dark:text-purple-400 truncate w-2/3">{op.department}</div>
                        <div className="flex-shrink-0">
                          <button onClick={() => { setSelected(op); setModalOpen(true) }} className="inline-flex items-center justify-center w-32 h-10 bg-purple-600 text-white rounded-full text-sm cursor-pointer active:cursor-grabbing">
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <ApplyModal opportunity={selected} open={modalOpen} onClose={() => { setModalOpen(false); setSelected(null) }} />
    </div>
  )
}

  function getImageFor(id: string) {
    if (id.startsWith('temp-general')) return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=60'
    if (id.startsWith('temp-web')) return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=60'
    if (id.startsWith('temp-english')) return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=60'
    if (id.startsWith('temp-photoshop')) return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=60'
    if (id.startsWith('temp-skill-development')) return 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=60'
    if (id.startsWith('temp-video-editing')) return 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=60'
    return 'https://images.unsplash.com/photo-1507504031002-6d6b2f3a6a6b?auto=format&fit=crop&w=1200&q=60'
  }
