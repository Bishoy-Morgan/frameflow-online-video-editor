'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
    Search, Star, Trash2, MoreHorizontal,
    Plus, Clock, Wand2, FolderOpen,
    Play, X, Loader2, RefreshCw, AlertTriangle,
} from 'lucide-react'
import DashboardHeader from '../components/DashboardHeader'

type Project = {
    id:          string
    name:        string
    starred:     boolean
    deletedAt:   string | null
    prompt:      string | null
    style:       string | null
    aspectRatio: string | null
    thumbnail:   string | null
    createdAt:   string
    updatedAt:   string
}

type Filter = 'all' | 'starred' | 'ai'

function timeAgo(dateStr: string) {
    const diff  = Date.now() - new Date(dateStr).getTime()
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins < 1)   return 'Just now'
    if (mins < 60)  return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7)   return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function ConfirmDialog({ project, onConfirm, onCancel, loading }: {
    project:   Project
    onConfirm: () => void
    onCancel:  () => void
    loading:   boolean
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onCancel}
        >
            <div
                className="flex flex-col gap-5 p-6 rounded-2xl w-full max-w-sm"
                style={{
                    backgroundColor: 'var(--bg)',
                    border: '1px solid var(--border-default)',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
                }}
                onClick={e => e.stopPropagation()}
            >
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                    <AlertTriangle size={20} style={{ color: '#ef4444' }} strokeWidth={1.75} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Move to Trash?</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>&quot;{project.name}&quot;</span> will be moved to trash. You can restore it within 30 days.
                    </p>
                </div>
                <div className="flex items-center gap-2 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                        style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                        style={{ backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', border: 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                    >
                        {loading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} strokeWidth={2} />}
                        Move to Trash
                    </button>
                </div>
            </div>
        </div>
    )
}

