'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Button from './ui/Button'
import { useTheme } from '@/hooks/useTheme'
import whiteLogo from '@/public/whiteLogo.png'
import blackLogo from '@/public/blackLogo.png'
import { Moon, Sun } from 'lucide-react'


const Navbar = () => {
    const router = useRouter()
    const { isDark, toggleTheme, mounted } = useTheme()

    return (
        <div
            className="
                absolute top-4 left-1/2 -translate-x-1/2
                container z-50
                flex items-center justify-between
                py-3 px-6 md:px-8
                rounded-2xl
                overflow-hidden
            "
            style={{
                backgroundColor: mounted
                    ? isDark 
                        ? 'rgba(0, 0, 0)' 
                        : 'rgba(255, 255, 255)'
                    : 'rgba(255, 255, 255)',
                boxShadow: mounted
                    ? isDark
                        ? 'inset 4px 4px 10px rgba(255, 255, 255, 0.1)'
                        : '0 8px 32px rgba(0, 0, 0, 0.4)'
                    : '0 8px 32px rgba(0, 0, 0, 0.1)', 
                color: 'var(--text)'
            }}
        >
            {/* Glass effect on inner top - Dark mode only */}
            {mounted && isDark && (
                <div
                    className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
                        borderRadius: '1rem 1rem 0 0',
                    }}
                />
            )}

            {/* Shining gradient overlay from top-right */}
            {mounted && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: isDark
                            ? 'radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)'
                            : 'radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)',
                        mixBlendMode: isDark ? 'soft-light' : 'overlay'
                    }}
                />
            )}

            {/* Left */}
            <div className="flex items-center space-x-3 relative z-10">
                <Image
                    src={mounted ? (isDark ? whiteLogo : blackLogo) : blackLogo}
                    alt="Logo"
                    width={40}
                    height={40}
                    priority
                />
                {/* <span className="text-xl font-semibold tracking-tighter">
                    Frameflow
                </span> */}
            </div>

            {/* Right */}
            <div className="flex items-center gap-6 relative z-10">
                {/* Theme Switcher */}
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="
                        relative h-9 w-20 rounded-xl
                        flex items-center
                        border transition-all duration-300
                        hover:border-opacity-40
                    "
                    style={{
                        borderColor: 'color-mix(in srgb, var(--text) 20%, transparent)',
                        backgroundColor: 'transparent'
                    }}
                >
                    {/* Sliding indicator */}
                    {mounted && (
                        <div
                            className="absolute top-1 bottom-1 w-8 rounded-lg transition-all duration-300 ease-in-out"
                            style={{
                                left: isDark ? 'calc(100% - 2.25rem)' : '0.25rem',
                                backgroundColor: 'color-mix(in srgb, var(--text) 15%, transparent)'
                            }}
                        />
                    )}
                    
                    {/* Icons */}
                    <div className="relative w-full flex items-center justify-between px-2.5">
                        <Sun 
                            className="transition-opacity duration-300 z-10"
                            size={18}
                            style={{
                                color: 'var(--text)',
                                opacity: mounted ? (isDark ? 0.4 : 1) : 1
                            }}
                        />
                        <Moon 
                            className="transition-opacity duration-300 z-10"
                            size={18}
                            style={{
                                color: 'var(--text)',
                                opacity: mounted ? (isDark ? 1 : 0.4) : 0.4
                            }}
                        />
                    </div>
                </button>

                <Button
                    variant="primary"
                    className="py-1!"
                    onClick={() => router.push('/auth/signin')}
                >
                    Sign In
                </Button>
            </div>
        </div>
    )
}

export default Navbar