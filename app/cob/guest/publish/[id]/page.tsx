import { getOpportunityById } from '@/app/lib/api/opportunities'

export default async function GuestOpportunityPage({ params }: { params: { id: string } }) {
  const opp = await getOpportunityById(params.id)
    const id = params.id
    const tempMap: Record<string, any> = {
      'temp-general-ict': {
        id: 'temp-general-ict',
        title: 'General ICT',
        description: 'Hands-on General ICT course covering basics of computers, internet and productivity tools. Free for guests.',
        department: 'Community Education',
        type: 'Project',
        required_skills: ['Basic Computer', 'Typing'],
        conductor: 'John Doe',
        duration: '4 weeks',
        features: ['Hands-on labs', 'Certificate'],
        reviews: [
          { name: 'Amaya K', rating: 5, comment: 'Excellent practical course — learned a lot.' },
        ],
        created_at: new Date().toISOString(),
      },
      'temp-web-development': {
        id: 'temp-web-development',
        title: 'Web Development',
        description: 'Introductory Web Development course covering HTML, CSS and JavaScript. Free for guests.',
        department: 'Community Education',
        type: 'Project',
        required_skills: ['HTML', 'CSS', 'JavaScript'],
        conductor: 'Jane Smith',
        duration: '6 weeks',
        features: ['Projects', 'Mentor support'],
        reviews: [
          { name: 'Liam R', rating: 5, comment: 'Great instructors and hands-on projects.' },
        ],
        created_at: new Date().toISOString(),
      },
      'temp-english': {
        id: 'temp-english',
        title: 'English',
        description: 'English conversation and writing course to improve communication skills. Free for guests.',
        department: 'Languages',
        type: 'Project',
        required_skills: ['Communication', 'Listening'],
        conductor: 'Dr. Allen',
        duration: '8 weeks',
        features: ['Conversation practice', 'Writing workshops'],
        reviews: [
          { name: 'Sara P', rating: 5, comment: 'Helped my speaking and confidence a lot.' },
        ],
        created_at: new Date().toISOString(),
      },
      'temp-photoshop': {
        id: 'temp-photoshop',
        title: 'Photoshop',
        description: 'Basic Photoshop course covering image editing, layers, and compositing. Free for guests.',
        department: 'Design',
        type: 'Project',
        required_skills: ['Creativity', 'Basic Design'],
        conductor: 'Creative Lab',
        duration: '3 weeks',
        features: ['Practical exercises', 'Portfolio pieces'],
        reviews: [
          { name: 'Noah M', rating: 5, comment: 'Practical and clear — great for beginners.' },
        ],
        created_at: new Date().toISOString(),
      },
      'temp-skill-development': {
        id: 'temp-skill-development',
        title: 'Skill Development',
        description: 'Workshops focused on soft skills, productivity, and career readiness. Free for guests.',
        department: 'Career Services',
        type: 'Project',
        required_skills: ['Communication', 'Time Management'],
        conductor: 'Career Team',
        duration: '2 weeks',
        features: ['Workshops', '1:1 coaching'],
        reviews: [
          { name: 'Olivia T', rating: 5, comment: 'Useful tips and excellent coaching.' },
        ],
        created_at: new Date().toISOString(),
      },
      'temp-video-editing': {
        id: 'temp-video-editing',
        title: 'Video Editing',
        description: 'Hands-on Video Editing course covering cutting, color grading, and export best practices. Free for guests.',
        department: 'Media',
        type: 'Project',
        required_skills: ['Storytelling', 'Basic Editing'],
        conductor: 'Media Lab',
        duration: '5 weeks',
        features: ['Practical projects', 'Export workflows'],
        reviews: [
          { name: 'Ethan V', rating: 5, comment: 'Great practical lessons and tips for quick editing.' },
        ],
        created_at: new Date().toISOString(),
      },
    }

    const data = opp ?? tempMap[id]

    if (!data) {
      return (
        <div className="flex flex-col flex-1 max-w-3xl mx-auto p-4 sm:p-6">
          <h1 className="text-2xl font-semibold">Course not found</h1>
          <p className="text-gray-500">The requested course does not exist or has been removed.</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col flex-1 max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
          <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300">{data.title}</h1>
          <div className="text-sm text-purple-500 dark:text-purple-400">{data.department} — {data.type}</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800">
          <div className="w-full h-56 mb-4 overflow-hidden rounded-md">
            <img src={getImageFor(data.id)} alt={data.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100">
              <img src={getConductorImage(data.conductor || '')} alt={data.conductor || 'Conductor'} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Conductor</div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">{data.conductor ?? 'TBA'}</div>
            </div>
          </div>

          <h2 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Description</h2>
          <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{data.description}</p>

          {data.required_skills && data.required_skills.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">Required Skills</h3>
              <ul className="list-disc list-inside text-gray-900 dark:text-white mt-2">
                {data.required_skills.map((s: string) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300">Conductor</h4>
              <div className="text-gray-900 dark:text-white">{data.conductor ?? 'TBA'}</div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300">Duration</h4>
              <div className="text-gray-900 dark:text-white">{data.duration ?? 'TBA'}</div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300">Features</h4>
              <div className="text-gray-900 dark:text-white">{data.features ? data.features.join(', ') : 'N/A'}</div>
            </div>
          </div>

          <div className="mt-6">
            <ApplyButton opportunityId={data.id} />
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Content</h3>
            <div className="mt-2 text-gray-800 dark:text-gray-200">
              {(data.content && typeof data.content === 'string') ? (
                <p className="whitespace-pre-wrap">{data.content}</p>
              ) : (
                <p className="whitespace-pre-wrap">{data.description}</p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Reviews</h3>
            {data.reviews && data.reviews.length > 0 ? (
              <div className="mt-3 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-yellow-500">{averageRating(data.reviews)}</div>
                  <div className="text-sm text-gray-600">out of 5</div>
                </div>
                {data.reviews.map((r: any, i: number) => (
                  <div key={i} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 dark:text-white">{r.name}</div>
                      <div className="flex items-center gap-1">{renderStars(r.rating)}</div>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">{r.comment}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 text-gray-600">No reviews yet.</div>
            )}
          </div>
        </div>
      </div>
    )


  function getImageFor(id: string) {
    if (id.startsWith('temp-general')) return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=60'
    if (id.startsWith('temp-web')) return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=60'
    if (id.startsWith('temp-english')) return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=60'
    if (id.startsWith('temp-photoshop')) return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=60'
    if (id.startsWith('temp-skill-development')) return 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=60'
    return 'https://images.unsplash.com/photo-1507504031002-6d6b2f3a6a6b?auto=format&fit=crop&w=1200&q=60'
  }

  function getConductorImage(name: string) {
    const n = encodeURIComponent(name || 'Instructor')
    return `https://ui-avatars.com/api/?name=${n}&background=7c3aed&color=fff&rounded=true`
  }

  function renderStars(rating: number) {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={i <= rating ? '#f59e0b' : '#e5e7eb'} className="w-4 h-4">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.974c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.286-3.974a1 1 0 00-.364-1.118L2.62 9.401c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
        </svg>
      )
    }
    return <>{stars}</>
  }

  function averageRating(reviews: any[]) {
    if (!reviews || reviews.length === 0) return 0
    const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }
  return (
    <div className="flex flex-col flex-1 max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300">{opp.title}</h1>
        <div className="text-sm text-purple-500 dark:text-purple-400">{opp.department} — {opp.type}</div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800">
        <h2 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Description</h2>
        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{opp.description}</p>

        {opp.required_skills && opp.required_skills.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">Required Skills</h3>
            <ul className="list-disc list-inside text-gray-900 dark:text-white mt-2">
              {opp.required_skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 text-sm text-purple-500">
          Posted: {new Date(opp.created_at).toLocaleString()}
        </div>
      </div>
    </div>
  )
}
