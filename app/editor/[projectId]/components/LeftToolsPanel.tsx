'use client'

import React from 'react'
import {
  Type, Music2, Image, Wand2,
  SlidersHorizontal, Layers,
} from 'lucide-react'

export type ToolId = 'text' | 'audio' | 'media' | 'effects' | 'adjust' | 'layers'

interface Tool {
  id:    ToolId
  icon:  React.ElementType
  label: string
}

const TOOLS: Tool[] = [
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'audio', icon: Music2, label: 'Audio' },
  { id: 'media', icon: Image, label: 'Media' },
  { id: 'effects', icon: Wand2, label: 'Effects' },
  { id: 'adjust', icon: SlidersHorizontal, label: 'Adjust' },
  { id: 'layers', icon: Layers, label: 'Layers' },
]

interface LeftToolsPanelProps {
  activeTool:  ToolId | null
  onToolClick: (id: ToolId) => void
}

export default function LeftToolsPanel({ activeTool, onToolClick }: LeftToolsPanelProps) {
  return (
    <div
      className="flex w-full flex-col items-center shrink-0 overflow-x-hidden overflow-y-scroll scrollbar-hide shadow-accent-40 rounded-xl p-1.5 gap-y-1.5"
    >
      {TOOLS.map(({ id, icon: Icon, label }) => {
        const active = activeTool === id
        return (
          <button
            key={id}
            onClick={() => onToolClick(id)}
            title={label}
            className="relative flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-150 group w-12 h-12 cursor-pointer hover:bg-(--accent-8) hover:shadow-lg focus:bg-(--accent-10) focus:shadow-lg"
          >
            <Icon
              size={24}
              strokeWidth={active ? 2.25 : 1.75}
              className={`transition-all duration-150 ${active ? 'text-(--accent)' : 'text-(--tertiary)'}`}
            />
            <div
              className="absolute top-0 bg-black left-full ml-2 w-4 h-4 rounded-lg text-caption font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 "
            >
              {label}
            </div>
          </button>
        )
      })}
    </div>
  )
}