"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { ReactNode, ComponentPropsWithoutRef, useState } from "react";

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

const sizes: Record<Size, string> = {
    sm: "text-body 3xl:text-lead px-4 3xl:px-6 py-2 3xl:py-2.5 gap-1.5",
    md: "text-body 3xl:text-lead px-6 py-3 gap-2",
    lg: "text-lead 3xl:text-hero px-6 py-3.5 3xl:py-3 gap-2.5",
};

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

    const containerStyles: Record<Variant, string> = {
        primary: "bg-accent border border-accent text-[--bg]",
        secondary: "bg-transparent border border-accent text-accent",
        ghost: "bg-transparent border border-transparent text-accent",
    };

    const overlayStyles: Record<Variant, string> = {
        primary: "bg-[var(--bg)]",
        secondary: "bg-accent",
        ghost: "bg-transparent",
    };

    const textColor: Record<Variant, { initial: string; hover: string }> = {
        primary: { initial: "var(--bg)", hover: "var(--accent)" },
        secondary: { initial: "var(--accent)", hover: "var(--bg)" },
        ghost: { initial: "var(--accent)",  hover: "var(--accent)"},
    }; 

    if (variant === "ghost") {
        return (
            <motion.button
                whileTap={{ scale: 0.97 }}
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                className={clsx(
                    "relative flex flex-row items-center justify-center font-semibold",
                    "rounded-xl cursor-pointer focus:outline-none transition-opacity duration-200",
                    "focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2",
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
                    <motion.span
                        className="absolute left-0 -bottom-0.5 h-px bg-accent"
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

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className={clsx(
                "relative flex flex-row items-center justify-center font-semibold",
                "rounded-xl overflow-hidden cursor-pointer focus:outline-none",
                "focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2",
                sizes[size],
                containerStyles[variant],
                className,
            )}
            {...props}
        >
            <motion.span
                aria-hidden
                className={clsx("absolute inset-x-0 bottom-0 pointer-events-none", overlayStyles[variant])}
                initial={{ height: "0%" }}
                animate={{ height: hovered ? "500%" : "0%" }}
                transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
                style={{ borderRadius: "50% 50% 0 0 / 60% 60% 0 0" }}
            />

            {icon && iconPosition === "left" && (
                <motion.span
                    className="relative z-10 shrink-0"
                    animate={{ color: hovered ? textColor[variant].hover : textColor[variant].initial }}
                    transition={{ duration: 0.22, delay: 0.08 }}
                >
                    {icon}
                </motion.span>
            )}

            <motion.span
                className="relative z-10"
                animate={{ color: hovered ? textColor[variant].hover : textColor[variant].initial }}
                transition={{ duration: 0.22, delay: 0.08 }}
            >
                {children}
            </motion.span>

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