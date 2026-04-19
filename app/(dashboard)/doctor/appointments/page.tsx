import { DoctorNav } from "@/components/doctor/doctor-nav";
import {
  DoctorAppointmentsTable,
  DoctorCard,
} from "@/components/doctor/doctor-ui";
import {
  getDoctorAppointments,
  requireDoctorUser,
} from "@/lib/doctor-dashboard";

export const dynamic = "force-dynamic";

export default async function DoctorAppointmentsPage() {
  const doctor = await requireDoctorUser();
  const appointments = await getDoctorAppointments(doctor.id);

  const now = new Date();
  const futureAppointments = (appointments || []).filter(
    (a: (typeof appointments)[number]) => {
    const dt = a.datetime ? new Date(a.datetime) : null;
    return dt ? dt.getTime() > now.getTime() : false;
    },
  );

  return (
    <div className="flex w-full flex-col gap-8 rounded-3xl bg-white p-6 font-sans shadow-sm md:p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <DoctorNav currentPath="/doctor/appointments" />
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600">
          {futureAppointments.length} appointment
          {futureAppointments.length === 1 ? "" : "s"} assigned to you
        </div>
      </div>

      <DoctorCard
        title="Appointments"
        description="All appointments where the patient is assigned to you as the doctor."
      >
        <DoctorAppointmentsTable
          appointments={futureAppointments}
          emptyMessage="No upcoming appointments are currently assigned to you."
        />
      </DoctorCard>
    </div>
  );
}
