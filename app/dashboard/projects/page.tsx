'use client'

import React, { useState } from 'react'
import { FolderPlus, Search, Grid, List } from 'lucide-react'
import DashboardHeader from '../components/DashboardHeader'
import DashboardCard, { Project } from '../components/DashboardCard'

const allProjects: Project[] = [
    { id: '1', name: 'Product Demo v3',      lastEdited: '2 hours ago'  },
    { id: '2', name: 'Q4 Social Campaign',   lastEdited: 'Yesterday'    },
    { id: '3', name: 'Onboarding Flow',      lastEdited: '3 days ago'   },
    { id: '4', name: 'Brand Reel 2025',      lastEdited: 'Last week'    },
    { id: '5', name: 'Tutorial Series Ep.1', lastEdited: '2 weeks ago'  },
    { id: '6', name: 'Event Highlight Reel', lastEdited: 'Last month'   },
    { id: '7', name: 'App Walkthrough',      lastEdited: 'Last month'   },
    { id: '8', name: 'Team Intro',           lastEdited: '2 months ago' },
]

export default function ProjectsPage() {
    const [query,    setQuery]    = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const filtered = allProjects.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div className="relative flex flex-col flex-1 min-h-0 overflow-auto">
                {/* Turquoise glow */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full"
                    style={{ background: 'radial-gradient(circle, var(--turquoise-8) 0%, transparent 65%)', filter: 'blur(72px)' }}
                />
            <DashboardHeader title="Projects" subtitle={`${allProjects.length} total`} />

            <main className="flex-1 p-8 flex flex-col gap-6">

                {/* Toolbar */}
                <div className="flex items-center justify-between gap-4 flex-wrap">

                    {/* Search */}
                    <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1"
                        style={{
                            maxWidth: 320,
                            backgroundColor: 'var(--surface-raised)',
                            border: '1px solid var(--border-default)',
                        }}
                    >
                        <Search size={14} strokeWidth={1.75} style={{ color: 'var(--text-tertiary)' }} />
                        <input
                            type="text"
                            placeholder="Search projects…"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="flex-1 text-sm font-medium bg-transparent focus:outline-none"
                            style={{
                                color: 'var(--text)',
                                fontFamily: 'var(--font-quicksand), sans-serif',
                                border: 'none',
                                outline: 'none',
                            }}
                        />
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-2">

                        {/* View toggle */}
                        <div
                            className="flex items-center rounded-lg p-1"
                            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                        >
                            {([['grid', Grid], ['list', List]] as const).map(([mode, Icon]) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer transition-all duration-150 focus:outline-none"
                                    style={{
                                        backgroundColor: viewMode === mode ? 'var(--bg)' : 'transparent',
                                        border: viewMode === mode ? '1px solid var(--border-default)' : '1px solid transparent',
                                        color: viewMode === mode ? 'var(--text)' : 'var(--text-tertiary)',
                                    }}
                                >
                                    <Icon size={13} strokeWidth={1.75} />
                                </button>
                            ))}
                        </div>

                        {/* New project */}
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all duration-200 focus:outline-none"
                            style={{
                                backgroundColor: 'var(--turquoise)',
                                color: '#020202',
                                border: 'none',
                                boxShadow: '0 0 0 1px var(--turquoise-42)',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            <FolderPlus size={14} strokeWidth={2} />
                            New Project
                        </button>
                    </div>
                </div>

                {/* Grid / list */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 gap-3 py-20">
                        <span className="text-3xl">🎬</span>
                        <span className="text-sm font-semibold text-tertiary">No projects found</span>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filtered.map(p => <DashboardCard key={p.id} project={p} />)}
                    </div>
                ) : (
                    <div className="flex flex-col rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-default)' }}>
                        {filtered.map((p, i) => (
                            <a
                                key={p.id}
                                href={`/dashboard/projects/${p.id}`}
                                className="flex items-center gap-4 px-5 py-3.5 transition-colors duration-150"
                                style={{
                                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                    textDecoration: 'none',
                                    backgroundColor: 'var(--bg)',
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-raised)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg)'}
                            >
                                {/* Thumbnail mini */}
                                <div
                                    className="w-14 h-9 rounded-md shrink-0 flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, var(--turquoise-10) 0%, var(--turquoise-22) 100%)' }}
                                >
                                    <div className="w-0 h-0" style={{
                                        borderTop: '4px solid transparent',
                                        borderBottom: '4px solid transparent',
                                        borderLeft: '6px solid var(--turquoise)',
                                        marginLeft: 1,
                                    }} />
                                </div>
                                <span className="text-sm font-bold text-secondary flex-1 truncate">{p.name}</span>
                                <span className="text-xs text-tertiary font-medium shrink-0">{p.lastEdited}</span>
                            </a>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}