"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Header({ user }: HeaderProps) {
  const userName = user?.name || user?.email || "User";
  const userImage = user?.image || "/default-avatar.png";

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 p-4">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8">
          <Image
            src={userImage}
            alt="User Avatar"
            fill
            sizes="32px"
            className="rounded-full object-cover"
          />
        </div>

        <span className="text-sm font-medium truncate max-w-[120px]">
          {userName}
        </span>

        <button
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          className="text-red-600 hover:text-red-800 text-sm transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
