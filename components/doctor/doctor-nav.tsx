import Link from "next/link";

type DoctorTab = {
  href: string;
  label: string;
};

const doctorTabs: DoctorTab[] = [
  { href: "/doctor", label: "Dashboard" },
  { href: "/doctor/patients", label: "Patients" },
  { href: "/doctor/appointments", label: "Appointments" },
];

export function DoctorNav({ currentPath }: { currentPath: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[15px] font-bold">
      {doctorTabs.map((tab) => {
        const isActive =
          tab.href === "/doctor"
            ? currentPath === tab.href
            : currentPath === tab.href ||
              currentPath.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-[8px] px-6 py-2.5 transition-colors ${
              isActive
                ? "bg-[#0ea5e9] text-white shadow-sm"
                : "bg-transparent text-[#111] hover:text-[#0ea5e9]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
