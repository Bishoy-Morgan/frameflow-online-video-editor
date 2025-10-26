"use client";

import { Plus } from "lucide-react";

interface TopPanelProps {
    height: string;
    isDragging: boolean;
}

export default function TopPanel({ height, isDragging }: TopPanelProps) {
    return (
        <div
        className={`flex flex-col items-center justify-center bg-gray-100 overflow-auto ${
            isDragging ? "transition-none" : "transition-[height] duration-300 ease-in-out"
        }`}
        style={{ height }}
        >
            <div className="group w-16 h-16 mb-6 bg-neutral-800 rounded-xl flex items-center justify-center shadow-lg shadow-neutral-700 hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                <Plus size={32} className="text-white group-hover:text-cyan-500" />
            </div>
            <h5 className="font-semibold mb-2">Click to upload</h5>
            <span className="text-xs text-gray-500 font-light">
                Or drag and drop file here
            </span>
        </div>
    );
}
