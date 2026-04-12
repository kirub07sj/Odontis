"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login?message=Password reset successful");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white p-6 md:p-12 font-sans font-medium text-[#111]">
      <header className="flex justify-end items-center w-full max-w-7xl mx-auto">
        <div className="w-12 h-12 bg-gray-300 rounded-sm"></div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center -mt-20">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-[28px] font-extrabold mb-3">Change Password</h1>
          <p className="text-gray-600 text-[15px] mb-8">Insert a new password</p>

          <form onSubmit={handleSubmit} className="text-left space-y-6">
            <div className="space-y-1.5">
              <label className="block text-[14px] font-bold text-gray-500" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-4 bg-[#fcfcfc] border border-gray-100 rounded-[8px] outline-none focus:ring-2 focus:ring-[#128fdb] focus:border-transparent transition-all text-sm font-mono placeholder:text-gray-400"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[14px] font-bold text-gray-500" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 bg-[#fcfcfc] border border-gray-100 rounded-[8px] outline-none focus:ring-2 focus:ring-[#128fdb] focus:border-transparent transition-all text-sm font-mono placeholder:text-gray-400"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full py-4 bg-[#128fdb] hover:bg-[#0e7cb8] disabled:bg-[#128fdb]/70 text-white rounded-[8px] font-bold transition-colors shadow-sm mt-2"
            >
              {isLoading ? "Updating..." : "Set Password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
