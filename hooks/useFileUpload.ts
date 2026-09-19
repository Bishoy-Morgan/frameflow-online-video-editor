import { useRef, useCallback, useState } from 'react'

interface UseFileUploadOptions {
    accept: string
    onUploaded: (url: string) => void
}

export function useFileUpload({ accept, onUploaded }: UseFileUploadOptions) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const trigger = useCallback((endpoint: string, projectId: string) => {
        setError(null)
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = accept
        input.onchange = async () => {
            const file = input.files?.[0]
            if (!file) return

            setUploading(true)
            try {
                const form = new FormData()
                form.append('file', file)
                form.append('projectId', projectId)

                const res = await fetch(endpoint, { method: 'POST', body: form })
                const data = await res.json()

                if (!res.ok || data.error) {
                    setError(data.error ?? 'Upload failed')
                    return
                }

                onUploaded(data.url)
            } catch {
                setError('Upload failed. Please try again.')
            } finally {
                setUploading(false)
            }
        }
        input.click()
    }, [accept, onUploaded])

    return { trigger, uploading, error, inputRef }
}