import { z } from 'zod'

const sceneSchema = z.object({
    id: z.string().optional(),
    title: z.string().trim().min(1).max(100),
    description: z.string(),
    musicMood: z.string(),
    duration: z.number().nonnegative(),
    order: z.number().int().nonnegative(),
    videoUrl: z.string().nullable().optional(),
    pexelsId: z.string().nullable().optional(),
})

export const patchProjectSchema = z.object({
    action: z.enum(['save', 'star', 'unstar', 'restore']).optional(),
    scenes: z.array(sceneSchema).optional(),
    name: z.string().trim().min(1).max(100).optional(),
    starred: z.boolean().optional(),
    deletedAt: z.string().datetime().nullable().optional()
})

export const createProjectSchema = z.object({
    name: z.string().trim().min(1).max(100),
    style: z.string().optional(),
    aspectRatio: z.string().optional(),
    prompt: z.string().optional(),
    scenes: z.array(sceneSchema).optional()
})