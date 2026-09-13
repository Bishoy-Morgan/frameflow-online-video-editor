'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
    Sparkles, 
    MessageSquare, 
    Captions, 
    Scissors,
    FileText, 
    Loader2, 
    Send, 
    Copy, 
    CheckCheck,
    RefreshCw,
    MoveRight,
    WandSparkles,
} from 'lucide-react'
import Button from '@/components/ui/Button'

type AiTab = 'chat' | 'captions' | 'scenes' | 'script'

interface Scene {
    id: string; title: string; description: string
    musicMood: string; duration: number; order: number
}

interface Message { role: 'user' | 'assistant'; content: string }

interface AISidebarProps {
    projectId: string
    projectName: string
    prompt: string | null
    scenes: Scene[]
    videoUrl: string | null
    onScenesUpdate: (scenes: Scene[]) => void
}

function AiChat({ projectName, prompt, scenes }: { projectName: string; prompt: string | null; scenes: Scene[] }) {
    const [messages, setMessages] = useState<Message[]>([{
        role: 'assistant',
        content: `Hi! I'm your AI editor for **${projectName}**. I can help you improve scenes, suggest transitions, write scripts, or answer any editing question. What would you like to do?`,
    }])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState<number | null>(null)
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
                body: JSON.stringify({ messages: updated, context }),
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
        <div className="flex flex-col h-full min-h-0 ">
            <div className="flex-1 overflow-y-auto p-1 space-y-3 min-h-0">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col gap-1 shadow-accent-22 p-1.5 min-h-40 rounded-xl ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`relative max-w-4/5 p-2.5 rounded-xl text-small pr-6 group ${
                            msg.role === 'user'
                                ? 'bg-(accent-16) text-(--text)'
                                : 'bg-(--accent-8) text-(--ghost) '
                        }`}>
                            <span
                            dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} 
                            />
                            {msg.role === 'assistant' && (
                                <button
                                    onClick={() => { navigator.clipboard.writeText(msg.content); setCopied(i); setTimeout(() => setCopied(null), 2000) }}
                                    className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded bg-transparent border-0 cursor-pointer text-(--ghost) hover:text-(--accent) hover:bg-(--accent-10)">
                                    {copied === i ? <CheckCheck size={12} className="text-(--accent)" /> : <Copy size={12} />}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-start">
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-caption bg-raised border border-default text-tertiary">
                            <Loader2 size={10} className="animate-spin" /> Thinking…
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="px-3 py-2 flex gap-1.5 flex-wrap border-t border-subtle">
                {['Improve scene descriptions', 'Suggest transitions', 'Write a hook'].map(q => (
                    <button key={q} onClick={() => setInput(q)}
                        className="text-small font-semibold px-2.5 py-1 rounded-xl transition-colors bg-raised border border-default text-(--text) cursor-pointer hover:bg-(--accent-16) hover:border-(--accent-16) hover:shadow-md">
                        {q}
                    </button>
                ))}
            </div>

            <div className="px-3 pb-3 pt-2">
                <div className="flex items-end gap-2 rounded-xl p-4 shadow-accent-22 border-(--accent-40)">
                    <textarea 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                    placeholder="Ask anything about your video…" rows={2}
                    className="flex-1 resize-none text-caption font-medium outline-none bg-transparent text-(--text)" 
                    />
                    <button 
                    onClick={send} 
                    disabled={!input.trim() || loading}
                    className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                        input.trim() && !loading
                            ? 'bg-(--accent) border border-transparent cursor-pointer'
                            : 'bg-(--bg) border border-default cursor-not-allowed'
                    }`}
                    >
                        <Send size={18} className={input.trim() && !loading ? 'text-white' : 'text-(--tertiary)'} />
                    </button>
                </div>
            </div>
        </div>
    )
}

function AutoCaptions({ projectId, scenes }: { projectId: string; scenes: Scene[] }) {
    const [loading, setLoading] = useState(false)
    const [captions, setCaptions] = useState<{ time: string; text: string }[]>([])
    const [error, setError] = useState('')

    const generate = async () => {
        setLoading(true); setError('')
        try {
            const res  = await fetch('/api/ai/captions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, scenes }),
            })
            const data = await res.json()
            if (data.captions) setCaptions(data.captions)
            else setError(data.error ?? 'Failed to generate captions')
        } catch {
            setError('Connection error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-3 p-3">
            {captions.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-4">
                    <div className="p-2 rounded-xl flex items-center justify-center bg-(--accent-10) shadow-md">
                        <Captions size={28} strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                        <p className="text-caption font-semibold text-(--tertiary) ">Auto-Captions</p>
                        <p className="text-caption mt-0.5">
                            Groq generates timestamped captions from your scene descriptions and durations.
                        </p>
                    </div>
                    
                    {error && <p className="text-small text-(--error)">{error}</p>}
                    
                    <Button
                    variant="secondary"
                    size="sm"
                    onClick={generate} 
                    disabled={loading}
                    >
                        Generate Captions
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                            {captions.length} captions
                        </span>
                        <button onClick={generate} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
                            <RefreshCw size={11} />
                        </button>
                    </div>
                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                        {captions.map((c, i) => (
                            <div key={i} className="flex gap-2 items-start px-2 py-1.5 rounded-lg"
                                style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-subtle)' }}>
                                <span className="text-[10px] font-mono shrink-0 mt-0.5 font-bold" style={{ color: 'var(--accent)', minWidth: '36px' }}>
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

function SceneDetect({ projectId, scenes, onScenesUpdate }: {
    projectId: string; scenes: Scene[]; onScenesUpdate: (s: Scene[]) => void
}) {
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState('')

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
        finally { setLoading(false) }
    }

    return (
        <div className="flex flex-col gap-3 p-3">
            <div className="flex flex-col items-center gap-3 py-4">
                <div className="p-2 rounded-xl flex items-center justify-center bg-(--accent-10) shadow-md">
                    <Scissors size={28} strokeWidth={1.5} />
                </div>
                <div className="text-center">
                    <p className="text-caption font-semibold text-(--tertiary)">Scene Detection</p>
                    <p className="text-caption mt-0.5">
                        Groq analyzes your project brief and generates an optimized scene breakdown.
                    </p>
                </div>
                {done  && <p className="text-[11px] text-(--success) font-semibold">✓ {scenes.length} scenes generated</p>}
                {error && <p className="text-[11px] text-(--error)">{error}</p>}
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={detect} 
                    disabled={loading}
                    >
                        Detect Scenes
                    </Button>
            </div>
            {scenes.length > 0 && (
                <div className="space-y-1.5">
                    {scenes.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                            style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-subtle)' }}>
                            <span className="text-[10px] font-bold w-5 text-center rounded-md py-0.5"
                                style={{ backgroundColor: 'var(--accent-8)', color: 'var(--accent)' }}>{i + 1}</span>
                            <span className="text-[11px] font-semibold truncate flex-1" style={{ color: 'var(--text-secondary)' }}>{s.title}</span>
                            <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>{s.duration}s</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function ScriptToEdit({ projectId, onScenesUpdate }: { projectId: string; onScenesUpdate: (s: Scene[]) => void }) {
    const [script, setScript] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState('')
    const [error, setError] = useState('')

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
        finally   { setLoading(false) }
    }

    return (
        <div className="flex flex-col gap-3 p-3">
            <div className="flex items-center gap-2">
                <FileText size={20} strokeWidth={1.75} />
                <span className="text-caption font-semibold text-(--text)">
                    Script <MoveRight size={16} className="inline-block m-x-1.5"/> Edit Plan
                </span>
            </div>
            <p className="text-caption text-(--text) ">
                Paste a script and Groq will create a full scene-by-scene edit plan with timings and music moods.
            </p>
            <textarea value={script} onChange={e => setScript(e.target.value.slice(0, 2000))} rows={6}
                placeholder="Scene 1: Open with a close-up of the product on a dark surface…"
                className="w-full resize-none text-caption rounded-xl p-3 outline-none shadow-accent-22"/>
            <div className="flex items-center justify-between">
                <span className="text-small text-(--text)" >{script.length}/2000</span>
                <Button
                variant="secondary"
                size="sm"
                onClick={generate} 
                disabled={loading || !script.trim()}
                icon={loading ? <Loader2 size={12} className="animate-spin" /> : <WandSparkles size={20} />}
                >
                    Generate Plan
                </Button>
            </div>
            {result && <p className="text-[11px] text-(--success) font-semibold">{result}</p>}
            {error  && <p className="text-[11px] text-(--error)">{error}</p>}
        </div>
    )
}

const TABS: { id: AiTab; icon: React.ElementType; label: string }[] = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'captions', icon: Captions, label: 'Captions' },
    { id: 'scenes', icon: Scissors, label: 'Scenes' },
    { id: 'script', icon: FileText, label: 'Script' },
]

export default function AISidebar({
    projectId, projectName, prompt, scenes, onScenesUpdate,
}: AISidebarProps) {
    const [activeTab, setActiveTab] = useState<AiTab>('chat')

    return (
        <div className="flex flex-col h-full p-2 bg-(--bg)">

            <div className="flex items-center gap-2 px-3 shrink-0 border-b border-(--accent) p-2 ">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0">
                    <Sparkles size={18} className="text-(--accent)" />
                </div>
                <span className="text-caption font-semibold">
                    AI Assistant
                </span>
            </div>

            <div className="flex shrink-0 p-4 gap-x-3">
                {TABS.map(({ id, icon: Icon, label }) => {
                    const active = activeTab === id
                    return (
                        <button key={id} onClick={() => setActiveTab(id)}
                            className={`flex-1 flex flex-col items-center px-1 py-2 rounded-xl transition-all duration-150 cursor-pointer hover:bg-(--accent-10) hover:shadow-md 
                            ${active ? 'bg-(--accent-10) shadow-md' : ''}`}
                        >
                            <Icon 
                            size={22} 
                            className={active ? 'text-(--accent)' : 'text-(--text-tertiary)'} strokeWidth={active ? 2 : 1.75} 
                            />
                            <span 
                            className={`text-tiny font-semibold ${active ? 'text-(--accent)' : 'text-(--text-tertiary)'}`}
                            >
                                {label}
                            </span>
                        </button>
                    )
                })}
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
                {activeTab === 'chat' && <AiChat projectName={projectName} prompt={prompt} scenes={scenes} />}
                {activeTab === 'captions' && <AutoCaptions projectId={projectId} scenes={scenes} />}
                {activeTab === 'scenes' && <SceneDetect projectId={projectId} scenes={scenes} onScenesUpdate={onScenesUpdate} />}
                {activeTab === 'script' && <ScriptToEdit  projectId={projectId} onScenesUpdate={onScenesUpdate} />}
            </div>
        </div>
    )
}