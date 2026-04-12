"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/verify-otp";
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white p-6 md:p-12 font-sans font-medium text-[#111]">
      <header className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <Link href="/login" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-gray-700 stroke-[2.5]" />
          </div>
          <span className="font-semibold text-[15px]">Back to sign in</span>
        </Link>
        <div className="w-12 h-12 bg-gray-300 rounded-sm"></div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center -mt-20">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-[28px] font-extrabold mb-3">Reset Your Password</h1>
          <p className="text-gray-600 text-[15px] mb-8">Enter the email you have been using</p>

          <form onSubmit={handleSubmit} className="text-left space-y-6">
            <div className="space-y-1.5">
              <label className="block text-[14px] font-bold text-gray-500" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-[#fcfcfc] border border-gray-100 rounded-[8px] outline-none focus:ring-2 focus:ring-[#128fdb] focus:border-transparent transition-all text-sm placeholder:text-gray-400"
                placeholder="Sarah@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#128fdb] hover:bg-[#0e7cb8] disabled:bg-[#128fdb]/70 text-white rounded-[8px] font-bold transition-colors shadow-sm"
            >
              {isLoading ? "Verifying..." : "Verify your email"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
