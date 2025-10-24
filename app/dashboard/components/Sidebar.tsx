"use client";
import Link from "next/link";
import { useState } from "react";
import { Home, User, Settings } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className={`font-bold text-xl ${!open && "hidden"}`}>Editar</h2>
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-500 hover:text-gray-700"
        >
          ☰
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
        >
          <Home size={20} /> {open && "Home"}
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
        >
          <User size={20} /> {open && "Profile"}
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
        >
          <Settings size={20} /> {open && "Settings"}
        </Link>
      </nav>
    </div>
  );
}
