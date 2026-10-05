"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTheme } from "@/hooks/useTheme";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, MoveLeft } from "lucide-react";
import googleIcon from "@/public/icons/google.svg";
import whiteLogo from "@/public/whiteLogo.png";
import blackLogo from "@/public/blackLogo.png";
import Button from "@/components/ui/Button";
import SectionGrid from "@/components/ui/SectionGrid";


export default function SignInPage() {
    const router = useRouter();
    const { isDark } = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid email or password.");
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <main className="relative min-h-svh w-full overflow-hidden">
            <SectionGrid />

            <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 cursor-default"
                >
                    <Image
                        src={isDark ? whiteLogo : blackLogo}
                        alt="Frameflow"
                        width={36}
                        height={36}
                        priority
                        suppressHydrationWarning
                    />

                    <h4 className="text-(--text) m-0" >
                        Frameflow
                    </h4>
                </Link>

                <Link
                    href="/"
                    className="group/btn flex items-center gap-2 text-small font-semibold text-subtle hover:text-black transition-all duration-150"
                >
                    <MoveLeft size={18} strokeWidth={2} className="text-subtle group-hover/btn:text-black group-hover/btn:-translate-x-2 transition-all duration-150" />
                    Back to home
                </Link>
            </header>

            <div className="relative z-10 flex min-h-[calc(100svh-82px)] items-center justify-center px-6 pb-12 pt-8">
                <div className="w-full max-w-105 ">

                    <div className="mb-8 text-center">
                        <span className="text-small font-medium uppercase tracking-[0.18em] text-accent">
                            Welcome back
                        </span>

                        <h1 className="mt-4 tracking-tight text-main">
                            Continue creating.
                        </h1>

                        <p className="mx-auto mt-3 max-w-sm text-caption">
                            Your projects are right where you left them.
                        </p>
                    </div>

                    <div className="relative overflow-hidden rounded-xl p-6 sm:p-8 border border-accent-22 glow-accent-22 bg-(--bg)" >

                            <button
                                type="button"
                                onClick={() =>
                                    signIn("google", {
                                        callbackUrl: "/dashboard",
                                    })
                                }
                                disabled={loading}
                                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-default bg-raised px-4 py-2.5 text-caption font-semibold text-secondary transition-all duration-150 hover:border-(--accent) hover: shadow-xs hover:shadow-[#00E6BB] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Image
                                    src={googleIcon}
                                    alt="Google"
                                    width={18}
                                    height={18}
                                />
                                Continue with Google
                            </button>

                            <div className="my-6 flex items-center gap-3 ">
                                <div className="h-px flex-1 bg-accent" />

                                <span className="text-small font-semibold text-tertiary">
                                    or
                                </span>

                                <div className="h-px flex-1 bg-accent" />
                            </div>

                            {error && (
                                <p className="mb-4 rounded-xl px-4 py-2.5 text-caption font-semibold text-white bg-error ">
                                    {error}
                                </p>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4"
                            >
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
                                        className="w-full rounded-xl border border-default bg-raised px-4 py-2.5 text-caption font-medium text-(--text) outline-none transition-all duration-150 placeholder:text-(--text-subtle) focus:border-(--accent) focus:shadow-lg "
                                    />
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label className="text-small font-semibold text-tertiary">
                                            Password
                                        </label>

                                        <Link
                                            href="/auth/forgot-password"
                                            className="text-small font-semibold text-tertiary transition-colors duration-150 hover:text-(--text)"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                            className="w-full rounded-xl border border-default bg-raised px-4 py-2.5 text-caption font-medium text-(--text) outline-none transition-all duration-150 placeholder:text-(--text-subtle) focus:border-(--accent) focus:shadow-lg "
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (p) => !p
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors duration-150 focus:outline-none text-subtle"
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.color =
                                                    "var(--text)")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.color =
                                                    "var(--text-subtle)")
                                            }
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
                                        "Sign in"
                                    )}
                                </Button>
                            </form>

                            <p className="mt-6 text-center text-small text-tertiary">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/auth/signup"
                                    className="font-semibold text-accent"
                                    style={{
                                        textDecoration: "none",
                                    }}
                                >
                                    Sign up free
                                </Link>
                            </p>
                    </div>

                    <div className="mt-10">
                        <div className="flex items-center gap-3">
                            <span className="text-tiny font-medium uppercase tracking-[0.16em] text-tertiary">
                                Timeline
                            </span>

                            <div
                                className="relative h-px flex-1 overflow-hidden bg-(--border-default)"
                            >
                                <div
                                    className="absolute left-[34%] top-1/2 h-2.5 w-px -translate-y-1/2 bg-accent"
                                />
                            </div>

                            <span className="text-tiny font-medium text-tertiary">
                                00:18
                            </span>
                        </div>

                        <div className="mt-2 flex gap-1.5">
                            <div className="h-1.5 w-[18%] rounded-full bg-accent-40"/>
                            <div className="h-1.5 w-[27%] rounded-full bg-(--border-strong)"/>
                            <div className="h-1.5 w-[12%] rounded-full bg-accent-16"/>
                            <div className="h-1.5 flex-1 rounded-full bg-(--border-default)"/>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-small font-medium uppercase tracking-[0.16em] text-tertiary">
                        Browser-based video editor
                    </p>
                </div>
            </div>
        </main>
    );
}