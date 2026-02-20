'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    label:   string
    value:   string | number
    sub?:    string
    icon:    LucideIcon
    accent?: boolean
}

export default function StatsCard({ label, value, sub, icon: Icon, accent }: StatsCardProps) {
    return (
        <div
            className="flex items-start justify-between p-5 rounded-xl"
            style={{
                backgroundColor: accent ? 'var(--turquoise-8)' : 'var(--surface-raised)',
                border: `1px solid ${accent ? 'var(--turquoise-22)' : 'var(--border-default)'}`,
            }}
        >
            <div className="flex flex-col gap-1.5">
                <span className="text-[0.68rem] font-bold tracking-widest uppercase text-tertiary">
                    {label}
                </span>
                <span
                    className="font-normal leading-none"
                    style={{
                        fontFamily: 'var(--font-dm-serif-display), serif',
                        fontSize: '2rem',
                        color: accent ? 'var(--turquoise)' : 'var(--text)',
                    }}
                >
                    {value}
                </span>
                {sub && (
                    <span className="text-xs text-tertiary font-medium">{sub}</span>
                )}
            </div>

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
        </div>
    )
}