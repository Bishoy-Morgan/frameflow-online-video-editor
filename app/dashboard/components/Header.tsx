"use client";

import Button from "@/components/ui/Button";
import { signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { Bolt, Languages, CircleUserRound, Moon, Sun, Contrast, Upload } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Header({ user }: HeaderProps) {
  const [settingsMenu, setSettingsMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [languageSubmenu, setLanguageSubmenu] = useState(false);
  const [themeSubmenu, setThemeSubmenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const menuRef = useRef<HTMLDivElement | null>(null);

  const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese"];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setSettingsMenu(false);
        setProfileMenu(false);
        setLanguageSubmenu(false);
        setThemeSubmenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15, ease: [0.42, 0, 1, 1] }
    }
  };

  const slideIn: Variants = {
    hidden: { opacity: 0, x: 10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
    },
    exit: {
      opacity: 0,
      x: 10,
      transition: { duration: 0.15, ease: [0.42, 0, 1, 1] }
    }
  };

  return (
    <header className="flex items-center justify-end gap-4 bg-white py-3 px-6 shadow-xs relative" ref={menuRef}>

      {/* Export button  */}
      <button className="flex items-center justify-center space-x-1 px-3 py-2 rounded-lg pink-gradient-bg transition-all duration-300 ease-linear text-white cursor-pointer">
        <Upload size={14}  />
        <span className="text-xs font-semibold">Export</span>
      </button>

      {/* <div
        className={`${profileMenu ? "gradient-bg" : "sky-gradient-bg"} relative w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:ring-1 hover:ring-gray-600 transition-all duration-300 ease-in-out`}
        onClick={() => {
          setProfileMenu(!profileMenu);
          setSettingsMenu(false);
        }}
      >
        <UserRound size={18} />
      </div> */}

      <div className={`${settingsMenu ? "bg-gray-200" : ""} w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-200 transition-all`}>
        <CircleUserRound 
          size={18}
          onClick={() => {
            setProfileMenu(!profileMenu);
            setSettingsMenu(false);
          }}
        />
      </div>
      <div className={`${settingsMenu ? "bg-gray-200" : ""} w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-200 transition-all`}>
        <Bolt
          size={18}
          className="cursor-pointer"
          onClick={() => {
            setSettingsMenu(!settingsMenu);
            setProfileMenu(false);
          }}
        />
      </div>

      {/* Settings Menu */}
      <AnimatePresence>
        {settingsMenu && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-16 right-2 w-auto p-4 bg-white rounded-xl flex flex-col items-start gap-3 shadow-xl z-20 border-gray-100 border"
          >
            <div
              className="relative w-full"
              onMouseEnter={() => setLanguageSubmenu(true)}
              onMouseLeave={() => setLanguageSubmenu(false)}
            >
              <span className="block mb-4 text-left text-gray-400 text-xs">Settings</span>
              <span className="text-sm py-2 px-3 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-2 cursor-pointer w-full">
                <Languages size={16} /> Language Settings
              </span>

              <AnimatePresence>
                {languageSubmenu && (
                  <motion.div
                    variants={slideIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-full top-0 ml-2 w-48 p-2 bg-white rounded-xl flex flex-col gap-1 shadow-xl z-30 border-gray-100 border"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`text-sm py-2 px-3 rounded-lg hover:bg-gray-100 text-left ${
                          selectedLanguage === lang ? "bg-gray-100 font-medium" : ""
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="relative w-full"
              onMouseEnter={() => setThemeSubmenu(true)}
              onMouseLeave={() => setThemeSubmenu(false)}
            >
              <span className="text-sm py-2 px-3 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-2 cursor-pointer w-full">
                {theme === "light" ? <Contrast size={16} /> : <Moon size={16} />} Theme
              </span>

              <AnimatePresence>
                {themeSubmenu && (
                  <motion.div
                    variants={slideIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-full top-0 ml-2 w-48 p-2 bg-white rounded-xl flex flex-col gap-1 shadow-xl z-30 border-gray-100 border"
                  >
                    <button
                      onClick={() => setTheme("light")}
                      className={`text-sm py-2 px-3 rounded-lg hover:bg-gray-100 text-left flex items-center gap-2 ${
                        theme === "light" ? "bg-gray-100 font-medium" : ""
                      }`}
                    >
                      <Sun size={16} /> Light
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`text-sm py-2 px-3 rounded-lg hover:bg-gray-100 text-left flex items-center gap-2 ${
                        theme === "dark" ? "bg-gray-100 font-medium" : ""
                      }`}
                    >
                      <Moon size={16} /> Dark
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Menu */}
      <AnimatePresence>
        {profileMenu && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-16 right-8 w-auto p-4 bg-white rounded-xl flex flex-col items-center gap-3 shadow-xl z-20 border-gray-100 border"
          >
            <Link
              href="/dashboard/profile"
              className="text-sm py-2 px-3 rounded-lg hover:bg-gray-100 transition-all"
            >
              Profile
            </Link>

            <Button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="text-sm py-1! px-2!"
            >
              Logout
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
