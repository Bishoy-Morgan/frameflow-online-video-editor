import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/auth'
import { prisma } from "./prisma"


export default async function currentUser() {
        const session = await getServerSession(authOptions)
    
        if (!session?.user?.email) {
            return null
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

        if (!fullUser) return null
    
        const user = {
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
        return user
}
