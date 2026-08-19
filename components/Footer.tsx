'use client'

import Link from 'next/link'
import { Youtube, Twitter, Instagram, Linkedin } from 'lucide-react'
import Button from './ui/Button'
import Image from 'next/image'
import whiteLogo from '@/public/whiteLogo.png'
import blackLogo from '@/public/blackLogo.png'
import { useTheme } from '@/hooks/useTheme'

const footerLinks = {
    Product: [
        { name: 'Features', href: '/features' },
        { name: 'Templates', href: '/templates' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Updates', href: '/updates' },
    ],
    Resources: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Tutorials', href: '/tutorials' },
        { name: 'Blog', href: '/blog' },
        { name: 'Support', href: '/support' },
    ],
    Company: [
        { name: 'About', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
        { name: 'Partners', href: '/partners' },
    ],
    Legal: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Licenses', href: '/licenses' },
    ],
}

const socialLinks = [
    { name: 'YouTube', Icon: Youtube, href: '#' },
    { name: 'Twitter', Icon: Twitter, href: '#' },
    { name: 'Instagram', Icon: Instagram, href: '#' },
    { name: 'LinkedIn', Icon: Linkedin, href: '#' },
]

const Footer = () => {
    const year = new Date().getFullYear()
    const { isDark, toggleTheme } = useTheme()

    return (
        <footer className="relative w-full border-t-(--border-default)">
            <div className="container py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-14">

                    <div className="col-span-2 flex flex-col gap-5">
                        <Link href="/" className="flex items-center">
                            <Image
                                src={isDark ? whiteLogo : blackLogo}
                                alt="Frameflow"
                                width={60}
                                height={30}
                                priority
                            />
                            <span className="text-hero ml-2 text-(--accent-fg)" style={{ fontFamily: 'var(--font-dm-serif-display)' }}>
                                Frameflow
                            </span>
                        </Link>
                        <p className="m-0 text-small 3xl:text-body">
                            A browser-based video editor built for speed, structure, and real workflows.
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                            {socialLinks.map(({ name, Icon, href }) => (
                                <Link
                                    key={name}
                                    href={href}
                                    aria-label={name}
                                    className="p-2 rounded-xl flex items-center justify-center transition-all duration-200 bg-(--surface-raised) border border-(--border-default) text-(--text-tertiary) hover:text-(--accent) hover:bg-(--accent-8) hover:border-(--accent-42)"
                                >
                                    <Icon size={22} strokeWidth={1.75} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([group, links]) => (
                        <div key={group} className="flex flex-col gap-4">
                            <span className="text-lead font-semibold 3xl:text-hero ">
                                {group}
                            </span>
                            <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
                                {links.map(({ name, href }) => (
                                    <li key={name}>
                                        <Link
                                            href={href}
                                            className="text-small 3xl:text-body font-medium text-(--text-tertiary) hover:text-(--accent) transition-colors duration-150"
                                        >
                                            {name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div
                    className="rounded-xl p-8 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-transparent border border-(--border-default) shadow-md"
                >
                    <div className="flex flex-col gap-1">
                        <span className="text-caption font-bold">Stay in the loop.</span>
                        <span className="text-caption text-tertiary">Product updates and release notes, no noise.</span>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 md:w-56 3xl:w-64 px-4 py-3 3xl:py-4 rounded-lg text-small font-medium focus:outline-none transition-colors duration-150 bg-(--bg) border border-(--border-default) text-(--text) placeholder-(--text-tertiary) focus:border-(--accent)"
                        />
                        <Button 
                            variant="primary" 
                            size="sm"
                        >
                            Subscribe
                        </Button>
                    </div>
                </div>

                <div
                    className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t-(--border-subtle) "
                >
                    <span className="text-small 3xl:text-caption text-tertiary font-medium">
                        © {year} Frameflow. All rights reserved.
                    </span>
                    <div className="flex items-center gap-5">
                        {['Status', 'Sitemap', 'Accessibility'].map(label => (
                            <Link
                                key={label}
                                href={`/${label.toLowerCase()}`}
                                className="text-small font-medium text-tertiary transition-colors duration-150"
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