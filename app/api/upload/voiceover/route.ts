import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadProjectVideo, StorageError } from '@/lib/storage'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let formData: FormData
    try {
        formData = await req.formData()
    } catch {
        return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    const file = formData.get('file') as File | null
    const projectId = formData.get('projectId') as string | null

    if (!file || !(file instanceof File))
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    if (!file.type.startsWith('video/'))
        return NextResponse.json({ error: 'File must be a video' }, { status: 400 })

    if (file.size > 50 * 1024 * 1024)
        return NextResponse.json({ error: 'File exceeds 50MB limit' }, { status: 413 })

    if (!projectId)
        return NextResponse.json({ error: 'projectId required' }, { status: 400 })

    const project = await prisma.project.findFirst({
        where: { id: projectId, userId: session.user.id },
        select: { id: true },
    })

    if (!project)
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })

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