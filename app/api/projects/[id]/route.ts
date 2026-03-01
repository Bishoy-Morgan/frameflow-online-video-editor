import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findFirst({
        where: { id, userId: session.user.id },
        include: {
            scenes: { orderBy: { order: 'asc' } },
            _count: { select: { assets: true, timelines: true, renders: true } },
        },
    })

    if (!project) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(project)
}

export async function PATCH(req: Request, { params }: Params) {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await req.json()

    const project = await prisma.project.findFirst({ where: { id, userId: session.user.id } })
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (action === 'star')    return NextResponse.json(await prisma.project.update({ where: { id }, data: { starred: true } }))
    if (action === 'unstar')  return NextResponse.json(await prisma.project.update({ where: { id }, data: { starred: false } }))
    if (action === 'restore') return NextResponse.json(await prisma.project.update({ where: { id }, data: { deletedAt: null } }))

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

export async function DELETE(_req: Request, { params }: Params) {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findFirst({ where: { id, userId: session.user.id } })
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (project.deletedAt) {
        await prisma.project.delete({ where: { id: project.id } })
        return NextResponse.json({ deleted: true })
    }

    const updated = await prisma.project.update({ where: { id: project.id }, data: { deletedAt: new Date() } })
    return NextResponse.json(updated)
}