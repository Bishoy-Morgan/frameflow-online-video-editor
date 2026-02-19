"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import googleIcon from '@/public/icons/google.svg';
import whiteLogo  from '@/public/whiteLogo.png';
import blackLogo  from '@/public/blackLogo.png';
import Button from "@/components/ui/Button";
import SectionGrid from "@/components/ui/SectionGrid";

const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'var(--surface-raised)',
    border: '1px solid var(--border-default)',
    borderRadius: '0.625rem',
    padding: '0.625rem 1rem',
    fontSize: '0.875rem',
    fontFamily: 'var(--font-quicksand), sans-serif',
    fontWeight: 500,
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.2s ease',
}

export default function SignUpPage() {
    // const router = useRouter();
    const { isDark, mounted } = useTheme();

    const [name,         setName]         = useState("");
    const [email,        setEmail]        = useState("");
    const [password,     setPassword]     = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error,        setError]        = useState("");
    const [loading,      setLoading]      = useState(false);

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
        callbackUrl: "/features",
    });
}

const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
};

    return (
        <div className="w-full flex h-svh surface">

            {/* ── Left — form panel ── */}
            <div className="relative w-full lg:w-1/2 flex items-center justify-center h-full overflow-hidden">

                {/* Grid lives behind everything */}
                <SectionGrid />

                {/* Glows */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-[20%] -right-[10%] w-100 h-100 rounded-full"
                    style={{ background: 'radial-gradient(circle, var(--turquoise-8) 0%, transparent 70%)', filter: 'blur(60px)' }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-[20%] -left-[10%] w-75 h-75 rounded-full"
                    style={{ background: 'radial-gradient(circle, var(--turquoise-6) 0%, transparent 70%)', filter: 'blur(50px)' }}
                />

                {/* Form card — solid background so grid doesn't bleed through */}
                <div
                    className="relative z-10 w-full max-w-105 mx-6 flex flex-col gap-6 p-8 rounded-2xl"
                    style={{
                        backgroundColor: 'var(--bg)',
                        border: '1px solid var(--border-default)',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                    }}
                >

                    {/* Logo + brand */}
                    <div className="flex flex-col gap-3">
                        <Link href="/" style={{ textDecoration: 'none' }} className="flex items-center gap-2.5">
                            <Image
                                src={mounted ? (isDark ? whiteLogo : blackLogo) : blackLogo}
                                alt="Frameflow"
                                width={28}
                                height={28}
                                priority
                            />
                            <span
                                className="font-normal"
                                style={{ fontFamily: 'var(--font-dm-serif-display), serif', fontSize: '1.1rem', color: 'var(--text)' }}
                            >
                                Frameflow
                            </span>
                        </Link>
                        <div>
                            <h2 className="font-normal m-0" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', lineHeight: 1.15 }}>
                                Create your account.
                            </h2>
                            <p className="m-0 mt-1 text-sm text-tertiary">
                                Start editing smarter it&apos;s free.
                            </p>
                        </div>
                    </div>

                    {/* Google */}
                    <button
                        type="button"
                        onClick={handleGoogle}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none"
                        style={{
                            backgroundColor: 'var(--surface-raised)',
                            border: '1px solid var(--border-default)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem',
                            fontFamily: 'var(--font-quicksand), sans-serif',
                            fontWeight: 600,
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--border-strong)'
                            e.currentTarget.style.backgroundColor = 'var(--surface-sunken)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--border-default)'
                            e.currentTarget.style.backgroundColor = 'var(--surface-raised)'
                        }}
                    >
                        <Image src={googleIcon} alt="Google" width={18} height={18} />
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-default)' }} />
                        <span className="text-xs font-semibold text-tertiary">or</span>
                        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-default)' }} />
                    </div>

                    {/* Error */}
                    {error && (
                        <p
                            className="m-0 text-xs font-semibold px-4 py-2.5 rounded-lg"
                            style={{
                                color: '#ef4444',
                                backgroundColor: 'rgba(239,68,68,0.08)',
                                border: '1px solid rgba(239,68,68,0.2)',
                            }}
                        >
                            {error}
                        </p>
                    )}

                    {/* Form fields */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                        <input
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            style={inputStyle}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                            onBlur={e  => e.currentTarget.style.borderColor = 'var(--border-default)'}
                        />

                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                            onBlur={e  => e.currentTarget.style.borderColor = 'var(--border-default)'}
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={{ ...inputStyle, paddingRight: '2.75rem' }}
                                onFocus={e => e.currentTarget.style.borderColor = 'var(--turquoise-42)'}
                                onBlur={e  => e.currentTarget.style.borderColor = 'var(--border-default)'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none cursor-pointer transition-colors duration-150"
                                style={{ color: 'var(--text-subtle)', background: 'none', border: 'none', padding: 0 }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            className="w-full justify-center mt-1"
                        >
                            {loading
                                ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                                : 'Create account'
                            }
                        </Button>
                    </form>

                    {/* Sign in */}
                    <p className="m-0 text-sm text-center text-tertiary">
                        Already have an account?{' '}
                        <Link href="/auth/signin" className="font-semibold text-turquoise" style={{ textDecoration: 'none' }}>
                            Sign in
                        </Link>
                    </p>

                    {/* Legal */}
                    <p className="m-0 text-[0.68rem] text-center text-tertiary leading-relaxed">
                        By continuing you agree to our{' '}
                        <Link href="/terms"   className="text-secondary" style={{ textDecoration: 'underline' }}>Terms</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-secondary" style={{ textDecoration: 'underline' }}>Privacy Policy</Link>.
                    </p>

                </div>
            </div>

            {/* ── Right — visual ── */}
            <div className="hidden lg:flex relative w-1/2 h-full flex-col items-center justify-center overflow-hidden"
                style={{ backgroundColor: 'var(--surface-sunken)' }}
            >
                {/* Grid on right side too */}
                <SectionGrid />

                {/* Center glow */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full"
                    style={{ background: 'radial-gradient(circle, var(--turquoise-12) 0%, transparent 65%)', filter: 'blur(60px)' }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center gap-8 px-12">
                    <div className="flex flex-col items-center gap-3">
                        <Image
                            src={mounted ? (isDark ? whiteLogo : blackLogo) : blackLogo}
                            alt="Frameflow"
                            width={56}
                            height={56}
                            priority
                        />
                        <span
                            className="font-normal"
                            style={{ fontFamily: 'var(--font-dm-serif-display), serif', fontSize: '2rem', color: 'var(--text)' }}
                        >
                            Frameflow
                        </span>
                    </div>

                    <p className="m-0 text-base leading-relaxed text-tertiary" style={{ maxWidth: '300px' }}>
                        A fast, structured video editor that runs entirely in your browser. No install. No friction.
                    </p>

                    {/* Three trust stats */}
                    <div className="flex flex-col gap-3 w-full max-w-70">
                        {[
                            { stat: '60fps',  label: 'Timeline playback'    },
                            { stat: '4K',     label: 'Export quality'        },
                            { stat: '< 2s',   label: 'Project load time'     },
                        ].map(({ stat, label }) => (
                            <div
                                key={stat}
                                className="flex items-center justify-between px-5 py-3 rounded-xl"
                                style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-default)' }}
                            >
                                <span
                                    className="font-normal text-turquoise"
                                    style={{ fontFamily: 'var(--font-dm-serif-display), serif', fontSize: '1.1rem' }}
                                >
                                    {stat}
                                </span>
                                <span className="text-xs font-semibold text-tertiary">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom line */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                    <span className="text-[0.65rem] font-medium tracking-widest uppercase text-tertiary">
                        Browser Video Editor
                    </span>
                </div>
            </div>

        </div>
    );
}