'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

// Subscribe to localStorage changes
function subscribe(callback: () => void) {
    window.addEventListener('storage', callback)
    return () => window.removeEventListener('storage', callback)
}

// Get theme from localStorage (client-side only)
function getSnapshot(): Theme {
    if (typeof window === 'undefined') return 'light'
    
    try {
        const stored = localStorage.getItem('theme')
        return (stored === 'dark' || stored === 'light') ? stored : 'light'
    } catch {
        return 'light'
    }
}

// Server-side snapshot (always returns 'light')
function getServerSnapshot(): Theme {
    return 'light'
}

export function useTheme() {
    // Use useSyncExternalStore to avoid hydration mismatch
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
    const [mounted, setMounted] = useState(false)

    // Set mounted after first render to avoid hydration mismatch
    // setMounted is a state setter and is stable, so it's safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        setMounted(true)
    }, [])

    // Sync theme changes to DOM and localStorage
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        localStorage.setItem('theme', newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
        // Trigger a re-render by dispatching a storage event
        window.dispatchEvent(new Event('storage'))
    }

    return {
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        mounted,
    }
}