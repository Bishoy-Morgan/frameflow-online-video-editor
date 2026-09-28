'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Button from './ui/Button'
import SectionGrid from './ui/SectionGrid'
import desktop from '@/public/images/hero-editorPage.png'
import { ArrowRight } from 'lucide-react'

const HeroSection = () => {
    const router = useRouter()

    return (
        <section className="relative w-full overflow-hidden">

            <SectionGrid />

            <div className="relative z-10 container pt-32 md:pt-40">

                <div className="mx-auto flex max-w-4xl flex-col items-center text-center">

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="mb-6"
                    >
                        <span className="text-small font-medium uppercase tracking-[0.18em] text-accent">
                            Browser-based video editor
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.08 }}
                        className="max-w-4xl font-normal tracking-tight text-main"
                    >
                        Turn ideas into<br/>
                        <span className="italic text-accent">
                            finished videos.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: 'easeOut', delay: 0.18 }}
                        className="max-w-2xl text-lead 3xl:text-hero"
                    >
                        A fast, structured video editor for social content,
                        marketing videos, and product demos — entirely in your browser.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.28 }}
                        className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
                    >
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => router.push('/auth/signup')}
                        >
                            Start creating — free
                        </Button>

                        <Button
                            variant="ghost"
                            size="md"
                            icon={<ArrowRight size={20} strokeWidth={2} />}
                            iconPosition="right"
                            onClick={() => router.push('/features')}
                        >
                            See how it works
                        </Button>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
                        className="mt-4 text-small font-medium text-tertiary"
                    >
                        No credit card required · Free forever plan available
                    </motion.p>

                </div>

                <motion.div
                    initial={{ opacity: 0, y: 70, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        duration: 0.9,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.35,
                    }}
                    className="relative mx-auto mt-10 w-full max-w-7xl"
                >

                    <motion.div
                        aria-hidden
                        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2"
                        style={{
                            background:
                                'radial-gradient(circle, var(--accent-32) 0%, transparent 68%)',
                            filter: 'blur(80px)',
                        }}
                        animate={{
                            scale: [1, 1.08, 1],
                            opacity: [0.45, 0.7, 0.45],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    <div
                        className="relative overflow-hidden rounded-xl glow-accent"
                    >
                        <Image
                            src={desktop}
                            alt="Frameflow video editor interface"
                            width={2400}
                            height={1350}
                            quality={88}
                            priority
                            sizes="(min-width: 1536px) 1200px, (min-width: 1024px) 90vw, 100vw"
                            className="block h-auto w-full"
                        />
                    </div>

                </motion.div>

                <div className="h-20 md:h-28" />

            </div>

        </section>
    )
}

export default HeroSection