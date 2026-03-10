'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles, MessageSquare, Captions, Scissors,
  FileText, Loader2, Send, Copy, CheckCheck,
  Wand2, RefreshCw,
} from 'lucide-react'

type AiTab = 'chat' | 'captions' | 'scenes' | 'script'

interface Scene {
  id: string; title: string; description: string
  musicMood: string; duration: number; order: number
}

interface Message { role: 'user' | 'assistant'; content: string }

interface GeminiSidebarProps {
  projectId:      string
  projectName:    string
  prompt:         string | null
  scenes:         Scene[]
  videoUrl:       string | null
  onScenesUpdate: (scenes: Scene[]) => void
}

// ── AI Chat ───────────────────────────────────────────────────────────────────

function AiChat({ projectName, prompt, scenes }: { projectName: string; prompt: string | null; scenes: Scene[] }) {
  const [messages, setMessages] = useState<Message[]>([{
    role:    'assistant',
    content: `Hi! I'm your AI editor for **${projectName}**. I can help you improve scenes, suggest transitions, write scripts, or answer any editing question. What would you like to do?`,
  }])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [copied,  setCopied]  = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const updated: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setLoading(true)
    try {
      const context = [
        `Project: ${projectName}`,
        prompt ? `Prompt: ${prompt}` : '',
        scenes.length > 0 ? `Scenes: ${scenes.map(s => `${s.title} (${s.duration}s, ${s.musicMood})`).join(', ')}` : '',
      ].filter(Boolean).join('\n')

      const res  = await fetch('/api/ai/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body:   JSON.stringify({ messages: updated, context }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: data.reply ?? 'Sorry, something went wrong.' }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Connection error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="relative max-w-[90%] px-3 py-2.5 rounded-xl text-xs leading-relaxed group"
              style={{
                backgroundColor: msg.role === 'user' ? 'var(--turquoise-8)'    : 'var(--surface-raised)',
                border:          msg.role === 'user' ? '1px solid var(--turquoise-22)' : '1px solid var(--border-default)',
                color:           msg.role === 'user' ? 'var(--turquoise)'      : 'var(--text-secondary)',
              }}>
              <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              {msg.role === 'assistant' && (
                <button onClick={() => { navigator.clipboard.writeText(msg.content); setCopied(i); setTimeout(() => setCopied(null), 2000) }}
                  className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                  {copied === i ? <CheckCheck size={10} style={{ color: '#34d399' }} /> : <Copy size={10} />}
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
              style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)' }}>
              <Loader2 size={10} className="animate-spin" />Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-3 py-2 flex gap-1.5 flex-wrap" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        {['Improve scene descriptions', 'Suggest transitions', 'Write a hook'].map(q => (
          <button key={q} onClick={() => setInput(q)}
            className="text-[10px] font-semibold px-2 py-1 rounded-md transition-colors"
            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--turquoise)'; e.currentTarget.style.borderColor = 'var(--turquoise-22)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-1">
        <div className="flex items-end gap-2 rounded-xl p-2"
          style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask anything about your video…" rows={2}
            className="flex-1 resize-none text-xs outline-none"
            style={{ backgroundColor: 'transparent', color: 'var(--text)', lineHeight: 1.5 }} />
          <button onClick={send} disabled={!input.trim() || loading}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
            style={{
              backgroundColor: input.trim() && !loading ? 'var(--turquoise)' : 'var(--bg)',
              border: `1px solid ${input.trim() && !loading ? 'transparent' : 'var(--border-default)'}`,
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            }}>
            <Send size={11} style={{ color: input.trim() && !loading ? '#fff' : 'var(--text-tertiary)' }} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Auto Captions — sends video as base64 to Gemini 1.5 Pro ──────────────────

function AutoCaptions({ projectId, videoUrl }: { projectId: string; videoUrl: string | null }) {
  const [loading,  setLoading]  = useState(false)
  const [captions, setCaptions] = useState<{ time: string; text: string }[]>([])
  const [error,    setError]    = useState('')
  const [progress, setProgress] = useState('')

  const generate = async () => {
    if (!videoUrl) return
    setLoading(true); setError(''); setProgress('Reading video file…')

    try {
      // Convert blob URL → base64
      const blob       = await fetch(videoUrl).then(r => r.blob())
      const mimeType   = blob.type || 'video/mp4'

      setProgress('Encoding for Gemini…')
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload  = () => resolve((reader.result as string).split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })

      setProgress('Sending to Gemini 1.5 Pro…')
      const res  = await fetch('/api/ai/captions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ projectId, videoBase64: base64, mimeType }),
      })
      const data = await res.json()

      if (data.captions) setCaptions(data.captions)
      else setError(data.error ?? 'Failed to generate captions')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setLoading(false); setProgress('')
    }
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      {!videoUrl ? (
        <div className="text-xs text-center py-6" style={{ color: 'var(--text-tertiary)' }}>
          Load a video first to generate captions
        </div>
      ) : captions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--turquoise-8)', border: '1px solid var(--turquoise-22)' }}>
            <Captions size={18} style={{ color: 'var(--turquoise)' }} strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>Auto-Captions</p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
              Gemini 1.5 Pro watches your video and generates timestamped captions automatically.
            </p>
          </div>
          {progress && <p className="text-[11px] font-medium" style={{ color: 'var(--turquoise)' }}>{progress}</p>}
          {error    && <p className="text-[11px] text-red-400">{error}</p>}
          <button onClick={generate} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-opacity"
            style={{ backgroundColor: 'var(--turquoise)', color: '#fff', border: 'none', cursor: loading ? 'wait' : 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            {loading
              ? <><Loader2 size={11} className="animate-spin" />Processing…</>
              : <><Sparkles size={11} />Generate Captions</>}
          </button>
          <p className="text-[10px] text-center" style={{ color: 'var(--text-tertiary)', opacity: 0.6 }}>
            Large videos may take 20–40s
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
              {captions.length} captions
            </span>
            <button onClick={generate} style={{ background: 'none', border: 'none', color: 'var(--turquoise)', cursor: 'pointer' }}>
              <RefreshCw size={11} />
            </button>
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {captions.map((c, i) => (
              <div key={i} className="flex gap-2 items-start px-2 py-1.5 rounded-lg"
                style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-subtle)' }}>
                <span className="text-[10px] font-mono shrink-0 mt-0.5 font-bold" style={{ color: 'var(--turquoise)', minWidth: '36px' }}>
                  {c.time}
                </span>
                <span className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Scene Detect ──────────────────────────────────────────────────────────────

function SceneDetect({ projectId, scenes, onScenesUpdate }: {
  projectId: string; scenes: Scene[]; onScenesUpdate: (s: Scene[]) => void
}) {
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')

  const detect = async () => {
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/ai/scenes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body:   JSON.stringify({ projectId }),
      })
      const data = await res.json()
      if (data.scenes) { onScenesUpdate(data.scenes); setDone(true) }
      else setError(data.error ?? 'Failed')
    } catch { setError('Connection error') }
    finally  { setLoading(false) }
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'var(--turquoise-8)', border: '1px solid var(--turquoise-22)' }}>
          <Scissors size={18} style={{ color: 'var(--turquoise)' }} strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>Scene Detection</p>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
            Gemini analyzes your project brief and generates an optimized scene breakdown.
          </p>
        </div>
        {done  && <p className="text-[11px] text-green-400 font-semibold">✓ {scenes.length} scenes generated</p>}
        {error && <p className="text-[11px] text-red-400">{error}</p>}
        <button onClick={detect} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-opacity"
          style={{ backgroundColor: 'var(--turquoise)', color: '#fff', border: 'none', cursor: loading ? 'wait' : 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          {loading
            ? <><Loader2 size={11} className="animate-spin" />Detecting…</>
            : <><Wand2 size={11} />{done ? 'Re-detect' : 'Detect Scenes'}</>}
        </button>
      </div>
      {scenes.length > 0 && (
        <div className="space-y-1.5">
          {scenes.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
              style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-subtle)' }}>
              <span className="text-[10px] font-bold w-5 text-center rounded-md py-0.5"
                style={{ backgroundColor: 'var(--turquoise-8)', color: 'var(--turquoise)' }}>{i + 1}</span>
              <span className="text-[11px] font-semibold truncate flex-1" style={{ color: 'var(--text-secondary)' }}>{s.title}</span>
              <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>{s.duration}s</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Script to Edit ────────────────────────────────────────────────────────────

function ScriptToEdit({ projectId, onScenesUpdate }: { projectId: string; onScenesUpdate: (s: Scene[]) => void }) {
  const [script,  setScript]  = useState('')
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState('')
  const [error,   setError]   = useState('')

  const generate = async () => {
    if (!script.trim()) return
    setLoading(true); setError(''); setResult('')
    try {
      const res  = await fetch('/api/ai/script-to-edit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body:   JSON.stringify({ projectId, script }),
      })
      const data = await res.json()
      if (data.scenes) { onScenesUpdate(data.scenes); setResult(`Generated ${data.scenes.length} scenes!`) }
      else setError(data.error ?? 'Failed')
    } catch { setError('Connection error') }
    finally  { setLoading(false) }
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center gap-2">
        <FileText size={14} style={{ color: 'var(--turquoise)' }} strokeWidth={1.75} />
        <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>Script → Edit Plan</span>
      </div>
      <p className="text-[11px]" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
        Paste a script and Gemini will create a full scene-by-scene edit plan with timings and music moods.
      </p>
      <textarea value={script} onChange={e => setScript(e.target.value.slice(0, 2000))} rows={6}
        placeholder="Scene 1: Open with a close-up of the product on a dark surface…"
        className="w-full resize-none text-xs rounded-xl p-3 outline-none"
        style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text)', lineHeight: 1.6 }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'} />
      <div className="flex items-center justify-between">
        <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{script.length}/2000</span>
        <button onClick={generate} disabled={!script.trim() || loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity"
          style={{
            backgroundColor: script.trim() ? 'var(--turquoise)' : 'var(--surface-raised)',
            border: `1px solid ${script.trim() ? 'transparent' : 'var(--border-default)'}`,
            color: script.trim() ? '#fff' : 'var(--text-tertiary)',
            cursor: script.trim() && !loading ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={e => { if (script.trim()) e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          {loading ? <><Loader2 size={10} className="animate-spin" />Generating…</> : <><Sparkles size={10} />Generate Plan</>}
        </button>
      </div>
      {result && <p className="text-[11px] text-green-400 font-semibold">{result}</p>}
      {error  && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  )
}

// ── Main Sidebar ──────────────────────────────────────────────────────────────

const TABS: { id: AiTab; icon: React.ElementType; label: string }[] = [
  { id: 'chat',     icon: MessageSquare, label: 'Chat'     },
  { id: 'captions', icon: Captions,      label: 'Captions' },
  { id: 'scenes',   icon: Scissors,      label: 'Scenes'   },
  { id: 'script',   icon: FileText,      label: 'Script'   },
]

export default function GeminiSidebar({
  projectId, projectName, prompt, scenes, videoUrl, onScenesUpdate,
}: GeminiSidebarProps) {
  const [activeTab, setActiveTab] = useState<AiTab>('chat')

  return (
    <div className="flex flex-col shrink-0"
      style={{ width: '280px', backgroundColor: 'var(--bg)', borderLeft: '1px solid var(--border-default)' }}>

      {/* Header */}
      <div className="flex items-center gap-2 px-3 shrink-0"
        style={{ height: '44px', borderBottom: '1px solid var(--border-default)' }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--turquoise-8)', border: '1px solid var(--turquoise-22)' }}>
          <Sparkles size={12} style={{ color: 'var(--turquoise)' }} />
        </div>
        <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>Gemini AI</span>
        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md"
          style={{ backgroundColor: 'var(--turquoise-8)', color: 'var(--turquoise)', border: '1px solid var(--turquoise-22)' }}>
          1.5 Pro
        </span>
      </div>

      {/* Tabs */}
      <div className="flex shrink-0" style={{ borderBottom: '1px solid var(--border-default)' }}>
        {TABS.map(({ id, icon: Icon, label }) => {
          const active = activeTab === id
          return (
            <button key={id} onClick={() => setActiveTab(id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors"
              style={{
                background: 'none', border: 'none',
                borderBottom: active ? '2px solid var(--turquoise)' : '2px solid transparent',
                cursor: 'pointer',
              }}>
              <Icon size={12} style={{ color: active ? 'var(--turquoise)' : 'var(--text-tertiary)' }} strokeWidth={active ? 2 : 1.75} />
              <span className="text-[9px] font-bold" style={{ color: active ? 'var(--turquoise)' : 'var(--text-tertiary)' }}>{label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeTab === 'chat'     && <AiChat       projectName={projectName} prompt={prompt} scenes={scenes} />}
        {activeTab === 'captions' && <AutoCaptions  projectId={projectId} videoUrl={videoUrl} />}
        {activeTab === 'scenes'   && <SceneDetect   projectId={projectId} scenes={scenes} onScenesUpdate={onScenesUpdate} />}
        {activeTab === 'script'   && <ScriptToEdit  projectId={projectId} onScenesUpdate={onScenesUpdate} />}
      </div>
    </div>
  )
}