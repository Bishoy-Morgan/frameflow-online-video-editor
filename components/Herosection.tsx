'use client'

import React from 'react'
import Button from './ui/Button'
import Image from 'next/image'
import laptopMockup from '@/public/images/laptop-mockup.webp'

const Herosection = () => {

    const handleButtonClick = () => {
        if (typeof window !== 'undefined') {
            window.open('/auth/signup', '_blank');
        }
    };
    
    return (
        <main className="gradient-bg w-full h-screen px-24 flex justify-center items-end pb-16 ">
            <div className='w-1/2 flex flex-col items-start justify-center '>
                <h1 className="text-6xl font-bold text-black">Free Online Video Editor</h1>
                <p className="mt-4 text-lg text-gray-700 max-w-xl">
                    Looking for free templates and smart tools to make videos free online to market your business and personal branding? CapCut&apos;s online video editor has you covered. Social media reels, promo videos, slideshows, and more are just at your fingertips. Start your free trial right now!
                </p>
                <Button 
                variant='primary' 
                className='mt-8 mb-4 py-4 px-8 text-xl'
                onClick={handleButtonClick}
                >
                    Sign up for free
                </Button>
                <span className='text-sm text-gray-500'>
                    *No credit card required
                </span>
            </div>
            <div className='relative w-1/2 h-3/4 flex items-center justify-end'>
                <Image
                    src={laptopMockup}
                    alt="Hero Image"
                    width={1.24 * 650}
                    height={650}
                    quality={75}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 650px"
                />
            </div>
        </main>
    )
}

export default Herosection
