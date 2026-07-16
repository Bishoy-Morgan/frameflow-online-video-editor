'use client'

import { createContext, useContext } from 'react'
import { UserRole } from '@prisma/client'

export interface DashboardUser {
    id:        string
    name:      string | null
    email:     string
    image:     string | null
    role:      UserRole
    createdAt: Date
    _count:    { projects: number }
    projects:  { updatedAt: Date }[]
}

const UserContext = createContext<DashboardUser | null>(null)

export function useUser(): DashboardUser {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error('useUser must be used inside <UserProvider>')
    return ctx
}

export default UserContext