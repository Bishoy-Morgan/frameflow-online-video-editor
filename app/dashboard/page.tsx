'use client'

import React, { useState, useEffect } from 'react'
import {
    FolderPlus, Upload, FolderOpen, Clock,
    Sparkles, ArrowRight, Wand2, Film,
    Monitor, Smartphone, Square,
    Clapperboard, Zap, Megaphone, BookOpen,
} from 'lucide-react'
import DashboardHeader from './components/DashboardHeader'
import DashboardCard, { Project } from './components/DashboardCard'
import StatsCard from './components/StatsCard'
import Link from 'next/link'

type AspectRatio = '9:16' | '16:9' | '1:1'
type Duration    = '15s' | '30s' | '60s'
type Style       = 'Cinematic' | 'Viral' | 'Minimal' | 'Bold'


const recentProjects: Project[] = [
    { id: '1', name: 'Product Demo v3',    lastEdited: '2 hours ago' },
    { id: '2', name: 'Q4 Social Campaign', lastEdited: 'Yesterday'   },
    { id: '3', name: 'Onboarding Flow',    lastEdited: '3 days ago'  },
    { id: '4', name: 'Brand Reel 2025',    lastEdited: 'Last week'   },
]

const STYLES: { label: Style; icon: React.ElementType }[] = [
    { label: 'Cinematic', icon: Film      },
    { label: 'Viral',     icon: Zap       },
    { label: 'Minimal',   icon: Square    },
    { label: 'Bold',      icon: Megaphone },
]

const RATIOS: { label: AspectRatio; icon: React.ElementType; hint: string }[] = [
    { label: '9:16', icon: Smartphone, hint: 'Reels / TikTok' },
    { label: '16:9', icon: Monitor,    hint: 'YouTube / Web'  },
    { label: '1:1',  icon: Square,     hint: 'Feed / Square'  },
]

const DURATIONS: Duration[] = ['15s', '30s', '60s']

const EXAMPLE_PROMPTS = [
    'A cinematic product reveal for a luxury watch brand with slow motion and dramatic lighting',
    'A fast-paced viral reel showing a morning routine with trending transitions',
    'A minimal brand story for a sustainable fashion label, quiet and emotional',
    'An energetic promo for a fitness app launch with bold text and beats',
    'A dreamy travel montage through Tokyo streets at golden hour',
]

const templates = [
    { label: 'Product Reveal',  icon: Clapperboard, desc: 'Clean unboxing or launch',  accent: false },
    { label: 'Viral Reel',      icon: Zap,          desc: 'Hook in 3s, keep watching', accent: true  },
    { label: 'Brand Story',     icon: BookOpen,     desc: 'Who you are, why you exist', accent: false },
    { label: 'Tutorial',        icon: Film,         desc: 'Step-by-step demo',          accent: false },
]

const quickActions = [
    { label: 'New Project',    sub: 'Start from scratch', icon: FolderPlus, accent: true,  onClick: () => {} },
    { label: 'Upload Footage', sub: 'Import your files',  icon: Upload,     accent: false, onClick: () => {} },
]


function useTypewriter(texts: string[], speed = 36, pause = 2400) {
    const [textIdx,  setTextIdx]  = useState(0)
    const [charIdx,  setCharIdx]  = useState(0)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const current = texts[textIdx]
        let t: ReturnType<typeof setTimeout>

        if (!deleting && charIdx < current.length) {
            t = setTimeout(() => setCharIdx(i => i + 1), speed)
        } else if (!deleting && charIdx === current.length) {
            t = setTimeout(() => setDeleting(true), pause)
        } else if (deleting && charIdx > 0) {
            t = setTimeout(() => setCharIdx(i => i - 1), speed / 2.2)
        } else if (deleting && charIdx === 0) {
            t = setTimeout(() => {
                setDeleting(false)
                setTextIdx(i => (i + 1) % texts.length)
            }, 300)
        }

        return () => clearTimeout(t)
    }, [charIdx, deleting, textIdx, texts, speed, pause])

    return texts[textIdx].slice(0, charIdx)
}

// Pill button (reusable option toggle)

function Pill({
    active,
    onClick,
    children,
}: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{
                backgroundColor: active ? 'var(--turquoise-8)'    : 'var(--bg)',
                border:          active ? '1px solid var(--turquoise-42)' : '1px solid var(--border-subtle)',
                color:           active ? 'var(--turquoise)'       : 'var(--text-tertiary)',
            }}
            onMouseEnter={e => {
                if (!active) {
                    e.currentTarget.style.borderColor = 'var(--border-default)'
                    e.currentTarget.style.color = 'var(--text)'
                }
            }}
            onMouseLeave={e => {
                if (!active) {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'
                    e.currentTarget.style.color = 'var(--text-tertiary)'
                }
            }}
        >
            {children}
        </button>
    )
}

// AI Hero

