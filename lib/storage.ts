import { createClient } from '@supabase/supabase-js'

const BUCKET         = 'project-videos'
const MAX_SIZE_BYTES = 50 * 1024 * 1024
const ALLOWED_TYPES  = ['video/mp4', 'video/quicktime', 'video/webm']

function getServiceClient() {
    const url         = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceRole) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    }

    return createClient(url, serviceRole, {
        auth: {
            autoRefreshToken:  false,
            persistSession:    false,
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
    url:      string
    fileName: string
}

export class StorageError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'StorageError'
    }
}

export async function uploadProjectVideo(
    file:      File,
    userId:    string,
    projectId: string,
): Promise<UploadResult> {

    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new StorageError('Unsupported format. Please upload an MP4, MOV, or WebM file.')
    }

    if (file.size > MAX_SIZE_BYTES) {
        throw new StorageError('File exceeds 50MB. Please compress or trim your video first.')
    }

    const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path      = `${userId}/${projectId}/${Date.now()}-${sanitized}`

    const supabase  = getServiceClient()
    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
            cacheControl: '3600',
            upsert:       false,
        })

    if (error) {
        console.error('Supabase upload error:', error)
        throw new StorageError(error.message)
    }

    const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path)

    return {
        url:      data.publicUrl,
        fileName: sanitized,
    }
}