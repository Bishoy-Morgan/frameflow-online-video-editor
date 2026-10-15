import { z } from 'zod'

const sceneSchema = z.object({
    id: z.string().optional(),
    title: z.string().trim().min(1).max(100),
    description: z.string(),
    musicMood: z.string(),
    duration: z.number().nonnegative(),
    sourceDuration: z.number().nonnegative().nullable().optional(),
    order: z.number().int().nonnegative(),
    videoUrl: z.string().nullable().optional(),
    pexelsId: z.string().nullable().optional(),
})

const musicSourceSchema = z.enum(['UPLOAD', 'PIXABAY'])
const voiceoverSourceSchema = z.enum(['UPLOAD', 'RECORDING'])

export const projectNameSchema = z.string()
    .trim()
    .min(1, 'Project name cannot be empty.')
    .max(100, 'Project name must be 100 characters or fewer.')
    .regex(/^[^<>]+$/u, 'Project names can\'t contain < or > characters.')
    .regex(/[\p{L}\p{N}]/u, 'Project name must include at least one letter or number.')

export const patchProjectSchema = z.object({
    action: z.enum(['save', 'update']).optional(),
    scenes: z.array(sceneSchema).optional(),
    name: projectNameSchema.optional(),
    starred: z.boolean().optional(),
    deletedAt: z.string().datetime().nullable().optional(),
    musicUrl: z.string().nullable().optional(),
    musicVolume: z.number().min(0).max(1).optional(),
    musicSource: musicSourceSchema.nullable().optional(),
    voiceoverUrl: z.string().nullable().optional(),
    voiceoverVolume: z.number().min(0).max(1).optional(),
    voiceoverSource: voiceoverSourceSchema.nullable().optional(),
})

export const createProjectSchema = z.object({
    name: projectNameSchema.optional(),
    style: z.string().nullable().optional(),
    aspectRatio: z.string().nullable().optional(),
    prompt: z.string().optional(),
    scenes: z.array(sceneSchema).optional(),
})

const audioLayerTypeSchema = z.enum(['MUSIC', 'VOICEOVER'])

export const createAudioLayerSchema = z.object({
    type: audioLayerTypeSchema,
    url: z.string().min(1),
    volume: z.number().min(0).max(1).optional(),
    startTime: z.number().nonnegative().optional(),
    row: z.number().int().nonnegative().optional(),
    sourceDuration: z.number().nonnegative().nullable().optional(),
})

export const patchAudioLayerSchema = z.object({
    volume: z.number().min(0).max(1).optional(),
    startTime: z.number().nonnegative().optional(),
    row: z.number().int().nonnegative().optional(),
})