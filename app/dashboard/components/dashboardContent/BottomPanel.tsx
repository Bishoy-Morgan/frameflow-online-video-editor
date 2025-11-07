"use client";

import { Play, Pause, Square } from "lucide-react";
import { RefObject } from "react";

interface BottomPanelProps {
    height: string;
    isDragging: boolean;
    videoRef: RefObject<HTMLVideoElement | null>; 
}

export default function BottomPanel({ height, isDragging, videoRef }: BottomPanelProps) {
    const handlePlay = () => videoRef.current?.play();
    const handlePause = () => videoRef.current?.pause();
    const handleStop = () => {
            if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            }
    };

    return (
    <div
      className={`bg-white flex flex-col items-center justify-center gap-4 ${
        isDragging ? "" : "transition-[height] duration-200 ease-in-out"
      }`}
      style={{ height, minHeight: "30vh" }}
    >
      <div className="flex gap-6">
            <button
            onClick={handlePlay}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2"
            >
                <Play size={18} /> Play
            </button>

        <button
          onClick={handlePause}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          <Pause size={18} /> Pause
        </button>

        <button
          onClick={handleStop}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          <Square size={18} /> Stop
        </button>
      </div>
    </div>
  );
}
