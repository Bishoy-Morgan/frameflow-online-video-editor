import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await prisma.loginAttempt.deleteMany({
        where: {
            createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
    })

    return NextResponse.json({ deletedCount: result.count })
}


