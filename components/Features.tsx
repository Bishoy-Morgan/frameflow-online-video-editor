'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import Image from 'next/image';
import man from '@/public/images/features/man.jpg'
import edit from '@/public/images/features/edit.jpg'
import Button from './ui/Button';

const Features = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);
    const { isDark } = useTheme();

    const features = [
        {
            id: 1,
            title: 'Auto Captions',
            description:
            'Generate accurate captions in seconds and make your videos easier to watch, search, and share. Frameflow helps you add subtitles that improve engagement and accessibility across all platforms.',
            image: man,
        },
        {
            id: 2,
            title: 'Text-Based Editing',
            description:
            'Edit videos as easily as editing text. Remove pauses, cut scenes, and rearrange clips by working directly with the transcript — faster workflows with full creative control.',
            image: edit,
        },
        {
            id: 3,
            title: 'Background Removal',
            description:
            'Remove or replace backgrounds with a single click. Perfect for creators, presentations, and social videos that need a clean and professional look.',
            image: man,
        },
        {
            id: 4,
            title: 'Cloud Projects',
            description:
            'Access your video projects anywhere. Frameflow saves your work securely in the cloud so you can edit, preview, and export without losing progress.',
            image: edit,
        },
    ];


    useEffect(() => {
        const interval = setInterval(() => {
            setFadeIn(false);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
                setFadeIn(true);
            }, 300);
        }, 5000);

        return () => clearInterval(interval);
    }, [features.length]);

    const currentFeature = features[currentIndex];

    return (
        <main className="w-full min-h-screen py-44 flex items-center justify-center">
            <div className="container h-full flex flex-col md:flex-row items-center justify-between gap-32">
                
                <div className="w-full md:w-1/2 space-y-4">
                    <h2 className='mb-20'>
                        Make a video with smart features
                    </h2>
                    
                    <div className="space-y-6">
                        {features.map((feature, index) => (
                            <div key={feature.id}>
                                <h3 
                                    className={`transition-all duration-300 ${
                                        index === currentIndex 
                                            ? 'ml-4' 
                                            : 'text-neutral-400/70'
                                    }`}
                                    style={{
                                        color: index === currentIndex ? 'var(--text)' : undefined
                                    }}
                                >
                                    {feature.title}
                                </h3>
                                {index === currentIndex && (
                                    <p className={`text-body font-medium text-neutral-800 mt-6 transition-opacity duration-300 p-8 rounded-xl backdrop-blur-3xl ${
                                        fadeIn ? 'opacity-100' : 'opacity-0'
                                    } ${
                                        isDark ? 'shadow-xl shadow-white/20 border-white/5 border bg-white/5' : 'shadow-xl shadow-black/20 border-black/5 border bg-black/5'
                                    }
                                    `}>
                                        {feature.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-caption text-neutral-500 mt-16">
                        Feature {currentIndex + 1} of {features.length}
                    </div>
                    <div className="flex gap-2 mb-6">
                        {features.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1 rounded-full transition-all duration-300 ${
                                index === currentIndex ? 'w-12 bg-hotPink' : 'w-8 bg-neutral-400'
                                }`}
                            />
                        ))}
                    </div>
                    <Button variant='secondary' className='mt-8 mb-4 '>
                        Sign up for free
                    </Button>
                </div>

                <div className="gradient-bg *:w-full md:w-1/2 md:h-[60vh] flex items-center justify-center rounded-xl shadow-lg ">
                    <div className={`relative md:w-4/5 md:h-4/5 transition-opacity duration-300 ${
                        fadeIn ? 'opacity-100' : 'opacity-0'
                    }`}>
                        <Image
                            src={currentFeature.image}
                            alt={currentFeature.title}
                            fill
                            className='object-cover rounded-xl '
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Features;