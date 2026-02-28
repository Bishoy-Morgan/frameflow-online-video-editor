'use client'

import React, { useState, useTransition } from 'react'
import Image from 'next/image'
import DashboardHeader from '../components/DashboardHeader'
import { useUser } from '../components/UserContext'
import Button from '@/components/ui/Button'
import { Eye, EyeOff, CheckCircle, AlertCircle, Camera } from 'lucide-react'

// Shared input style 
const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'var(--surface-raised)',
    border: '1px solid var(--border-default)',
    borderRadius: '0.625rem',
    padding: '0.625rem 1rem',
    fontSize: '0.875rem',
    fontFamily: 'var(--font-quicksand), sans-serif',
    fontWeight: 500,
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.2s ease',
}

const readonlyInputStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: 'var(--surface-sunken)',
    color: 'var(--text-tertiary)',
    cursor: 'not-allowed',
}

// Feedback message
function Feedback({ type, message }: { type: 'success' | 'error'; message: string }) {
    return (
        <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold"
            style={{
                backgroundColor: type === 'success' ? 'var(--turquoise-8)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${type === 'success' ? 'var(--turquoise-22)' : 'rgba(239,68,68,0.2)'}`,
                color: type === 'success' ? 'var(--turquoise)' : '#ef4444',
            }}
        >
            {type === 'success'
                ? <CheckCircle size={13} strokeWidth={2} />
                : <AlertCircle size={13} strokeWidth={2} />
            }
            {message}
        </div>
    )
}

// Profile section
function ProfileSection() {
    const user = useUser()
    const [name,       setName]       = useState(user.name ?? '')
    const [feedback,   setFeedback]   = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [isPending,  startTransition] = useTransition()

    const initials = user.name
        ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : user.email[0].toUpperCase()

    const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long', year: 'numeric'
    })

    async function handleSave() {
        if (!name.trim()) {
            setFeedback({ type: 'error', message: 'Name cannot be empty.' })
            return
        }
        startTransition(async () => {
            try {
                const res = await fetch('/api/user/profile', {
                    method:  'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ name: name.trim() }),
                })
                if (!res.ok) throw new Error()
                setFeedback({ type: 'success', message: 'Profile updated successfully.' })
            } catch {
                setFeedback({ type: 'error', message: 'Failed to update profile. Try again.' })
            }
        })
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Avatar row */}
            <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={user.name ?? user.email}
                            width={64}
                            height={64}
                            className="rounded-xl object-cover"
                            style={{ border: '1px solid var(--border-default)' }}
                        />
                    ) : (
                        <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold"
                            style={{
                                backgroundColor: 'var(--turquoise-10)',
                                border: '1px solid var(--turquoise-22)',
                                color: 'var(--turquoise)',
                                fontFamily: 'var(--font-dm-serif-display), serif',
                            }}
                        >
                            {initials}
                        </div>
                    )}
                    {/* Avatar upload hint */}
                    <div
                        className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                        style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)' }}
                        title="Avatar is managed via your Google account"
                    >
                        <Camera size={11} strokeWidth={1.75} />
                    </div>
                </div>

                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-secondary">
                        {user.name ?? user.email.split('@')[0]}
                    </span>
                    <span className="text-xs text-tertiary font-medium">{user.email}</span>
                    <span className="text-[0.65rem] text-tertiary font-medium mt-0.5">
                        Member since {memberSince}
                    </span>
                </div>
            </div>

            {/* Name field */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary">Display name</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setFeedback(null) }}
                    placeholder="Your full name"
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                    onBlur={e  => e.currentTarget.style.borderColor = 'var(--border-default)'}
                />
            </div>

            {/* Email — read only, managed by auth provider */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-secondary">Email</label>
                    <span className="text-[0.65rem] font-semibold text-tertiary">
                        Managed by {user.password ? 'your account' : 'Google'}
                    </span>
                </div>
                <input
                    type="email"
                    value={user.email}
                    readOnly
                    style={readonlyInputStyle}
                />
            </div>

            {/* Role badge */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary">Role</label>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
                    style={{ backgroundColor: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)' }}
                >
                    <span
                        className="text-[0.6rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                        style={{
                            backgroundColor: user.role === 'ADMIN' ? 'var(--turquoise-8)' : 'var(--surface-raised)',
                            border: `1px solid ${user.role === 'ADMIN' ? 'var(--turquoise-22)' : 'var(--border-default)'}`,
                            color: user.role === 'ADMIN' ? 'var(--turquoise)' : 'var(--text-tertiary)',
                        }}
                    >
                        {user.role}
                    </span>
                </div>
            </div>

            {feedback && <Feedback {...feedback} />}

            <div className="flex justify-end">
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={isPending || name.trim() === (user.name ?? '')}
                >
                    {isPending ? (
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                    ) : 'Save changes'}
                </Button>
            </div>
        </div>
    )
}

