import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "RECEPTIONIST" && session.user.role !== "DOCTOR")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          orderBy: { datetime: "desc" },
          include: {
            doctor: { select: { name: true } }
          }
        }
      }
    });

    if (!patient) return new NextResponse("Not Found", { status: 404 });

    return NextResponse.json(patient);
  } catch (error) {
    console.error("[PATIENT_ID_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "RECEPTIONIST")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { firstName, lastName, phoneNumber, age, gender, address, additionalInfo, doctorId } = body;

    if (!firstName || !lastName || !phoneNumber || !age || !gender || !doctorId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const fullName = `${firstName} ${lastName}`;

    // Get current patient to see latest appointment
    const currentPatient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          orderBy: { datetime: "desc" },
          take: 1
        }
      }
    });

    const latestAppointment = currentPatient?.appointments[0];

    // Build update parameters
    const updateData: any = {
      fullName,
      phoneNumber,
      age,
      gender,
      address,
      additionalInfo,
    };

    // Check if the assigned doctor has changed. If so, create new timestamped Visit!
    if (!latestAppointment || latestAppointment.doctorId !== doctorId) {
      updateData.appointments = {
        create: {
          doctorId,
          datetime: new Date(),
          status: "waiting"
        }
      };

      // If the old appointment was still active, close it out so the old doctor's load drops
      if (latestAppointment && (latestAppointment.status === "waiting" || latestAppointment.status === "in-treatment")) {
        updateData.appointments.update = {
          where: { id: latestAppointment.id },
          data: { status: "reassigned" }
        };
      }
    }

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: updateData,
      include: { appointments: true }
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("[PATIENT_ID_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
