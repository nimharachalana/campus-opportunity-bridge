'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Profile } from '@/app/types'
import {
    Mail, GraduationCap, Building2, Star,
    Lock, CheckCircle2, XCircle, Pencil, Plus, X, Save, Camera, Loader2
} from 'lucide-react'

const ALL_SKILLS = [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Next.js',
    'Java', 'C++', 'C#', 'R', 'MATLAB', 'SQL', 'PostgreSQL', 'MongoDB',
    'Machine Learning', 'Deep Learning', 'Data Analysis', 'Statistics',
    'Communication', 'Research', 'Writing', 'Leadership', 'Teamwork',
    'Problem Solving', 'Critical Thinking', 'Project Management',
    'Figma', 'UI/UX Design', 'Graphic Design', 'Public Speaking', 'Excel',
]

export default function StudentProfile() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error'>('success')

    const [editProfileMode, setEditProfileMode] = useState(false)
    const [editSkillsMode, setEditSkillsMode] = useState(false)
    const [customSkill, setCustomSkill] = useState('')
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    // Editable fields
    const [fullName, setFullName] = useState('')
    const [department, setDepartment] = useState('')
    const [gpa, setGpa] = useState('')
    const [skills, setSkills] = useState<{name: string, percentage: number}[]>([])

    // Avatar
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [avatarUploading, setAvatarUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Password change
    const [mustChangePassword, setMustChangePassword] = useState(false)
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [pwLoading, setPwLoading] = useState(false)
    const [pwMessage, setPwMessage] = useState('')
    const [pwError, setPwError] = useState('')

    useEffect(() => {
        async function load() {
            setLoading(true)
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (authUser) {
                setUser(authUser)
                const { data: prof } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single()
                if (prof) {
                    setProfile(prof as Profile)
                    setFullName(prof.full_name || '')
                    setDepartment(prof.department || '')
                    setGpa(prof.gpa?.toString() || '')
                    const loadedSkills = prof.skills || []
                    const parsedSkills = loadedSkills.map((s: any) => {
                        let obj: any = { name: 'Unknown', percentage: 50 }
                        if (typeof s === 'string') {
                            try {
                                const p = JSON.parse(s);
                                if (p && p.name) obj = { ...obj, ...p };
                                else obj.name = s;
                            } catch { obj.name = s; }
                        } else if (typeof s === 'object' && s !== null) {
                            obj = { ...s };
                        }
                        if (typeof obj.name === 'string' && obj.name.startsWith('{')) {
                            try {
                                const pName = JSON.parse(obj.name);
                                if (pName && pName.name) obj.name = pName.name;
                            } catch {}
                        }
                        return obj;
                    })
                    const uniqueSkills = Array.from(new Map(parsedSkills.map((s: any) => [s.name, s])).values())
                    setSkills(uniqueSkills as {name: string, percentage: number}[])
                    setMustChangePassword(prof.must_change_password ?? false)
                    setAvatarUrl(prof.avatar_url || null)
                }
            }
            setLoading(false)
        }
        load()
    }, [])

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        if (file.size > 2 * 1024 * 1024) {
            setMessage('Photo must be smaller than 2MB.')
            setMessageType('error')
            return
        }

        setAvatarUploading(true)
        const reader = new FileReader()
        reader.onloadend = async () => {
            const result = reader.result as string
            setAvatarPreview(result)

            try {
                const finalAvatarUrl = await new Promise<string>((resolve, reject) => {
                    const img = new Image()
                    img.onload = () => {
                        const canvas = document.createElement('canvas')
                        const MAX = 256
                        const scale = Math.min(MAX / img.width, MAX / img.height, 1)
                        canvas.width = img.width * scale
                        canvas.height = img.height * scale
                        const ctx = canvas.getContext('2d')
                        if (ctx) {
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                            resolve(canvas.toDataURL('image/jpeg', 0.82))
                        } else {
                            reject('Canvas context error')
                        }
                    }
                    img.onerror = reject
                    img.src = result
                })

                const { error } = await supabase
                    .from('profiles')
                    .update({ avatar_url: finalAvatarUrl })
                    .eq('id', user.id)

                if (error) {
                    setMessage(error.message)
                    setMessageType('error')
                } else {
                    setAvatarUrl(finalAvatarUrl)
                    setAvatarFile(null)
                    setAvatarPreview(null)
                    setProfile(prev => prev ? { ...prev, avatar_url: finalAvatarUrl } : prev)
                    setMessage('Profile photo updated successfully!')
                    setMessageType('success')
                }
            } catch (err) {
                console.warn('Image save failed', err)
                setMessage('Failed to update photo.')
                setMessageType('error')
            } finally {
                setAvatarUploading(false)
                setTimeout(() => setMessage(''), 3000)
            }
        }
        reader.readAsDataURL(file)
    }

    const handleSaveProfile = async () => {
        if (!user) return
        setSaving(true)
        setMessage('')

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                department,
                gpa: gpa ? parseFloat(gpa) : null
            })
            .eq('id', user.id)

        if (error) {
            setMessage(error.message)
            setMessageType('error')
        } else {
            setMessage('Profile details updated successfully!')
            setMessageType('success')
            setEditProfileMode(false)
            setProfile(prev => prev ? { ...prev, full_name: fullName, department, gpa: gpa ? parseFloat(gpa) : null } : prev)
        }
        setSaving(false)
        setTimeout(() => setMessage(''), 3000)
    }

    const handleSaveSkills = async () => {
        if (!user) return
        setSaving(true)
        setMessage('')

        const { error } = await supabase
            .from('profiles')
            .update({ skills })
            .eq('id', user.id)

        if (error) {
            setMessage(error.message)
            setMessageType('error')
        } else {
            setMessage('Skills updated successfully!')
            setMessageType('success')
            setEditSkillsMode(false)
            setProfile(prev => prev ? { ...prev, skills } : prev)
        }
        setSaving(false)
        setTimeout(() => setMessage(''), 3000)
    }

    const addSkill = (name: string) => {
        setSkills(prev => [...prev, { name, percentage: 50 }])
    }
    const addCustomSkill = () => {
        if (customSkill.trim() && !skills.some(s => s.name.toLowerCase() === customSkill.trim().toLowerCase())) {
            setSkills(prev => [...prev, { name: customSkill.trim(), percentage: 50 }])
            setCustomSkill('')
        }
    }
    const removeSkill = (name: string) => {
        setSkills(prev => prev.filter(s => s.name !== name))
    }
    const updateSkillPercentage = (name: string, percentage: number) => {
        setSkills(prev => prev.map(s => s.name === name ? { ...s, percentage } : s))
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setPwError('')
        setPwMessage('')
        if (!currentPassword) { setPwError('Current password is required'); return }
        if (newPassword !== confirmPassword) { setPwError('Passwords do not match'); return }
        if (newPassword.length < 6) { setPwError('Password must be at least 6 characters'); return }
        setPwLoading(true)

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user?.email,
            password: currentPassword
        })

        if (signInError) {
            setPwError('Incorrect current password')
            setPwLoading(false)
            return
        }

        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) { setPwError(error.message); setPwLoading(false); return }
        if (user?.id) await supabase.from('profiles').update({ must_change_password: false }).eq('id', user.id)
        setPwMessage('Password updated successfully!')
        setPwLoading(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setMustChangePassword(false)
        setTimeout(() => setShowPasswordModal(false), 2000)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const initials = (fullName || profile?.full_name || 'S').charAt(0).toUpperCase()

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setShowPasswordModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold text-sm transition-all shadow-md">
                        <Lock className="w-4 h-4" /> Change Password
                    </button>
                    {!editProfileMode ? (
                        <button
                            type="button"
                            onClick={() => setEditProfileMode(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-all shadow-md shadow-teal-900/20"
                        >
                            <Pencil className="w-4 h-4" /> Edit Profile
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setEditProfileMode(false)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold text-sm transition-all"
                            >
                                <X className="w-4 h-4" /> Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-all shadow-md disabled:opacity-60"
                            >
                                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {message && (
                <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${messageType === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'}`}>
                    {messageType === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                    {message}
                </div>
            )}

            {mustChangePassword && (
                <div className="flex items-center gap-3 p-4 rounded-xl border bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm font-medium">
                    <Lock className="w-5 h-5 shrink-0" />
                    You are using a default password. Please change it below.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
            {/* Profile Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-6 w-full">
                <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="relative shrink-0 group">
                        {(avatarPreview || avatarUrl) ? (
                            <img
                                src={(avatarPreview || avatarUrl)!}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-teal-500/30 shadow-lg"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-teal-500/30 shadow-lg">
                                {initials}
                            </div>
                        )}
                        {/* Upload overlay */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={avatarUploading}
                            className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            {avatarUploading
                                ? <Loader2 className="w-6 h-6 text-white animate-spin" />
                                : <Camera className="w-6 h-6 text-white" />
                            }
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profile?.full_name || 'Student'}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                        <div className="flex flex-col gap-2 mt-2 items-start">
                            <span className="inline-block px-2.5 py-0.5 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold rounded-full capitalize">
                                {profile?.role || 'Student'}
                            </span>
                            {profile?.department && (
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {profile.department}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                        {editProfileMode ? (
                            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                        ) : (
                            <p className="text-slate-900 dark:text-white font-semibold text-sm">{profile?.full_name || '—'}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</label>
                        <p className="text-slate-900 dark:text-white font-semibold text-sm">{user?.email || '—'}</p>
                    </div>

                    {/* Department */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Department</label>
                        {editProfileMode ? (
                            <select 
                                value={department} 
                                onChange={e => setDepartment(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                            >
                                <option value="" disabled>Select Department</option>
                                <option value="Department of Engineering Technology">Department of Engineering Technology</option>
                                <option value="Department of Information and Communication Technology (ICT)">Department of Information and Communication Technology (ICT)</option>
                                <option value="Department of Biosystems Technology">Department of Biosystems Technology</option>
                                <option value="Department of Multidisciplinary Studies">Department of Multidisciplinary Studies</option>
                            </select>
                        ) : (
                            <p className="text-slate-900 dark:text-white font-semibold text-sm">{profile?.department || '—'}</p>
                        )}
                    </div>

                    {/* GPA */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> GPA</label>
                        {editProfileMode ? (
                            <div className="flex items-center gap-3 w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2">
                                <input type="range" min="0" max="4" step="0.01" value={gpa || 0} onChange={e => setGpa(e.target.value)} className="flex-1 accent-teal-500 cursor-pointer" />
                                <input type="number" min="0" max="4" step="0.01" value={gpa} onChange={e => setGpa(e.target.value)} placeholder="0.00"
                                    className="w-20 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-bold text-sm outline-none text-center focus:ring-2 focus:ring-teal-500" />
                            </div>
                        ) : (
                            <p className="text-slate-900 dark:text-white font-semibold text-sm">{profile?.gpa ?? '—'}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-5 w-full">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <Star className="w-5 h-5 text-teal-500" /> Skills
                    </h2>
                    {!editSkillsMode ? (
                        <button type="button" onClick={() => setEditSkillsMode(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold text-sm transition-all">
                            <Pencil className="w-4 h-4" /> Edit Skills
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setEditSkillsMode(false)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold text-sm transition-all">
                                <X className="w-4 h-4" /> Cancel
                            </button>
                            <button type="button" onClick={handleSaveSkills} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-all shadow-md disabled:opacity-60">
                                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Skills'}
                            </button>
                        </div>
                    )}
                </div>
                {editSkillsMode ? (
                    <div className="flex flex-col gap-6 mt-2">

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Add Custom Skill</label>
                            <div className="flex gap-2">
                                <input type="text" value={customSkill} onChange={e => setCustomSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()} placeholder="e.g. AWS, Docker" className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white" />
                                <button type="button" onClick={addCustomSkill} className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-bold transition-colors">Add</button>
                            </div>
                        </div>

                        {skills.length > 0 && (
                            <div className="flex flex-col gap-3 mt-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adjust Proficiency</label>
                                <div className="flex flex-col gap-3">
                                    {skills.map(skill => (
                                        <div key={skill.name} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <span className="font-semibold text-slate-900 dark:text-white min-w-[120px]">{skill.name}</span>
                                            <input type="range" min="0" max="100" value={skill.percentage} onChange={(e) => updateSkillPercentage(skill.name, parseInt(e.target.value))} className="flex-1 accent-teal-500" />
                                            <span className="text-sm font-bold w-10 text-right text-teal-600 dark:text-teal-400">{skill.percentage}%</span>
                                            <button type="button" onClick={() => removeSkill(skill.name)} className="text-slate-400 hover:text-red-500 p-1 ml-2">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col w-full mt-2">
                        {skills.length === 0 ? (
                            <p className="text-sm text-slate-400">No skills added yet. Click Edit Skills to add skills.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 w-full">
                                {skills.map(skill => (
                                    <div key={skill.name} className="flex flex-col gap-1.5 w-full">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">{skill.name}</span>
                                            <span className="text-teal-600 dark:text-teal-400 font-bold">{skill.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                            <div className="bg-teal-500 h-2 rounded-full transition-all duration-500" style={{ width: `${skill.percentage}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Lock className="w-6 h-6 text-teal-500" /> Change Password</h2>
                            <button type="button" onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full p-2 transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handlePasswordChange} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Password</label>
                                <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                                <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confirm Password</label>
                                <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                            </div>
                            {pwError && <p className="text-sm text-red-500 font-medium">{pwError}</p>}
                            {pwMessage && <p className="text-sm text-emerald-500 font-medium">{pwMessage}</p>}
                            <div className="flex justify-end gap-3 mt-2">
                                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                                <button type="submit" disabled={pwLoading} className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition-all disabled:opacity-60">{pwLoading ? 'Updating...' : 'Update Password'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}