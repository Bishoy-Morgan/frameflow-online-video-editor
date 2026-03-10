import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'FrameFlow | Editor',
}

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}