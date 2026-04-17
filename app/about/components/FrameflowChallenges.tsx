'use client'

import React, { useEffect, useRef } from 'react'
import SectionGrid from '@/components/ui/SectionGrid'
import { SectionLabel } from '@/app/features/components/FeaturesHero'


const FrameflowChallenges = () => {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const pointsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const seq = [
      { el: titleRef.current, delay: 0 },
      { el: textRef.current, delay: 120 },
      { el: pointsRef.current, delay: 250 },
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

      {/* Glow (LEFT) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[40%] left-[20%] w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--turquoise-10) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Top separator */}
      <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

      <div className="container relative z-10 max-w-[900px]">

        <SectionLabel>THE PROBLEM</SectionLabel>

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
          Video editing is still too{' '}
          <span className="italic text-turquoise">complicated</span>{' '}
          for what it should be.
        </h2>

        {/* Description */}
        <p
          ref={textRef}
          className="text-lg leading-[1.75] text-muted-62 mb-12 max-w-[700px]"
        >
          Most tools are built with power in mind — not usability.  
          Complex interfaces, slow workflows, and heavy software create friction
          where there should be flow.
        </p>

        {/* Points */}
        <div ref={pointsRef} className="grid gap-6 sm:grid-cols-2">
          {[
            'Too many controls, not enough clarity',
            'Slow rendering and feedback loops',
            'Tools that interrupt creativity',
            'Overloaded interfaces that confuse more than help',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 text-muted-48">
              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-turquoise" />
              <p className="leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default FrameflowChallenges