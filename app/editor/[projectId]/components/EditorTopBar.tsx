'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, House, Share2, Loader2, CheckCheck } from 'lucide-react'
import { useUser } from '@/components/providers/UserContext'
import Image from 'next/image'
import Button from '@/components/ui/Button'

interface EditorTopBarProps {
  projectId: string
  projectName: string
  saving: boolean
  saved: boolean
  onOpenShare: () => void
}

function UserAvatar() {
  const user = useUser()

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 1)
    : user.email[0].toUpperCase()

  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="flex flex-col items-end">
        <span
          className="text-small font-semibold max-w-30 "
        >
          {user.name ?? user.email}
        </span>
        <span
          className="text-[10px] leading-tight"
          style={{ color: 'var(--text-tertiary)' }}
        >
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
        />
      ) : (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-body font-semibold bg-(--accent-40) text-(--accent-fg) "
        >
          {initials}
        </div>
      )}
    </div>
  )
}

function SaveStatus({ saving, saved }: { saving: boolean; saved: boolean }) {
  if (saving) {
    return (
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <Loader2 size={20} className="animate-spin" />
        Saving…
      </div>
    )
  }

  if (saved) {
    return (
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-(--success)"
      >
        <CheckCheck size={20} />
        Saved
      </div>
    )
  }

  return null
}

export default function EditorTopBar({
  projectId, projectName, saving, saved, onOpenShare,
}: EditorTopBarProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(projectName)

  const handleNameBlur = async () => {
    setEditing(false)
    if (name.trim() === projectName || !name.trim()) return
    await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'rename', name: name.trim() }),
    })
  }

  return (
    <div
      className="relative flex items-center justify-between py-2 px-4 shrink-0 w-[99%] rounded-2xl border border-(--accent-16) shadow-accent-40 "
    >
      <button
        onClick={() => router.push('/dashboard')}
        title="Go to dashboard"
        className="cursor-pointer"
      >
        <House size={24} strokeWidth={2} className="inline-block text-(--accent)" />
      </button>

      <div>
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={e => e.key === 'Enter' && handleNameBlur()}
            className="text-caption font-semibold outline-none rounded-xl px-2 py-0.5 min-w-0 max-w-65 border"
            style={{
              backgroundColor: 'var(--surface-raised)',
              borderColor: 'var(--accent-42)',
              color: 'var(--text)',
            }}
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-caption font-semibold group bg-transparent border-none cursor-pointer p-0 max-w-70 overflow-hidden text-(--text) rounded-xl "
          >
            <span className="truncate">
              {name}
            </span>
            <Pencil
              size={20}
              strokeWidth={2}
              className="opacity-0 group-hover:opacity-40 shrink-0 transition-opacity text-(--accent-fg) "
            />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <SaveStatus saving={saving} saved={saved} />

        <UserAvatar />

        <Button
          variant="primary"
          size="sm"
          className="py-1! px-2.5!"
          onClick={onOpenShare}
          icon={<Share2 size={18} strokeWidth={2} className="inline-block" />}
        >
          Share
        </Button>
      </div>
    </div>
  )
}