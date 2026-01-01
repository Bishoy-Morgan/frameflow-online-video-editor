'use client'

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import man from '@/public/images/features/man.jpg'
import edit from '@/public/images/features/edit.jpg'
import Button from './ui/Button';

const HowToUse = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);

    const steps = [
        {
            id: 1,
            title: 'Step 1: Upload video',
            description: 'Sign up for or sign in to CapCut and launch your personal workspace. Upload media files from the computer, Cloud, Google Drive, Dropbox, or by QR code.',
            image: man,
        },
        {
            id: 2,
            title: 'Step 2: Edit or create a video',
            description: "Drag and drop your media files to the editing timeline. You can trim, crop, split, reverse, or mirror clips. Apply audio, text, stickers, effects, transitions, and filters to the video to make it compelling. You can also resize the video, remove its background, or generate captions as required. Explore every tool in our toolkit to make your content stand out.",
            image: edit,
        },
        {
            id: 3,
            title: 'Step 3: Export & share',
            description: "Customize your file name and resolution. Click the Advanced Settings to set the quality, frame rate, and format. Finally, hit the Export button to download your video or share it on your social platforms.",
            image: man,
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setFadeIn(false);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % steps.length);
                setFadeIn(true);
            }, 300);
        }, 5000);

        return () => clearInterval(interval);
    }, [steps.length]);

    const currentFeature = steps[currentIndex];

    return (
        <main className="w-full min-h-screen md:py-20">
            <div className='container flex flex-col items-center justify-center'>
                <h2 className='mb-24 font-bold'>
                    How to create a video online
                </h2>
                <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-x-24">
                    
                    <div className="w-full md:w-1/2 space-y-8">
                        
                        <div className="space-y-18">
                            {steps.map((feature, index) => (
                                <div key={feature.id} className={`${index === currentIndex ? 'border-l-4 border-turquoise ' : ''}`}>
                                    <h4 
                                        className={`font-semibold transition-all duration-300 pl-10 ${
                                            index === currentIndex 
                                                ? 'opacity-100' 
                                                : 'opacity-25'
                                        }`}
                                        style={{
                                            color: index === currentIndex ? 'var(--text)' : undefined
                                        }}
                                    >
                                        {feature.title}
                                    </h4>
                                    <p 
                                        className={`text-body mt-6 transition-opacity duration-300 rounded-xl pl-10 ${
                                            index === currentIndex && fadeIn ? 'opacity-100' : 'opacity-25'
                                        }`}
                                        style={{
                                            color: index === currentIndex ? 'var(--text)' : undefined
                                        }}
                                    >
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="gradient-bg w-full md:w-1/2 md:h-[60vh] 2xl:max-h-[500px] flex items-center justify-center rounded-xl shadow-lg ">
                        <div 
                            className={`relative md:w-4/5 md:h-4/5 2xl:max-h-[500px] transition-opacity duration-300 ${
                                fadeIn ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <Image
                                src={currentFeature.image}
                                alt={currentFeature.title}
                                fill
                                className='object-cover rounded-xl '
                            />
                        </div>
                    </div>
                </div>
                <Button variant='primary' className='mt-20'>
                    Sign up for free
                </Button>
            </div>
        </main>
    );
};

export default HowToUse;