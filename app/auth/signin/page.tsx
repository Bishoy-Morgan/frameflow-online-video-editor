"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import googleIcon from "@/public/icons/google.svg";
import Button from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";


export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="w-full flex items-center justify-center h-screen">
      {/* Left Side - Visual Section */}
      <div className="relative w-1/2  text-white h-full flex flex-col justify-center items-center">
      <div className="absolute inset-0 z-0 bg-linear-to-t from-black to-transparent"/>
        <video
          src="/videos/promo.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-10 text-center ">
          <p className="text-lg text-gray-500 max-w-md">Control every single pixel on your video with a lot of features provided by Editar</p>
        </div>
      </div>
      {/* Right Side - Form Section */}
      <div className="w-1/2 flex items-center justify-center h-full shadow-lg">
        <form onSubmit={handleSubmit} className="w-1/2 space-y-5">
          <div className="text-center">
            <h3 className="font-semibold text-2xl">Welcome back to Editar</h3>
            <p className="text-gray-500 text-sm mt-1">
              Continue your creative journey — sign in to edit your videos online.
            </p>
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center relative gap-2 border border-gray-300 rounded-md py-2.5 hover:bg-gray-50 transition-all cursor-pointer"
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
            <span className="text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center my-3">
            <div className="h-px bg-gray-300 w-1/3"></div>
            <span className="text-gray-400 text-sm mx-2">or</span>
            <div className="h-px bg-gray-300 w-1/3"></div>
          </div>

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2980B9]"
            required
          />

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2980B9]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
              <div className="w-5 h-5 border-3 border-[#2980B9] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-sm text-center text-gray-500">
            Don’t have an account?{" "}
            <a href="/auth/signup" className="text-[#2980B9] hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
