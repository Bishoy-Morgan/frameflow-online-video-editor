import React from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Sidebar from './components/Sidebar'
import SectionGrid from '@/components/ui/SectionGrid'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        redirect('/auth/signin')
    }

    return (
        <div className="relative flex h-svh overflow-hidden surface">
            <SectionGrid />
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
                {children}
            </div>
        </div>
    )
}