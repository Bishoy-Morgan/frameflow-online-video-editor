'use client';

import React from 'react';
import { Play, Clock, Monitor, Smartphone, Square } from 'lucide-react';
import { Template } from './TemplatesData';

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const getAspectRatioIcon = (ratio: string) => {
    switch(ratio) {
      case '16:9': 
        return <Monitor className="w-4 h-4" />;
      case '9:16': 
        return <Smartphone className="w-4 h-4" />;
      default: 
        return <Square className="w-4 h-4" />;
    }
  };

  return (
    <div className="group cursor-pointer">
      <div className={`aspect-9/16 rounded-2xl bg-linear-to-br ${template.thumbnail} mb-4 relative overflow-hidden`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
        
        {/* Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-tiny font-semibold">
            {template.category}
          </span>
        </div>

        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full bg-hotPink text-white text-tiny font-semibold">
              PRO
            </span>
          </div>
        )}

        {/* Duration & Aspect Ratio */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/40 backdrop-blur-sm text-white text-tiny">
            <Clock className="w-3 h-3" />
            <span>{template.duration}s</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/40 backdrop-blur-sm text-white text-tiny">
            {getAspectRatioIcon(template.aspectRatio)}
            <span>{template.aspectRatio}</span>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <h5 className="font-semibold mb-1">{template.name}</h5>
      <p className="text-caption opacity-70">{template.style}</p>
    </div>
  );
}