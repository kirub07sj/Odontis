import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { UserProfile } from "@/components/shared/user-profile";

export default function DoctorSettingsPage() {
  return (
    <div className="w-full">
      <Link href="/doctor" className="inline-flex items-center gap-3 text-[#111] hover:text-gray-600 font-extrabold text-[15px] mb-4 transition-colors">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-gray-800 stroke-[2.5]" />
        </div>
        Back to Dashboard
      </Link>
      
      <UserProfile />
    </div>
  );
}
