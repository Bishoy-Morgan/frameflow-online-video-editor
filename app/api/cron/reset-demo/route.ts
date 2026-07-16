import { NextResponse } from 'next/server'
import { seedDemoAccount } from '@/prisma/seed'

export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        await seedDemoAccount()
        return NextResponse.json({ message: 'Demo account reset successfully' })
    } catch (error) {
        console.error('Demo reset failed:', error)
        return NextResponse.json({ error: 'Demo reset failed' }, { status: 500 })
    }
}