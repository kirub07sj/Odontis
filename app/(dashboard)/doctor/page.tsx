import { DoctorNav } from "@/components/doctor/doctor-nav";
import {
  DoctorAppointmentsTable,
  DoctorCard,
} from "@/components/doctor/doctor-ui";
import {
  getDoctorDashboardData,
  requireDoctorUser,
} from "@/lib/doctor-dashboard";

export const dynamic = "force-dynamic";

export default async function DoctorDashboardPage() {
  const doctor = await requireDoctorUser();
  const { todayAppointments, upcomingAppointments } =
    await getDoctorDashboardData(doctor.id);

  return (
    <div className="flex w-full flex-col gap-8 rounded-3xl bg-white p-6 font-sans shadow-sm md:p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <DoctorNav currentPath="/doctor" />
        <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-bold text-sky-700">
          {doctor.name}&apos;s appointments for today and upcoming visits
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <DoctorCard
          title="Today's Patient List"
          description="Appointments scheduled for today under your care."
        >
          <DoctorAppointmentsTable
            appointments={todayAppointments}
            emptyMessage="No patients are scheduled for today."
          />
        </DoctorCard>

        <DoctorCard
          title="Appointed List"
          description="Future appointments already assigned to you."
        >
          <DoctorAppointmentsTable
            appointments={upcomingAppointments}
            emptyMessage="No future appointments are assigned yet."
            dateLabel="Appointment Date"
            compactDate
          />
        </DoctorCard>
      </div>
    </div>
  );
}
