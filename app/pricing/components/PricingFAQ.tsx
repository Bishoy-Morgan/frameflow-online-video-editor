'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import SectionGrid from '@/components/ui/SectionGrid'

const faqs = [
    {
        q: 'Can I use Frameflow for free?',
        a: 'Yes. The Free plan gives you access to core editing features with limited export capabilities. No credit card required.',
    },
    {
        q: 'Can I cancel anytime?',
        a: 'Yes. Paid plans can be canceled at any time — no questions, no penalties.',
    },
    {
        q: 'Do you offer team plans?',
        a: 'Yes. Team plans are designed for collaborative workflows and growing product teams. Contact us to discuss your setup.',
    },
    {
        q: 'Is my data secure?',
        a: 'Projects are stored securely with structured data handling and controlled access. Your source files are never modified.',
    },
]

// ── Single FAQ row ────────────────────────────────────────────────────────────
const FAQItem = ({ faq, index }: { faq: typeof faqs[0]; index: number }) => {
    const [open, setOpen] = useState(false)
    const bodyRef = useRef<HTMLDivElement>(null)
    const itemRef = useRef<HTMLDivElement>(null)

    // Entrance animation
    useEffect(() => {
        const el = itemRef.current
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateY(12px)'
        const t = setTimeout(() => {
            el.style.transition = 'opacity 0.45s ease, transform 0.45s ease'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
        }, 80 + index * 80)
        return () => clearTimeout(t)
    }, [index])

    return (
        <div
            ref={itemRef}
            className="transition-colors duration-200"
            style={{ borderBottom: '1px solid var(--border-default)' }}
        >
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer focus:outline-none group"
                style={{ background: 'none', border: 'none' }}
            >
                <span
                    className="text-[0.9375rem] font-semibold leading-snug transition-colors duration-200"
                    style={{ color: open ? 'var(--turquoise-fg)' : 'var(--text-secondary)' }}
                >
                    {faq.q}
                </span>

                {/* Plus / minus icon */}
                <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                        backgroundColor: open ? 'var(--turquoise-10)' : 'var(--border-subtle)',
                        border: `1px solid ${open ? 'var(--turquoise-22)' : 'var(--border-default)'}`,
                        transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                >
                    <Plus size={12} strokeWidth={2.5} color={open ? 'var(--turquoise-fg)' : 'var(--text-muted)'} />
                </span>
            </button>

            {/* Answer — animate height */}
            <div
                ref={bodyRef}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: open ? '200px' : '0', opacity: open ? 1 : 0 }}
            >
                <p className="m-0 pb-5 text-sm leading-relaxed text-tertiary pr-10">
                    {faq.a}
                </p>
            </div>
        </div>
    )
}

// ── Section ───────────────────────────────────────────────────────────────────
const PricingFAQ = () => {
    const headerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = headerRef.current
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateY(12px)'
        setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
        }, 60)
    }, [])

    return (
        <section className="relative w-full overflow-hidden py-28 surface">

            <SectionGrid />

            <div aria-hidden className="absolute top-0 left-[10%] right-[10%] h-px line-turquoise" />

            {/* Glow — top right */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-[10%] -right-[5%] w-[420px] h-[420px] rounded-full"
                style={{ background: 'radial-gradient(circle, var(--turquoise-8) 0%, transparent 70%)', filter: 'blur(72px)' }}
            />

            <div className="container relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">

                    {/* Left — label + headline */}
                    <div ref={headerRef} className="flex flex-col gap-4 lg:sticky lg:top-32">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-px bg-turquoise" />
                            <span className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-turquoise">
                                FAQ
                            </span>
                        </div>
                        <h2
                            className="font-normal leading-tight m-0"
                            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
                        >
                            Common questions.
                        </h2>
                        <p className="m-0 text-sm leading-relaxed text-tertiary">
                            Short answers. No padding.
                        </p>
                    </div>

                    {/* Right — FAQ list */}
                    <div
                        className="lg:col-span-2 flex flex-col"
                        style={{ borderTop: '1px solid var(--border-default)' }}
                    >
                        {faqs.map((faq, i) => (
                            <FAQItem key={faq.q} faq={faq} index={i} />
                        ))}
                    </div>

                </div>

            </div>
        </section>
    )
}

export default PricingFAQ