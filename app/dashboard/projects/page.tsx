'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    Search, FolderPlus, FolderOpen, Star, Trash2,
    ChevronDown, X, Loader2, SortAsc, SortDesc, Clock, AlignLeft,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import DashboardCard, { Project as CardProject } from '../components/DashboardCard'
import Button from '@/components/ui/Button'

interface Scene {
    id: string
    title: string
    description: string
    musicMood: string
    duration: number
    order: number
    videoUrl?: string | null
}

interface Project {
    id: string
    name: string
    style: string | null
    aspectRatio: string | null
    createdAt: string
    updatedAt: string
    starred: boolean
    deletedAt: string | null
    thumbnail: string | null
    scenes: Scene[]
}

type SortField = 'updatedAt' | 'createdAt' | 'name'
type SortDir = 'asc' | 'desc'
type Filter = 'all' | 'starred' | 'trash'

function formatRelative(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString()
}

function toCardProject(p: Project): CardProject {
    return {
        id: p.id,
        name: p.name,
        lastEdited: formatRelative(p.updatedAt),
        thumbnail: p.thumbnail ?? undefined,
        previewVideoUrl: p.scenes?.[0]?.videoUrl ?? null,
        starred: p.starred,
        deletedAt: p.deletedAt,
        aspectRatio: p.aspectRatio,
        style: p.style,
        sceneCount: p.scenes?.length,
        totalDuration: p.scenes?.reduce((sum, s) => sum + s.duration, 0),
    }
}

function StatBadge({ icon: Icon, count, label, active, onClick }: {
    icon: React.ElementType
    count: number
    label: string
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-caption font-semibold transition-all duration-150 border cursor-pointer ${
                active
                    ? 'bg-(--accent-8) border-(--accent-42) text-(--accent)'
                    : 'bg-(--surface-overlay) border-(--border-default) text-(--text-tertiary) hover:border-(--border-strong) hover:text-(--text)'
            }`}
        >
            <Icon size={16} strokeWidth={2} />
            {label}
            <span className={`text-tiny font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-(--accent-16) text-(--accent)' : 'bg-(--surface-raised) text-(--text-tertiary)'}`}>
                {count}
            </span>
        </button>
    )
}

