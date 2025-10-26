"use client";

interface BottomPanelProps {
    height: string;
    isDragging: boolean;
}

export default function BottomPanel({ height, isDragging }: BottomPanelProps) {
    return (
        <div
        className={`bg-white overflow-auto  ${
            isDragging ? "transition-none" : "transition-[height] duration-300 ease-in-out"
        }`}
        style={{ height, minHeight: "30vh" }}
        >
            <div className="p-4 text-center font-medium ">
                Bottom Container — {height}
            </div>
        </div>
    );
}
