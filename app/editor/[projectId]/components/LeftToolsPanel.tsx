'use client'

import React from 'react'
import {
  Scissors, Type, Music2, Image, Wand2,
  SlidersHorizontal, Layers,
} from 'lucide-react'

export type ToolId = 'trim' | 'text' | 'audio' | 'media' | 'effects' | 'adjust' | 'layers'

interface Tool {
  id:    ToolId
  icon:  React.ElementType
  label: string
}

const TOOLS: Tool[] = [
  { id: 'trim',    icon: Scissors,          label: 'Trim'    },
  { id: 'text',    icon: Type,              label: 'Text'    },
  { id: 'audio',   icon: Music2,            label: 'Audio'   },
  { id: 'media',   icon: Image,             label: 'Media'   },
  { id: 'effects', icon: Wand2,             label: 'Effects' },
  { id: 'adjust',  icon: SlidersHorizontal, label: 'Adjust'  },
  { id: 'layers',  icon: Layers,            label: 'Layers'  },
]

interface LeftToolsPanelProps {
  activeTool:  ToolId | null
  onToolClick: (id: ToolId) => void
}

export default function LeftToolsPanel({ activeTool, onToolClick }: LeftToolsPanelProps) {
  return (
    <div
      className="flex flex-col items-center py-3 gap-1.5 shrink-0 overflow-x-hidden"
      style={{
        width:           '68px',       // wider: 52 → 68
        backgroundColor: 'var(--bg)',
        borderRight:     '1px solid var(--border-default)',
        overflowY:       'auto',
      }}
    >
      {TOOLS.map(({ id, icon: Icon, label }) => {
        const active = activeTool === id
        return (
          <button
            key={id}
            onClick={() => onToolClick(id)}
            title={label}
            className="relative flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-150 group"
            style={{
              width:           '52px',   // button: 40 → 52
              height:          '52px',   // button: 40 → 52
              backgroundColor: active ? 'var(--turquoise-8)' : 'transparent',
              border:          active ? '1px solid var(--turquoise-22)' : '1px solid transparent',
              cursor:          'pointer',
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.backgroundColor = 'var(--surface-raised)'
                e.currentTarget.style.borderColor     = 'var(--border-default)'
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor     = 'transparent'
              }
            }}
          >
            <Icon
              size={20}                  // icon: 15 → 20
              strokeWidth={active ? 2 : 1.75}
              style={{ color: active ? 'var(--turquoise)' : 'var(--text-tertiary)' }}
            />
            <span
              className="font-bold leading-none"
              style={{
                fontSize: '10px',        // label: 8px → 10px
                color:    active ? 'var(--turquoise)' : 'var(--text-tertiary)',
                opacity:  active ? 1 : 0.7,
              }}
            >
              {label}
            </span>

            {/* Tooltip */}
            <div
              className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
              style={{
                backgroundColor: 'var(--bg)',
                border:          '1px solid var(--border-default)',
                color:           'var(--text)',
                boxShadow:       '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              {label}
            </div>
          </button>
        )
      })}
    </div>
  )
}