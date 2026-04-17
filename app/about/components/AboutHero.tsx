'use client'

import React, { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import SectionGrid from '@/components/ui/SectionGrid'
import Button from '@/components/ui/Button'

const AboutHero = () => {
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const seq = [
      { el: h1Ref.current, delay: 0 },
      { el: subRef.current, delay: 120 },
      { el: ctaRef.current, delay: 250 },
      { el: statsRef.current, delay: 380 },
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
    <section className="relative w-full h-svh flex items-center overflow-hidden surface max-h-[1200px]">

      <SectionGrid />

      {/* Glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-turquoise-16"
        style={{ filter: 'blur(80px)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[5%] -left-[8%] w-[400px] h-[400px] rounded-full bg-turquoise-8"
        style={{ filter: 'blur(60px)' }}
      />

      <div className="container relative z-10 pt-64 pb-28">
        <div className="max-w-[820px]">

          {/* Headline */}
          <h1
            ref={h1Ref}
            className="font-normal mb-7"
            style={{
              fontSize: 'clamp(2.75rem, 6vw, 5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Editing video should feel{' '}
            <span className="relative inline-block italic text-turquoise">
              effortless
              <svg
                aria-hidden
                viewBox="0 0 220 12"
                fill="none"
                className="absolute left-0 w-full"
                style={{ bottom: '-6px', height: '10px' }}
              >
                <path
                  d="M2 8 C40 3, 80 10, 120 5 C160 1, 200 9, 218 6"
                  stroke="var(--turquoise)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.6"
                />
              </svg>
            </span>{' '}
            — not technical.
          </h1>

          {/* Sub */}
          <p
            ref={subRef}
            className="text-lg leading-[1.75] max-w-[580px] mb-11 text-muted-62"
          >
            Frameflow was built to rethink video editing on the web — removing
            unnecessary complexity and delivering a fast, real-time workflow
            directly in the browser.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">

            <Button variant="primary">
              Try Frameflow
            </Button>

            <Button
              variant="secondary"
              icon={<ArrowRight size={14} strokeWidth={2} />}
              iconPosition="right"
            >
              Why we built it
            </Button>

          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className="flex flex-wrap items-center gap-8 mt-16 pt-8 border-t border-muted-10"
          >
            {[
              { value: '< 2s', label: 'Load time' },
              { value: '60fps', label: 'Smooth playback' },
              { value: '4K', label: 'High-quality export' },
              { value: '100%', label: 'Runs in your browser' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-2xl font-normal leading-none text-turquoise">
                  {value}
                </span>
                <span className="text-[0.7rem] font-semibold tracking-[0.06em] uppercase text-muted-48">
                  {label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default AboutHero