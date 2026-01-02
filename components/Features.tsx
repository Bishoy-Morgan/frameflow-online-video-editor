'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import Image from 'next/image';
import autoCaption from '@/public/images/features/auto-caption.webp'
import textEdit from '@/public/images/features/text-edit.webp'
import bgRemoval from '@/public/images/features/bg-removal.jpg'
import cloud from '@/public/images/features/cloud-projects.webp'
import Button from './ui/Button';

const FEATURES = [
    {
        id: 1,
        title: 'Auto Captions',
        description: 'Generate accurate captions in seconds and make your videos easier to watch, search, and share. Frameflow helps you add subtitles that improve engagement and accessibility across all platforms.',
        image: autoCaption,
    },
    {
        id: 2,
        title: 'Text-Based Editing',
        description: 'Edit videos as easily as editing text. Remove pauses, cut scenes, and rearrange clips by working directly with the transcript — faster workflows with full creative control.',
        image: textEdit,
    },
    {
        id: 3,
        title: 'Background Removal',
        description: 'Remove or replace backgrounds with a single click. Perfect for creators, presentations, and social videos that need a clean and professional look.',
        image: bgRemoval,
    },
    {
        id: 4,
        title: 'Cloud Projects',
        description: 'Access your video projects anywhere. Frameflow saves your work securely in the cloud so you can edit, preview, and export without losing progress.',
        image: cloud,
    },
];

const SLIDE_INTERVAL = 5000;
const FADE_DURATION = 300;

const Features = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);
    const { isDark } = useTheme();

    useEffect(() => {
        const interval = setInterval(() => {
            setFadeIn(false);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % FEATURES.length);
                setFadeIn(true);
            }, FADE_DURATION);
        }, SLIDE_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    const currentFeature = FEATURES[currentIndex];

    return (
        <main className="w-full py-20 lg:py-32 flex items-center justify-center">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20 ">
                
                {/* Left Section - Feature List */}
                <div className="w-full md:w-1/2 space-y-6">
                    <h2 className="mb-12 lg:mb-16">
                        Make a video with smart features
                    </h2>
                    
                    <div className="space-y-6">
                        {FEATURES.map((feature, index) => {
                        const isActive = index === currentIndex;
                        
                        return (
                            <div key={feature.id}>
                                <h3 
                                    className={`transition-all duration-300 ${
                                    isActive ? 'ml-4' : 'text-neutral-400/70'
                                    }`}
                                    style={{ color: isActive ? 'var(--text)' : undefined }}
                                >
                                    {feature.title}
                                </h3>
                                
                                {isActive && (
                                    <p 
                                        className={`
                                            text-body font-semibold mt-6 p-6 lg:p-8 
                                            rounded-xl backdrop-blur-3xl
                                            transition-opacity duration-300
                                            border border-turquoise bg-turquoise text-neutral-800
                                            ${fadeIn ? 'opacity-100' : 'opacity-0'}
                                            ${isDark ? 'shadow-xl shadow-white/20' : 'shadow-xl shadow-black/20'}
                                        `}
                                    >
                                        {feature.description}
                                    </p>
                                )}
                            </div>
                        );
                        })}
                    </div>

                    {/* Progress Indicator */}
                    <div className="pt-8">
                        <div className="text-caption text-neutral-500 mb-3">
                            Feature {currentIndex + 1} of {FEATURES.length}
                        </div>
                        
                        <div className="flex gap-2 mb-6">
                            {FEATURES.map((_, index) => (
                                <div
                                key={index}
                                className={`h-1 rounded-full transition-all duration-300 ${
                                    index === currentIndex ? 'w-12 bg-hotPink' : 'w-8 bg-neutral-400'
                                }`}
                                />
                            ))}
                        </div>
                        
                        <Button variant="secondary" className="mt-4">
                            Sign up for free
                        </Button>
                    </div>
                </div>

                {/* Right Section - Image Display */}
                <div className="w-full md:w-1/2 h-[400px] md:h-[500px] lg:h-[600px] max-h-[500px] flex items-center justify-center">
                    <div className="gradient-bg w-full h-full rounded-xl shadow-lg flex items-end justify-end">
                        <div 
                        className={`
                            relative w-[90%] h-[90%]
                            transition-opacity duration-300
                            ${fadeIn ? 'opacity-100' : 'opacity-0'}
                        `}
                        >
                            <Image
                                src={currentFeature.image}
                                alt={currentFeature.title}
                                fill
                                className="object-cover rounded-tl-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Features;