import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const GROQ_API_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const PEXELS_API_URL = 'https://api.pexels.com/videos/search'

type Scene = {
    title:       string
    description: string
    musicMood:   string
    duration:    number
}

type GenerateBody = {
    prompt:      string
    style:       string
    aspectRatio: string
    duration:    string
}

// ── Pexels ────────────────────────────────────────────────────────────────────

async function fetchPexelsVideo(
    query: string,
    aspectRatio: string
): Promise<{ videoUrl: string; pexelsId: string } | null> {
    const apiKey = process.env.PEXELS_API_KEY
    if (!apiKey) return null

    const orientation =
        aspectRatio === '9:16' ? 'portrait' :
        aspectRatio === '1:1'  ? 'square'   : 'landscape'

    try {
        const res = await fetch(
            `${PEXELS_API_URL}?query=${encodeURIComponent(query)}&per_page=5&orientation=${orientation}`,
            { headers: { Authorization: apiKey } }
        )

        if (!res.ok) {
            console.error('Pexels error:', await res.text())
            return null
        }

        const data = await res.json()
        const video = data.videos?.[0]
        if (!video) return null

        const files: { quality: string; link: string }[] = video.video_files ?? []
        const preferred =
            files.find(f => f.quality === 'hd') ??
            files.find(f => f.quality === 'sd') ??
            files[0]

        if (!preferred) return null

        return {
            videoUrl: preferred.link,
            pexelsId: String(video.id),
        }
    } catch (err) {
        console.error('Pexels fetch error:', err)
        return null
    }
}

// ── Prompt ────────────────────────────────────────────────────────────────────

function buildPrompt(body: GenerateBody): string {
    const totalSeconds = parseInt(body.duration)
    return `You are a professional video director and creative AI assistant.
The user wants to create a short video with these parameters:
- Prompt: "${body.prompt}"
- Visual style: ${body.style}
- Aspect ratio: ${body.aspectRatio}
- Total duration: ${body.duration} (${totalSeconds} seconds)

Generate a structured scene breakdown for this video.
Divide the video into 3-6 scenes that together add up to exactly ${totalSeconds} seconds.

For each scene return:
- title: short scene title (3-6 words)
- description: vivid visual description of what happens in this scene (2-3 sentences, be specific about camera angles, lighting, motion)
- musicMood: one of [Uplifting, Dramatic, Calm, Energetic, Melancholic, Mysterious, Cinematic, Playful]
- duration: number of seconds for this scene (integer)

Respond ONLY with a valid JSON object in this exact format, no markdown, no explanation, no trailing commas:
{
  "projectName": "short catchy project name based on the prompt",
  "scenes": [
    {
      "title": "...",
      "description": "...",
      "musicMood": "...",
      "duration": 0
    }
  ]
}`
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: GenerateBody = await req.json()

    if (!body.prompt?.trim()) {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const groqKey = process.env.GROQ_API_KEY
    if (!groqKey) {
        return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
    }

    // ── Step 1: Generate scene briefs with Groq ──
    let groqData: { projectName: string; scenes: Scene[] }

    try {
        const res = await fetch(GROQ_API_URL, {
            method:  'POST',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
                model:       'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens:  2048,
                messages: [{ role: 'user', content: buildPrompt(body) }],
            }),
        })

        if (!res.ok) {
            const err = await res.text()
            console.error('Groq error:', err)
            return NextResponse.json({ error: 'Groq API error', details: err }, { status: 502 })
        }

        const raw  = await res.json()
        const text = raw?.choices?.[0]?.message?.content ?? ''

        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            console.error('No JSON in Groq response:', text)
            return NextResponse.json({ error: 'Failed to parse Groq response' }, { status: 500 })
        }

        const cleaned = jsonMatch[0]
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']')
            .trim()

        groqData = JSON.parse(cleaned)

    } catch (err) {
        console.error('Groq parse error:', err)
        return NextResponse.json({ error: 'Failed to parse Groq response' }, { status: 500 })
    }

    // ── Step 2: Fetch a matching Pexels video for each scene in parallel ──
    const pexelsResults = await Promise.all(
        groqData.scenes.map(scene =>
            fetchPexelsVideo(`${scene.title} ${body.style}`, body.aspectRatio)
        )
    )

    // ── Step 3: Save project + scenes to DB ──
    const project = await prisma.project.create({
        data: {
            name:        groqData.projectName ?? body.prompt.slice(0, 60),
            userId:      session.user.id,
            prompt:      body.prompt,
            style:       body.style,
            aspectRatio: body.aspectRatio,
            aiDuration:  body.duration,
            scenes: {
                create: groqData.scenes.map((s, i) => ({
                    title:       s.title,
                    description: s.description,
                    musicMood:   s.musicMood,
                    duration:    s.duration,
                    order:       i,
                    videoUrl:    pexelsResults[i]?.videoUrl ?? null,
                    pexelsId:    pexelsResults[i]?.pexelsId ?? null,
                })),
            },
        },
        include: {
            scenes: { orderBy: { order: 'asc' } },
        },
    })

    return NextResponse.json(project, { status: 201 })
}