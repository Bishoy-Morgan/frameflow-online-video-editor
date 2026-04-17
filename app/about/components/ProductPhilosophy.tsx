'use client'

import React, { useEffect, useRef } from 'react'
import SectionGrid from '@/components/ui/SectionGrid'

const ProductPhilosophy = () => {
  const labelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const seq = [
      { el: labelRef.current, delay: 0 },
      { el: titleRef.current, delay: 120 },
      { el: textRef.current, delay: 260 },
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

      {/* Center Glow (stronger focus) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--turquoise-16) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Top separator */}
      <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

      <div className="container relative z-10 flex flex-col items-center text-center max-w-[800px] gap-8">

        {/* Label */}
        <div ref={labelRef} className="flex items-center gap-3">
          <div className="w-7 h-px bg-turquoise" />
          <span className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-turquoise">
            OUR PHILOSOPHY
          </span>
        </div>

        {/* Headline */}
        <h2
          ref={titleRef}
          className="font-normal m-0"
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
        >
          Tools should feel{' '}
          <span className="italic text-turquoise">invisible</span>{' '}
          — not overwhelming.
        </h2>

        {/* Text */}
        <p
          ref={textRef}
          className="text-lg leading-relaxed text-muted-60 max-w-[520px]"
        >
          Editing should be fast, intuitive, and distraction-free.  
          Every interaction should feel immediate. Every decision should feel clear.  
          The tool should stay out of the way — so creativity can flow.
        </p>

      </div>
    </section>
  )
}

export default ProductPhilosophy