import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadProjectVideo, StorageError } from '@/lib/storage'

export async function POST(req: Request) {
    // ── Auth guard ────────────────────────────────────────────────────────────
    const session = await getServerSession(authOptions)
    if (!session?.user?.id)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // ── Parse multipart form data ─────────────────────────────────────────────
    let formData: FormData
    try {
        formData = await req.formData()
    } catch {
        return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    const file      = formData.get('file')      as File   | null
    const projectId = formData.get('projectId') as string | null

    if (!file || !(file instanceof File))
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    if (!projectId)
        return NextResponse.json({ error: 'projectId required' }, { status: 400 })

    // ── Upload ────────────────────────────────────────────────────────────────
    try {
        const result = await uploadProjectVideo(file, session.user.id, projectId)
        return NextResponse.json({ url: result.url, fileName: result.fileName })
    } catch (err) {
        if (err instanceof StorageError)
            return NextResponse.json({ error: err.message }, { status: 422 })
        console.error('Upload error:', err)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}