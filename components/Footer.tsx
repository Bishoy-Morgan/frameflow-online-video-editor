'use client'

import React from 'react'
import Link from 'next/link'
import { Youtube, Twitter, Instagram, Linkedin } from 'lucide-react'
import Button from './ui/Button'

const footerLinks = {
    Product: [
        { name: 'Features',  href: '/features'  },
        { name: 'Templates', href: '/templates' },
        { name: 'Pricing',   href: '/pricing'   },
        { name: 'Updates',   href: '/updates'   },
    ],
    Resources: [
        { name: 'Documentation', href: '/docs'      },
        { name: 'Tutorials',     href: '/tutorials' },
        { name: 'Blog',          href: '/blog'      },
        { name: 'Support',       href: '/support'   },
    ],
    Company: [
        { name: 'About',    href: '/about'    },
        { name: 'Careers',  href: '/careers'  },
        { name: 'Contact',  href: '/contact'  },
        { name: 'Partners', href: '/partners' },
    ],
    Legal: [
        { name: 'Privacy Policy',   href: '/privacy'      },
        { name: 'Terms of Service', href: '/terms'        },
        { name: 'Cookie Policy',    href: '/cookies'      },
        { name: 'Licenses',         href: '/licenses'     },
    ],
}

const socialLinks = [
    { name: 'YouTube',   Icon: Youtube,   href: '#' },
    { name: 'Twitter',   Icon: Twitter,   href: '#' },
    { name: 'Instagram', Icon: Instagram, href: '#' },
    { name: 'LinkedIn',  Icon: Linkedin,  href: '#' },
]

const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer className="relative w-full surface" style={{ borderTop: '1px solid var(--border-default)' }}>
            <div className="container py-16">

                {/* ── Main grid ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-14">

                    {/* Brand */}
                    <div className="col-span-2 flex flex-col gap-5">
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <span
                                className="font-normal text-turquoise"
                                style={{ fontFamily: 'var(--font-dm-serif-display), serif', fontSize: '1.5rem' }}
                            >
                                Frameflow
                            </span>
                        </Link>
                        <p className="m-0 text-sm leading-relaxed text-tertiary" style={{ maxWidth: '260px' }}>
                            A browser-based video editor built for speed, structure, and real workflows.
                        </p>

                        {/* Social icons */}
                        <div className="flex items-center gap-2 mt-1">
                            {socialLinks.map(({ name, Icon, href }) => (
                                <Link
                                    key={name}
                                    href={href}
                                    aria-label={name}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                                    style={{
                                        backgroundColor: 'var(--surface-raised)',
                                        border: '1px solid var(--border-default)',
                                        color: 'var(--text-tertiary)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'var(--turquoise-42)'
                                        e.currentTarget.style.backgroundColor = 'var(--turquoise-8)'
                                        e.currentTarget.style.color = 'var(--turquoise)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'var(--border-default)'
                                        e.currentTarget.style.backgroundColor = 'var(--surface-raised)'
                                        e.currentTarget.style.color = 'var(--text-tertiary)'
                                    }}
                                >
                                    <Icon size={14} strokeWidth={1.75} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([group, links]) => (
                        <div key={group} className="flex flex-col gap-4">
                            <span className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-secondary">
                                {group}
                            </span>
                            <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
                                {links.map(({ name, href }) => (
                                    <li key={name}>
                                        <Link
                                            href={href}
                                            className="text-sm font-medium text-tertiary transition-colors duration-150"
                                            style={{ textDecoration: 'none' }}
                                            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                                        >
                                            {name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* ── Newsletter ── */}
                <div
                    className="rounded-xl p-8 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-default)' }}
                >
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-secondary">Stay in the loop.</span>
                        <span className="text-sm text-tertiary">Product updates and release notes, no noise.</span>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 md:w-56 px-4 py-2 rounded-lg text-sm font-medium focus:outline-none transition-colors duration-150"
                            style={{
                                backgroundColor: 'var(--bg)',
                                border: '1px solid var(--border-default)',
                                color: 'var(--text)',
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                        />
                        <Button variant="primary" size="sm">
                            Subscribe
                        </Button>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div
                    className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}
                >
                    <span className="text-xs text-tertiary font-medium">
                        © {year} Frameflow. All rights reserved.
                    </span>
                    <div className="flex items-center gap-5">
                        {['Status', 'Sitemap', 'Accessibility'].map(label => (
                            <Link
                                key={label}
                                href={`/${label.toLowerCase()}`}
                                className="text-xs font-medium text-tertiary transition-colors duration-150"
                                style={{ textDecoration: 'none' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </footer>
    )
}

export default Footer