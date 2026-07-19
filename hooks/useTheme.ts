'use client'

import { useSyncExternalStore, useCallback, useEffect } from 'react'

type Theme = 'light' | 'dark'

function getSnapshot(): Theme {
    const stored = localStorage.getItem('theme')
    return stored === 'dark' ? 'dark' : 'light'
}

function getServerSnapshot(): Theme {
    return 'light'
}

function subscribe(callback: () => void): () => void {
    const handleStorage = (e: StorageEvent) => {
        if (e.key === 'theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
            callback()
        }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
}

function applyTheme(theme: Theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
}

export function useTheme() {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    useEffect(() => {
        applyTheme(theme)
    }, [theme])

    const toggleTheme = useCallback(() => {
        const next: Theme = theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        // storage event only fires in OTHER tabs, not this one —
        // dispatch manually so this tab's useSyncExternalStore re-reads too
        window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: next }))
    }, [theme])

    return {
        theme,
        isDark: theme === 'dark',
        toggleTheme,
    }
}