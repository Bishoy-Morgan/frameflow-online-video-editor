import React from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Sidebar from './components/Sidebar'
import UserProvider from './components/UserProvider'
import SectionGrid from '@/components/ui/SectionGrid'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        redirect('/auth/signin')
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id:        true,
            name:      true,
            email:     true,
            image:     true,
            role:      true,
            createdAt: true,
            _count: {
                select: { projects: true }
            },
            projects: {
                orderBy: { updatedAt: 'desc' },
                take: 1,
                select: { updatedAt: true },
            },
        },
    })

    if (!user) redirect('/auth/signin')

    return (
        <UserProvider user={user}>
            <div className="relative flex h-svh overflow-hidden surface">
                <SectionGrid />
                <Sidebar />
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
                    {children}
                </div>
            </div>
        </UserProvider>
    )
}