function ProjectCard({ project, onStar, onDeleteRequest }: {
    project:         Project
    onStar:          (id: string, starred: boolean) => void
    onDeleteRequest: (project: Project) => void
}) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [starring, setStarring] = useState(false)
    const menuRef                 = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleStar = async (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation()
        setStarring(true)
        await onStar(project.id, project.starred)
        setStarring(false)
    }

    return (
        <div
            className="group flex flex-col rounded-xl overflow-hidden transition-all duration-200"
            style={{ boxShadow: '0 0 0 1px var(--border-default)' }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1), 0 0 0 1px var(--turquoise-22)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 0 1px var(--border-default)'
            }}
        >
            <Link href={`/dashboard/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                <div className="relative w-full aspect-video overflow-hidden" style={{ backgroundColor: 'var(--surface-raised)' }}>
                    {project.thumbnail ? (
                        <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, var(--turquoise-10) 0%, var(--turquoise-22) 100%)' }}
                        >
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                                style={{ backgroundColor: 'var(--turquoise-22)', border: '1px solid var(--turquoise-40)' }}
                            >
                                <Play size={16} strokeWidth={0} fill="var(--turquoise)" style={{ marginLeft: 2 }} />
                            </div>
                        </div>
                    )}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(2,2,2,0.3)' }}
                    >
                        <span className="text-[0.7rem] font-bold tracking-widest uppercase text-white">Open</span>
                    </div>
                    {project.prompt && (
                        <div
                            className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                            style={{ backgroundColor: 'rgba(2,2,2,0.6)', backdropFilter: 'blur(4px)', color: 'var(--turquoise)', border: '1px solid var(--turquoise-22)' }}
                        >
                            <Wand2 size={9} strokeWidth={2.5} /> AI
                        </div>
                    )}
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                        <button
                            onClick={handleStar}
                            disabled={starring}
                            className="w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 focus:outline-none"
                            style={{
                                backgroundColor: project.starred ? 'rgba(251,191,36,0.2)' : 'rgba(2,2,2,0.5)',
                                backdropFilter: 'blur(4px)', border: 'none',
                                color: project.starred ? '#fbbf24' : '#fefefe',
                                cursor: 'pointer',
                            }}
                        >
                            {starring ? <Loader2 size={11} className="animate-spin" /> : <Star size={11} strokeWidth={2} fill={project.starred ? '#fbbf24' : 'none'} />}
                        </button>
                        <div ref={menuRef} className="relative">
                            <button
                                onClick={e => { e.preventDefault(); e.stopPropagation(); setMenuOpen(o => !o) }}
                                className="w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 focus:outline-none"
                                style={{ backgroundColor: 'rgba(2,2,2,0.5)', backdropFilter: 'blur(4px)', border: 'none', color: '#fefefe', cursor: 'pointer' }}
                            >
                                <MoreHorizontal size={13} />
                            </button>
                            {menuOpen && (
                                <div
                                    className="absolute right-0 top-full mt-1 w-44 rounded-xl overflow-hidden z-50"
                                    style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
                                >
                                    <button
                                        onClick={handleStar}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-left"
                                        style={{ color: 'var(--text-tertiary)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-raised)'; e.currentTarget.style.color = 'var(--text)' }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                                    >
                                        <Star size={13} strokeWidth={1.75} fill={project.starred ? 'currentColor' : 'none'} />
                                        {project.starred ? 'Unstar' : 'Star'}
                                    </button>
                                    <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                        <button
                                            onClick={e => { e.preventDefault(); e.stopPropagation(); setMenuOpen(false); onDeleteRequest(project) }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-left"
                                            style={{ color: 'var(--text-tertiary)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#ef4444' }}
                                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                                        >
                                            <Trash2 size={13} strokeWidth={1.75} /> Move to Trash
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
            <div className="flex flex-col gap-1 px-4 py-3" style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold truncate" style={{ color: 'var(--text-secondary)' }}>{project.name}</span>
                    {project.starred && <Star size={11} strokeWidth={0} fill="#fbbf24" className="shrink-0" />}
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <Clock size={11} strokeWidth={1.75} style={{ color: 'var(--text-tertiary)' }} />
                        <span className="text-[0.68rem] font-medium" style={{ color: 'var(--text-tertiary)' }}>{timeAgo(project.updatedAt)}</span>
                    </div>
                    {project.aspectRatio && (
                        <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}
                        >
                            {project.aspectRatio}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

function EmptyState({ filter, onNew }: { filter: Filter; onNew: () => void }) {
    const messages = {
        all:     { icon: FolderOpen, title: 'No projects yet',     sub: 'Create your first project or generate one with AI' },
        starred: { icon: Star,       title: 'No starred projects',  sub: 'Star projects you want to find quickly'            },
        ai:      { icon: Wand2,      title: 'No AI projects yet',   sub: 'Use the AI generator on the dashboard to get started' },
    }
    const { icon: Icon, title, sub } = messages[filter]
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}>
                <Icon size={22} style={{ color: 'var(--text-tertiary)', opacity: 0.5 }} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{title}</p>
                <p className="text-xs max-w-xs" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>
            </div>
            {filter === 'all' && (
                <button
                    onClick={onNew}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold mt-2"
                    style={{ backgroundColor: 'var(--turquoise)', color: '#fff', boxShadow: '0 4px 14px var(--turquoise-22)', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                    <Plus size={13} strokeWidth={2.5} /> New Project
                </button>
            )}
        </div>
    )
}

export default function ProjectsPage() {
    const [projects,     setProjects]     = useState<Project[]>([])
    const [loading,      setLoading]      = useState(true)
    const [search,       setSearch]       = useState('')
    const [filter,       setFilter]       = useState<Filter>('all')
    const [creating,     setCreating]     = useState(false)
    const [newName,      setNewName]      = useState('')
    const [showNew,      setShowNew]      = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
    const [deleting,     setDeleting]     = useState(false)

    const fetchProjects = useCallback(async () => {
        setLoading(true)
        try {
            const res  = await fetch('/api/projects')
            const data = await res.json()
            setProjects(Array.isArray(data) ? data : [])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchProjects() }, [fetchProjects])

    const handleCreate = async () => {
        if (!newName.trim()) return
        setCreating(true)
        try {
            const res     = await fetch('/api/projects', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name: newName.trim() }),
            })
            const project = await res.json()
            setProjects(prev => [project, ...prev])
            setNewName('')
            setShowNew(false)
        } finally {
            setCreating(false)
        }
    }

    const handleStar = async (id: string, currentlyStarred: boolean) => {
        await fetch(`/api/projects/${id}`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ action: currentlyStarred ? 'unstar' : 'star' }),
        })
        setProjects(prev => prev.map(p => p.id === id ? { ...p, starred: !currentlyStarred } : p))
    }

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        try {
            await fetch(`/api/projects/${deleteTarget.id}`, { method: 'DELETE' })
            setProjects(prev => prev.filter(p => p.id !== deleteTarget.id))
            setDeleteTarget(null)
        } finally {
            setDeleting(false)
        }
    }

    const filtered = projects
        .filter(p => filter === 'starred' ? p.starred : filter === 'ai' ? !!p.prompt : true)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    const filterTabs: { key: Filter; label: string; count: number }[] = [
        { key: 'all',     label: 'All',          count: projects.length },
        { key: 'starred', label: 'Starred',       count: projects.filter(p => p.starred).length },
        { key: 'ai',      label: 'AI Generated',  count: projects.filter(p => !!p.prompt).length },
    ]

    return (
        <div className="relative flex flex-col flex-1 min-h-0 overflow-auto">

            {deleteTarget && (
                <ConfirmDialog
                    project={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleting}
                />
            )}

            <DashboardHeader title="Projects" subtitle="All your video projects" />

            <main className="flex-1 p-8 flex flex-col gap-6">

                {/* Toolbar */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', width: '220px' }}
                        >
                            <Search size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                            <input
                                type="text"
                                placeholder="Search projects…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="text-xs outline-none w-full bg-transparent"
                                style={{ color: 'var(--text)' }}
                            />
                            {search && (
                                <button onClick={() => setSearch('')} style={{ color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                    <X size={11} />
                                </button>
                            )}
                        </div>
                        <div
                            className="flex items-center gap-1 p-1 rounded-xl"
                            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                        >
                            {filterTabs.map(({ key, label, count }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                                    style={{
                                        backgroundColor: filter === key ? 'var(--bg)' : 'transparent',
                                        border: filter === key ? '1px solid var(--border-default)' : '1px solid transparent',
                                        color: filter === key ? 'var(--text)' : 'var(--text-tertiary)',
                                        boxShadow: filter === key ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {label}
                                    {count > 0 && (
                                        <span
                                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                            style={{
                                                backgroundColor: filter === key ? 'var(--turquoise-8)' : 'var(--surface-raised)',
                                                color: filter === key ? 'var(--turquoise)' : 'var(--text-tertiary)',
                                                border: filter === key ? '1px solid var(--turquoise-22)' : '1px solid var(--border-subtle)',
                                            }}
                                        >
                                            {count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchProjects}
                            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
                            title="Refresh"
                        >
                            <RefreshCw size={13} strokeWidth={2} />
                        </button>
                        <button
                            onClick={() => setShowNew(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
                            style={{ backgroundColor: 'var(--turquoise)', color: '#fff', boxShadow: '0 4px 14px var(--turquoise-22)', border: 'none', cursor: 'pointer' }}
                            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                        >
                            <Plus size={13} strokeWidth={2.5} /> New Project
                        </button>
                    </div>
                </div>

                {/* New project form */}
                {showNew && (
                    <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--turquoise-22)', boxShadow: '0 0 0 3px var(--turquoise-8)' }}
                    >
                        <input
                            autoFocus
                            type="text"
                            placeholder="Project name…"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') { setShowNew(false); setNewName('') } }}
                            className="flex-1 text-sm outline-none bg-transparent"
                            style={{ color: 'var(--text)' }}
                        />
                        <button
                            onClick={handleCreate}
                            disabled={!newName.trim() || creating}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{
                                backgroundColor: newName.trim() ? 'var(--turquoise)' : 'var(--border-default)',
                                color: newName.trim() ? '#fff' : 'var(--text-tertiary)',
                                cursor: newName.trim() ? 'pointer' : 'not-allowed',
                                border: 'none',
                            }}
                        >
                            {creating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                            Create
                        </button>
                        <button
                            onClick={() => { setShowNew(false); setNewName('') }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg"
                            style={{ color: 'var(--text-tertiary)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg)'; e.currentTarget.style.color = 'var(--text)' }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                        >
                            <X size={13} />
                        </button>
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState filter={filter} onNew={() => setShowNew(true)} />
                ) : (
                    <>
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                            {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}{search && ` matching "${search}"`}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filtered.map(p => (
                                <ProjectCard
                                    key={p.id}
                                    project={p}
                                    onStar={handleStar}
                                    onDeleteRequest={setDeleteTarget}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}