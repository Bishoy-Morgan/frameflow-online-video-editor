import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function useCreateProject() {
    const router = useRouter()
    const [creating, setCreating] = useState(false)

    const createProject = useCallback(async (overrides?: Partial<{ style: string; aspectRatio: string }>) => {
        if (creating) return
        setCreating(true)
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ style: 'Cinematic', aspectRatio: '16:9', ...overrides }),
            })
            if (res.status === 401) { router.push('/auth/signin?callbackUrl=/dashboard'); return }
            if (!res.ok) throw new Error('Failed to create project')
            const project = await res.json()
            router.push(`/editor/${project.id}`)
            return project
        } catch (err) {
            console.error(err)
        } finally {
            setCreating(false)
        }
    }, [creating, router])

    return { createProject, creating }
}