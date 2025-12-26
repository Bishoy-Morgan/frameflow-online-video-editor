'use client'

import React from 'react';
import { Download, Play } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import Button from './ui/Button';

export default function CTASection() {
  const { isDark } = useTheme();

  return (
    <section className="py-24">
      <div className="container">
        <div className={`rounded-3xl p-16 text-center relative overflow-hidden ${
          isDark 
            ? 'shadow-xl shadow-white/20 border-white/5 border bg-white/5' 
            : 'shadow-xl shadow-black/20 border-black/5 border bg-black/5'
        }`}>
          <div className="relative z-10">
            <h2 className="mb-6">Ready to Create Something Amazing?</h2>
            <p className="text-hero max-w-2xl mx-auto mb-8 opacity-90">
              Join millions of creators and start making professional videos today
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant='secondary'
              >
                <Download className="w-5 h-5 inline-block mr-3 mb-1 " />
                Download Free
              </Button>
              <Button variant='primary'>
                <Play className="w-5 h-5 inline-block mr-3 mb-1 " />
                Watch Demo
              </Button>
            </div>

            <p className="text-caption mt-6 opacity-75">No credit card required • Free forever</p>
          </div>
        </div>
      </div>
    </section>
  );
}