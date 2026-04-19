import Link from "next/link";

import type {
  DoctorAppointmentItem,
  DoctorPatientItem,
} from "@/lib/doctor-dashboard";

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(value);
}

function formatStatus(status: string) {
  return status.replace(/[-_]/g, " ");
}

function statusClasses(status: string) {
  switch (status) {
    case "DONE":
    case "done":
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "in_treatment":
    case "in-treatment":
    case "IN_TREATMENT":
      return "bg-amber-100 text-amber-700";
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-700";
    case "waiting":
    case "WAITING":
      return "bg-sky-100 text-sky-700";
    default:
      return "bg-sky-100 text-sky-700";
  }
}

export function DoctorCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-[#fafafa] p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-[22px] font-extrabold text-[#4a4a4a]">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm font-medium text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function DoctorAppointmentsTable({
  appointments,
  emptyMessage,
  dateLabel = "Date & Time",
  compactDate = false,
}: {
  appointments: DoctorAppointmentItem[];
  emptyMessage: string;
  dateLabel?: string;
  compactDate?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 text-[14px] font-bold text-slate-500">
            <th className="pb-4 font-bold min-w-[190px]">Patient</th>
            <th className="pb-4 font-bold min-w-[140px]">Patient ID</th>
            <th className="pb-4 font-bold min-w-[170px]">{dateLabel}</th>
            <th className="pb-4 font-bold min-w-[120px] text-center">Status</th>
          </tr>
        </thead>
        <tbody className="text-[14px] font-bold text-slate-900">
          {appointments.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-8 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : null}
          {appointments.map((appointment) => {
            const href = `/doctor/patients/${appointment.patient.id}`;

            return (
              <tr
                key={appointment.id}
                className="border-b border-slate-100 transition-colors hover:bg-white"
              >
                <td className="py-4">
                  <Link
                    href={href}
                    className="block rounded-lg py-1 text-slate-900 hover:text-[#0ea5e9]"
                  >
                    {appointment.patient.fullName}
                  </Link>
                </td>
                <td className="py-4 font-mono text-xs text-slate-500">
                  <Link href={href} className="block rounded-lg py-1">
                    {appointment.patient.id}
                  </Link>
                </td>
                <td className="py-4 text-slate-500">
                  <Link href={href} className="block rounded-lg py-1">
                    {compactDate
                      ? formatDate(appointment.datetime)
                      : formatDateTime(appointment.datetime)}
                  </Link>
                </td>
                <td className="py-4 text-center">
                  <Link href={href} className="inline-flex rounded-full">
                    <span
                      className={`inline-flex min-w-[110px] justify-center rounded-full px-4 py-1.5 text-[13px] font-bold capitalize ${statusClasses(
                        appointment.status,
                      )}`}
                    >
                      {formatStatus(appointment.status)}
                    </span>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function DoctorPatientsTable({
  patients,
  emptyMessage,
}: {
  patients: DoctorPatientItem[];
  emptyMessage: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 text-[14px] font-bold text-slate-500">
            <th className="pb-4 font-bold min-w-[190px]">Patient</th>
            <th className="pb-4 font-bold min-w-[150px]">Phone Number</th>
            <th className="pb-4 font-bold min-w-[90px]">Age</th>
            <th className="pb-4 font-bold min-w-[170px]">Latest Visit</th>
            <th className="pb-4 font-bold min-w-[120px] text-center">Status</th>
            <th className="pb-4 font-bold min-w-[90px] text-center">Visits</th>
          </tr>
        </thead>
        <tbody className="text-[14px] font-bold text-slate-900">
          {patients.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : null}
          {patients.map((patient) => {
            const href = `/doctor/patients/${patient.id}`;

            return (
              <tr
                key={patient.id}
                className="border-b border-slate-100 transition-colors hover:bg-white"
              >
                <td className="py-4">
                  <Link
                    href={href}
                    className="block rounded-lg py-1 text-slate-900 hover:text-[#0ea5e9]"
                  >
                    {patient.fullName}
                  </Link>
                </td>
                <td className="py-4 text-slate-500">
                  <Link href={href} className="block rounded-lg py-1">
                    {patient.phoneNumber}
                  </Link>
                </td>
                <td className="py-4 text-slate-500">
                  <Link href={href} className="block rounded-lg py-1">
                    {patient.age}
                  </Link>
                </td>
                <td className="py-4 text-slate-500">
                  <Link href={href} className="block rounded-lg py-1">
                    {formatDateTime(patient.latestAppointmentAt)}
                  </Link>
                </td>
                <td className="py-4 text-center">
                  <Link href={href} className="inline-flex rounded-full">
                    <span
                      className={`inline-flex min-w-[110px] justify-center rounded-full px-4 py-1.5 text-[13px] font-bold capitalize ${statusClasses(
                        patient.latestAppointmentStatus,
                      )}`}
                    >
                      {formatStatus(patient.latestAppointmentStatus)}
                    </span>
                  </Link>
                </td>
                <td className="py-4 text-center text-slate-500">
                  <Link href={href} className="block rounded-lg py-1">
                    {patient.totalAppointments}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
