import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
        where: {
            userId:    session.user.id,
            deletedAt: null,
        },
        orderBy: { updatedAt: 'desc' },
        select: {
            id:          true,
            name:        true,
            starred:     true,
            deletedAt:   true,
            prompt:      true,
            style:       true,
            aspectRatio: true,
            thumbnail:   true,
            createdAt:   true,
            updatedAt:   true,
        },
    })

    return NextResponse.json(projects)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await req.json()

    if (!name?.trim()) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const project = await prisma.project.create({
        data: {
            name:   name.trim(),
            userId: session.user.id,
        },
        select: {
            id:          true,
            name:        true,
            starred:     true,
            deletedAt:   true,
            prompt:      true,
            style:       true,
            aspectRatio: true,
            thumbnail:   true,
            createdAt:   true,
            updatedAt:   true,
        },
    })

    return NextResponse.json(project, { status: 201 })
}