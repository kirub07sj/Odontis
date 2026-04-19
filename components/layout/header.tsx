"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bell, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { usePatientStore } from "@/features/patients/patient.store";

interface SearchPatientResult {
  id: string;
  fullName: string;
  phoneNumber: string;
}

export const Header = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { openProfileModal } = usePatientStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchPatientResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debouncing hook
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch logic hook
  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedQuery.trim().length === 0) {
        setResults([]);
        setIsDropdownOpen(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setIsDropdownOpen(true);
      try {
        const res = await fetch(`/api/patients/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };

    handleSearch();
  }, [debouncedQuery]);

  const handleResultClick = (id: string) => {
    setSearchQuery("");
    setIsDropdownOpen(false);
    openProfileModal(id);
  };

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
      <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl mx-12 relative z-50">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-10">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => { if (searchQuery.trim().length > 0) setIsDropdownOpen(true); }}
          placeholder="Search Patient by Phone number, Name"
          className="block w-full py-3.5 pl-12 pr-4 bg-white border-none rounded-full text-[14px] font-medium text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-[#0ea5e9] outline-none shadow-sm relative z-20"
        />
        
        {/* Dropdown Results Overlay */}
        {isDropdownOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white/70 backdrop-blur-3xl border border-white/40 shadow-2xl rounded-3xl p-4 flex flex-col gap-2 max-h-[400px] overflow-y-auto">
             {isSearching ? (
               <div className="flex items-center justify-center p-8">
                 <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0ea5e9] rounded-full animate-spin"></div>
               </div>
             ) : results.length > 0 ? (
               results.map((patient) => (
                 <div 
                   key={patient.id}
                   onClick={() => handleResultClick(patient.id)}
                   className="bg-white border border-gray-50 hover:border-blue-100 hover:shadow-md cursor-pointer rounded-2xl p-4 flex justify-between items-center transition-all group"
                 >
                   <div className="flex flex-col flex-1">
                     <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Full Name</span>
                     <span className="text-[15px] font-extrabold text-gray-800 group-hover:text-[#0ea5e9] transition-colors truncate">{patient.fullName}</span>
                   </div>
                   <div className="flex flex-col w-32">
                     <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Phone Number</span>
                     <span className="text-[14px] font-bold text-gray-600">{patient.phoneNumber}</span>
                   </div>
                   <div className="flex flex-col w-20 text-right pr-2">
                     <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Card ID</span>
                     <span className="text-[15px] font-mono font-black text-gray-800">{patient.id.slice(-4)}</span>
                   </div>
                 </div>
               ))
             ) : (
               <div className="flex items-center justify-center p-8 bg-white border border-gray-50 rounded-2xl">
                 <span className="text-[15px] font-bold text-gray-500">Patient Not Found</span>
               </div>
             )}
          </div>
        )}
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
            <span className="text-[14px] font-bold text-gray-900 group-hover:text-[#0ea5e9] transition-colors">
              {status === "loading" ? "..." : session?.user?.name || "Guest"}
            </span>
            <span className="text-[12px] font-semibold text-gray-500 capitalize">
              {status === "loading" ? "" : session?.user?.role?.toLowerCase() || "User"}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};
