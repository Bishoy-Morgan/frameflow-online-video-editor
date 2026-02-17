"use client";

import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { ReactNode, ComponentPropsWithoutRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = "primary" | "secondary" | "ghost";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ComponentPropsWithoutRef<typeof motion.button> {
    variant?:  Variant;
    size?:     Size;
    children:  ReactNode;
    className?: string;
    icon?:     ReactNode;
    iconPosition?: "left" | "right";
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const sizes: Record<Size, string> = {
    sm: "px-4 py-2 text-sm   gap-1.5",
    md: "px-6 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg   gap-2.5",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Button({
    variant  = "primary",
    size     = "md",
    children,
    className,
    icon,
    iconPosition = "left",
    ...props
}: ButtonProps) {
    const [hovered, setHovered] = useState(false);

    // ── Variant config ────────────────────────────────────────────────────────
    // primary   → solid turquoise, fill wipes to --bg on hover (text flips to turquoise)
    // secondary → transparent with turquoise border, fill wipes to turquoise on hover (text flips to --bg)
    // ghost     → no border, no background, text turquoise, subtle underline on hover

    const containerStyles: Record<Variant, string> = {
        primary:   "bg-turquoise   border border-turquoise   text-[--bg]",
        secondary: "bg-transparent border border-turquoise   text-turquoise",
        ghost:     "bg-transparent border border-transparent text-turquoise",
    };

    const overlayStyles: Record<Variant, string> = {
        primary:   "bg-[var(--bg)]",
        secondary: "bg-turquoise",
        ghost:     "bg-transparent",
    };

    // Text color before / after hover
    const textColor: Record<Variant, { initial: string; hover: string }> = {
        primary:   { initial: "var(--bg)",        hover: "var(--turquoise)" },
        secondary: { initial: "var(--turquoise)",  hover: "var(--bg)"       },
        ghost:     { initial: "var(--turquoise)",  hover: "var(--turquoise)"},
    };

    // ── Ghost is simpler — no fill overlay ────────────────────────────────────
    if (variant === "ghost") {
        return (
            <motion.button
                whileTap={{ scale: 0.97 }}
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                className={clsx(
                    "relative inline-flex items-center justify-center font-semibold",
                    "rounded-lg cursor-pointer focus:outline-none transition-opacity duration-200",
                    "focus-visible:ring-2 focus-visible:ring-[var(--turquoise)] focus-visible:ring-offset-2",
                    sizes[size],
                    containerStyles.ghost,
                    className,
                )}
                {...props}
            >
                {icon && iconPosition === "left" && (
                    <span className="shrink-0">{icon}</span>
                )}
                <span className="relative">
                    {children}
                    {/* Underline */}
                    <motion.span
                        className="absolute left-0 -bottom-0.5 h-px bg-turquoise"
                        initial={{ width: "0%" }}
                        animate={{ width: hovered ? "100%" : "0%" }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                </span>
                {icon && iconPosition === "right" && (
                    <span className="shrink-0">{icon}</span>
                )}
            </motion.button>
        );
    }

    // ── Primary & secondary — wipe fill animation ─────────────────────────────
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className={clsx(
                "relative inline-flex items-center justify-center font-semibold",
                "rounded-lg overflow-hidden cursor-pointer focus:outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--turquoise)] focus-visible:ring-offset-2",
                sizes[size],
                containerStyles[variant],
                className,
            )}
            {...props}
        >
            {/* Fill wipe overlay */}
            <motion.span
                aria-hidden
                className={clsx("absolute inset-x-0 bottom-0 pointer-events-none", overlayStyles[variant])}
                initial={{ height: "0%" }}
                animate={{ height: hovered ? "500%" : "0%" }}
                transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
                style={{ borderRadius: "50% 50% 0 0 / 60% 60% 0 0" }}
            />

            {/* Icon left */}
            {icon && iconPosition === "left" && (
                <motion.span
                    className="relative z-10 shrink-0"
                    animate={{ color: hovered ? textColor[variant].hover : textColor[variant].initial }}
                    transition={{ duration: 0.22, delay: 0.08 }}
                >
                    {icon}
                </motion.span>
            )}

            {/* Label */}
            <motion.span
                className="relative z-10"
                animate={{ color: hovered ? textColor[variant].hover : textColor[variant].initial }}
                transition={{ duration: 0.22, delay: 0.08 }}
            >
                {children}
            </motion.span>

            {/* Icon right */}
            {icon && iconPosition === "right" && (
                <motion.span
                    className="relative z-10 shrink-0"
                    animate={{ color: hovered ? textColor[variant].hover : textColor[variant].initial }}
                    transition={{ duration: 0.22, delay: 0.08 }}
                >
                    {icon}
                </motion.span>
            )}
        </motion.button>
    );
}