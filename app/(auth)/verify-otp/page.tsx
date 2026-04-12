"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus the first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if current one is filled
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current one is empty
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/reset-password";
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
        <div className="w-full max-w-md text-center">
          <h1 className="text-[28px] font-extrabold mb-3">OTP Verification</h1>
          <p className="text-gray-600 text-[15px] mb-2">Enter the OTP code we sent to your email</p>
          <p className="font-bold text-[15px] mb-8">Sarah@example.com</p>

          <form onSubmit={handleSubmit} className="text-left space-y-8">
            <div>
              <label className="block text-[14px] font-bold text-gray-500 mb-3">
                OTP code
              </label>
              <div className="flex justify-between gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold bg-[#fcfcfc] border border-gray-200 rounded-[8px] outline-none focus:ring-2 focus:ring-[#128fdb] focus:border-[#128fdb] transition-all"
                    maxLength={1}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.some((d) => d === "")}
              className="w-full py-4 bg-[#128fdb] hover:bg-[#0e7cb8] disabled:bg-[#128fdb]/70 text-white rounded-[8px] font-bold transition-colors shadow-sm"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
