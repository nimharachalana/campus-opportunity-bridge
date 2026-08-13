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

    const [editMode, setEditMode] = useState(false)

    // Editable fields
    const [fullName, setFullName] = useState('')
    const [department, setDepartment] = useState('')
    const [gpa, setGpa] = useState('')
    const [skills, setSkills] = useState<string[]>([])

    // Avatar
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [avatarUploading, setAvatarUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Password change
    const [mustChangePassword, setMustChangePassword] = useState(false)
    const [showPasswordForm, setShowPasswordForm] = useState(false)
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
                    setSkills(prof.skills || [])
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

        setAvatarUploading(true)
        const ext = file.name.split('.').pop()
        const filePath = `${user.id}/avatar.${ext}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true })

        if (uploadError) {
            setMessage('Failed to upload photo: ' + uploadError.message)
            setMessageType('error')
            setAvatarUploading(false)
            return
        }

        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)

        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
        setAvatarUrl(publicUrl)
        setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : prev)
        setAvatarUploading(false)
        setMessage('Profile photo updated!')
        setMessageType('success')
        setTimeout(() => setMessage(''), 3000)
    }

    const handleSave = async () => {
        if (!user) return
        setSaving(true)
        setMessage('')
        const { error } = await supabase
            .from('profiles')
            .update({ full_name: fullName, department, gpa: gpa ? parseFloat(gpa) : null, skills })
            .eq('id', user.id)

        if (error) {
            setMessage(error.message)
            setMessageType('error')
        } else {
            setMessage('Profile updated successfully!')
            setMessageType('success')
            setEditMode(false)
            setProfile(prev => prev ? { ...prev, full_name: fullName, department, gpa: gpa ? parseFloat(gpa) : null, skills } : prev)
        }
        setSaving(false)
        setTimeout(() => setMessage(''), 3000)
    }

    const toggleSkill = (skill: string) => {
        setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setPwError('')
        setPwMessage('')
        if (newPassword !== confirmPassword) { setPwError('Passwords do not match'); return }
        if (newPassword.length < 6) { setPwError('Password must be at least 6 characters'); return }
        setPwLoading(true)
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) { setPwError(error.message); setPwLoading(false); return }
        if (user?.id) await supabase.from('profiles').update({ must_change_password: false }).eq('id', user.id)
        setPwMessage('Password updated successfully!')
        setPwLoading(false)
        setNewPassword('')
        setConfirmPassword('')
        setMustChangePassword(false)
        setShowPasswordForm(false)
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
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
                {!editMode ? (
                    <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-all shadow-md shadow-teal-900/20"
                    >
                        <Pencil className="w-4 h-4" /> Edit Profile
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setEditMode(false)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold text-sm transition-all"
                        >
                            <X className="w-4 h-4" /> Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-all shadow-md disabled:opacity-60"
                        >
                            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
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

            {/* Profile Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-6">
                <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="relative shrink-0 group">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
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
                        <div className="flex items-center gap-2 mt-1">
                            <span className="inline-block px-2.5 py-0.5 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold rounded-full capitalize">
                                {profile?.role || 'Student'}
                            </span>
                            {profile?.department && (
                                <span className="inline-block px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-full">
                                    {profile.department}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Hover over photo to change it</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                        {editMode ? (
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
                        {editMode ? (
                            <input type="text" value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Computer Science"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                        ) : (
                            <p className="text-slate-900 dark:text-white font-semibold text-sm">{profile?.department || '—'}</p>
                        )}
                    </div>

                    {/* GPA */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> GPA</label>
                        {editMode ? (
                            <input type="number" min="0" max="4" step="0.01" value={gpa} onChange={e => setGpa(e.target.value)} placeholder="e.g. 3.75"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                        ) : (
                            <p className="text-slate-900 dark:text-white font-semibold text-sm">{profile?.gpa ?? '—'}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-5">
                <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-teal-500" /> Skills
                </h2>
                {editMode ? (
                    <>
                        <div className="flex flex-wrap gap-2">
                            {ALL_SKILLS.map(skill => (
                                <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${skills.includes(skill) ? 'bg-teal-500 text-white border-teal-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-teal-400'}`}>
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {(profile?.skills ?? []).length === 0 ? (
                            <p className="text-sm text-slate-400">No skills added yet. Click Edit Profile to add skills.</p>
                        ) : (
                            (profile?.skills ?? []).map(skill => (
                                <span key={skill} className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Password Change Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <Lock className="w-5 h-5 text-slate-400" /> Password
                    </h2>
                    <button onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="text-sm font-semibold text-teal-600 hover:text-teal-500 transition-colors">
                        {showPasswordForm ? 'Cancel' : 'Change Password'}
                    </button>
                </div>
                {showPasswordForm && (
                    <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                                <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confirm Password</label>
                                <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                            </div>
                        </div>
                        {pwError && <p className="text-sm text-red-500 font-medium">{pwError}</p>}
                        {pwMessage && <p className="text-sm text-emerald-500 font-medium">{pwMessage}</p>}
                        <button type="submit" disabled={pwLoading}
                            className="w-full sm:w-auto self-start px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition-all disabled:opacity-60">
                            {pwLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}