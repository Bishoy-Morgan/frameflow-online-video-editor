"use client";

import { useState, useRef, DragEvent, useEffect, RefObject } from "react";
import { PackageX, Plus } from "lucide-react";

interface TopPanelProps {
    height: string;
    isDragging: boolean;
    videoRef: RefObject<HTMLVideoElement | null>; 
}

export default function TopPanel({
    height,
    isDragging,
    videoRef,
}: TopPanelProps) {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        return () => {
            if (videoUrl) URL.revokeObjectURL(videoUrl);
        };
    }, [videoUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("video/")) {
            if (videoUrl) URL.revokeObjectURL(videoUrl);
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("video/")) {
            if (videoUrl) URL.revokeObjectURL(videoUrl);
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = () => {
        setIsDraggingOver(false);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
        className={`relative flex flex-col items-center justify-center bg-gray-100 overflow-hidden ${
            isDragging ? "transition-none" : "transition-[height] duration-300 ease-in-out"
        }`}
        style={{ height }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        >
            <input
                type="file"
                accept="video/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

        {videoUrl ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="h-full max-h-full max-w-full object-contain"
                />
                <button
                onClick={() => {
                    if (videoUrl) URL.revokeObjectURL(videoUrl);
                    setVideoUrl(null);
                }}
                className="group absolute top-4 right-4 bg-white p-1.5 text-sm cursor-pointer rounded-lg transition-all duration-300 ease-in-out"
                >
                    <PackageX size={20} className="text-black" />

                    <span className="absolute top-1/2 right-[125%] -translate-y-1/2 px-2 py-1 text-xs font-medium text-white bg-black rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 ease-in-out whitespace-nowrap">
                        Delete project
                    </span>
                </button>
            </div>
        ) : (
            <div
            className={`flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-200 ease-in-out`}
            onClick={handleClick}
            >
                <div className="group w-16 h-16 rounded-xl bg-black flex items-center justify-center hover:scale-105 transition-transform duration-200">
                    <Plus size={32} className="text-white group-hover:text-cyan-500" />
                </div>
                <h5 className="font-semibold mt-6 text-black">
                    Click to upload
                </h5>
                <span className="mt-1 mb-6 text-sm text-gray-500 font-light">
                    Or drag and drop
                </span>
                <span className="text-xs text-gray-500 font-light">
                    MP4, MOV, AVI, or WebM
                </span>
            </div>
        )}
        </div>
    );
}
