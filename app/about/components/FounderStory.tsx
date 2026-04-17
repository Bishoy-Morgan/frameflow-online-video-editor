'use client'

import React, { useEffect, useRef } from 'react'
import SectionGrid from '@/components/ui/SectionGrid'
import { SectionLabel } from '@/app/features/components/FeaturesHero'


const FounderStory = () => {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const seq = [
      { el: titleRef.current, delay: 0 },
      { el: textRef.current, delay: 160 },
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 surface"
      />

      {/* Glow (RIGHT - softer, more subtle) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[40%] right-[18%] w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--turquoise-10) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Top separator */}
      <div
        aria-hidden
        className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise"
      />

      <div className="container relative z-10 max-w-[1100px]">

        <SectionLabel>BEHIND THE PRODUCT</SectionLabel>

        <div className="grid gap-12 md:grid-cols-2 items-start">

          {/* Left: Headline */}
          <h2
            ref={titleRef}
            className="font-normal"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            Built from frustration —{' '}
            <span className="italic text-turquoise">refined</span>{' '}
            through experience.
          </h2>

          {/* Right: Story */}
          <div
            ref={textRef}
            className="flex flex-col gap-6 text-muted-60 leading-relaxed"
          >
            <p>
              Frameflow started as a simple idea — video editing on the web
              should be faster, simpler, and more intuitive than what exists today.
            </p>

            <p>
              Most tools felt heavy, overly complex, or disconnected from how
              modern applications should perform. Instead of improving workflows,
              they often slowed them down.
            </p>

            <p>
              So this became an attempt to rethink the experience — focusing on
              real-time interaction, clean interfaces, and a system that stays out
              of the way.
            </p>

            <p className="text-muted-40 text-sm">
              Built with a focus on performance, clarity, and modern web standards.
            </p>
          </div>

        </div>

      </div>
    </section>
  )
}

export default FounderStory