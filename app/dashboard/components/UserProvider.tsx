'use client'

import UserContext, { DashboardUser } from './UserContext'

export default function UserProvider({
    user,
    children,
}: {
    user: DashboardUser
    children: React.ReactNode
}) {
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}