'use client'

import React from 'react'
import Button from './ui/Button'
import Image from 'next/image'
import laptopMockup from '@/public/images/laptop-mockup.webp'
// import { useTheme } from '@/hooks/useTheme'

const Herosection = () => {
    // const { isDark } = useTheme()

    const handleButtonClick = () => {
        if (typeof window !== 'undefined') {
            window.open('/auth/signup', '_self');
        }
    };
    
    
    return (
        <section className="gradient-bg w-full h-svh flex items-end pb-4 max-h-[800px]">
            <div className="container">
                <div className="flex flex-col md:flex-row items-start justify-between gap-12 md:gap-16">
                    {/* Left Content */}
                    <div className="w-full md:w-3/5 flex flex-col items-start">
                        <h1>
                            Frameflow is a Free Online Video Editor for Social Media and Marketing
                        </h1>
                        <p className="text-lead" style={{ color: 'color-mix(in srgb, var(--text) 70%, transparent)' }}>
                            Frameflow lets you edit videos directly in your browser with fast, intuitive
                            tools and ready-made templates. Create social media reels, promo videos, and
                            marketing content without downloads or complicated software.
                        </p>
                        <Button 
                            variant="primary" 
                            className="mt-6 mb-2"
                            onClick={handleButtonClick}
                        >
                            Sign up for free
                        </Button>
                        <span className="text-small ml-2">
                            *No credit card required
                        </span>
                    </div>

                    {/* Right Image */}
                    <div className="w-full md:w-2/5 flex items-start justify-center md:justify-end">
                        <Image
                            src={laptopMockup}
                            alt="Frameflow Video Editor Interface"
                            width={650}
                            height={524}
                            quality={85}
                            priority
                            className="w-full h-auto max-w-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Herosection