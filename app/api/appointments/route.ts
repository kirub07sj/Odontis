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
    const { patientId, datetime } = body;

    if (!patientId || !datetime) {
      return new NextResponse("Missing patientId or datetime", { status: 400 });
    }

    const dt = new Date(datetime);
    if (isNaN(dt.getTime()) || dt.getTime() <= Date.now()) {
      return new NextResponse("Invalid datetime; must be in the future", { status: 400 });
    }

    // Ensure doctor is assigned to patient
    const patient = await prisma.patient.findFirst({
      where: {
        id: patientId,
        appointments: { some: { doctorId: session.user.id } },
      },
    });

    if (!patient) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const created = await prisma.appointment.create({
      data: {
        patientId,
        doctorId: session.user.id,
        datetime: dt,
        status: "waiting",
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error("[APPOINTMENT_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
