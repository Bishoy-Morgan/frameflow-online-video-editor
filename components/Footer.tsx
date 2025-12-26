'use client'

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import Button from './ui/Button';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer className="w-full surface flex flex-col items-center">
      <div className="text-center px-4 py-24 space-y-12">
        <h2>
          Inspire your creativity and create like a pro
        </h2>
        <p className="opacity-70 text-xl">
          Turn your creative ideas into reality with FrameFlow video editor online.
        </p>
        <Button 
          variant="primary"
          style={{ 
            color: 'var(--bg)' 
          }}
        >
          Sign up for free
        </Button>
      </div>
      <div className={`w-[90%] px-8 py-6 ${
        isDark ? 'border-t border-white/20' : 'border-t border-black/20'
      }`}>
        <p className="text-sm opacity-60">
          © 2024 FrameFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;