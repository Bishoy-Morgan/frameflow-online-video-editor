'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Clock, MoreHorizontal, Play, Star, Copy, Pencil, Trash2, Check, X } from 'lucide-react'
import Image from 'next/image'

export interface Project {
    id:         string
    name:       string
    lastEdited: string
    thumbnail?: string
    starred?:   boolean
}

interface DashboardCardProps {
    project:   Project
    onUpdate?: () => void  // refresh list after mutation
}

export default function DashboardCard({ project, onUpdate }: DashboardCardProps) {
    const [menuOpen,   setMenuOpen]   = useState(false)
    const [renaming,   setRenaming]   = useState(false)
    const [nameVal,    setNameVal]    = useState(project.name)
    const [starred,    setStarred]    = useState(project.starred ?? false)
    const [loading,    setLoading]    = useState<string | null>(null)

    const menuRef  = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Close menu on outside click
    useEffect(() => {
        if (!menuOpen) return
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [menuOpen])

    // Focus input when renaming starts
    useEffect(() => {
        if (renaming) setTimeout(() => inputRef.current?.select(), 50)
    }, [renaming])

    const handleRename = async () => {
        const trimmed = nameVal.trim()
        if (!trimmed || trimmed === project.name) { setRenaming(false); setNameVal(project.name); return }
        setLoading('rename')
        await fetch(`/api/projects/${project.id}`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ name: trimmed }),
        })
        setLoading(null)
        setRenaming(false)
        onUpdate?.()
    }

    const handleStar = async () => {
        setStarred(s => !s)
        setMenuOpen(false)
        await fetch(`/api/projects/${project.id}`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ starred: !starred }),
        })
        onUpdate?.()
    }

    const handleDuplicate = async () => {
        setLoading('duplicate')
        setMenuOpen(false)
        await fetch(`/api/projects/${project.id}/duplicate`, { method: 'POST' })
        setLoading(null)
        onUpdate?.()
    }

    const handleDelete = async () => {
        setLoading('delete')
        setMenuOpen(false)
        await fetch(`/api/projects/${project.id}`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ deletedAt: new Date().toISOString() }),
        })
        setLoading(null)
        onUpdate?.()
    }

    const menuItems = [
        {
            id:      'rename',
            label:   'Rename',
            icon:    Pencil,
            action:  () => { setMenuOpen(false); setRenaming(true) },
        },
        {
            id:      'star',
            label:   starred ? 'Unstar' : 'Star',
            icon:    Star,
            action:  handleStar,
            active:  starred,
        },
        {
            id:      'duplicate',
            label:   'Duplicate',
            icon:    Copy,
            action:  handleDuplicate,
        },
        {
            id:      'delete',
            label:   'Move to Trash',
            icon:    Trash2,
            action:  handleDelete,
            danger:  true,
        },
    ]

    return (
        <div
            onClick={() => !renaming && window.open(`/editor/${project.id}`, '_blank')}
            className="group flex flex-col rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
            style={{ boxShadow: '0 0 0 1px var(--border-default)', position: 'relative' }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1), 0 0 0 1px var(--turquoise-22)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 0 1px var(--border-default)'
            }}
        >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video overflow-hidden" style={{ backgroundColor: 'var(--surface-raised)' }}>
                {project.thumbnail ? (
                    <Image src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
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

                {/* Star badge */}
                {starred && (
                    <div className="absolute top-2 left-2">
                        <Star size={12} fill="var(--turquoise)" style={{ color: 'var(--turquoise)' }} />
                    </div>
                )}

                {/* Hover overlay */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(2,2,2,0.3)' }}
                >
                    <span className="text-[0.7rem] font-bold tracking-widest uppercase text-white">Open in Editor</span>
                </div>

                {/* ⋯ button */}
                <div ref={menuRef} style={{ position: 'absolute', top: 8, right: 8, zIndex: 30 }}>
                    <button
                        onClick={e => { e.preventDefault(); e.stopPropagation(); setMenuOpen(o => !o) }}
                        className="w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:opacity-100"
                        style={{
                            backgroundColor: menuOpen ? 'var(--turquoise)' : 'rgba(2,2,2,0.55)',
                            backdropFilter:  'blur(4px)',
                            border:          'none',
                            color:           menuOpen ? '#020202' : '#fefefe',
                            cursor:          'pointer',
                        }}
                    >
                        <MoreHorizontal size={13} />
                    </button>

                    {/* Dropdown */}
                    {menuOpen && (
                        <div
                            onClick={e => e.stopPropagation()}
                            className="absolute right-0 flex flex-col p-1 rounded-xl"
                            style={{
                                top:             'calc(100% + 6px)',
                                width:           '168px',
                                backgroundColor: 'var(--bg)',
                                border:          '1px solid var(--border-default)',
                                boxShadow:       '0 8px 32px rgba(0,0,0,0.2)',
                                zIndex:          50,
                            }}
                        >
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={item.action}
                                    disabled={loading === item.id}
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left w-full transition-colors duration-100"
                                    style={{
                                        fontSize:        '12px',
                                        fontWeight:      600,
                                        color:           item.danger ? '#ef4444' : item.active ? 'var(--turquoise)' : 'var(--text-secondary)',
                                        backgroundColor: 'transparent',
                                        border:          'none',
                                        cursor:          'pointer',
                                        opacity:         loading === item.id ? 0.5 : 1,
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = item.danger
                                            ? 'rgba(239,68,68,0.08)'
                                            : 'var(--surface-raised)'
                                    }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                                >
                                    <item.icon size={13} strokeWidth={item.active ? 2.5 : 1.75} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div
                className="flex flex-col gap-1 px-4 py-3"
                style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border-subtle)' }}
            >
                {renaming ? (
                    <div
                        className="flex items-center gap-1"
                        onClick={e => e.stopPropagation()}
                    >
                        <input
                            ref={inputRef}
                            value={nameVal}
                            onChange={e => setNameVal(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') handleRename()
                                if (e.key === 'Escape') { setRenaming(false); setNameVal(project.name) }
                            }}
                            className="flex-1 rounded-md px-2 py-0.5 text-sm font-bold"
                            style={{
                                backgroundColor: 'var(--surface-raised)',
                                border:          '1px solid var(--turquoise-42)',
                                color:           'var(--text)',
                                outline:         'none',
                                minWidth:        0,
                            }}
                        />
                        <button onClick={handleRename} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--turquoise)', padding: 2 }}>
                            <Check size={13} />
                        </button>
                        <button onClick={() => { setRenaming(false); setNameVal(project.name) }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 2 }}>
                            <X size={13} />
                        </button>
                    </div>
                ) : (
                    <span className="text-sm font-bold truncate" style={{ color: 'var(--text-secondary)' }}>
                        {nameVal}
                    </span>
                )}
                <div className="flex items-center gap-1.5">
                    <Clock size={11} strokeWidth={1.75} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-[0.68rem] font-medium" style={{ color: 'var(--text-tertiary)' }}>{project.lastEdited}</span>
                </div>
            </div>
        </div>
    )
}