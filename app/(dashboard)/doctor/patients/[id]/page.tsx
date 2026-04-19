import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { DoctorNav } from "@/components/doctor/doctor-nav";
import { DoctorCard } from "@/components/doctor/doctor-ui";
import AppointmentForm from "@/components/patients/appointment-form";
import TreatmentWorkflow from "@/components/patients/treatment-workflow";
import {
  getDoctorPatientDetails,
  requireDoctorUser,
} from "@/lib/doctor-dashboard";

export const dynamic = "force-dynamic";

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatStatus(status: string) {
  return status.replace(/-/g, " ");
}

export default async function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const doctor = await requireDoctorUser();
  const { id } = await params;
  const patient = await getDoctorPatientDetails(doctor.id, id);

  if (!patient) {
    notFound();
  }

  const latestVisit = patient.appointments[0] ?? null;
  const patientAny = patient as any;
  const patientStatus = patientAny.status ?? (latestVisit?.status ?? "WAITING");
  const patientStartedAt = patientAny.startedAt ? String(patientAny.startedAt) : null;
  const patientCompletedAt = patientAny.completedAt ? String(patientAny.completedAt) : null;

  return (
    <div className="flex w-full flex-col gap-8 rounded-3xl bg-white p-6 font-sans shadow-sm md:p-10">
      <div className="flex flex-col gap-5">
        <DoctorNav currentPath="/doctor/patients" />
        <Link
          href="/doctor/patients"
          className="inline-flex items-center gap-3 text-[15px] font-extrabold text-[#111] transition-colors hover:text-gray-600"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
            <ChevronLeft className="h-5 w-5 text-gray-800" />
          </span>
          Back to Patients
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DoctorCard
          title="Patient Information"
          description={`ID: ${patient.id}`}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 shadow-sm md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Full Name
              </p>
              <p className="mt-2 text-[15px] font-bold text-slate-900">
                {patient.fullName}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Phone Number
              </p>
              <p className="mt-2 text-[15px] font-bold text-slate-900">
                {patient.phoneNumber}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Age / Gender
              </p>
              <p className="mt-2 text-[15px] font-bold text-slate-900">
                {patient.age} / {patient.gender}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Address
              </p>
              <p className="mt-2 text-[15px] font-bold text-slate-900">
                {patient.address || "No address recorded."}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Additional Information
              </p>
              <p className="mt-2 text-[15px] font-bold text-slate-900">
                {patient.additionalInfo || "No additional information recorded."}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Assigned Doctor
              </p>
              <p className="mt-2 text-[15px] font-bold text-slate-900">
                Dr. {doctor.name}
              </p>
            </div>
          </div>
        </DoctorCard>

        <DoctorCard
          title="Medical Information"
          description="One treatment workflow from start to completion with medical records."
        >
          <div className="grid gap-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <TreatmentWorkflow
                patientId={patient.id}
                initialStatus={patientStatus}
                startedAt={patientStartedAt}
                completedAt={patientCompletedAt}
                initial={{
                  diagnosis: patient.diagnosis ?? "",
                  treatment: patient.treatment ?? "",
                  prescription: patient.prescription ?? "",
                  additionalInfo: patient.additionalInfo ?? "",
                }}
              />
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Latest Appointment
              </p>
              <p className="mt-2 text-[15px] font-bold text-slate-900">
                {latestVisit ? formatDateTime(latestVisit.datetime) : "No visit"}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Appointment Date
              </p>
              <div className="mt-2">
                <AppointmentForm patientId={patient.id} />
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Total Visits With You
              </p>
              <p className="mt-2 text-[15px] font-bold text-slate-900">
                {patient.appointments.length}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Patient ID
              </p>
              <p className="mt-2 font-mono text-xs text-slate-500">
                {patient.id}
              </p>
            </div>
          </div>
        </DoctorCard>
      </div>

      <DoctorCard
        title="Appointment History"
        description="Appointments for this patient that were assigned to you."
      >
        <div className="space-y-3">
          {patient.appointments.length === 0 ? (
            <p className="py-4 text-sm font-medium text-slate-500">
              No appointment history found for this patient.
            </p>
          ) : null}
          {patient.appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[15px] font-extrabold text-slate-900">
                    {formatDateTime(appointment.datetime)}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Dr. {appointment.doctor.name}
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-sky-100 px-4 py-1.5 text-[13px] font-bold capitalize text-sky-700">
                  {formatStatus(appointment.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DoctorCard>
    </div>
  );
}
