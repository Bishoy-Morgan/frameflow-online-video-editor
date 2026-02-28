import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent'

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

function buildSystemPrompt(body: GenerateBody): string {
    const totalSeconds = parseInt(body.duration)
    return `
You are a professional video director and creative AI assistant.
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
}
`.trim()
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: GenerateBody = await req.json()

    if (!body.prompt?.trim()) {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    console.log('API Key present:', !!apiKey)
    console.log('API Key prefix:', apiKey?.slice(0, 8))

    let geminiData: { projectName: string; scenes: Scene[] }

    try {
        const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: buildSystemPrompt(body) }],
                    },
                ],
                generationConfig: {
                    temperature:     0.7,
                    maxOutputTokens: 2048,
                },
            }),
        })

        if (!res.ok) {
            const err = await res.text()
            console.error('Gemini error:', err)
            return NextResponse.json({ error: 'Gemini API error' }, { status: 502 })
        }

        const raw  = await res.json()
        const text = raw?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

        console.log('Gemini raw text:', text)

        // Extract JSON object from response robustly
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            console.error('No JSON found in Gemini response:', text)
            return NextResponse.json({ error: 'Failed to parse Gemini response' }, { status: 500 })
        }

        // Remove trailing commas before parsing (common Gemini issue)
        const cleaned = jsonMatch[0]
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']')
            .trim()

        console.log('Cleaned JSON:', cleaned)

        geminiData = JSON.parse(cleaned)

    } catch (err) {
        console.error('Gemini parse error:', err)
        return NextResponse.json({ error: 'Failed to parse Gemini response' }, { status: 500 })
    }

    // ── Create project + scenes in DB ──
    const project = await prisma.project.create({
        data: {
            name:        geminiData.projectName ?? body.prompt.slice(0, 60),
            userId:      session.user.id,
            prompt:      body.prompt,
            style:       body.style,
            aspectRatio: body.aspectRatio,
            aiDuration:  body.duration,
            scenes: {
                create: geminiData.scenes.map((s, i) => ({
                    title:       s.title,
                    description: s.description,
                    musicMood:   s.musicMood,
                    duration:    s.duration,
                    order:       i,
                })),
            },
        },
        include: {
            scenes: {
                orderBy: { order: 'asc' },
            },
        },
    })

    return NextResponse.json(project, { status: 201 })
}