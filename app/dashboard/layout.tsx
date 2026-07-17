import React from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Sidebar from './components/Sidebar'
import SectionGrid from '@/components/ui/SectionGrid'
import { prisma } from '@/lib/prisma'
import UserProvider from '@/components/providers/UserProvider'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        redirect('/auth/signin')
    }

    const fullUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true, name: true, email: true, image: true, role: true,
            password: true,
            createdAt: true,
            _count: { select: { projects: true } },
            projects: { select: { updatedAt: true } },
        },
    })

    if (!fullUser) redirect('/auth/signin')

    const dashboardUser = {
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        image: fullUser.image,
        role: fullUser.role,
        createdAt: fullUser.createdAt,
        _count: fullUser._count,
        projects: fullUser.projects,
        hasPassword: !!fullUser.password,
    }

    return (
        <UserProvider user={dashboardUser}>
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