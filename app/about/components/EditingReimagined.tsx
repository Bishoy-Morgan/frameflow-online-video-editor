'use client'

import React, { useEffect, useRef } from 'react'
import SectionGrid from '@/components/ui/SectionGrid'
import { SectionLabel } from '@/app/features/components/FeaturesHero'



const EditingReimagined = () => {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const blocksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const seq = [
      { el: titleRef.current, delay: 0 },
      { el: textRef.current, delay: 120 },
      { el: blocksRef.current, delay: 250 },
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

      {/* Glow (RIGHT) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[45%] right-[15%] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--turquoise-14) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Top separator */}
      <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

      <div className="container relative z-10 max-w-[1000px]">

        <SectionLabel>THE SHIFT</SectionLabel>

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
          So we built something{' '}
          <span className="italic text-turquoise">different</span>.
        </h2>

        {/* Description */}
        <p
          ref={textRef}
          className="text-lg leading-[1.75] text-muted-62 mb-16 max-w-[720px]"
        >
          Frameflow focuses on what actually matters — speed, simplicity, and
          real-time interaction. No installs. No bloated workflows. Just a
          streamlined editing experience that works instantly in your browser.
        </p>

        {/* Feature Blocks */}
        <div ref={blocksRef} className="grid gap-10 md:grid-cols-2">
          {[
            {
              title: 'Real-time editing',
              desc: 'See every change instantly with a responsive timeline designed for speed.',
            },
            {
              title: 'Browser-native',
              desc: 'No downloads or setup — start editing directly in your browser.',
            },
            {
              title: 'Focused interface',
              desc: 'A clean UI that removes distractions and keeps you in control.',
            },
            {
              title: 'Built for performance',
              desc: 'Optimized to deliver smooth playback and fast workflows at scale.',
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              <h3 className="text-xl font-normal tracking-tight">
                {item.title}
              </h3>
              <p className="text-muted-48 leading-relaxed max-w-[420px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default EditingReimagined