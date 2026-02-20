'use client'

import { useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'light'
    
    if (document.documentElement.classList.contains('dark')) return 'dark'
    
    const stored = localStorage.getItem('theme')
    return stored === 'dark' ? 'dark' : 'light'
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme)

    // Sync DOM whenever theme changes
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        localStorage.setItem('theme', theme)
    }, [theme])

    // Listen for changes from other tabs
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
                setTheme(e.newValue)
            }
        }
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }, [])

    return {
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        mounted: true,
    }
}