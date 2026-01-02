'use client';

import React from 'react';

interface FilterGroupProps {
  label: string;
  options: readonly string[];
  selected: string;
  onChange: (value: string) => void;
  name: string;
}

export default function FilterGroup({ label, options, selected, onChange, name }: FilterGroupProps) {
  return (
    <div>
      <label className="block text-body font-semibold mb-3 opacity-70">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name={name}
              checked={selected === option}
              onChange={() => onChange(option)}
              className="w-4 h-4 accent-turquoise"
            />
            <span className="text-body">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}