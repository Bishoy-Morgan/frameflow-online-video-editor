'use client'

import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PenLine, House, Share2, Loader2, CheckCheck } from 'lucide-react'
import { useUser } from '@/components/providers/UserContext'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import OperationNotice, { type OperationNoticeState } from '@/components/ui/OperationNotice'
import { projectNameSchema } from '@/lib/schemas'

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
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-body font-semibold bg-accent-40 text-accent-fg "
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
  const [renaming, setRenaming] = useState(false)
  const [renameError, setRenameError] = useState<string | null>(null)
  const [notice, setNotice] = useState<OperationNoticeState | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const handleNameBlur = async () => {
    const validation = projectNameSchema.safeParse(name)
    if (!validation.success) {
      const message = validation.error.issues[0]?.message ?? 'Invalid project name.'
      setRenameError(message)
      setNotice({ type: 'error', message })
      requestAnimationFrame(() => nameInputRef.current?.focus())
      return
    }

    const trimmedName = validation.data
    if (!trimmedName || trimmedName === projectName) {
      setName(projectName)
      setEditing(false)
      return
    }

    setRenaming(true)
    setRenameError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName }),
      })
      if (!res.ok) {
        const response = await res.json().catch(() => null)
        const apiError = response?.error
        const message = typeof apiError === 'string'
          ? apiError
          : apiError?.fieldErrors?.name?.[0] ?? apiError?.formErrors?.[0]
        throw new Error(message ?? `Could not save project name (HTTP ${res.status}).`)
      }

      setName(trimmedName)
      setRenameError(null)
      setEditing(false)
      setNotice({ type: 'success', message: 'Project name updated successfully.' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save project name.'
      setRenameError(message)
      setNotice({ type: 'error', message })
      requestAnimationFrame(() => nameInputRef.current?.focus())
    } finally {
      setRenaming(false)
    }
  }

  return (
    <>
    <div
      className="relative flex items-center justify-between py-2 px-4 shrink-0 w-[99%] rounded-2xl border border-accent-16 glow-accent-40 "
    >
      <button
        onClick={() => router.push('/dashboard')}
        title="Go to dashboard"
        className="cursor-pointer"
      >
        <House size={26} strokeWidth={1.5} fill='var(--accent)' className="border-(--text) inline-block scale-90 hover:scale-105 transition-all duration-300 " />
      </button>

      <div className="relative">
        {editing ? (
          <input
            ref={nameInputRef}
            autoFocus
            value={name}
            maxLength={100}
            disabled={renaming}
            onChange={e => { setName(e.target.value); setRenameError(null) }}
            onBlur={handleNameBlur}
            onKeyDown={e => {
              if (e.key === 'Enter') e.currentTarget.blur()
              if (e.key === 'Escape' && !renaming) {
                setName(projectName)
                setRenameError(null)
                setEditing(false)
              }
            }}
            className="text-caption font-bold outline-none rounded-xl px-3 py-2 min-w-0 max-w-65 glow-accent-22 border border-accent-20"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-caption font-bold group bg-transparent border-none cursor-pointer p-0 max-w-70 overflow-hidden text-(--text) "
          >
            <span className="truncate">
              {name}
            </span>
            <PenLine
              size={18}
              strokeWidth={2}
              className="opacity-40 group-hover:opacity-100 shrink-0 transition-opacity text-accent-fg ml-2"
            />
          </button>
        )}
        {renameError && <span role="alert" className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-100 min-w-sm text-center border-error border px-6 py-2 glow-error rounded-xl bg-error text-small text-white font-medium ">{renameError}</span>}
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
    <OperationNotice notice={notice} onClose={() => setNotice(null)} />
    </>
  )
}