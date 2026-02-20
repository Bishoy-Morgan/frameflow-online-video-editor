'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import DashboardHeader from '../../../components/DashboardHeader'
import Button from '@/components/ui/Button'

interface Props {
    params: { projectId: string }
}

export default function ProjectSettingsPage({ params }: Props) {
    const [name, setName] = useState('Product Demo v3')

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

    return (
        <div className="flex flex-col flex-1 min-h-0 overflow-auto">
            <DashboardHeader title="Project Settings" subtitle="Product Demo v3" />

            <main className="flex-1 p-8 max-w-2xl flex flex-col gap-8">

                {/* Back */}
                <Link
                    href={`/dashboard/projects/${params.projectId}`}
                    className="flex items-center gap-2 text-sm font-semibold text-tertiary w-fit transition-colors duration-150"
                    style={{ textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                >
                    <ArrowLeft size={14} strokeWidth={2} />
                    Back to project
                </Link>

                {/* General */}
                <section className="flex flex-col gap-5">
                    <div>
                        <h4 className="m-0 font-semibold text-base">General</h4>
                        <p className="m-0 mt-1 text-sm text-tertiary">Basic project information.</p>
                    </div>
                    <div
                        className="flex flex-col gap-4 p-6 rounded-xl"
                        style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                    >
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-secondary">Project name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                style={inputStyle}
                                onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                                onBlur={e  => e.currentTarget.style.borderColor = 'var(--border-default)'}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button variant="primary" size="sm">Save changes</Button>
                        </div>
                    </div>
                </section>

                {/* Export settings */}
                <section className="flex flex-col gap-5">
                    <div>
                        <h4 className="m-0 font-semibold text-base">Export</h4>
                        <p className="m-0 mt-1 text-sm text-tertiary">Default export preferences for this project.</p>
                    </div>
                    <div
                        className="flex flex-col gap-4 p-6 rounded-xl"
                        style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                    >
                        {[
                            { label: 'Resolution', value: '1920 × 1080 (1080p)' },
                            { label: 'Format',     value: 'MP4 (H.264)'         },
                            { label: 'Frame rate', value: '30fps'               },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <span className="text-sm font-semibold text-secondary">{label}</span>
                                <span className="text-sm text-tertiary font-medium">{value}</span>
                            </div>
                        ))}
                        <div className="flex justify-end pt-1">
                            <Button variant="secondary" size="sm">Edit export settings</Button>
                        </div>
                    </div>
                </section>

                {/* Danger zone */}
                <section className="flex flex-col gap-5">
                    <div>
                        <h4 className="m-0 font-semibold text-base" style={{ color: '#ef4444' }}>Danger Zone</h4>
                        <p className="m-0 mt-1 text-sm text-tertiary">Permanent actions — cannot be undone.</p>
                    </div>
                    <div
                        className="flex items-center justify-between p-5 rounded-xl"
                        style={{ backgroundColor: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-secondary">Delete project</span>
                            <span className="text-xs text-tertiary">This will permanently delete the project and all its files.</span>
                        </div>
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all duration-150 focus:outline-none"
                            style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.14)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                        >
                            <Trash2 size={14} strokeWidth={1.75} />
                            Delete
                        </button>
                    </div>
                </section>

            </main>
        </div>
    )
}