function SortDropdown({ field, dir, onChange, onClose }: {
    field: SortField
    dir: SortDir
    onChange: (f: SortField, d: SortDir) => void
    onClose: () => void
}) {
    const ref = React.useRef<HTMLDivElement>(null)
    useEffect(() => {
        const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose() }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [onClose])

    const options: { label: string; field: SortField; icon: React.ElementType }[] = [
        { label: 'Last modified', field: 'updatedAt', icon: Clock },
        { label: 'Date created', field: 'createdAt', icon: Clock },
        { label: 'Name', field: 'name', icon: AlignLeft },
    ]

    return (
        <div ref={ref} className="absolute right-0 top-11 z-50 rounded-xl overflow-hidden py-1 min-w-45 bg-(--surface-overlay) border border-(--border-default) shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
            {options.map(({ label, field: f, icon: Icon }) => (
                <button
                    key={f}
                    onClick={() => { onChange(f, f === field ? (dir === 'asc' ? 'desc' : 'asc') : 'desc'); onClose() }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-caption font-medium text-left transition-colors bg-transparent border-none cursor-pointer hover:bg-(--surface-raised) ${
                        f === field ? 'text-(--accent)' : 'text-(--text-secondary)'
                    }`}
                >
                    <Icon size={16} />
                    {label}
                    {f === field && (dir === 'asc' ? <SortAsc size={16} className="ml-auto" /> : <SortDesc size={16} className="ml-auto" />)}
                </button>
            ))}
        </div>
    )
}

function RenameModal({ project, onSave, onClose }: { project: Project; onSave: (name: string) => void; onClose: () => void }) {
    const [name, setName] = useState(project.name)
    const inputRef = React.useRef<HTMLInputElement>(null)

    useEffect(() => { inputRef.current?.focus(); inputRef.current?.select() }, [])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs" onClick={onClose}>
            <div
                className="rounded-xl p-8 w-full max-w-sm flex flex-col gap-4 bg-(--surface-overlay) border border-(--accent-16) shadow-accent-40"
                onClick={e => e.stopPropagation()}
            >
                <div>
                    <h4 className="text-(--text) font-semibold">Rename project</h4>
                    <p className="text-caption mt-1 text-(--text-tertiary)">Enter a new name for this project.</p>
                </div>
                <input
                    ref={inputRef}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') onSave(name); if (e.key === 'Escape') onClose() }}
                    className="w-full px-3 py-2.5 rounded-xl text-caption font-medium outline-none bg-(--bg) border border-(--border-default) text-(--text) focus:border-(--accent) focus:shadow-lg"
                />
                <div className="flex gap-2 justify-end">
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='primary'
                        size='sm'
                        onClick={() => onSave(name)}
                        disabled={!name.trim()}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}

function ConfirmDeleteModal({ project, onConfirm, onClose }: {
    project: { id: string; name: string }
    onConfirm: () => void
    onClose: () => void
}) {
    const [input, setInput] = useState('')
    const matches = input.trim() === project.name

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs" onClick={onClose}>
            <div
                className="rounded-xl p-8 w-full max-w-sm flex flex-col gap-4 bg-(--surface-overlay) border border-(--accent-16) shadow-accent-40"
                onClick={e => e.stopPropagation()}
            >
                <div>
                    <h4 className="text-(--text) font-semibold">Delete permanently</h4>
                    <p className="text-caption mt-1 text-(--text-tertiary)">
                        This can&apos;t be undone. Type <span className="font-bold text-(--text-secondary)">{project.name}</span> to confirm.
                    </p>
                </div>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={project.name}
                    autoFocus
                    className="w-full px-3 py-2.5 rounded-xl text-caption font-medium outline-none bg-(--bg) border border-(--border-default) text-(--text) focus:border-(--accent) focus:shadow-lg"
                />
                <div className="flex gap-2 justify-end">
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <button
                        onClick={onConfirm}
                        disabled={!matches}
                        className={`px-4 py-2 rounded-xl text-caption font-semibold text-white bg-(--error) ${matches ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                    >
                        Delete Permanently
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<Filter>('all')
    const [sortField, setSortField] = useState<SortField>('updatedAt')
    const [sortDir, setSortDir] = useState<SortDir>('desc')
    const [sortOpen, setSortOpen] = useState(false)
    const [renaming, setRenaming] = useState<Project | null>(null)
    const [creating, setCreating] = useState(false)
    const [deletingPermanently, setDeletingPermanently] = useState<Project | null>(null)

    const router = useRouter()

    const fetchProjects = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/projects?includeDeleted=true')
            const data = await res.json()
            setProjects(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchProjects() }, [fetchProjects])

    const displayed = useMemo(() => {
        let list = [...projects]

        if (filter === 'starred') list = list.filter(p => p.starred && !p.deletedAt)
        else if (filter === 'trash') list = list.filter(p => !!p.deletedAt)
        else list = list.filter(p => !p.deletedAt)

        if (search.trim()) {
            const q = search.toLowerCase()
            list = list.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.style?.toLowerCase().includes(q) ||
                p.scenes?.some(s => s.title.toLowerCase().includes(q))
            )
        }

        list.sort((a, b) => {
            let av: string | number = a[sortField]
            let bv: string | number = b[sortField]
            if (sortField !== 'name') { av = new Date(av).getTime(); bv = new Date(bv).getTime() }
            if (av < bv) return sortDir === 'asc' ? -1 : 1
            if (av > bv) return sortDir === 'asc' ? 1 : -1
            return 0
        })

        return list
    }, [projects, filter, search, sortField, sortDir])

    const handleNewProject = async () => {
        setCreating(true)
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Untitled Project', style: 'Cinematic', aspectRatio: '16:9' }),
            })
            const project = await res.json()
            router.push(`/editor/${project.id}`)
        } catch (err) { console.error(err) } finally { setCreating(false) }
    }

    const handleRename = async (project: Project, name: string) => {
        setRenaming(null)
        if (!name.trim() || name === project.name) return
        setProjects(ps => ps.map(p => p.id === project.id ? { ...p, name } : p))
        await fetch(`/api/projects/${project.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        })
    }

const handleDuplicate = async (project: Project) => {
    const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: `${project.name} (copy)`,
            style: project.style ?? undefined,
            aspectRatio: project.aspectRatio ?? undefined,
            scenes: project.scenes?.map(({ title, description, musicMood, duration, order, videoUrl }) =>
                ({ title, description, musicMood, duration, order, videoUrl: videoUrl ?? undefined })),
        }),
    })

    if (!res.ok) {
        console.error('Duplicate failed:', await res.json())
        return
    }

    await fetchProjects()
}

    const handleToggleStar = async (project: Project) => {
        const starred = !project.starred
        setProjects(ps => ps.map(p => p.id === project.id ? { ...p, starred } : p))
        await fetch(`/api/projects/${project.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ starred }),
        })
    }

    const handleTrash = async (project: Project) => {
        setProjects(ps => ps.map(p => p.id === project.id ? { ...p, deletedAt: new Date().toISOString() } : p))
        await fetch(`/api/projects/${project.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deletedAt: new Date().toISOString() }),
        })
    }

    const handleRestore = async (project: Project) => {
        setProjects(ps => ps.map(p => p.id === project.id ? { ...p, deletedAt: null } : p))
        await fetch(`/api/projects/${project.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deletedAt: null }),
        })
    }

    const handlePermanentDelete = async (project: Project) => {
        setProjects(ps => ps.filter(p => p.id !== project.id))
        await fetch(`/api/projects/${project.id}`, { method: 'DELETE' })
        setDeletingPermanently(null)
    }

    const counts = useMemo(() => ({
        all: projects.filter(p => !p.deletedAt).length,
        starred: projects.filter(p => p.starred && !p.deletedAt).length,
        trash: projects.filter(p => !!p.deletedAt).length,
    }), [projects])

    return (
        <div className="relative flex flex-col flex-1 min-h-0 overflow-auto p-2 ">
            <div className="flex flex-col rounded-xl overflow-hidden bg-(--surface-overlay) border border-(--border-default) shadow-accent-22">

                <div className="flex flex-col gap-4 px-10 pt-8 ">
                    <div className="flex items-end justify-between flex-wrap gap-4">
                        <div className="flex flex-col gap-0.5">
                            <h3 className="font-semibold text-(--text)">Projects</h3>
                            <span className="text-caption text-(--text-tertiary)">All your videos in one place</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <StatBadge icon={FolderOpen} count={counts.all} label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
                            <StatBadge icon={Star} count={counts.starred} label="Starred" active={filter === 'starred'} onClick={() => setFilter('starred')} />
                            <StatBadge icon={Trash2} count={counts.trash} label="Trash" active={filter === 'trash'} onClick={() => setFilter('trash')} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-caption bg-(--surface-raised) border border-(--border-default) min-w-50 flex-1 max-w-80">
                            <Search size={16} className="text-(--text-tertiary) shrink-0" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search projects…"
                                className="bg-transparent outline-none flex-1 text-caption text-(--text)"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="bg-transparent border-none cursor-pointer">
                                    <X size={12} className="text-(--text-tertiary)" />
                                </button>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setSortOpen(v => !v)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-caption font-semibold transition-all duration-150 border cursor-pointer ${
                                    sortOpen ? 'bg-(--surface-raised) border-(--border-strong)' : 'bg-(--surface-raised) border-(--border-default)'
                                } text-(--text-secondary)`}
                            >
                                {sortDir === 'asc' ? <SortAsc size={16} strokeWidth={2} /> : <SortDesc size={12} strokeWidth={2} />}
                                Sort
                                <ChevronDown size={14} className={`transition-transform duration-150 ${sortOpen ? 'rotate-180' : ''}`} />
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

                        <Button size="sm" variant="primary" onClick={handleNewProject} disabled={creating}>
                            {creating
                                ? <><Loader2 size={16} className="animate-spin inline-block mr-2" />Creating…</>
                                : <><FolderPlus size={16} strokeWidth={2.5} className="inline-block mr-2" />New Project</>}
                        </Button>
                    </div>
                </div>

                <main className="flex-1 px-12 pb-8 ">
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-10">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="rounded-2xl overflow-hidden animate-pulse ring-1 ring-(--border-default)">
                                    <div className="aspect-video bg-(--surface-sunken)" />
                                    <div className="px-3 py-2 flex flex-col gap-1.5 bg-(--surface-overlay)">
                                        <div className="h-2.5 w-1/2 rounded-xl bg-(--surface-sunken)" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : displayed.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-xl bg-(--surface-raised) ">
                            <div className="w-14 h-14 flex items-center justify-center ">
                                {filter === 'trash'
                                    ? <Trash2 size={36} className="text-(--accent)" />
                                    : filter === 'starred'
                                        ? <Star size={24} className="text-(--accent)" />
                                        : <FolderOpen size={24} className="text-(--accent)" />}
                            </div>
                            <div className="flex flex-col items-center gap-1 text-center">
                                <span className="text-lead font-bold text-(--text-secondary)">
                                    {search
                                        ? 'No projects match your search'
                                        : filter === 'trash'
                                            ? 'Trash is empty'
                                            : filter === 'starred'
                                                ? 'No starred projects'
                                                : 'No projects yet'}
                                </span>
                                <span className="text-small text-(--text-tertiary)">
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
                                <Button size="sm" variant="primary" onClick={handleNewProject}>
                                    <FolderPlus size={13} strokeWidth={2.5} className="inline-block mr-2" />
                                    New Project
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-10">
                            {displayed.map(p => (
                                <DashboardCard
                                    key={p.id}
                                    project={toCardProject(p)}
                                    onRename={p.deletedAt ? undefined : () => setRenaming(p)}
                                    onDuplicate={p.deletedAt ? undefined : () => handleDuplicate(p)}
                                    onToggleStar={p.deletedAt ? undefined : () => handleToggleStar(p)}
                                    onTrash={p.deletedAt ? undefined : () => handleTrash(p)}
                                    onRestore={p.deletedAt ? () => handleRestore(p) : undefined}
                                    onPermanentDelete={p.deletedAt ? () => setDeletingPermanently(p) : undefined}
                                />
                            ))}
                        </div>
                    )}

                    {!loading && displayed.length > 0 && (
                        <p className="text-small font-medium text-center mt-6 text-(--text-tertiary)">
                            {displayed.length} {displayed.length === 1 ? 'project' : 'projects'}
                            {search && ` matching "${search}"`}
                        </p>
                    )}
                </main>
            </div>

            {renaming && (
                <RenameModal
                    project={renaming}
                    onSave={name => handleRename(renaming, name)}
                    onClose={() => setRenaming(null)}
                />
            )}

            {deletingPermanently && (
                <ConfirmDeleteModal
                    project={deletingPermanently}
                    onConfirm={() => handlePermanentDelete(deletingPermanently)}
                    onClose={() => setDeletingPermanently(null)}
                />
            )}
        </div>
    )
}