import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const [total, starred, trash] = await Promise.all([
        prisma.project.count({
            where: { userId, deletedAt: null },
        }),
        prisma.project.count({
            where: { userId, starred: true, deletedAt: null },
        }),
        prisma.project.count({
            where: { userId, deletedAt: { not: null } },
        }),
    ])

    return NextResponse.json({ total, starred, trash })
}