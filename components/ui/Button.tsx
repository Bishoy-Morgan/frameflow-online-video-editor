"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { ReactNode, ComponentPropsWithoutRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

type Variant = "primary" | "secondary";

interface ButtonProps extends ComponentPropsWithoutRef<typeof motion.button> {
    variant?: Variant;
    children: ReactNode;
    className?: string;
}

export default function Button({
    variant = "primary",
    children,
    className,
    ...props
}: ButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { isDark } = useTheme();

    const baseStyles =
        "relative inline-flex items-center justify-center overflow-hidden rounded-xl px-8 py-3 text-lead !leading-sung font-bold transition-all duration-300 focus:outline-none cursor-pointer";

    const getVariantStyles = () => {
        if (variant === "primary") {
            return isDark
                ? "bg-white text-black border border-white" 
                : "bg-black text-white border border-black";
        }
        if (variant === "secondary") {
            return "bg-[#FF007F] text-white border border-[#FF007F]";
        }
        return "";
    };

    const overlayVariants = {
        initial: {
            y: "100%",
        },
        hover: {
            y: "0%",
            transition: {
                duration: 1,
                ease: [0.33, 1, 0.68, 1] as const,
            },
        },
    };

    const getOverlayColor = () => {
        if (variant === "primary") {
            return isDark ? "bg-black" : "bg-white";
        }
        if (variant === "secondary") {
            return isDark ? 'bg-black' : 'bg-white';
        }
        return "bg-white";
    };

    // Get text colors based on variant and theme
    const getTextColors = () => {
        if (variant === "primary") {
            return isDark 
                ? { initial: "#000000", hover: "#ffffff" }
                : { initial: "#ffffff", hover: "#000000" };
        }
        if (variant === "secondary") {
            return {
                initial: "#000000",
                hover: "#FF007F"
            };
        }
        return {
            initial: "#ffffff",
            hover: "#000000"
        };
    };

    const textColors = getTextColors();

    const textVariants = {
        initial: {
            color: textColors.initial,
        },
        hover: {
            color: textColors.hover,
            transition: {
                duration: 0.3,
                delay: 0.1,
            },
        },
    };

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={clsx(baseStyles, getVariantStyles(), className)}
            {...props}
        >
            {/* Curved overlay with circular top */}
            <motion.div
                className={clsx(
                    "absolute inset-x-0 bottom-0",
                    getOverlayColor()
                )}
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
                variants={overlayVariants}
                style={{
                    height: "500%",
                    borderRadius: "50% 50% 0 0 / 80% 80% 0 0",
                }}
            />

            {/* Text content */}
            <motion.span
                className="relative z-10"
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
                variants={textVariants}
            >
                {children}
            </motion.span>
        </motion.button>
    );
}