"use client";

import { useRef, useState, useEffect } from "react";
import TopPanel from "./TopPanel";
import BottomPanel from "./BottomPanel";

export default function DashboardContent() {
  const [topHeight, setTopHeight] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const minTop = 50;
  const maxTop = 90;
  const frameRef = useRef<number | null>(null);

  // ✅ This ref must be created in the parent so both children share it
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const startY = e.clientY;
    const startTopVh = topHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);

      frameRef.current = requestAnimationFrame(() => {
        const deltaY = moveEvent.clientY - startY;
        const vhDelta = (deltaY / window.innerHeight) * 100;
        let newTopVh = startTopVh + vhDelta;

        if (newTopVh < minTop) newTopVh = minTop;
        if (newTopVh > maxTop) newTopVh = maxTop;

        setTopHeight(newTopVh);
      });
    };

    const onMouseUp = () => {
      setIsDragging(false);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const bottomHeight = 100 - topHeight;

  return (
    <div className="w-full h-screen flex flex-col select-none">
      {/* ✅ Pass the ref to TopPanel */}
      <TopPanel height={`${topHeight}vh`} isDragging={isDragging} videoRef={videoRef} />

      {/* Divider */}
      <div
        onMouseDown={handleMouseDown}
        className={`h-[3px] bg-gray-400 cursor-row-resize hover:bg-cyan-500 active:bg-cyan-500 transition-all duration-150 ${
          isDragging ? "opacity-100" : "opacity-0 hover:opacity-100"
        }`}
      />

      {/* ✅ Pass the same ref to BottomPanel */}
      <BottomPanel height={`${bottomHeight}vh`} isDragging={isDragging} videoRef={videoRef} />
    </div>
  );
}
