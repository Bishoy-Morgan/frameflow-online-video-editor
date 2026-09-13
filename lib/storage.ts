import { createClient } from '@supabase/supabase-js'

const VIDEO_BUCKET = 'project-videos'
const VIDEO_MAX_SIZE_BYTES = 50 * 1024 * 1024
const VIDEO_ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']

const AUDIO_BUCKET = 'project-audio'
const AUDIO_MAX_SIZE_BYTES = 20 * 1024 * 1024
const AUDIO_ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/webm']

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceRole) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    }

    return createClient(url, serviceRole, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
        },
        global: {
            headers: {
                // Explicitly pass service role as bearer — forces RLS bypass
                Authorization: `Bearer ${serviceRole}`,
            },
        },
    })
}

export interface UploadResult {
    url: string
    fileName: string
}

export class StorageError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'StorageError'
    }
}

interface UploadConfig {
    bucket: string
    allowedTypes: string[]
    maxSizeBytes: number
    unsupportedFormatMessage: string
    tooLargeMessage: string
}

async function uploadFile(
    file: File,
    userId: string,
    projectId: string,
    config: UploadConfig,
): Promise<UploadResult> {

    if (!config.allowedTypes.includes(file.type)) {
        throw new StorageError(config.unsupportedFormatMessage)
    }

    if (file.size > config.maxSizeBytes) {
        throw new StorageError(config.tooLargeMessage)
    }

    const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${userId}/${projectId}/${Date.now()}-${sanitized}`

    const supabase = getServiceClient()
    const { error } = await supabase.storage
        .from(config.bucket)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
        })

    if (error) {
        console.error(`Supabase upload error (${config.bucket}):`, error)
        throw new StorageError(error.message)
    }

    const { data } = supabase.storage
        .from(config.bucket)
        .getPublicUrl(path)

    return {
        url: data.publicUrl,
        fileName: sanitized,
    }
}

export async function uploadProjectVideo(
    file: File,
    userId: string,
    projectId: string,
): Promise<UploadResult> {
    return uploadFile(file, userId, projectId, {
        bucket: VIDEO_BUCKET,
        allowedTypes: VIDEO_ALLOWED_TYPES,
        maxSizeBytes: VIDEO_MAX_SIZE_BYTES,
        unsupportedFormatMessage: 'Unsupported format. Please upload an MP4, MOV, or WebM file.',
        tooLargeMessage: 'File exceeds 50MB. Please compress or trim your video first.',
    })
}

export async function uploadProjectAudio(
    file: File,
    userId: string,
    projectId: string,
): Promise<UploadResult> {
    return uploadFile(file, userId, projectId, {
        bucket: AUDIO_BUCKET,
        allowedTypes: AUDIO_ALLOWED_TYPES,
        maxSizeBytes: AUDIO_MAX_SIZE_BYTES,
        unsupportedFormatMessage: 'Unsupported format. Please upload an MP3, WAV, or WebM audio file.',
        tooLargeMessage: 'File exceeds 20MB. Please use a shorter or lower-bitrate track.',
    })
}