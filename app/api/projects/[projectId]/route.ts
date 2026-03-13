import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const project = await prisma.project.findFirst({
        where: { id: projectId, userId: session.user.id },
    })
    if (!project)
        return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await req.json()
    const { action, scenes, name, starred, deletedAt } = body

    // Save scene changes from editor (delete, reorder, trim)
    if (action === 'save' && Array.isArray(scenes)) {
        // Delete all existing scenes and replace with current state
        await prisma.scene.deleteMany({ where: { projectId } })

        if (scenes.length > 0) {
            await prisma.scene.createMany({
                data: scenes.map((s: {
                    id?:         string
                    title:       string
                    description: string
                    musicMood:   string
                    duration:    number
                    order:       number
                    videoUrl?:   string | null
                    pexelsId?:   string | null
                }) => ({
                    projectId,
                    title:       s.title,
                    description: s.description,
                    musicMood:   s.musicMood,
                    duration:    s.duration,
                    order:       s.order,
                    videoUrl:    s.videoUrl   ?? null,
                    pexelsId:    s.pexelsId   ?? null,
                })),
            })
        }

        await prisma.project.update({
            where: { id: projectId },
            data:  { updatedAt: new Date() },
        })

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