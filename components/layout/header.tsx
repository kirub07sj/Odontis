"use client";

import { Search, Bell, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="flex justify-between items-center w-full pb-8">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm">
          {/* Simple Tooth SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
             <path d="M12 2C8 2 6 5 6 9v3c0 2-1 4-3 5h18c-2-1-3-3-3-5V9c0-4-2-7-6-7z"/>
             <path d="M10 22c0-2-1-4-3-4H6"/>
             <path d="M14 22c0-2 1-4 3-4h1"/>
          </svg>
        </Link>
        <span className="text-[20px] font-extrabold text-[#111111]">Odontis</span>
      </div>

      {/* Middle - Search Bar */}
      <div className="hidden md:flex flex-1 max-w-2xl mx-12 relative">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search Patient by Phone number, Name, Card ID"
          className="block w-full py-3.5 pl-12 pr-4 bg-white border-none rounded-full text-[14px] font-medium text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-[#0ea5e9] outline-none shadow-sm"
        />
      </div>

      {/* Right - Profile & Notifications */}
      <div className="flex items-center gap-6">
        <button className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm relative hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-3 right-3 block w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center justify-center w-12 h-12 bg-red-50 hover:bg-red-100 rounded-full shadow-sm transition-colors text-red-500"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>

        <Link href={`/${pathname.split('/')[1]}/settings`} className="flex items-center gap-3 group cursor-pointer">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm group-hover:bg-gray-50 transition-colors">
            <User className="w-6 h-6 text-gray-400" />
          </div>
          <div className="hidden md:flex flex-col items-start leading-tight">
            <span className="text-[14px] font-bold text-gray-900 group-hover:text-[#0ea5e9] transition-colors">Sarah Nahom</span>
            <span className="text-[12px] font-semibold text-gray-500">Reception</span>
          </div>
        </Link>
      </div>
    </header>
  );
};
