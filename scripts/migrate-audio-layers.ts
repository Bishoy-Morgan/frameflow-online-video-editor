import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const projects = await prisma.project.findMany({
        where: {
            OR: [
                { musicUrl: { not: null } },
                { voiceoverUrl: { not: null } },
            ],
        },
        select: {
            id: true,
            musicUrl: true,
            musicVolume: true,
            voiceoverUrl: true,
            voiceoverVolume: true,
        },
    })

    console.log(`Found ${projects.length} project(s) with existing music/voiceover.`)

    for (const p of projects) {
        const layers = []

        if (p.musicUrl) {
            layers.push({
                projectId: p.id,
                type: 'MUSIC' as const,
                url: p.musicUrl,
                volume: p.musicVolume ?? 0.5,
                startTime: 0,
                row: 0,
            })
        }

        if (p.voiceoverUrl) {
            layers.push({
                projectId: p.id,
                type: 'VOICEOVER' as const,
                url: p.voiceoverUrl,
                volume: p.voiceoverVolume ?? 1.0,
                startTime: 0,
                row: 0,
            })
        }

        if (layers.length > 0) {
            await prisma.audioLayer.createMany({ data: layers })
            console.log(`Migrated project ${p.id}: ${layers.length} layer(s).`)
        }
    }

    console.log('Done.')
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())