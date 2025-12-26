"use client";

import {
  UploadCloud,
  GalleryHorizontalEnd,
  Shapes,
  AudioLines,
  TypeOutline,
  Captions,
  Sparkles,
  Blend,
  Blocks,
} from "lucide-react";
import Image from "next/image";
import logo from "@/public/whiteLogo.png";

const navItems = [
  { icon: UploadCloud, label: "Media" },
  { icon: GalleryHorizontalEnd, label: "Templates" },
  { icon: Shapes, label: "Elements" },
  { icon: AudioLines, label: "Audio" },
  { icon: TypeOutline, label: "Text" },
  { icon: Captions, label: "Captions" },
  { icon: Sparkles, label: "Effects" },
  { icon: Blend, label: "Filters" },
  { icon: Blocks, label: "Plugins" },
];

export default function Sidebar() {
  return (
    <div className="bg-black text-white transition-all duration-300 flex flex-col items-center w-18">
      {/* Logo */}
      <div className="w-4/5 flex items-center justify-center border-gray-700 border-b py-4">
        <Image src={logo} alt="Logo" width={40} height={40} />
      </div>

      {/* Nav */}
      <nav className="flex flex-col items-center mt-4 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-hide">
        {navItems.map(({ icon: Icon, label }) => (
          <button key={label} className="sidebar-button group">
            <Icon
              size={20}
              className="text-gray-500 group-hover:text-white transition-all duration-300 ease-in-out"
            />
            <span className="text-[0.6rem] text-gray-500 group-hover:font-medium group-hover:text-white transition-all duration-300 ease-in-out">
              {label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
