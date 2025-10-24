"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { ReactNode, ComponentPropsWithoutRef, useState } from "react";

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

    const baseStyles =
        "relative inline-flex items-center justify-center overflow-hidden rounded-md px-6 py-3 text-sm font-medium transition-all duration-300 focus:outline-none cursor-pointer";

    const variants: Record<Variant, string> = {
        primary: "bg-black text-white border border-black",
        secondary: "bg-white text-black border border-gray-300",
    };

    // Animation variants for the curved overlay
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

    const textVariants = {
        initial: {
            color: variant === "primary" ? "#ffffff" : "#000000",
        },
        hover: {
            color: variant === "primary" ? "#000000" : "#ffffff",
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
            className={clsx(baseStyles, variants[variant], className)}
            {...props}
        >
            {/* Curved overlay with circular top */}
            <motion.div
                className={clsx(
                    "absolute inset-x-0 bottom-0",
                    variant === "primary" ? "bg-white" : "bg-black"
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