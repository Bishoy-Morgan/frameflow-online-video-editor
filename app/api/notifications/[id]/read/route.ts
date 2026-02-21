import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where:  { email: session.user.email },
        select: { id: true },
    })

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Ensure the notification belongs to this user
    const notification = await prisma.notification.findFirst({
        where: { id: params.id, userId: user.id },
    })

    if (!notification) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.notification.update({
        where: { id: params.id },
        data:  { read: true },
    })

    return NextResponse.json({ success: true })
}