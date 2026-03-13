'use client'

import React, { useState } from 'react'
import { ArrowLeft, Save, Download, Loader2, CheckCheck, Pencil, Sparkles } from 'lucide-react'
import { useUser } from '@/components/providers/UserContext'
import Image from 'next/image'

interface EditorTopBarProps {
  projectId:   string
  projectName: string
  saving:      boolean
  saved:        boolean
  aiOpen:      boolean
  onToggleAi:  () => void
  onSave:      () => void
  onExport:    () => void
}

function UserAvatar() {
  const user = useUser()

  // Build initials from name, fall back to email first char
  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase()

  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="flex flex-col items-end">
        <span className="text-xs font-semibold leading-tight truncate max-w-30"
          style={{ color: 'var(--text)' }}>
          {user.name ?? user.email}
        </span>
        <span className="text-[10px] leading-tight"
          style={{ color: 'var(--text-tertiary)' }}>
          {user._count.projects} project{user._count.projects !== 1 ? 's' : ''}
        </span>
      </div>

      {user.image ? (
        <Image
          src={user.image}
          alt={user.name ?? 'User avatar'}
          width={28}
          height={28}
          className="rounded-full object-cover shrink-0"
          style={{ border: '1px solid var(--border-default)' }}
        />
      ) : (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
          style={{
            backgroundColor: 'var(--turquoise-16)',
            border:          '1px solid var(--turquoise-42)',
            color:           'var(--turquoise)',
          }}
        >
          {initials}
        </div>
      )}
    </div>
  )
}

export default function EditorTopBar({
  projectId, projectName, saving, saved, aiOpen, onToggleAi, onSave, onExport,
}: EditorTopBarProps) {
  const [editing, setEditing] = useState(false)
  const [name,    setName]    = useState(projectName)

  const handleNameBlur = async () => {
    setEditing(false)
    if (name.trim() === projectName || !name.trim()) return
    await fetch(`/api/projects/${projectId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action: 'rename', name: name.trim() }),
    })
  }

  return (
    <div
      className="flex items-center justify-between px-4 shrink-0 z-20"
      style={{
        height:          '48px',
        backgroundColor: 'var(--bg)',
        borderBottom:    '1px solid var(--border-default)',
      }}
    >
      {/* Left — back + project title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-xs font-semibold shrink-0 transition-colors"
          style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
          title="Back to dashboard"
        >
          <ArrowLeft size={14} strokeWidth={2} />
        </button>

        <div className="w-px h-4 shrink-0" style={{ backgroundColor: 'var(--border-default)' }} />

        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={e => e.key === 'Enter' && handleNameBlur()}
            className="text-sm font-bold outline-none rounded-md px-2 py-0.5 min-w-0"
            style={{
              backgroundColor: 'var(--surface-raised)',
              border:          '1px solid var(--turquoise-42)',
              color:           'var(--text)',
              maxWidth:        '260px',
            }}
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-sm font-bold group"
            style={{
              background:  'none',
              border:      'none',
              color:       'var(--text)',
              cursor:      'pointer',
              padding:     0,
              maxWidth:    '280px',
              overflow:    'hidden',
            }}
          >
            <span className="truncate">{name}</span>
            <Pencil
              size={10} strokeWidth={2}
              className="opacity-0 group-hover:opacity-40 shrink-0 transition-opacity"
              style={{ color: 'var(--text-tertiary)' }}
            />
          </button>
        )}
      </div>

      {/* Right — AI toggle + save + export + user */}
      <div className="flex items-center gap-2">

        {/* AI Sidebar toggle */}
        <button
          onClick={onToggleAi}
          title={aiOpen ? 'Hide AI sidebar' : 'Show AI sidebar'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
          style={{
            backgroundColor: aiOpen ? 'var(--turquoise-8)'           : 'var(--surface-raised)',
            border:          aiOpen ? '1px solid var(--turquoise-42)' : '1px solid var(--border-default)',
            color:           aiOpen ? 'var(--turquoise)'              : 'var(--text-tertiary)',
            cursor:          'pointer',
          }}
          onMouseEnter={e => {
            if (!aiOpen) {
              e.currentTarget.style.color       = 'var(--text)'
              e.currentTarget.style.borderColor = 'var(--border-strong)'
            }
          }}
          onMouseLeave={e => {
            if (!aiOpen) {
              e.currentTarget.style.color       = 'var(--text-tertiary)'
              e.currentTarget.style.borderColor = 'var(--border-default)'
            }
          }}
        >
          <Sparkles size={12} strokeWidth={2} />
          AI
        </button>

        <div className="w-px h-4 shrink-0" style={{ backgroundColor: 'var(--border-default)' }} />

        {/* Save */}
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            backgroundColor: saved ? 'rgba(52,211,153,0.1)'          : 'var(--surface-raised)',
            border:          saved ? '1px solid rgba(52,211,153,0.3)' : '1px solid var(--border-default)',
            color:           saved ? '#34d399'                        : 'var(--text-tertiary)',
            cursor:          saving ? 'wait' : 'pointer',
          }}
          onMouseEnter={e => { if (!saved) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-strong)' } }}
          onMouseLeave={e => { if (!saved) { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-default)' } }}
        >
          {saving ? <Loader2 size={11} className="animate-spin" /> : saved ? <CheckCheck size={11} /> : <Save size={11} strokeWidth={2} />}
          {saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
        </button>

        {/* Export */}
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity"
          style={{
            backgroundColor: 'var(--turquoise)',
            border:          'none',
            color:           '#fff',
            cursor:          'pointer',
            boxShadow:       '0 2px 8px var(--turquoise-22)',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <Download size={11} strokeWidth={2.5} /> Export
        </button>

        <div className="w-px h-4 shrink-0" style={{ backgroundColor: 'var(--border-default)' }} />

        {/* User identity */}
        <UserAvatar />
      </div>
    </div>
  )
}