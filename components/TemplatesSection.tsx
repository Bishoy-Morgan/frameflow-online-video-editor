'use client';

import React from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import Button from './ui/Button';

export default function TemplatesSection() {
  const { isDark } = useTheme();

  const templates = [
    { name: "Vlog Intro", category: "YouTube", color: "from-pink-500 to-purple-600" },
    { name: "Product Showcase", category: "Business", color: "from-blue-500 to-cyan-500" },
    { name: "Tutorial", category: "Education", color: "from-green-500 to-emerald-600" },
    { name: "Music Video", category: "Creative", color: "from-orange-500 to-red-600" },
    { name: "Social Ad", category: "Marketing", color: "from-violet-500 to-fuchsia-600" },
    { name: "Testimonial", category: "Business", color: "from-teal-500 to-blue-600" }
  ];

  return (
    <section className="w-full py-20 lg:py-32 flex items-center justify-center">
      <div className="container flex flex-col gap-12 lg:gap-20 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="mb-4">Ready-to-Use Templates</h2>
            <p className="text-body font-semibold opacity-80">Start creating in seconds with professional templates</p>
          </div>
          <Button variant="secondary">
            Browse All
            <ArrowRight className="w-5 h-5 inline-block ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {templates.map((template, idx) => (
            <div
              key={idx}
              className="group cursor-pointer"
            >
              <div className={`aspect-9/16 rounded-2xl bg-linear-to-br ${template.color} mb-4 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-tiny font-semibold">
                    {template.category}
                  </span>
                </div>
              </div>
              <h5 className="font-semibold">{template.name}</h5>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}