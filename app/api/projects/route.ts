import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createProjectSchema } from '@/lib/schemas'

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
        where:   { userId: session.user.id, deletedAt: null },
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

    const body = await req.json()
    const result = createProjectSchema.safeParse(body)
    if (!result.success) {
        return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }
    const { name, style, aspectRatio, prompt, scenes } = result.data

    const scenesData = Array.isArray(scenes) && scenes.length > 0
            ? {
                create: scenes.map((s: {
                    title:       string
                    description: string
                    musicMood:   string
                    duration:    number
                    order:       number
                }) => ({
                    title:       s.title,
                    description: s.description,
                    musicMood:   s.musicMood,
                    duration:    s.duration,
                    order:       s.order,
                }))
            }
        : undefined

    const project = await prisma.project.create({
        data: {
            name:        name.trim(),
            userId:      session.user.id,
            style:       style       ?? null,
            aspectRatio: aspectRatio ?? null,
            prompt:      prompt      ?? null,
            ...(scenesData ? { scenes: scenesData } : {}),
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