function AIHero() {
    const [prompt,     setPrompt]     = useState('')
    const [style,      setStyle]      = useState<Style>('Cinematic')
    const [ratio,      setRatio]      = useState<AspectRatio>('9:16')
    const [duration,   setDuration]   = useState<Duration>('30s')
    const [generating, setGenerating] = useState(false)
    const [focused,    setFocused]    = useState(false)

    const placeholder = useTypewriter(EXAMPLE_PROMPTS)

    const handleGenerate = () => {
        if (!prompt.trim()) return

        const params = new URLSearchParams({
            prompt,
            style,
            aspectRatio: ratio,
            duration,
        })

        window.open(`/generate?${params.toString()}`, '_blank')
    }

    return (
        <div
            className="relative rounded-2xl overflow-hidden"
            style={{
                background: 'linear-gradient(160deg, var(--surface-raised) 0%, var(--bg) 100%)',
                border: `1px solid ${focused ? 'var(--turquoise-42)' : 'var(--border-default)'}`,
                boxShadow: focused ? '0 0 0 3px var(--turquoise-8), 0 16px 48px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.04)',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
            }}
        >
            {/* Top glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-40"
                style={{
                    background: 'radial-gradient(ellipse 90% 100% at 50% 0%, var(--turquoise-10) 0%, transparent 100%)',
                }}
            />

            {/* Dot grid */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(circle, var(--turquoise-22) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    opacity: 0.35,
                    maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)',
                }}
            />

            <div className="relative flex flex-col gap-6 px-8 pt-8 pb-7">

                {/* Heading */}
                <div className="flex flex-col items-center text-center gap-3">

                    <h1
                        className="font-bold leading-tight"
                        style={{
                            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                            color: 'var(--text)',
                            fontFamily: 'var(--font-dm-serif-display), serif',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        What video do you want{' '}
                        <span
                            style={{
                                color: 'var(--turquoise)',
                                textShadow: '0 0 32px var(--turquoise-42)',
                            }}
                        >
                            to create?
                        </span>
                    </h1>

                    <p className="text-sm max-w-md" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                        Describe your idea in plain words — AI will generate a ready-to-edit video project in seconds.
                    </p>
                </div>

                {/* Prompt input */}
                <div className="max-w-2xl w-full mx-auto flex flex-col gap-0">
                    <div
                        className="relative rounded-xl overflow-hidden"
                        style={{
                            backgroundColor: 'var(--bg)',
                            border: '1px solid var(--border-default)',
                        }}
                    >
                        <textarea
                            value={prompt}
                            onChange={e => setPrompt(e.target.value.slice(0, 500))}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            rows={3}
                            className="w-full resize-none px-5 pt-4 pb-14 text-sm outline-none"
                            style={{
                                backgroundColor: 'transparent',
                                color: 'var(--text)',
                                lineHeight: '1.7',
                            }}
                            placeholder={placeholder + (focused ? '' : '|')}
                        />

                        {/* Inner bottom bar */}
                        <div
                            className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2.5"
                            style={{
                                backgroundColor: 'var(--surface-raised)',
                                borderTop: '1px solid var(--border-subtle)',
                            }}
                        >
                            <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                                {prompt.length > 0
                                    ? `${prompt.length} / 500`
                                    : 'Be as descriptive as possible for best results'}
                            </span>

                            <button
                                onClick={handleGenerate}
                                disabled={!prompt.trim() || generating}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                                style={{
                                    backgroundColor: prompt.trim() && !generating ? 'var(--turquoise)' : 'var(--surface-raised)',
                                    color: prompt.trim() && !generating ? '#fff' : 'var(--text-tertiary)',
                                    border: `1px solid ${prompt.trim() && !generating ? 'transparent' : 'var(--border-default)'}`,
                                    cursor: prompt.trim() && !generating ? 'pointer' : 'not-allowed',
                                    boxShadow: prompt.trim() && !generating ? '0 4px 12px var(--turquoise-22)' : 'none',
                                }}
                                onMouseEnter={e => { if (prompt.trim() && !generating) e.currentTarget.style.opacity = '0.88' }}
                                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                            >
                                {generating ? (
                                    <>
                                        <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Generating…
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={12} strokeWidth={2.5} />
                                        Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div className="flex flex-wrap justify-center gap-8">

                    <div className="flex flex-col gap-2 items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                            Style
                        </span>
                        <div className="flex gap-1.5">
                            {STYLES.map(({ label, icon: Icon }) => (
                                <Pill key={label} active={style === label} onClick={() => setStyle(label)}>
                                    <Icon size={11} strokeWidth={2} />
                                    {label}
                                </Pill>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                            Format
                        </span>
                        <div className="flex gap-1.5">
                            {RATIOS.map(({ label, icon: Icon, hint }) => (
                                <Pill key={label} active={ratio === label} onClick={() => setRatio(label)}>
                                    <Icon size={11} strokeWidth={2} />
                                    <span title={hint}>{label}</span>
                                </Pill>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                            Duration
                        </span>
                        <div className="flex gap-1.5">
                            {DURATIONS.map(d => (
                                <Pill key={d} active={duration === d} onClick={() => setDuration(d)}>
                                    {d}
                                </Pill>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

// Dashboard Page

export default function DashboardPage() {
    return (
        <div className="relative flex flex-col flex-1 min-h-0 overflow-auto">

            <DashboardHeader title="Overview" subtitle="Welcome back" />

            <main className="flex-1 p-8 flex flex-col gap-10">

                {/* 1 ── AI Hero */}
                <AIHero />

                {/* 2 ── Templates */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-5 h-px bg-turquoise" />
                        <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-turquoise">
                            Start from a Template
                        </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {templates.map(({ label, icon: Icon, desc, accent }) => (
                            <button
                                key={label}
                                className="flex flex-col items-start gap-3 p-4 rounded-xl text-left transition-all duration-200 group"
                                style={{
                                    backgroundColor: accent ? 'var(--turquoise-8)' : 'var(--surface-raised)',
                                    border: `1px solid ${accent ? 'var(--turquoise-22)' : 'var(--border-default)'}`,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = accent ? 'var(--turquoise-42)' : 'var(--border-strong)'
                                    e.currentTarget.style.transform = 'translateY(-1px)'
                                    e.currentTarget.style.boxShadow = accent ? '0 8px 24px var(--turquoise-10)' : '0 8px 24px rgba(0,0,0,0.06)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = accent ? 'var(--turquoise-22)' : 'var(--border-default)'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{
                                        backgroundColor: accent ? 'var(--turquoise-16)' : 'var(--bg)',
                                        border: `1px solid ${accent ? 'var(--turquoise-32)' : 'var(--border-default)'}`,
                                        color: accent ? 'var(--turquoise)' : 'var(--text-tertiary)',
                                    }}
                                >
                                    <Icon size={15} strokeWidth={1.75} />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-bold" style={{ color: accent ? 'var(--turquoise)' : 'var(--text-secondary)' }}>
                                        {label}
                                    </span>
                                    <span className="text-[11px] font-medium leading-snug" style={{ color: 'var(--text-tertiary)' }}>
                                        {desc}
                                    </span>
                                </div>
                                <ArrowRight
                                    size={12}
                                    className="mt-auto self-end opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ color: accent ? 'var(--turquoise)' : 'var(--text-tertiary)' }}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3 ── Recent projects */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-px bg-turquoise" />
                            <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-turquoise">
                                Recent Projects
                            </span>
                        </div>
                        <Link
                            href="/dashboard/projects"
                            className="text-xs font-bold transition-colors duration-150"
                            style={{ textDecoration: 'none', color: 'var(--text-tertiary)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {recentProjects.map(p => (
                            <DashboardCard key={p.id} project={p} />
                        ))}
                    </div>
                </div>

                {/* 4 ── Quick actions */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-5 h-px bg-turquoise" />
                        <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-turquoise">
                            Quick Actions
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {quickActions.map(({ label, sub, icon: Icon, accent, onClick }) => (
                            <button
                                key={label}
                                onClick={onClick}
                                className="flex items-center gap-4 px-5 py-4 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none"
                                style={{
                                    backgroundColor: accent ? 'var(--turquoise-8)' : 'var(--surface-raised)',
                                    border: `1px solid ${accent ? 'var(--turquoise-22)' : 'var(--border-default)'}`,
                                    minWidth: 200,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = accent ? 'var(--turquoise-42)' : 'var(--border-strong)'
                                    e.currentTarget.style.transform = 'translateY(-1px)'
                                    e.currentTarget.style.boxShadow = accent ? '0 8px 24px var(--turquoise-10)' : '0 8px 24px rgba(0,0,0,0.06)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = accent ? 'var(--turquoise-22)' : 'var(--border-default)'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                    style={{
                                        backgroundColor: accent ? 'var(--turquoise-16)' : 'var(--bg)',
                                        border: `1px solid ${accent ? 'var(--turquoise-32)' : 'var(--border-default)'}`,
                                        color: accent ? 'var(--turquoise)' : 'var(--text-tertiary)',
                                    }}
                                >
                                    <Icon size={16} strokeWidth={1.75} />
                                </div>
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="text-sm font-bold" style={{ color: accent ? 'var(--turquoise)' : 'var(--text-secondary)' }}>
                                        {label}
                                    </span>
                                    <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{sub}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 5 ── Stats summary at bottom */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-5 h-px bg-turquoise" />
                        <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-turquoise">
                            Your Activity
                        </span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard label="Total Projects" value={12}    sub="2 this month"  icon={FolderOpen} accent />
                        <StatsCard label="Hours Edited"   value="38h"   sub="Last 30 days"  icon={Clock}      />
                        <StatsCard label="Exports"        value={24}    sub="MP4, MOV, GIF" icon={Upload}     />
                        <StatsCard label="Storage Used"   value="4.2G"  sub="of 10GB free"  icon={FolderOpen} />
                    </div>
                </div>

            </main>
        </div>
    )
}