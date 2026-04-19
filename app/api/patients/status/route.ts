import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Body = {
  patientId?: string;
  status?: "WAITING" | "IN_TREATMENT" | "COMPLETED";
};

const allowedTransitions: Record<string, string[]> = {
  WAITING: ["IN_TREATMENT"],
  IN_TREATMENT: ["COMPLETED"],
  COMPLETED: [],
};

function normalizeStatus(value: string) {
  return value.toUpperCase().replace(/-/g, "_");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "DOCTOR") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body: Body = await req.json();
    const { patientId, status } = body;

    if (!patientId || !status) {
      return new NextResponse("Missing patientId or status", { status: 400 });
    }

    // Fetch patient and verify doctor has an appointment with them
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        appointments: {
          where: {
            doctorId: session.user.id,
          },
          orderBy: {
            datetime: "desc",
          },
        },
      },
    });

    if (!patient) {
      return new NextResponse("Patient not found", { status: 404 });
    }

    // Ensure the doctor is assigned to this patient (has at least one appointment)
    if (!patient.appointments || patient.appointments.length === 0) {
      return new NextResponse("Forbidden: not assigned to this patient", { status: 403 });
    }

    const latestDoctorAppointment = patient.appointments[0];
    if (!latestDoctorAppointment) {
      return new NextResponse("No appointment found for this doctor and patient", {
        status: 404,
      });
    }

    const inTreatmentAppointment = patient.appointments.find(
      (appointment) => normalizeStatus(appointment.status || "WAITING") === "IN_TREATMENT",
    );
    const waitingAppointment = patient.appointments.find(
      (appointment) => normalizeStatus(appointment.status || "WAITING") === "WAITING",
    );

    const targetAppointment =
      status === "IN_TREATMENT"
        ? waitingAppointment ?? latestDoctorAppointment
        : inTreatmentAppointment ?? latestDoctorAppointment;

    const current = normalizeStatus(targetAppointment.status || "WAITING");

    if (status === current) {
      return NextResponse.json({ message: "No change", patient });
    }

    // Validate transition
    const allowed = allowedTransitions[current] || [];
    if (!allowed.includes(status)) {
      return new NextResponse("Invalid status transition", { status: 400 });
    }

    const appointmentStatusUpdate =
      status === "IN_TREATMENT" ? "in-treatment" : "done";

    const updated = await prisma.appointment.update({
      where: { id: targetAppointment.id },
      data: { status: appointmentStatusUpdate },
      include: {
        patient: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATIENT_STATUS_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
