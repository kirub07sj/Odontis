import { DoctorNav } from "@/components/doctor/doctor-nav";
import {
  DoctorCard,
  DoctorPatientsTable,
} from "@/components/doctor/doctor-ui";
import {
  getDoctorPatients,
  requireDoctorUser,
} from "@/lib/doctor-dashboard";

export const dynamic = "force-dynamic";

export default async function DoctorPatientsPage() {
  const doctor = await requireDoctorUser();
  const patients = await getDoctorPatients(doctor.id);

  return (
    <div className="flex w-full flex-col gap-8 rounded-3xl bg-white p-6 font-sans shadow-sm md:p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <DoctorNav currentPath="/doctor/patients" />
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600">
          {patients.length} patient{patients.length === 1 ? "" : "s"} assigned
          to you
        </div>
      </div>

      <DoctorCard
        title="Patients"
        description="Patients currently assigned to you (waiting or in treatment)."
      >
        <DoctorPatientsTable
          patients={patients}
          emptyMessage="You do not have any assigned patients yet."
        />
      </DoctorCard>
    </div>
  );
}
