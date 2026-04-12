// app/(dashboard)/layout.tsx
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#111111] font-sans flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6">
        <Header />
      </div>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-12">
        {children}
      </main>
    </div>
  );
}
