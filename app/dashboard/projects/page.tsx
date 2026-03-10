'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
    Search, Grid3X3, List, SlidersHorizontal,
    Star, Trash2, FolderPlus, FolderOpen,
    MoreVertical, Pencil, Copy, ExternalLink,
    ChevronDown, X, Loader2, Film,
    SortAsc, SortDesc, Clock, AlignLeft,
} from 'lucide-react'
import DashboardHeader from '../components/DashboardHeader'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Scene {
    id:          string
    title:       string
    description: string
    musicMood:   string
    duration:    number
    order:       number
}

interface Project {
    id:          string
    name:        string
    style:       string | null
    aspectRatio: string | null
    createdAt:   string
    updatedAt:   string
    starred:     boolean
    deletedAt:   string | null
    thumbnail:   string | null
    scenes:      Scene[]
    _count?: { scenes: number }
}

type SortField = 'updatedAt' | 'createdAt' | 'name'
type SortDir   = 'asc' | 'desc'
type Filter    = 'all' | 'starred' | 'trash'
type ViewMode  = 'grid' | 'list'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelative(dateStr: string): string {
    const diff  = Date.now() - new Date(dateStr).getTime()
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins  < 1)   return 'Just now'
    if (mins  < 60)  return `${mins}m ago`
    if (hours < 24)  return `${hours}h ago`
    if (days  === 1) return 'Yesterday'
    if (days  < 7)   return `${days}d ago`
    return new Date(dateStr).toLocaleDateString()
}

function totalDuration(scenes: Scene[]): string {
    const secs = scenes.reduce((a, s) => a + s.duration, 0)
    if (secs < 60) return `${secs}s`
    return `${Math.floor(secs / 60)}m ${secs % 60}s`
}

// ─── Thumbnail placeholder ────────────────────────────────────────────────────

function ProjectThumbnail({ project, size = 'md' }: { project: Project; size?: 'sm' | 'md' }) {
    return (
        <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--turquoise-10) 0%, var(--turquoise-8) 100%)' }}
        >
            {/* Dot grid */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(circle, var(--turquoise-22) 1px, transparent 1px)',
                    backgroundSize:  size === 'sm' ? '14px 14px' : '22px 22px',
                    opacity:         0.5,
                }}
            />
            {/* Glow */}
            <div
                className="absolute rounded-full blur-2xl"
                style={{
                    width:           size === 'sm' ? 48 : 80,
                    height:          size === 'sm' ? 48 : 80,
                    backgroundColor: 'var(--turquoise-22)',
                }}
            />
            {/* Icon */}
            <Film
                size={size === 'sm' ? 16 : 24}
                style={{ color: 'var(--turquoise)', opacity: 0.8, position: 'relative', zIndex: 1 }}
                strokeWidth={1.5}
            />
            {/* Aspect ratio badge */}
            <div
                className="absolute bottom-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: 'var(--turquoise-8)', color: 'var(--turquoise)', border: '1px solid var(--turquoise-22)' }}
            >
                {project.aspectRatio ?? '16:9'}
            </div>
        </div>
    )
}

// ─── Context Menu ─────────────────────────────────────────────────────────────

