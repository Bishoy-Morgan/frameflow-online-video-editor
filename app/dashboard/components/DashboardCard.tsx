'use client'

import React from 'react'
import Link from 'next/link'
import { Clock, MoreHorizontal, Play } from 'lucide-react'
import Image from 'next/image'

export interface Project {
    id:          string
    name:        string
    lastEdited:  string
    thumbnail?:  string   // optional — falls back to placeholder
}

interface DashboardCardProps {
    project: Project
}

export default function DashboardCard({ project }: DashboardCardProps) {
    return (
        <Link
            href={`/dashboard/projects/${project.id}`}
            style={{ textDecoration: 'none' }}
            className="group flex flex-col rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1), 0 0 0 1px var(--turquoise-22)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 0 1px var(--border-default)'
            }}
            // style2={{ boxShadow: '0 0 0 1px var(--border-default)' }}
        >
            {/* Thumbnail */}
            <div
                className="relative w-full aspect-video overflow-hidden"
                style={{ backgroundColor: 'var(--surface-raised)' }}
            >
                {project.thumbnail ? (
                    <Image
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    // Placeholder — turquoise gradient with play icon
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, var(--turquoise-10) 0%, var(--turquoise-22) 100%)' }}
                    >
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                            style={{
                                backgroundColor: 'var(--turquoise-22)',
                                border: '1px solid var(--turquoise-40)',
                            }}
                        >
                            <Play size={16} strokeWidth={0} fill="var(--turquoise)" style={{ marginLeft: 2 }} />
                        </div>
                    </div>
                )}

                {/* Hover overlay */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(2,2,2,0.3)' }}
                >
                    <span className="text-[0.7rem] font-bold tracking-widest uppercase text-white">
                        Open
                    </span>
                </div>

                {/* More button */}
                <button
                    onClick={e => { e.preventDefault(); e.stopPropagation() }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer focus:outline-none"
                    style={{
                        backgroundColor: 'rgba(2,2,2,0.5)',
                        backdropFilter: 'blur(4px)',
                        border: 'none',
                        color: '#fefefe',
                    }}
                >
                    <MoreHorizontal size={13} />
                </button>
            </div>

            {/* Info */}
            <div
                className="flex flex-col gap-1 px-4 py-3"
                style={{
                    backgroundColor: 'var(--bg)',
                    borderTop: '1px solid var(--border-subtle)',
                }}
            >
                <span
                    className="text-sm font-bold truncate transition-colors duration-150"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    {project.name}
                </span>
                <div className="flex items-center gap-1.5">
                    <Clock size={11} strokeWidth={1.75} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-[0.68rem] font-medium text-tertiary">{project.lastEdited}</span>
                </div>
            </div>
        </Link>
    )
}