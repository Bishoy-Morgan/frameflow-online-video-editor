"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTheme } from "@/hooks/useTheme";
import Image from "next/image";
import googleIcon from "@/public/icons/google.svg";
import Button from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";
import signinImage from '@/public/images/signin2.jpg'


export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isDark } = useTheme()

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
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="gradient-bg w-full flex items-center justify-center h-screen">
      {/* Left Side - Visual Section */}
      <div className="relative w-full h-full ">
        <Image 
          src={signinImage}
          alt="Video edit Image"
          fill
          className="object-cover"
        />
      </div>
      {/* Right Side - Form Section */}
      <div 
        className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1/3 flex items-center justify-center p-8 rounded-xl h-fit ${
          isDark ? "bg-black shadow-white/20 shadow" : "bg-white shadow-black/20 shadow"
        }`}
        style={{
            color: 'var(--text)',
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center">
            <h2>Welcome back to Frameflow</h2>
            <p className="text-lead mt-1">
              Continue your creative journey — sign in to edit your videos online.
            </p>
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center relative gap-2 border border-neutral-300 rounded-md py-2.5 hover:bg-neutral-50 transition-all cursor-pointer"
          >
            {/* Google Icon on the left */}
            <Image
              src={googleIcon}
              alt="Google icon"
              width={22}
              height={22}
              className="absolute left-3"
            />

            {/* Centered text */}
            <span className="text-black font-semibold text-lead">
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center my-3">
            <div className="h-px bg-neutral-300 w-1/3"></div>
            <span className="text-neutral-400 text-caption mx-2">or</span>
            <div className="h-px bg-neutral-300 w-1/3"></div>
          </div>

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-neutral-300 rounded-md px-4 py-2 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
            required
          />

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-300 rounded-md px-4 py-2 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Sign In Button */}
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-full py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-3 border-[#FF007F] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-body text-center text-neutral-500">
            Don’t have an account?{" "}
            <a href="/auth/signup" className="text-[#FF007F] hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
