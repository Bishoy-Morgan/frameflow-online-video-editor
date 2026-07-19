import React from 'react'
import { redirect } from 'next/navigation'
import Sidebar from './components/Sidebar'
import SectionGrid from '@/components/ui/SectionGrid'
import UserProvider from '@/components/providers/UserProvider'
import currentUser from '@/lib/currentUser'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await currentUser()

    if (!user) {
        redirect('/auth/signin')
    }

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