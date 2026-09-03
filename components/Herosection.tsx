'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Button from './ui/Button'
import SectionGrid from './ui/SectionGrid'
import desktop from '@/public/images/editor.png'
import { ArrowRight } from 'lucide-react'

const HeroSection = () => {
    const router = useRouter()

    return (
        <section className="relative w-full md:h-svh md:max-h-250 flex items-center overflow-hidden">

            <SectionGrid />

            <div className="container relative z-10 pt-32 md:pt-40 pb-20">
                <div className="w-full lg:w-1/2 flex flex-col items-start">

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
                        className="font-normal mb-6 text-main"
                    >
                        Edit video.
                        <br />
                        <span className="italic text-accent">In your browser.</span>
                        <br />
                        Ship faster.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: 'easeOut', delay: 0.22 }}
                        className="mb-10 text-lead 3xl:text-hero"
                    >
                        Frameflow gives you a fast, structured timeline editor for social media,
                        marketing content, and product demos — no downloads, no complexity.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: 'easeOut', delay: 0.34 }}
                        className="flex flex-col items-start md:flex-row md:items-center gap-4"
                    >
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => router.push('/auth/signup')}
                        >
                            Sign up for free
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: 'easeOut', delay: 0.44 }}
                        className="m-0 mt-5 text-small text-tertiary font-medium ml-1"
                    >
                        No credit card required · Free forever plan available
                    </motion.p>

                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, ease: 'easeOut', delay: 0.2 }}
                    className="relative mt-14 lg:mt-0 lg:absolute lg:top-3/5 lg:-translate-y-1/2 lg:left-[52%] lg:w-[58vw] lg:z-10"
                >
                    <motion.div
                        aria-hidden
                        className="absolute -inset-[40%] -z-10 pointer-events-none"
                        style={{
                            background: 'radial-gradient(ellipse 55% 35% at 50% 50%, var(--accent-32) 0%, transparent 70%)',
                            filter: 'blur(70px)',
                        }}
                        animate={{
                            x: [-40, 40, -40],
                            y: [-20, 20, -20],
                            scale: [1, 1.1, 1],
                            opacity: [0.6, 0.9, 0.6],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    <div
                        className="relative w-full aspect-video"
                        style={{
                            maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 65%, transparent 100%)',
                            WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 65%, transparent 100%)',
                        }}
                    >
                        <Image
                            src={desktop}
                            alt="Frameflow Video Editor Interface"
                            fill
                            quality={82}
                            priority
                            sizes="(min-width: 1024px) 58vw, 100vw"
                            className="w-full h-full object-contain block"
                        />
                    </div>
                </motion.div>
            </div>

        </section>
    )
}

export default HeroSection