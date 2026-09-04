'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'
import Button from './ui/Button'
import SectionGrid from './ui/SectionGrid'
import { ArrowRight } from 'lucide-react'

import aiGenerator from '@/public/images/features/ai-generator.png'
import aiGeneratorDark from '@/public/images/features/ai-generator.png'
import stockFootage from '@/public/images/features/auto-caption.webp'
import stockFootageDark from '@/public/images/features/auto-caption.webp'
import autoCaptions from '@/public/images/features/caption.png'
import autoCaptionsDark from '@/public/images/features/caption.png'
import aiChat from '@/public/images/features/cloud-projects.webp'
import aiChatDark from '@/public/images/features//cloud-projects.webp'
import sceneRegen from '@/public/images/features/edit.jpg'
import sceneRegenDark from '@/public/images/features/edit.jpg'
import exportPresets from '@/public/images/features/text-edit.webp'
import exportPresetsDark from '@/public/images/features/text-edit.webp'
import musicMatch from '@/public/images/features/man.jpg'
import musicMatchDark from '@/public/images/features/man.jpg'
import { useRouter } from 'next/navigation'

const FEATURES = [
    {
        id: 1,
        tag: '01',
        title: 'AI Project Generator',
        description: 'Describe your video. Frameflow breaks it into a structured scene plan and matches real stock footage to each scene automatically.',
        imageLight: aiGenerator,
        imageDark: aiGeneratorDark,
        live: true,
    },
    {
        id: 2,
        tag: '02',
        title: 'Stock Footage Library',
        description: 'Search thousands of clips by keyword and drop them straight into your timeline. No licensing hassle, no leaving the editor.',
        imageLight: stockFootage,
        imageDark: stockFootageDark,
        live: true,
    },
    {
        id: 3,
        tag: '03',
        title: 'Auto-Captions',
        description: 'Generate accurate, timestamped captions from your scenes. Improve engagement, accessibility, and searchability automatically.',
        imageLight: autoCaptions,
        imageDark: autoCaptionsDark,
        live: false,
    },
    {
        id: 4,
        tag: '04',
        title: 'AI Editing Assistant',
        description: 'Chat with an assistant that understands your project — get suggestions on pacing, transitions, and hooks as you edit.',
        imageLight: aiChat,
        imageDark: aiChatDark,
        live: false,
    },
    {
        id: 5,
        tag: '05',
        title: 'Scene Regeneration',
        description: 'Not happy with one scene? Reroll it independently — new footage, new framing — without touching the rest of your timeline.',
        imageLight: sceneRegen,
        imageDark: sceneRegenDark,
        live: false,
    },
    {
        id: 6,
        tag: '06',
        title: 'Platform Export Presets',
        description: 'Export tuned to where you\u2019re posting — correct aspect ratio and length caps for TikTok, Reels, and Shorts, built in.',
        imageLight: exportPresets,
        imageDark: exportPresetsDark,
        live: false,
    },
    {
        id: 7,
        tag: '07',
        title: 'AI-Matched Music',
        description: 'Every scene is scored for mood. Frameflow pairs it with music that fits the tone automatically.',
        imageLight: musicMatch,
        imageDark: musicMatchDark,
        live: false,
    },
]

const INTERVAL = 4800

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay, ease: 'easeOut' },
    }),
}

const HomepageFeatures = () => {
    const [current, setCurrent] = useState(0)
    const { isDark } = useTheme()
    const router = useRouter()

    useEffect(() => {
        const id = setInterval(() => {
            setCurrent(i => (i + 1) % FEATURES.length)
        }, INTERVAL)
        return () => clearInterval(id)
    }, [])

    const go = (index: number) => {
        if (index === current) return
        setCurrent(index)
    }

    const feature = FEATURES[current]
    const activeImage = isDark ? feature.imageDark : feature.imageLight

    return (
        <section className="relative w-full overflow-hidden py-28">
            <SectionGrid />
            <div className="container relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    custom={0}
                    variants={fadeUp}
                    className="max-w-140 mb-14"
                >
                    <div className="flex items-center gap-3 mb-8 3xl:mb-12">
                        <div className="w-7 h-px bg-(--accent)" />
                        <span className="text-caption font-bold tracking-[0.14em] uppercase text-(--accent-fg)">
                            Features
                        </span>
                    </div>
                    <h2 className="font-normal leading-tight">
                        Smart tools for faster video.
                    </h2>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    custom={0.1}
                    variants={fadeUp}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`text-${feature.id}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-160 mx-auto text-center mb-8"
                        >
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <h3 className="font-semibold m-0 text-(--text)">
                                    {feature.title}
                                </h3>
                                {!feature.live && (
                                    <span className="text-tiny font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md shrink-0 border border-(--border-default) bg-(--surface-raised) text-(--text-tertiary)">
                                        Soon
                                    </span>
                                )}
                            </div>
                            <p className="text-caption 3xl:text-body text-(--text)">
                                {feature.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <div
                        className="relative aspect-video overflow-hidden rounded-2xl w-4/5 mx-auto backdrop-blur-xl border border-(--border-default)"
                        style={{
                            background: 'color-mix(in srgb, var(--surface-raised) 55%, transparent)',
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`img-${feature.id}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Image
                                    src={activeImage}
                                    alt={feature.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-2">
                            {FEATURES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => go(i)}
                                    aria-label={`Go to feature ${i + 1}`}
                                    className={`h-1.5 cursor-pointer rounded-full border-none p-0 transition-all duration-300 focus:outline-none ${
                                        i === current
                                            ? 'w-8 bg-(--accent) shadow-[0_0_6px_var(--accent)]'
                                            : 'w-1.5 bg-(--border-strong)'
                                    }`}
                                />
                            ))}
                            <span className="ml-2 text-small text-tertiary font-medium">
                                {current + 1} / {FEATURES.length}
                            </span>
                        </div>

                        <Button
                            variant="primary"
                            icon={<ArrowRight size={22} strokeWidth={2} />}
                            iconPosition="right"
                            onClick={() => router.push('/auth/signup')}
                            className="w-fit"
                        >
                            Sign up for free
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default HomepageFeatures