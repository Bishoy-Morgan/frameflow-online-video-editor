'use client'

import React, { useEffect, useRef } from 'react'
import { Check, Minus } from 'lucide-react'
import Button from '@/components/ui/Button'
import SectionGrid from '@/components/ui/SectionGrid'

// ── Plans data ────────────────────────────────────────────────────────────────
const plans = [
    {
        id:          'free',
        label:       'Free',
        price:       '$0',
        period:      'forever',
        description: 'For individuals exploring video editing in the browser.',
        features: [
            { text: 'Basic timeline editing',      available: true  },
            { text: 'Standard export quality',     available: true  },
            { text: 'Limited active projects',     available: true  },
            { text: 'Community support',           available: true  },
            { text: 'HD export',                   available: false },
            { text: 'Priority rendering',          available: false },
        ],
        cta:         'Start Free',
        ctaVariant:  'secondary' as const,
        highlighted: false,
        badge:       null,
    },
    {
        id:          'pro',
        label:       'Pro',
        price:       '$12',
        period:      'per month',
        description: 'For creators and professionals who need more flexibility.',
        features: [
            { text: 'Unlimited projects',          available: true },
            { text: 'HD export',                   available: true },
            { text: 'Priority rendering',          available: true },
            { text: 'Advanced export settings',    available: true },
            { text: 'Email support',               available: true },
            { text: 'Shared workspaces',           available: false },
        ],
        cta:         'Upgrade to Pro',
        ctaVariant:  'primary' as const,
        highlighted: true,
        badge:       'Most popular',
    },
    {
        id:          'team',
        label:       'Team',
        price:       'Custom',
        period:      'per workspace',
        description: 'For startups and growing teams.',
        features: [
            { text: 'Everything in Pro',               available: true },
            { text: 'Shared workspaces',               available: true, note: 'future-ready'  },
            { text: 'Role-based access',               available: true, note: 'planned'       },
            { text: 'Priority support',                available: true },
            { text: 'Early access to new features',    available: true },
            { text: 'Custom integrations',             available: true },
        ],
        cta:         'Contact Sales',
        ctaVariant:  'secondary' as const,
        highlighted: false,
        badge:       null,
    },
]

// ── Plan card ─────────────────────────────────────────────────────────────────
const PlanCard = ({ plan, index }: { plan: typeof plans[0]; index: number }) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateY(20px)'
        const t = setTimeout(() => {
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
        }, 100 + index * 100)
        return () => clearTimeout(t)
    }, [index])

    return (
        <div
            ref={ref}
            className="relative flex flex-col rounded-2xl overflow-hidden"
            style={{
                border: plan.highlighted
                    ? '1px solid var(--turquoise-42)'
                    : '1px solid var(--border-default)',
                backgroundColor: 'var(--bg)',
                boxShadow: plan.highlighted
                    ? '0 0 0 1px var(--turquoise-20), 0 20px 60px var(--turquoise-8)'
                    : 'none',
            }}
        >
            {/* Highlighted top accent bar */}
            {plan.highlighted && (
                <div className="h-0.5 w-full bg-turquoise" style={{ boxShadow: '0 0 12px var(--turquoise-glow)' }} />
            )}

            {/* Badge */}
            {plan.badge && (
                <div className="absolute top-5 right-5">
                    <span
                        className="text-[0.6rem] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
                        style={{
                            backgroundColor: 'var(--turquoise)',
                            color: 'var(--bg)',
                        }}
                    >
                        {plan.badge}
                    </span>
                </div>
            )}

            {/* Header */}
            <div className="px-8 pt-8 pb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span
                    className="text-[0.7rem] font-bold tracking-[0.14em] uppercase mb-4 block"
                    style={{ color: plan.highlighted ? 'var(--turquoise-fg)' : 'var(--text-muted)' }}
                >
                    {plan.label}
                </span>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span
                        className="font-normal leading-none"
                        style={{
                            fontFamily: 'var(--font-dm-serif-display), serif',
                            fontSize: plan.price === 'Custom' ? '2.25rem' : '3.25rem',
                            color: 'var(--text)',
                        }}
                    >
                        {plan.price}
                    </span>
                    <span className="text-sm font-semibold text-tertiary">{plan.period}</span>
                </div>

                <p className="m-0 text-sm leading-relaxed text-tertiary">{plan.description}</p>
            </div>

            {/* Features */}
            <div className="px-8 py-6 flex-1 flex flex-col gap-3">
                {plan.features.map((feature) => (
                    <div key={feature.text} className="flex items-start gap-3">
                        <span
                            className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                            style={{
                                backgroundColor: feature.available
                                    ? 'var(--turquoise-10)'
                                    : 'var(--border-subtle)',
                            }}
                        >
                            {feature.available
                                ? <Check size={10} strokeWidth={2.5} color="var(--turquoise-fg)" />
                                : <Minus size={10} strokeWidth={2} color="var(--text-subtle)" />
                            }
                        </span>
                        <span
                            className="text-sm leading-snug"
                            style={{
                                color: feature.available ? 'var(--text-secondary)' : 'var(--text-subtle)',
                                fontWeight: feature.available ? 600 : 400,
                            }}
                        >
                            {feature.text}
                            {'note' in feature && feature.note && (
                                <span
                                    className="ml-2 text-[0.58rem] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-full"
                                    style={{
                                        backgroundColor: 'var(--turquoise-8)',
                                        border: '1px solid var(--turquoise-20)',
                                        color: 'var(--turquoise-fg)',
                                    }}
                                >
                                    {feature.note}
                                </span>
                            )}
                        </span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="px-8 pb-8">
                <Button
                    variant={plan.ctaVariant}
                    className="w-full justify-center"
                >
                    {plan.cta}
                </Button>
            </div>
        </div>
    )
}

// ── Section ───────────────────────────────────────────────────────────────────
const PricingPlans = () => {
    const headerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = headerRef.current
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateY(12px)'
        setTimeout(() => {
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
        }, 60)
    }, [])

    return (
        <section className="relative w-full overflow-hidden pb-28 surface">

            <SectionGrid />

            <div className="container relative z-10">

                {/* Plans grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                    {plans.map((plan, i) => (
                        <PlanCard key={plan.id} plan={plan} index={i} />
                    ))}
                </div>

                {/* Bottom note */}
                <div ref={headerRef} className="mt-10 flex items-center justify-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-turquoise shadow-turquoise" />
                    <p className="m-0 text-sm text-tertiary font-medium">
                        No credit card required to start. Cancel anytime.
                    </p>
                </div>

            </div>
        </section>
    )
}

export default PricingPlans