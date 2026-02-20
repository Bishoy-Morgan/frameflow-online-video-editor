'use client'

import React, { useState } from 'react'
import DashboardHeader from '../components/DashboardHeader'
import Button from '@/components/ui/Button'

export default function DashboardSettingsPage() {
    const [displayName, setDisplayName] = useState('Your Name')
    const [email,       setEmail]       = useState('you@example.com')

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

    const sections = [
        {
            title:  'Profile',
            sub:    'Your name and email address.',
            content: (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-secondary">Display name</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            style={inputStyle}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                            onBlur={e  => e.currentTarget.style.borderColor = 'var(--border-default)'}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-secondary">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={inputStyle}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                            onBlur={e  => e.currentTarget.style.borderColor = 'var(--border-default)'}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button variant="primary" size="sm">Save changes</Button>
                    </div>
                </div>
            ),
        },
        {
            title:  'Password',
            sub:    'Update your account password.',
            content: (
                <div className="flex flex-col gap-4">
                    {['Current password', 'New password', 'Confirm new password'].map(label => (
                        <div key={label} className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-secondary">{label}</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                style={inputStyle}
                                onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                                onBlur={e  => e.currentTarget.style.borderColor = 'var(--border-default)'}
                            />
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <Button variant="primary" size="sm">Update password</Button>
                    </div>
                </div>
            ),
        },
        {
            title:  'Plan',
            sub:    'Your current subscription.',
            content: (
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-secondary">Free Plan</span>
                            <span
                                className="text-[0.6rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: 'var(--turquoise-8)', border: '1px solid var(--turquoise-22)', color: 'var(--turquoise)' }}
                            >
                                Active
                            </span>
                        </div>
                        <span className="text-xs text-tertiary font-medium">3 projects · Standard export</span>
                    </div>
                    <Button variant="primary" size="sm">Upgrade to Pro</Button>
                </div>
            ),
        },
    ]

    return (
        <div className="relative flex flex-col flex-1 min-h-0 overflow-auto">
                {/* Turquoise glow */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full"
                    style={{ background: 'radial-gradient(circle, var(--turquoise-8) 0%, transparent 65%)', filter: 'blur(72px)' }}
                />
            <DashboardHeader title="Settings" subtitle="Account & preferences" />

            <main className="flex-1 p-8 max-w-2xl flex flex-col gap-8">
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