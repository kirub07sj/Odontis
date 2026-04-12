import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "RECEPTIONIST" && session.user.role !== "DOCTOR")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        appointments: {
          include: {
            doctor: {
              select: { name: true }
            }
          },
          orderBy: { datetime: "desc" },
          take: 1
        }
      }
    });

    // Formatting for the dash
    const mapped = patients.map((p) => {
      const latestAppointment = p.appointments[0];
      return {
        id: p.id,
        name: p.fullName,
        doctor: latestAppointment?.doctor?.name || "Unassigned",
        datetime: latestAppointment?.datetime || p.createdAt,
        status: latestAppointment?.status || "registered",
      };
    });

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("[PATIENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "RECEPTIONIST")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { 
      firstName, lastName, phoneNumber, age, gender, address, additionalInfo, doctorId 
    } = body;

    if (!firstName || !lastName || !phoneNumber || !age || !gender || !doctorId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const fullName = `${firstName} ${lastName}`;

    const newPatient = await prisma.patient.create({
      data: {
        fullName,
        phoneNumber,
        age,
        gender,
        address,
        additionalInfo,
        appointments: {
          create: {
            doctorId,
            datetime: new Date(),
            status: "waiting"
          }
        }
      },
      include: {
        appointments: true
      }
    });

    return NextResponse.json(newPatient);
  } catch (error) {
    console.error("[PATIENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