// ── Password section ──────────────────────────────────────────────────────────
function PasswordSection() {
    const user = useUser()
    const [current,  setCurrent]  = useState('')
    const [next,     setNext]     = useState('')
    const [confirm,  setConfirm]  = useState('')
    const [showPw,   setShowPw]   = useState(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [isPending, startTransition] = useTransition()

    // Google-only users have no password — show info instead
    const isGoogleOnly = !user.password

    if (isGoogleOnly) {
        return (
            <div
                className="flex items-start gap-3 px-4 py-3.5 rounded-lg"
                style={{ backgroundColor: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)' }}
            >
                <AlertCircle size={15} strokeWidth={1.75} style={{ color: 'var(--text-tertiary)', marginTop: 1 }} />
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-secondary">No password set</span>
                    <span className="text-xs text-tertiary font-medium">
                        Your account uses Google Sign-In. Password login is not enabled.
                    </span>
                </div>
            </div>
        )
    }

    async function handleUpdate() {
        if (!current || !next || !confirm) {
            setFeedback({ type: 'error', message: 'All fields are required.' })
            return
        }
        if (next !== confirm) {
            setFeedback({ type: 'error', message: 'New passwords do not match.' })
            return
        }
        if (next.length < 8) {
            setFeedback({ type: 'error', message: 'Password must be at least 8 characters.' })
            return
        }
        startTransition(async () => {
            try {
                const res = await fetch('/api/user/password', {
                    method:  'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ currentPassword: current, newPassword: next }),
                })
                if (!res.ok) {
                    const data = await res.json()
                    throw new Error(data.error ?? 'Failed')
                }
                setCurrent(''); setNext(''); setConfirm('')
                setFeedback({ type: 'success', message: 'Password updated successfully.' })
            } catch (err: any) {
                setFeedback({ type: 'error', message: err.message ?? 'Failed to update password.' })
            }
        })
    }

    const fields = [
        { label: 'Current password',      value: current,  set: setCurrent  },
        { label: 'New password',           value: next,     set: setNext     },
        { label: 'Confirm new password',   value: confirm,  set: setConfirm  },
    ]

    return (
        <div className="flex flex-col gap-4">
            {fields.map(({ label, value, set }) => (
                <div key={label} className="flex flex-col gap-1.5 relative">
                    <label className="text-xs font-bold text-secondary">{label}</label>
                    <div className="relative">
                        <input
                            type={showPw ? 'text' : 'password'}
                            value={value}
                            placeholder="••••••••"
                            onChange={e => { set(e.target.value); setFeedback(null) }}
                            style={{ ...inputStyle, paddingRight: '2.5rem' }}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                            onBlur={e  => e.currentTarget.style.borderColor = 'var(--border-default)'}
                        />
                        {/* Show/hide toggle only on first field */}
                        {label === 'Current password' && (
                            <button
                                type="button"
                                onClick={() => setShowPw(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none cursor-pointer"
                                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)' }}
                            >
                                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {feedback && <Feedback {...feedback} />}

            <div className="flex justify-end">
                <Button variant="primary" size="sm" onClick={handleUpdate} disabled={isPending}>
                    {isPending ? (
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                    ) : 'Update password'}
                </Button>
            </div>
        </div>
    )
}

// ── Plan section ──────────────────────────────────────────────────────────────
function PlanSection() {
    const user = useUser()

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-secondary">Free Plan</span>
                    <span
                        className="text-[0.6rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                        style={{
                            backgroundColor: 'var(--turquoise-8)',
                            border: '1px solid var(--turquoise-22)',
                            color: 'var(--turquoise)',
                        }}
                    >
                        Active
                    </span>
                </div>
                <span className="text-xs text-tertiary font-medium">
                    {user._count.projects} {user._count.projects === 1 ? 'project' : 'projects'} · Standard export
                </span>
            </div>
            <Button variant="primary" size="sm">Upgrade to Pro</Button>
        </div>
    )
}

export default function DashboardSettingsPage() {
    const sections = [
        { title: 'Profile',  sub: 'Your name, avatar and account details.', content: <ProfileSection /> },
        { title: 'Password', sub: 'Update your login password.',            content: <PasswordSection /> },
        { title: 'Plan',     sub: 'Your current subscription.',             content: <PlanSection /> },
    ]

    return (
        <div className="relative flex flex-col flex-1 min-h-0 overflow-auto">
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full"
                style={{ background: 'radial-gradient(circle, var(--turquoise-8) 0%, transparent 65%)', filter: 'blur(72px)' }}
            />

            <DashboardHeader title="Settings" />

            <main className="relative z-10 flex-1 p-8 max-w-2xl flex flex-col gap-8">
                {sections.map(({ title, sub, content }) => (
                    <section key={title} className="flex flex-col gap-4">
                        <div>
                            <h4 className="m-0 font-semibold text-base">{title}</h4>
                            <p className="m-0 mt-1 text-sm text-tertiary">{sub}</p>
                        </div>
                        <div
                            className="p-6 rounded-xl"
                            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                        >
                            {content}
                        </div>
                    </section>
                ))}
            </main>
        </div>
    )
}