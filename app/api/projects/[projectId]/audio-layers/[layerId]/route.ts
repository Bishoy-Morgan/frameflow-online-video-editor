import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { patchAudioLayerSchema } from '@/lib/schemas'

type Params = { params: Promise<{ projectId: string; layerId: string }> }

async function assertOwnership(projectId: string, layerId: string, userId: string) {
    const layer = await prisma.audioLayer.findFirst({
        where: { id: layerId, projectId },
        include: { project: { select: { userId: true } } },
    })
    if (!layer || layer.project.userId !== userId) return null
    return layer
}

export async function PATCH(req: Request, { params }: Params) {
    const { projectId, layerId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (session.user.role === 'DEMO')
        return NextResponse.json({ error: 'Demo users cannot modify projects' }, { status: 403 })

    const existing = await assertOwnership(projectId, layerId, session.user.id)
    if (!existing)
        return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await req.json()
    const result = patchAudioLayerSchema.safeParse(body)
    if (!result.success)
        return NextResponse.json({ error: result.error.flatten() }, { status: 400 })

    const updated = await prisma.audioLayer.update({
        where: { id: layerId },
        data: result.data,
    })

    return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: Params) {
    const { projectId, layerId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (session.user.role === 'DEMO')
        return NextResponse.json({ error: 'Demo users cannot modify projects' }, { status: 403 })

    const existing = await assertOwnership(projectId, layerId, session.user.id)
    if (!existing)
        return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.audioLayer.delete({ where: { id: layerId } })

    return NextResponse.json({ deleted: true })
}