'use client'

import React, { useState, useTransition } from 'react'
import Image from 'next/image'
import { useUser } from '@/components/providers/UserContext'
import Button from '@/components/ui/Button'
import { Eye, EyeOff, CheckCircle, AlertCircle, Camera, Pencil } from 'lucide-react'

const inputClass = 'w-full px-3 py-2.5 rounded-xl text-caption font-medium outline-none bg-(--bg) border border-(--border-default) text-(--text) focus:border-(--accent) focus:shadow-lg'
const readonlyInputClass = `${inputClass} cursor-not-allowed bg-(--surface-sunken) text-(--text-tertiary)`

function Feedback({ type, message }: { type: 'success' | 'error'; message: string }) {
    return (
        <div
            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold ${
                type === 'success'
                    ? 'border-(--accent-22) bg-(--accent-8) text-(--accent)'
                    : 'border-(--error-22) bg-(--error-8) text-(--error)'
            }`}
        >
            {type === 'success'
                ? <CheckCircle size={16} strokeWidth={2} />
                : <AlertCircle size={16} strokeWidth={2} />
            }
            {message}
        </div>
    )
}

function ProfileSection() {
    const user = useUser()
    const [name, setName] = useState(user.name ?? '')
    const [isEditing, setIsEditing] = useState(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [isPending, startTransition] = useTransition()

    const initials = user.name
        ? user.name.split(' ').map(w => w[0]).slice(0, 1).join('').toUpperCase()
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
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: name.trim() }),
                })
                if (!res.ok) throw new Error()
                setFeedback({ type: 'success', message: 'Profile updated successfully.' })
                setIsEditing(false)
            } catch {
                setFeedback({ type: 'error', message: 'Failed to update profile. Try again.' })
            }
        })
    }

    return (
        <div className="relative flex flex-col gap-5 ">
            <div className="absolute top-0 right-0">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setIsEditing(true); setFeedback(null) }}
                    disabled={isEditing || isPending}
                    className={isEditing || isPending ? 'cursor-not-allowed opacity-40' : 'opacity-100'}
                >
                    <Pencil size={18} className='inline-block mr-2' />
                    Edit
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={user.name ?? user.email}
                            width={64}
                            height={64}
                            className="rounded-xl border border-(--border-default) object-cover"
                        />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-(--accent-22) bg-(--accent-10) text-main text-(--accent) shadow-accent-22">
                            {initials}
                        </div>
                    )}
                    <div
                        className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-(--border-default) bg-(--bg) text-(--text-tertiary)"
                        title="Avatar is managed via your Google account"
                    >
                        <Camera size={14} strokeWidth={1.75} />
                    </div>
                </div>

                <div className="flex flex-col gap-0.5">
                    <span className="text-lead font-bold text-secondary">
                        {user.name ?? user.email.split('@')[0]}
                    </span>
                    <span className="text-small text-tertiary font-medium">{user.email}</span>
                    <span className="text-small text-tertiary font-medium mt-0.5">
                        Member since {memberSince}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-caption font-bold text-secondary">Display name</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setFeedback(null) }}
                    placeholder="Your full name"
                    className={inputClass}
                    disabled={!isEditing || isPending}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                    <label className="text-caption font-bold text-secondary">Email</label>
                    <span className="text-tiny font-semibold text-tertiary">
                        Managed by {user.hasPassword ? 'your account' : 'Google'}
                    </span>
                </div>
                <input
                    type="email"
                    value={user.email}
                    readOnly
                    className={readonlyInputClass}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-caption font-bold text-secondary">Role</label>
                <div className="flex items-center gap-2 rounded-lg border border-(--border-subtle) bg-(--surface-sunken) px-4 py-2.5">
                    <span
                        className={`rounded-full border px-2 py-0.5 text-small font-bold uppercase tracking-wider ${
                            user.role === 'ADMIN'
                                ? 'border-(--accent-22) bg-(--accent-8) text-(--accent)'
                                : 'border-(--border-default) bg-(--surface-raised) text-(--text-tertiary)'
                        }`}
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
                    disabled={!isEditing || isPending || name.trim() === (user.name ?? '')}
                    className={!isEditing ? 'hidden' : 'block'}
                >
                    {isPending ? (
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                    ) : 'Save changes'}
                </Button>
            </div>
        </div>
    )
}

function PasswordSection() {
    const user = useUser()
    const [current, setCurrent] = useState('')
    const [next, setNext] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [isPending, startTransition] = useTransition()

    const isGoogleOnly = !user.hasPassword

    if (isGoogleOnly) {
        return (
            <div className="flex items-start gap-3 rounded-lg border border-(--border-subtle) bg-(--surface-sunken) px-4 py-3.5">
                <AlertCircle size={15} strokeWidth={1.75} className="mt-px text-(--text-tertiary)" />
                <div className="flex flex-col gap-0.5">
                    <span className="text-caption font-bold text-secondary">No password set</span>
                    <span className="text-small text-tertiary font-medium">
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
                setIsEditing(false)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update password.'
                setFeedback({ type: 'error', message })
            }
        })
    }

    const fields = [
        { label: 'Current password', value: current, set: setCurrent },
        { label: 'New password', value: next, set: setNext },
        { label: 'Confirm new password', value: confirm, set: setConfirm },
    ]

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setIsEditing(true); setFeedback(null) }}
                    disabled={isEditing || isPending}
                    className={isEditing || isPending ? 'cursor-not-allowed opacity-60' : ''}
                >
                    <Pencil size={18} className='inline-block mr-2' />
                    Edit
                </Button>
            </div>

            {fields.map(({ label, value, set }) => (
                <div key={label} className="flex flex-col gap-1.5 relative">
                    <label className="text-caption font-bold text-secondary">{label}</label>
                    <div className="relative">
                        <input
                            type={showPw ? 'text' : 'password'}
                            value={value}
                            placeholder="••••••••"
                            onChange={e => { set(e.target.value); setFeedback(null) }}
                            className={`${inputClass} pr-10`}
                            disabled={!isEditing || isPending}
                        />
                        {label === 'Current password' && (
                            <button
                                type="button"
                                onClick={() => setShowPw(p => !p)}
                                disabled={!isEditing || isPending}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent text-(--text-tertiary) focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {feedback && <Feedback {...feedback} />}

            <div className="flex justify-end">
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleUpdate}
                    disabled={!isEditing || isPending}
                    className={!isEditing ? 'hidden' : 'block'}
                >
                    {isPending ? (
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                    ) : 'Update password'}
                </Button>
            </div>
        </div>
    )
}

export default function AccountPage() {
    const sections = [
        { title: 'Profile', sub: 'Your name, avatar and account details.', content: <ProfileSection /> },
        { title: 'Password', sub: 'Update your login password.', content: <PasswordSection /> },
    ]

    return (
        <div className="flex flex-1 min-h-0 flex-col p-2 overflow-y-scroll">
            <div className="flex flex-col rounded-t-xl border border-(--accent-20) bg-(--surface-overlay) shadow-accent-40">

                <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-12 pb-12 pt-12">
                    <div className="flex flex-col gap-1 pb-6 border-b border-(--accent-20) ">
                        <h3 className="m-0 text-(--text)">Account</h3>
                        <span className="text-caption text-(--text-tertiary)">Manage your profile and sign-in details</span>
                    </div>

                    {sections.map(({ title, sub, content }) => (
                        <section key={title} className="flex flex-col gap-4 mt-8  ">
                            <div>
                                <h4 className="m-0 font-semibold">{title}</h4>
                                <p className="m-0 mt-1 text-caption text-tertiary">{sub}</p>
                            </div>
                            <div className="rounded-xl border border-(--accent-40) bg-(--surface-raised) p-6 shadow-accent-22">
                                {content}
                            </div>
                        </section>
                    ))}
                </main>
            </div>
        </div>
    )
}