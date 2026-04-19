import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "DOCTOR") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { patientId, diagnosis, treatment, prescription, additionalInfo } = body;

    if (!patientId) {
      return new NextResponse("Missing patientId", { status: 400 });
    }

    // Verify doctor assignment
    const patient = await prisma.patient.findFirst({
      where: {
        id: patientId,
        appointments: { some: { doctorId: session.user.id } },
      },
    });

    if (!patient) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updated = await prisma.patient.update({
      where: { id: patientId },
      data: {
        diagnosis,
        treatment,
        prescription,
        additionalInfo,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATIENT_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