function ContextMenu({
    project,
    onRename,
    onDuplicate,
    onToggleStar,
    onTrash,
    onRestore,
    onClose,
    anchorRef,
}: {
    project:      Project
    onRename:     () => void
    onDuplicate:  () => void
    onToggleStar: () => void
    onTrash:      () => void
    onRestore:    () => void
    onClose:      () => void
    anchorRef:    React.RefObject<HTMLButtonElement | null>
}) {
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node) && !anchorRef.current?.contains(e.target as Node))
                onClose()
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [onClose, anchorRef])

    const items = project.deletedAt
        ? [{ label: 'Restore',   icon: FolderOpen, action: onRestore, danger: false }]
        : [
            { label: 'Rename',   icon: Pencil,     action: onRename,     danger: false },
            { label: 'Duplicate',icon: Copy,       action: onDuplicate,  danger: false },
            { label: project.starred ? 'Unstar' : 'Star', icon: Star, action: onToggleStar, danger: false },
            { label: 'Move to Trash', icon: Trash2, action: onTrash,    danger: true  },
          ]

    return (
        <div
            ref={menuRef}
            className="absolute right-0 top-8 z-50 rounded-xl overflow-hidden py-1 min-w-[160px]"
            style={{
                backgroundColor: 'var(--surface-raised)',
                border:          '1px solid var(--border-default)',
                boxShadow:       '0 12px 40px rgba(0,0,0,0.18)',
            }}
        >
            {items.map(({ label, icon: Icon, action, danger }) => (
                <button
                    key={label}
                    onClick={(e) => { e.stopPropagation(); action(); onClose() }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors duration-100 text-left"
                    style={{ color: danger ? '#ef4444' : 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = danger ? 'rgba(239,68,68,0.06)' : 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <Icon size={13} strokeWidth={2} />
                    {label}
                </button>
            ))}
        </div>
    )
}

// ─── Project Card (Grid) ──────────────────────────────────────────────────────

function ProjectCard({
    project,
    onOpen,
    onRename,
    onDuplicate,
    onToggleStar,
    onTrash,
    onRestore,
}: {
    project:      Project
    onOpen:       () => void
    onRename:     () => void
    onDuplicate:  () => void
    onToggleStar: () => void
    onTrash:      () => void
    onRestore:    () => void
}) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [hovered,  setHovered]  = useState(false)
    const menuBtnRef = useRef<HTMLButtonElement>(null)

    return (
        <div
            className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
            style={{
                border:     `1px solid ${hovered ? 'var(--border-strong)' : 'var(--border-default)'}`,
                boxShadow:  hovered ? '0 8px 32px rgba(0,0,0,0.10)' : '0 2px 8px rgba(0,0,0,0.04)',
                transform:  hovered ? 'translateY(-2px)' : 'translateY(0)',
                opacity:    project.deletedAt ? 0.65 : 1,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onOpen}
        >
            {/* Thumbnail */}
            <div className="aspect-video w-full relative" style={{ backgroundColor: 'var(--surface-raised)' }}>
                <ProjectThumbnail project={project} />

                {/* Star badge */}
                {project.starred && (
                    <div
                        className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                    >
                        <Star size={11} fill="#fbbf24" color="#fbbf24" />
                    </div>
                )}

                {/* Hover overlay */}
                <div
                    className="absolute inset-0 flex items-center justify-center transition-all duration-200"
                    style={{
                        backgroundColor: hovered ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
                        opacity:         hovered ? 1 : 0,
                        backdropFilter:  hovered ? 'blur(2px)' : 'none',
                    }}
                >
                    <div
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-transform duration-200"
                        style={{
                            backgroundColor: 'var(--turquoise)',
                            boxShadow:       '0 0 0 2px rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.4)',
                            transform:       hovered ? 'scale(1)' : 'scale(0.92)',
                            border:          '1px solid rgba(255,255,255,0.2)',
                        }}
                    >
                        <ExternalLink size={12} strokeWidth={2.5} />
                        {project.deletedAt ? 'View' : 'Open Editor'}
                    </div>
                </div>
            </div>

            {/* Info bar */}
            <div
                className="px-3 py-3 flex items-center gap-2"
                style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border-subtle)' }}
            >
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>
                        {project.name}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        {formatRelative(project.updatedAt)} · {project.scenes?.length ?? 0} scenes
                        {project.scenes?.length > 0 && ` · ${totalDuration(project.scenes)}`}
                    </p>
                </div>

                {/* Menu button */}
                <div className="relative" onClick={e => e.stopPropagation()}>
                    <button
                        ref={menuBtnRef}
                        onClick={() => setMenuOpen(v => !v)}
                        className="w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-100"
                        style={{ color: 'var(--text-tertiary)' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--surface-raised)'; e.currentTarget.style.color = 'var(--text)' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                    >
                        <MoreVertical size={13} strokeWidth={2} />
                    </button>
                    {menuOpen && (
                        <ContextMenu
                            project={project}
                            onRename={onRename}
                            onDuplicate={onDuplicate}
                            onToggleStar={onToggleStar}
                            onTrash={onTrash}
                            onRestore={onRestore}
                            onClose={() => setMenuOpen(false)}
                            anchorRef={menuBtnRef}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Project Row (List) ───────────────────────────────────────────────────────

function ProjectRow({
    project,
    onOpen,
    onRename,
    onDuplicate,
    onToggleStar,
    onTrash,
    onRestore,
}: {
    project:      Project
    onOpen:       () => void
    onRename:     () => void
    onDuplicate:  () => void
    onToggleStar: () => void
    onTrash:      () => void
    onRestore:    () => void
}) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [hovered,  setHovered]  = useState(false)
    const menuBtnRef = useRef<HTMLButtonElement>(null)

    return (
        <div
            className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150"
            style={{
                backgroundColor: hovered ? 'var(--surface-raised)' : 'transparent',
                border:          `1px solid ${hovered ? 'var(--border-default)' : 'transparent'}`,
                opacity:         project.deletedAt ? 0.65 : 1,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onOpen}
        >
            {/* Mini thumbnail */}
            <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: 'var(--surface-raised)' }}>
                <ProjectThumbnail project={project} size="sm" />
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                        {project.name}
                    </p>
                    {project.starred && <Star size={11} fill="#fbbf24" color="#fbbf24" />}
                    {project.deletedAt && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                            TRASH
                        </span>
                    )}
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                    {project.scenes?.length ?? 0} scenes
                    {project.scenes?.length > 0 && ` · ${totalDuration(project.scenes)}`}
                    {project.style && ` · ${project.style}`}
                </p>
            </div>

            {/* Aspect ratio */}
            <span className="text-[11px] font-bold shrink-0 hidden sm:block" style={{ color: 'var(--text-tertiary)', width: 40 }}>
                {project.aspectRatio ?? '—'}
            </span>

            {/* Updated */}
            <span className="text-[11px] shrink-0 hidden md:block" style={{ color: 'var(--text-tertiary)', width: 80 }}>
                {formatRelative(project.updatedAt)}
            </span>

            {/* Created */}
            <span className="text-[11px] shrink-0 hidden lg:block" style={{ color: 'var(--text-tertiary)', width: 80 }}>
                {new Date(project.createdAt).toLocaleDateString()}
            </span>

            {/* Actions */}
            <div className="relative shrink-0" onClick={e => e.stopPropagation()}>
                <button
                    ref={menuBtnRef}
                    onClick={() => setMenuOpen(v => !v)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-100"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg)'; e.currentTarget.style.color = 'var(--text)' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                >
                    <MoreVertical size={14} strokeWidth={2} />
                </button>
                {menuOpen && (
                    <ContextMenu
                        project={project}
                        onRename={onRename}
                        onDuplicate={onDuplicate}
                        onToggleStar={onToggleStar}
                        onTrash={onTrash}
                        onRestore={onRestore}
                        onClose={() => setMenuOpen(false)}
                        anchorRef={menuBtnRef}
                    />
                )}
            </div>
        </div>
    )
}

// ─── Rename Modal ─────────────────────────────────────────────────────────────

function RenameModal({ project, onSave, onClose }: { project: Project; onSave: (name: string) => void; onClose: () => void }) {
    const [name, setName] = useState(project.name)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => { inputRef.current?.focus(); inputRef.current?.select() }, [])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4"
                style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', boxShadow: '0 24px 64px rgba(0,0,0,0.24)' }}
                onClick={e => e.stopPropagation()}
            >
                <div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Rename project</h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Enter a new name for this project.</p>
                </div>
                <input
                    ref={inputRef}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') onSave(name); if (e.key === 'Escape') onClose() }}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{
                        backgroundColor: 'var(--bg)',
                        border:          '1px solid var(--border-default)',
                        color:           'var(--text)',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                />
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-xs font-semibold"
                        style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(name)}
                        disabled={!name.trim()}
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                        style={{ backgroundColor: 'var(--turquoise)', opacity: name.trim() ? 1 : 0.5 }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Sort Dropdown ────────────────────────────────────────────────────────────

function SortDropdown({
    field, dir, onChange, onClose,
}: {
    field:    SortField
    dir:      SortDir
    onChange: (f: SortField, d: SortDir) => void
    onClose:  () => void
}) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose() }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [onClose])

    const options: { label: string; field: SortField; icon: React.ElementType }[] = [
        { label: 'Last modified', field: 'updatedAt', icon: Clock    },
        { label: 'Date created',  field: 'createdAt', icon: Clock    },
        { label: 'Name',          field: 'name',      icon: AlignLeft },
    ]

    return (
        <div
            ref={ref}
            className="absolute right-0 top-10 z-50 rounded-xl overflow-hidden py-1 min-w-[180px]"
            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', boxShadow: '0 12px 40px rgba(0,0,0,0.18)' }}
        >
            {options.map(({ label, field: f, icon: Icon }) => (
                <div key={f} className="flex items-center gap-2">
                    <button
                        onClick={() => { onChange(f, f === field ? (dir === 'asc' ? 'desc' : 'asc') : 'desc'); onClose() }}
                        className="flex-1 flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-left transition-colors"
                        style={{ color: f === field ? 'var(--turquoise)' : 'var(--text-secondary)' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Icon size={12} />
                        {label}
                        {f === field && (dir === 'asc' ? <SortAsc size={11} className="ml-auto" /> : <SortDesc size={11} className="ml-auto" />)}
                    </button>
                </div>
            ))}
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
    const router = useRouter()

    const [projects,     setProjects]     = useState<Project[]>([])
    const [loading,      setLoading]      = useState(true)
    const [search,       setSearch]       = useState('')
    const [viewMode,     setViewMode]     = useState<ViewMode>('grid')
    const [filter,       setFilter]       = useState<Filter>('all')
    const [sortField,    setSortField]    = useState<SortField>('updatedAt')
    const [sortDir,      setSortDir]      = useState<SortDir>('desc')
    const [sortOpen,     setSortOpen]     = useState(false)
    const [renaming,     setRenaming]     = useState<Project | null>(null)
    const [creating,     setCreating]     = useState(false)

    // Fetch all projects (including trashed for trash tab)
    const fetchProjects = useCallback(async () => {
        setLoading(true)
        try {
            const res  = await fetch('/api/projects?includeDeleted=true')
            const data = await res.json()
            setProjects(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchProjects() }, [fetchProjects])

    // ── Derived list ──────────────────────────────────────────────────────────

    const displayed = useMemo(() => {
        let list = [...projects]

        // Filter
        if (filter === 'starred') list = list.filter(p => p.starred && !p.deletedAt)
        else if (filter === 'trash') list = list.filter(p => !!p.deletedAt)
        else list = list.filter(p => !p.deletedAt)

        // Search
        if (search.trim()) {
            const q = search.toLowerCase()
            list = list.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.style?.toLowerCase().includes(q) ||
                p.scenes?.some(s => s.title.toLowerCase().includes(q))
            )
        }

        // Sort
        list.sort((a, b) => {
            let av: string | number = a[sortField]
            let bv: string | number = b[sortField]
            if (sortField !== 'name') { av = new Date(av).getTime(); bv = new Date(bv).getTime() }
            if (av < bv) return sortDir === 'asc' ? -1 :  1
            if (av > bv) return sortDir === 'asc' ?  1 : -1
            return 0
        })

        return list
    }, [projects, filter, search, sortField, sortDir])

    // ── Actions ───────────────────────────────────────────────────────────────

    const handleOpen = (project: Project) => {
        if (project.deletedAt) return
        window.open(`/editor/${project.id}`, '_blank')
    }

    const handleNewProject = async () => {
        setCreating(true)
        try {
            const res = await fetch('/api/projects', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ name: 'Untitled Project', style: 'Modern', aspectRatio: '16:9' }),
            })
            const project = await res.json()
            window.open(`/editor/${project.id}`, '_blank')
        } catch (err) { console.error(err) } finally { setCreating(false) }
    }

    const handleRename = async (project: Project, name: string) => {
        setRenaming(null)
        if (!name.trim() || name === project.name) return
        setProjects(ps => ps.map(p => p.id === project.id ? { ...p, name } : p))
        await fetch(`/api/projects/${project.id}`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ name }),
        })
    }

    const handleDuplicate = async (project: Project) => {
        const res = await fetch('/api/projects', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                name:        `${project.name} (copy)`,
                style:       project.style,
                aspectRatio: project.aspectRatio,
                scenes:      project.scenes?.map(({ title, description, musicMood, duration, order }) =>
                    ({ title, description, musicMood, duration, order })),
            }),
        })
        const dup = await res.json()
        setProjects(ps => [dup, ...ps])
    }

    const handleToggleStar = async (project: Project) => {
        const starred = !project.starred
        setProjects(ps => ps.map(p => p.id === project.id ? { ...p, starred } : p))
        await fetch(`/api/projects/${project.id}`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ starred }),
        })
    }

    const handleTrash = async (project: Project) => {
        setProjects(ps => ps.map(p => p.id === project.id ? { ...p, deletedAt: new Date().toISOString() } : p))
        await fetch(`/api/projects/${project.id}`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ action: 'trash' }),
        })
    }

    const handleRestore = async (project: Project) => {
        setProjects(ps => ps.map(p => p.id === project.id ? { ...p, deletedAt: null } : p))
        await fetch(`/api/projects/${project.id}`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ action: 'restore' }),
        })
    }

    // ── Tab counts ────────────────────────────────────────────────────────────

    const counts = useMemo(() => ({
        all:     projects.filter(p => !p.deletedAt).length,
        starred: projects.filter(p => p.starred && !p.deletedAt).length,
        trash:   projects.filter(p => !!p.deletedAt).length,
    }), [projects])

    // ── Render ────────────────────────────────────────────────────────────────

    const FILTERS: { key: Filter; label: string; icon: React.ElementType }[] = [
        { key: 'all',     label: 'All',     icon: FolderOpen },
        { key: 'starred', label: 'Starred', icon: Star       },
        { key: 'trash',   label: 'Trash',   icon: Trash2     },
    ]

    return (
        <div className="relative flex flex-col flex-1 min-h-0 overflow-auto">
            <DashboardHeader title="Projects" subtitle="Your video library" />

            <main className="flex-1 p-8 flex flex-col gap-6">

                {/* ── Top bar ── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    {/* Filter tabs */}
                    <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-subtle)' }}>
                        {FILTERS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
                                style={{
                                    backgroundColor: filter === key ? 'var(--bg)'               : 'transparent',
                                    color:           filter === key ? 'var(--text)'              : 'var(--text-tertiary)',
                                    border:          filter === key ? '1px solid var(--border-default)' : '1px solid transparent',
                                    boxShadow:       filter === key ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                                }}
                            >
                                <Icon size={12} strokeWidth={2} />
                                {label}
                                <span
                                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                    style={{
                                        backgroundColor: filter === key ? 'var(--turquoise-8)' : 'var(--surface-raised)',
                                        color:           filter === key ? 'var(--turquoise)'   : 'var(--text-tertiary)',
                                    }}
                                >
                                    {counts[key]}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center gap-2">

                        {/* Search */}
                        <div
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', minWidth: 200 }}
                        >
                            <Search size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search projects…"
                                className="bg-transparent outline-none flex-1 text-xs"
                                style={{ color: 'var(--text)' }}
                            />
                            {search && (
                                <button onClick={() => setSearch('')}>
                                    <X size={12} style={{ color: 'var(--text-tertiary)' }} />
                                </button>
                            )}
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <button
                                onClick={() => setSortOpen(v => !v)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
                                style={{
                                    backgroundColor: sortOpen ? 'var(--bg)' : 'var(--surface-raised)',
                                    border:          '1px solid var(--border-default)',
                                    color:           'var(--text-secondary)',
                                }}
                            >
                                <SlidersHorizontal size={12} strokeWidth={2} />
                                Sort
                                <ChevronDown size={11} style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                            </button>
                            {sortOpen && (
                                <SortDropdown
                                    field={sortField}
                                    dir={sortDir}
                                    onChange={(f, d) => { setSortField(f); setSortDir(d) }}
                                    onClose={() => setSortOpen(false)}
                                />
                            )}
                        </div>

                        {/* View toggle */}
                        <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-default)' }}>
                            {([['grid', Grid3X3], ['list', List]] as const).map(([mode, Icon]) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className="w-8 h-8 flex items-center justify-center transition-colors duration-150"
                                    style={{
                                        backgroundColor: viewMode === mode ? 'var(--turquoise-8)' : 'var(--surface-raised)',
                                        color:           viewMode === mode ? 'var(--turquoise)'   : 'var(--text-tertiary)',
                                    }}
                                >
                                    <Icon size={13} strokeWidth={2} />
                                </button>
                            ))}
                        </div>

                        {/* New project */}
                        <button
                            onClick={handleNewProject}
                            disabled={creating}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all duration-150"
                            style={{ backgroundColor: 'var(--turquoise)', boxShadow: '0 4px 12px var(--turquoise-22)' }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            {creating
                                ? <Loader2 size={12} className="animate-spin" />
                                : <FolderPlus size={12} strokeWidth={2.5} />}
                            New Project
                        </button>
                    </div>
                </div>

                {/* ── List header (list mode only) ── */}
                {viewMode === 'list' && displayed.length > 0 && (
                    <div
                        className="flex items-center gap-4 px-4 py-2"
                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    >
                        <div className="w-16 shrink-0" />
                        <span className="flex-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Name</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest shrink-0 hidden sm:block" style={{ color: 'var(--text-tertiary)', width: 40 }}>Format</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest shrink-0 hidden md:block" style={{ color: 'var(--text-tertiary)', width: 80 }}>Modified</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest shrink-0 hidden lg:block" style={{ color: 'var(--text-tertiary)', width: 80 }}>Created</span>
                        <div className="w-7 shrink-0" />
                    </div>
                )}

                {/* ── Content ── */}
                {loading ? (
                    <div className={viewMode === 'grid'
                        ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
                        : 'flex flex-col gap-1'
                    }>
                        {Array.from({ length: 8 }).map((_, i) => (
                            viewMode === 'grid' ? (
                                <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ border: '1px solid var(--border-default)' }}>
                                    <div className="aspect-video" style={{ backgroundColor: 'var(--surface-raised)' }} />
                                    <div className="px-3 py-3 flex flex-col gap-2" style={{ backgroundColor: 'var(--bg)' }}>
                                        <div className="h-3 w-3/4 rounded" style={{ backgroundColor: 'var(--surface-raised)' }} />
                                        <div className="h-2 w-1/2 rounded" style={{ backgroundColor: 'var(--surface-raised)' }} />
                                    </div>
                                </div>
                            ) : (
                                <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl animate-pulse">
                                    <div className="w-16 h-10 rounded-lg" style={{ backgroundColor: 'var(--surface-raised)' }} />
                                    <div className="flex-1 flex flex-col gap-1.5">
                                        <div className="h-3 w-48 rounded" style={{ backgroundColor: 'var(--surface-raised)' }} />
                                        <div className="h-2 w-24 rounded" style={{ backgroundColor: 'var(--surface-raised)' }} />
                                    </div>
                                </div>
                            )
                        ))}
                    </div>

                ) : displayed.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl"
                        style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                    >
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: 'var(--turquoise-8)', border: '1px solid var(--turquoise-22)' }}
                        >
                            {filter === 'trash'
                                ? <Trash2   size={24} style={{ color: 'var(--turquoise)' }} />
                                : filter === 'starred'
                                ? <Star     size={24} style={{ color: 'var(--turquoise)' }} />
                                : <FolderOpen size={24} style={{ color: 'var(--turquoise)' }} />}
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                                {search
                                    ? 'No projects match your search'
                                    : filter === 'trash'
                                    ? 'Trash is empty'
                                    : filter === 'starred'
                                    ? 'No starred projects'
                                    : 'No projects yet'}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                {search
                                    ? 'Try a different search term'
                                    : filter === 'all'
                                    ? 'Create your first project to get started'
                                    : filter === 'starred'
                                    ? 'Star projects to pin them here'
                                    : 'Deleted projects will appear here'}
                            </span>
                        </div>
                        {filter === 'all' && !search && (
                            <button
                                onClick={handleNewProject}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white mt-2"
                                style={{ backgroundColor: 'var(--turquoise)', boxShadow: '0 4px 12px var(--turquoise-22)' }}
                            >
                                <FolderPlus size={13} strokeWidth={2.5} />
                                New Project
                            </button>
                        )}
                    </div>

                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {displayed.map(p => (
                            <ProjectCard
                                key={p.id}
                                project={p}
                                onOpen={() => handleOpen(p)}
                                onRename={() => setRenaming(p)}
                                onDuplicate={() => handleDuplicate(p)}
                                onToggleStar={() => handleToggleStar(p)}
                                onTrash={() => handleTrash(p)}
                                onRestore={() => handleRestore(p)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {displayed.map(p => (
                            <ProjectRow
                                key={p.id}
                                project={p}
                                onOpen={() => handleOpen(p)}
                                onRename={() => setRenaming(p)}
                                onDuplicate={() => handleDuplicate(p)}
                                onToggleStar={() => handleToggleStar(p)}
                                onTrash={() => handleTrash(p)}
                                onRestore={() => handleRestore(p)}
                            />
                        ))}
                    </div>
                )}

                {/* Project count footer */}
                {!loading && displayed.length > 0 && (
                    <p className="text-[11px] text-center" style={{ color: 'var(--text-tertiary)' }}>
                        {displayed.length} {displayed.length === 1 ? 'project' : 'projects'}
                        {search && ` matching "${search}"`}
                    </p>
                )}

            </main>

            {/* Rename modal */}
            {renaming && (
                <RenameModal
                    project={renaming}
                    onSave={name => handleRename(renaming, name)}
                    onClose={() => setRenaming(null)}
                />
            )}
        </div>
    )
}