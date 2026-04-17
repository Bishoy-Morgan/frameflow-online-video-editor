'use client'

import React, { useEffect, useRef } from 'react'
import SectionGrid from '@/components/ui/SectionGrid'
import { SectionLabel } from '@/app/features/components/FeaturesHero'


const CoreCapabilities = () => {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const seq = [
      { el: titleRef.current, delay: 0 },
      { el: textRef.current, delay: 120 },
      { el: gridRef.current, delay: 260 },
    ]

    seq.forEach(({ el, delay }) => {
      if (!el) return
      el.style.opacity = '0'
      el.style.transform = 'translateY(18px)'
      setTimeout(() => {
        el.style.transition = 'opacity 0.65s ease, transform 0.65s ease'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, delay)
    })
  }, [])

  return (
    <section className="relative w-full overflow-hidden py-40 surface">

      {/* Grid */}
      <div className="opacity-70">
        <SectionGrid />
      </div>

      {/* Bottom fade */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 surface" />

      {/* Glow (LEFT again for rhythm reset) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[35%] left-[15%] w-[550px] h-[550px] rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--turquoise-12) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Top separator */}
      <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

      <div className="container relative z-10 max-w-[1100px]">

        <SectionLabel>CAPABILITIES</SectionLabel>

        {/* Headline */}
        <h2
          ref={titleRef}
          className="mb-6"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
        >
          Everything you need —{' '}
          <span className="italic text-turquoise">nothing you don’t</span>.
        </h2>

        {/* Description */}
        <p
          ref={textRef}
          className="text-lg leading-[1.75] text-muted-62 mb-16 max-w-[720px]"
        >
          Frameflow focuses on essential editing capabilities, refined for speed
          and clarity. Each feature is designed to reduce friction and keep you
          moving.
        </p>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[
            {
              title: 'Timeline editing',
              desc: 'A structured timeline designed for intuitive control and fast iteration.',
            },
            {
              title: 'Instant feedback',
              desc: 'Preview edits in real time without delays or rendering interruptions.',
            },
            {
              title: 'High-quality export',
              desc: 'Export your videos in up to 4K resolution with optimized performance.',
            },
            {
              title: 'Lightweight workflow',
              desc: 'No heavy installations — everything runs efficiently in your browser.',
            },
            {
              title: 'Focused UI',
              desc: 'A clean interface that prioritizes clarity over complexity.',
            },
            {
              title: 'Scalable performance',
              desc: 'Built to handle demanding workflows while staying responsive.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group relative p-6 rounded-2xl border border-muted-10 bg-white/2 backdrop-blur-sm transition-all duration-300 hover:border-turquoise/30 hover:bg-white/[0.04]"
            >
              <h3 className="text-lg font-normal mb-2 tracking-tight">
                {item.title}
              </h3>
              <p className="text-muted-48 leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default CoreCapabilities