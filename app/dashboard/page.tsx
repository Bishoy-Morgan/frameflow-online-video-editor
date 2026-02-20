'use client'

import React from 'react'
import { FolderPlus, Upload, FolderOpen, Clock } from 'lucide-react'
import DashboardHeader from './components/DashboardHeader'
import DashboardCard, { Project } from './components/DashboardCard'
import StatsCard from './components/StatsCard'

const recentProjects: Project[] = [
    { id: '1', name: 'Product Demo v3',    lastEdited: '2 hours ago' },
    { id: '2', name: 'Q4 Social Campaign', lastEdited: 'Yesterday'   },
    { id: '3', name: 'Onboarding Flow',    lastEdited: '3 days ago'  },
    { id: '4', name: 'Brand Reel 2025',    lastEdited: 'Last week'   },
]

const quickActions = [
    {
        label:    'New Project',
        sub:      'Start from scratch',
        icon:     FolderPlus,
        accent:   true,
        onClick:  () => {},
    },
    {
        label:    'Upload Footage',
        sub:      'Import your files',
        icon:     Upload,
        accent:   false,
        onClick:  () => {},
    },
]

export default function DashboardPage() {
    return (
        <div className="relative flex flex-col flex-1 min-h-0 overflow-auto">
                {/* Turquoise glow */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full"
                    style={{ background: 'radial-gradient(circle, var(--turquoise-8) 0%, transparent 65%)', filter: 'blur(72px)' }}
                />
            <DashboardHeader title="Overview" subtitle="Welcome back" />

            <main className="flex-1 p-8 flex flex-col gap-10">

                {/* ── Stats row ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard label="Total Projects" value={12}   sub="2 this month"    icon={FolderOpen} accent />
                    <StatsCard label="Hours Edited"   value="38h"  sub="Last 30 days"    icon={Clock}      />
                    <StatsCard label="Exports"         value={24}   sub="MP4, MOV, GIF"  icon={Upload}     />
                    <StatsCard label="Storage Used"   value="4.2G" sub="of 10GB free"    icon={FolderOpen} />
                </div>

                {/* ── Quick actions ── */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-5 h-px bg-turquoise" />
                        <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-turquoise">
                            Quick Actions
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {quickActions.map(({ label, sub, icon: Icon, accent, onClick }) => (
                            <button
                                key={label}
                                onClick={onClick}
                                className="flex items-center gap-4 px-5 py-4 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none group"
                                style={{
                                    backgroundColor: accent ? 'var(--turquoise-8)' : 'var(--surface-raised)',
                                    border: `1px solid ${accent ? 'var(--turquoise-22)' : 'var(--border-default)'}`,
                                    background: 'none',
                                    minWidth: 200,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = accent ? 'var(--turquoise-42)' : 'var(--border-strong)'
                                    e.currentTarget.style.transform = 'translateY(-1px)'
                                    e.currentTarget.style.boxShadow = accent
                                        ? '0 8px 24px var(--turquoise-10)'
                                        : '0 8px 24px rgba(0,0,0,0.06)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = accent ? 'var(--turquoise-22)' : 'var(--border-default)'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                    style={{
                                        backgroundColor: accent ? 'var(--turquoise-16)' : 'var(--bg)',
                                        border: `1px solid ${accent ? 'var(--turquoise-32)' : 'var(--border-default)'}`,
                                        color: accent ? 'var(--turquoise)' : 'var(--text-tertiary)',
                                    }}
                                >
                                    <Icon size={16} strokeWidth={1.75} />
                                </div>
                                <div className="flex flex-col items-start gap-0.5">
                                    <span
                                        className="text-sm font-bold"
                                        style={{ color: accent ? 'var(--turquoise)' : 'var(--text-secondary)' }}
                                    >
                                        {label}
                                    </span>
                                    <span className="text-xs text-tertiary font-medium">{sub}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Recent projects ── */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-px bg-turquoise" />
                            <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-turquoise">
                                Recent Projects
                            </span>
                        </div>
                        <a
                            href="/dashboard/projects"
                            className="text-xs font-bold text-tertiary transition-colors duration-150"
                            style={{ textDecoration: 'none' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                        >
                            View all →
                        </a>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {recentProjects.map(p => (
                            <DashboardCard key={p.id} project={p} />
                        ))}
                    </div>
                </div>

            </main>
        </div>
    )
}