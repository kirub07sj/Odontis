"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();

        const role = sessionData?.user?.role;
        if (role === "ADMIN") {
          router.push("/admin");
        } else if (role === "DOCTOR") {
          router.push("/doctor");
        } else if (role === "RECEPTIONIST") {
          router.push("/reception");
        } else {
          router.push("/");
        }

        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4 sm:p-8 font-sans">
      <div className="w-full max-w-[1200px] flex items-center justify-between gap-12 lg:gap-20 h-full min-h-[600px] max-h-[850px] my-auto">

        {/* Left Side - Image */}
        <div className="hidden lg:block w-1/2 h-full min-h-[700px] relative rounded-[32px] overflow-hidden shadow-2xl shadow-blue-900/5">
          <Image
            src="/images/tooth-bg.png"
            alt="Dental Tooth Art"
            fill
            className="object-cover hover:scale-105 transition-transform duration-[2s] ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
          {/* Overlay watermark */}
          <div className="absolute bottom-8 left-8 px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg">
            <p className="text-white text-[11px] font-semibold tracking-wide drop-shadow-sm animate-pulse">
              © 2026 Dental Clinic Management Sys. All Rights Reserved.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center relative py-12">
          <div className="w-full max-w-[520px] mx-auto flex flex-col justify-center">

            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-[28px] font-extrabold text-[#111111] leading-tight tracking-tight  mb-3 w-full">
                Dental Clinic Management
              </h1>
              <p className="text-gray-500 text-[16px] font-medium">
                Enter your details to access the system
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm text-center font-semibold shadow-sm blur-0">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-gray-600 tracking-wide" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-[#fcfcfc] border border-gray-200 rounded-xl outline-none focus:ring-[3px] focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[15px] placeholder:text-gray-400 font-medium text-gray-800 hover:border-gray-300"
                  placeholder="Sarah@example.com"
                  required
                />
              </div>

              <div className="space-y-2.5 pt-1">
                <label className="block text-sm font-bold text-gray-600 tracking-wide" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 bg-[#fcfcfc] border border-gray-200 rounded-xl outline-none focus:ring-[3px] focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[15px] font-mono placeholder:text-gray-400 font-medium text-gray-800 hover:border-gray-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex justify-end pt-1">
                <Link href="/forgot-password" className="text-[14px] text-gray-500 hover:text-[#0ea5e9] font-bold transition-colors">
                  Forget Password ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full py-4 px-4 bg-[#0ea5e9] hover:bg-[#0284c7] disabled:bg-[#0ea5e9]/70 text-white rounded-xl font-bold transition-all mt-4 shadow-lg shadow-[#0ea5e9]/25 hover:shadow-xl hover:shadow-[#0ea5e9]/30 flex items-center justify-center gap-2 text-[16px] hover:-translate-y-[1px]"
              >
                {isLoading ? "Signing in..." : (
                  <>
                    Sign in <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Inline Footer for premium look instead of absolute bottom corner */}
            <div className="mt-16 flex items-center justify-center lg:justify-end gap-6 text-[13px] font-medium text-gray-400">
              <Link href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-gray-700 transition-colors">Terms of Service</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
