import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface PexelsVideoFile {
    link:      string
    file_type: string
    width:     number
    height:    number
    quality:   string
}

interface PexelsVideoUser {
    name: string
}

interface PexelsVideoItem {
    id:          number
    duration:    number
    image:       string
    width:       number
    height:      number
    video_files: PexelsVideoFile[]
    user:        PexelsVideoUser
}

interface PexelsSearchResponse {
    videos:        PexelsVideoItem[]
    total_results: number
    page:          number
}

export interface PexelsVideo {
    id:       number
    duration: number
    image:    string
    videoUrl: string
    width:    number
    height:   number
    user:     string
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const query   = searchParams.get('query')?.trim()
    const page    = searchParams.get('page') ?? '1'
    const perPage = '12'

    if (!query)
        return NextResponse.json({ error: 'Query required' }, { status: 400 })

    const res = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&orientation=portrait`,
        { headers: { Authorization: process.env.PEXELS_API_KEY! } }
    )

    if (!res.ok)
        return NextResponse.json({ error: 'Pexels API error' }, { status: 502 })

    const data: PexelsSearchResponse = await res.json()

    const videos: PexelsVideo[] = data.videos.map((v: PexelsVideoItem) => {
        const files = v.video_files

        // 1. Try HD MP4 first (≤ 1920px wide)
        const hd = files
            .filter((f: PexelsVideoFile) => f.file_type === 'video/mp4' && f.width <= 1920)
            .sort((a: PexelsVideoFile, b: PexelsVideoFile) => b.width - a.width)[0]

        // 2. Fall back to any MP4
        const anyMp4 = files
            .filter((f: PexelsVideoFile) => f.file_type === 'video/mp4')
            .sort((a: PexelsVideoFile, b: PexelsVideoFile) => b.width - a.width)[0]

        // 3. Last resort — whatever file is available
        const fallback = files[0]

        const best = hd ?? anyMp4 ?? fallback

        return {
            id:       v.id,
            duration: v.duration,
            image:    v.image,
            videoUrl: best?.link ?? '',
            width:    best?.width  ?? v.width,
            height:   best?.height ?? v.height,
            user:     v.user?.name ?? 'Pexels',
        }
    }).filter((v: PexelsVideo) => v.videoUrl !== '')

    return NextResponse.json({
        videos,
        totalResults: data.total_results,
        page:         data.page,
    })
}