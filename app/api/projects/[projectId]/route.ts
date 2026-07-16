import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { patchProjectSchema } from '@/lib/schemas'

type Params = { params: Promise<{ projectId: string }> }

export async function GET(_req: Request, { params }: Params) {
    const { projectId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const project = await prisma.project.findFirst({
        where:   { id: projectId, userId: session.user.id },
        include: {
            scenes: { orderBy: { order: 'asc' } },
            _count: { select: { assets: true, timelines: true, renders: true } },
        },
    })

    if (!project)
        return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json(project)
}

export async function PATCH(req: Request, { params }: Params) {
    const { projectId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (session.user.role === 'DEMO')
        return NextResponse.json({ error: 'Demo users cannot modify projects' }, { status: 403 })

    const project = await prisma.project.findFirst({
        where: { id: projectId, userId: session.user.id },
    })
    if (!project)
        return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await req.json()
    const result = patchProjectSchema.safeParse(body)
    if (!result.success) {
        return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }
    const { action, scenes, name, starred, deletedAt } = result.data

    if (action === 'save' && Array.isArray(scenes)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const scenesToCreate = scenes.map(({ id: _id, ...rest }) => ({ ...rest, projectId }))

        const operations = [
            prisma.scene.deleteMany({ where: { projectId } }),
            ...(scenesToCreate.length > 0 ? [prisma.scene.createMany({ data: scenesToCreate })] : []),
            prisma.project.update({ where: { id: projectId }, data: { updatedAt: new Date() } }),
        ]

        await prisma.$transaction(operations)

        return NextResponse.json({ saved: true })
    }

    // Rename
    if (typeof name === 'string') {
        const updated = await prisma.project.update({
            where: { id: projectId },
            data:  { name: name.trim() },
        })
        return NextResponse.json(updated)
    }

    // Star / unstar
    if (typeof starred === 'boolean') {
        const updated = await prisma.project.update({
            where: { id: projectId },
            data:  { starred },
        })
        return NextResponse.json(updated)
    }

    // Soft delete
    if (deletedAt !== undefined) {
        const updated = await prisma.project.update({
            where: { id: projectId },
            data:  { deletedAt: deletedAt ? new Date(deletedAt) : null },
        })
        return NextResponse.json(updated)
    }

    // Legacy action strings
    if (action === 'star')    return NextResponse.json(await prisma.project.update({ where: { id: projectId }, data: { starred: true } }))
    if (action === 'unstar')  return NextResponse.json(await prisma.project.update({ where: { id: projectId }, data: { starred: false } }))
    if (action === 'restore') return NextResponse.json(await prisma.project.update({ where: { id: projectId }, data: { deletedAt: null } }))

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

export async function DELETE(_req: Request, { params }: Params) {
    const { projectId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (session.user.role === 'DEMO')
        return NextResponse.json({ error: 'Demo users cannot modify projects' }, { status: 403 })

    const project = await prisma.project.findFirst({
        where: { id: projectId, userId: session.user.id },
    })
    if (!project)
        return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (project.deletedAt) {
        await prisma.scene.deleteMany({ where: { projectId } })
        await prisma.project.delete({ where: { id: projectId } })
        return NextResponse.json({ deleted: true })
    }

    const updated = await prisma.project.update({
        where: { id: projectId },
        data:  { deletedAt: new Date() },
    })
    return NextResponse.json(updated)
}