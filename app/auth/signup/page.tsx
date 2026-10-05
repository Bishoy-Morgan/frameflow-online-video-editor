"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTheme } from "@/hooks/useTheme";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, MoveLeft, Sparkles, Play } from "lucide-react";
import lightEditorImg from "@/public/images/homepage/lighteditorImg.png";
import darkEditorImg from "@/public/images/homepage/darkeditorImg.png";
import googleIcon from "@/public/icons/google.svg";
import whiteLogo from "@/public/whiteLogo.png";
import blackLogo from "@/public/blackLogo.png";
import Button from "@/components/ui/Button";
import SectionGrid from "@/components/ui/SectionGrid";

export default function SignUpPage() {
    const { isDark } = useTheme();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email: email.toLowerCase(),
                password,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Something went wrong.");
            setLoading(false);
            return;
        }

        await signIn("credentials", {
            email: email.toLowerCase(),
            password,
            callbackUrl: "/dashboard",
        });
    }

    const handleGoogle = async () => {
        setLoading(true);
        await signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <main className="relative min-h-svh w-full overflow-hidden">
            <SectionGrid />

            <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
                <Link
                    href="/"
                    className="flex cursor-default items-center gap-2.5"
                >
                    <Image
                        src={isDark ? whiteLogo : blackLogo}
                        alt="Frameflow"
                        width={36}
                        height={36}
                        priority
                        suppressHydrationWarning
                    />
                    <h4 className="m-0 text-(--text)">
                        Frameflow
                    </h4>
                </Link>

                <Link
                    href="/"
                    className="group/btn flex items-center gap-2 text-small font-semibold text-subtle transition-all duration-150 hover:text-(--text)"
                >
                    <MoveLeft
                        size={18}
                        strokeWidth={2}
                        className="text-subtle transition-all duration-150 group-hover/btn:-translate-x-2 group-hover/btn:text-(--text)"
                    />
                    Back to home
                </Link>
            </header>

            <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-6 pb-16 pt-6 md:px-10 md:pb-20 md:pt-10">
                <div className="grid w-full items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 xl:gap-20">

                    <div className="mx-auto w-full max-w-105 lg:mx-0">
                        <div className="mb-7">
                            <span className="text-small font-medium uppercase tracking-[0.18em] text-accent">
                                Get started
                            </span>

                            <h1 className="mt-4 tracking-tight">
                                Start creating.
                            </h1>

                            <p className="mt-3 max-w-sm text-caption">
                                Build, edit, and finish your videos entirely
                                in your browser.
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-xl border border-accent-22 bg-(--bg) p-6 glow-accent-22 sm:p-8">
                            <button
                                type="button"
                                onClick={handleGoogle}
                                disabled={loading}
                                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-default bg-raised px-4 py-2.5 text-caption font-semibold text-secondary transition-all duration-150 hover:border-(--accent) hover:shadow-xs hover:shadow-[#00E6BB] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Image
                                    src={googleIcon}
                                    alt="Google"
                                    width={18}
                                    height={18}
                                />
                                Continue with Google
                            </button>

                            <div className="my-6 flex items-center gap-3">
                                <div className="h-px flex-1 bg-accent" />
                                <span className="text-small font-semibold text-tertiary">
                                    or
                                </span>
                                <div className="h-px flex-1 bg-accent" />
                            </div>

                            {error && (
                                <p className="mb-4 rounded-xl bg-error px-4 py-2.5 text-caption font-semibold text-white">
                                    {error}
                                </p>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4"
                            >
                                <div>
                                    <label className="mb-2 block text-small font-semibold text-tertiary">
                                        Full name
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                        className="w-full rounded-xl border border-default bg-raised px-4 py-2.5 text-caption font-medium text-(--text) outline-none transition-all duration-150 placeholder:text-(--text-subtle) focus:border-(--accent) focus:shadow-lg"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-small font-semibold text-tertiary">
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        className="w-full rounded-xl border border-default bg-raised px-4 py-2.5 text-caption font-medium text-(--text) outline-none transition-all duration-150 placeholder:text-(--text-subtle) focus:border-(--accent) focus:shadow-lg"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-small font-semibold text-tertiary">
                                        Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Create a password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                            className="w-full rounded-xl border border-default bg-raised px-4 py-2.5 pr-11 text-caption font-medium text-(--text) outline-none transition-all duration-150 placeholder:text-(--text-subtle) focus:border-(--accent) focus:shadow-lg"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((p) => !p)
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-subtle transition-colors duration-150 hover:text-(--text) focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                    className="mt-1 w-full justify-center"
                                >
                                    {loading ? (
                                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                        "Create account"
                                    )}
                                </Button>
                            </form>

                            <p className="mt-6 text-center text-small text-tertiary">
                                Already have an account?{" "}
                                <Link
                                    href="/auth/signin"
                                    className="font-semibold text-accent no-underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        <p className="mt-6 text-center text-small font-medium uppercase tracking-[0.16em] text-tertiary">
                            Browser-based video editor
                        </p>
                    </div>

                    <div className="relative hidden min-h-140 items-center lg:flex">
                        <div
                            aria-hidden
                            className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-16 blur-[90px]"
                        />

                        <div className="relative w-full">
                            <div className="absolute -right-4 -top-8 z-20 w-60 rounded-xl border border-accent-22 bg-(--bg) p-4 shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-16 text-accent">
                                        <Sparkles size={17} />
                                    </div>

                                    <div>
                                        <p className="text-small font-semibold">
                                            AI Project Generator
                                        </p>
                                        <p className="mt-0.5 text-tiny text-tertiary">
                                            Turn an idea into a timeline
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 rounded-lg border border-default bg-raised px-3 py-2">
                                    <p className="text-tiny text-secondary">
                                        Product launch video with three scenes
                                    </p>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl border border-accent-22 bg-(--bg) p-2 glow-accent-22">
                                <div className="relative overflow-hidden rounded-xl border border-default bg-sunken">
                                    <Image
                                        src={
                                            isDark
                                                ? darkEditorImg
                                                : lightEditorImg
                                        }
                                        alt="Frameflow video editor"
                                        width={1600}
                                        height={1000}
                                        priority
                                        className="block h-auto w-full"
                                    />

                                    <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-xl border border-default bg-(--bg) px-4 py-3 shadow-lg">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-(--bg)">
                                            <Play
                                                size={14}
                                                fill="currentColor"
                                                strokeWidth={2.5}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-small font-semibold">
                                                Your next video
                                            </p>
                                            <p className="text-tiny text-tertiary">
                                                Edit directly in your browser
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-7 left-8 z-20 flex items-center gap-3 rounded-xl border border-default bg-(--bg) px-4 py-3 shadow-xl">
                                <div className="flex gap-1">
                                    <div className="h-5 w-1.5 rounded-full bg-accent-40" />
                                    <div className="h-5 w-1.5 rounded-full bg-accent-22" />
                                    <div className="h-5 w-1.5 rounded-full bg-accent-16" />
                                </div>

                                <div>
                                    <p className="text-small font-semibold">
                                        Structured timeline
                                    </p>
                                    <p className="text-tiny text-tertiary">
                                        Everything stays organized
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-between px-2">
                                <span className="text-tiny font-medium uppercase tracking-[0.16em] text-tertiary">
                                    Frameflow editor
                                </span>

                                <div className="flex items-center gap-3">
                                    <div className="h-px w-12 bg-(--border-default)" />
                                    <span className="text-tiny font-medium text-tertiary">
                                        00:18
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}