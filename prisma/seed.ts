import { prisma } from '@/lib/prisma'

const DEMO_PASSWORD_HASH = "$2b$10$SS9ZHREZ/02sRKVdApCPyu3MYesivL.p68DDHev5WX89P70E4/YXG";

export async function seedDemoAccount() {
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@frameflow.app'},
        update: { role: 'DEMO', name: 'Demo User', password: DEMO_PASSWORD_HASH },
        create: { role: 'DEMO', email: 'demo@frameflow.app', password: DEMO_PASSWORD_HASH, name: 'Demo User' },
    })

    await prisma.project.deleteMany({
        where: {
            userId: demoUser.id,
        }
    })

    await prisma.project.create({
        data: {
            name: 'Demo Project',
            userId: demoUser.id,
            style: 'Cinematic',
            scenes: {
                create: [
                    {
                        title: 'Product Launch Intro',
                        description: 'Fast-paced reel intro with bold text overlay, perfect for announcing a new product',
                        musicMood: 'Upbeat',
                        duration: 8,
                        order: 0,
                        videoUrl: 'https://gvcbfsfglzhbxmsyuylg.supabase.co/storage/v1/object/public/template-previews/Instagram-Reel-3.mp4',
                    },
                    {
                        title: 'Music Video Opener',
                        description: 'Cinematic slow-motion opener with dynamic lighting, sets the tone for the track',
                        musicMood: 'Energetic',
                        duration: 12,
                        order: 1,
                        videoUrl: 'https://gvcbfsfglzhbxmsyuylg.supabase.co/storage/v1/object/public/template-previews/Music-Video-1.mp4',
                    },
                    {
                        title: 'Beat Drop Transition',
                        description: 'Sharp cut transition synced to the beat, high-energy visual rhythm',
                        musicMood: 'Intense',
                        duration: 6,
                        order: 2,
                        videoUrl: 'https://gvcbfsfglzhbxmsyuylg.supabase.co/storage/v1/object/public/template-previews/Music-Video-2.mp4',
                    },
                ],
            },
        },
    })
}

if (require.main === module) {
    seedDemoAccount()
        .catch((e) => {
            console.error(e)
            process.exit(1)
        })
        .finally(async () => {
            await prisma.$disconnect()
        })
}