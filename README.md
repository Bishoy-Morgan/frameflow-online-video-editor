# Frameflow

A browser-based AI-assisted video editor, built solo. Describe a video, get a scene plan, pick footage, and arrange it on a multi-track timeline.

**Status:** in active development. Export is not built yet (see Roadmap).

![Editor](public/Images/screenshots/editor.png)

## Screenshots

**AI project generator**
![AI generation](public/Images/screenshots/ai-generation.png)

**Projects dashboard**
![Dashboard](public/Images/screenshots/dashboard.png)

## What works today

- **AI project generator:** a prompt becomes a scene plan (Groq)
- **Stock footage search** via the Pexels API
- **Uploads** to Supabase Storage for video, music, and voiceover
- **Timeline** with Video, Music, and Voiceover tracks and a draggable playhead
- **Project management:** create, duplicate, star, trash, restore, permanent delete
- **Auth:** NextAuth with Google sign-in

## Engineering decisions

- **Validation:** all API input is validated with Zod schemas
- **Authorization:** upload and mutation routes check project ownership
- **Login hardening:** timing-safe password comparison and rate limiting by email and IP, with a daily cleanup cron
- **Data integrity:** scene saves run in atomic database transactions
- **CI:** GitHub Actions runs lint, type-check, and build on every push

## Stack

Next.js (App Router), TypeScript, Tailwind, Prisma, Supabase Storage, NextAuth, Groq, Pexels API, Vercel

## Roadmap (not built yet)

- Video export (FFmpeg)
- Trim with in/out points, text overlays
- Auto-captions, AI chat assistant, scene detection

## Run locally

1. Clone the repo and run `npm install`
2. Copy `.env.example` to `.env.local` and fill in the keys
3. Run `npm run dev`

## License

All rights reserved.