import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAudioLayerSchema } from '@/lib/schemas'

type Params = { params: Promise<{ projectId: string }> }

export async function GET(_req: Request, { params }: Params) {
    const { projectId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const project = await prisma.project.findFirst({
        where: { id: projectId, userId: session.user.id },
        select: { id: true },
    })
    if (!project)
        return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const layers = await prisma.audioLayer.findMany({
        where: { projectId },
        orderBy: [{ type: 'asc' }, { row: 'asc' }, { startTime: 'asc' }],
    })

    return NextResponse.json(layers)
}

export async function POST(req: Request, { params }: Params) {
    const { projectId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (session.user.role === 'DEMO')
        return NextResponse.json({ error: 'Demo users cannot modify projects' }, { status: 403 })

    const project = await prisma.project.findFirst({
        where: { id: projectId, userId: session.user.id },
        select: { id: true },
    })
    if (!project)
        return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await req.json()
    const result = createAudioLayerSchema.safeParse(body)
    if (!result.success)
        return NextResponse.json({ error: result.error.flatten() }, { status: 400 })

    const { type, url, volume, startTime, row, sourceDuration } = result.data

    const layer = await prisma.audioLayer.create({
        data: {
            projectId,
            type,
            url,
            volume: volume ?? (type === 'MUSIC' ? 0.5 : 1.0),
            startTime: startTime ?? 0,
            row: row ?? 0,
            sourceDuration: sourceDuration ?? null,
        },
    })

    return NextResponse.json(layer, { status: 201 })
}