import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "RECEPTIONIST")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const doctors = await prisma.user.findMany({
      where: { role: "DOCTOR" },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            appointments: {
              where: {
                status: {
                  in: ["waiting", "in-treatment"]
                }
              }
            }
          }
        }
      }
    } as any);

    const mapped = doctors.map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      assignedPatients: doc._count.appointments
    }));

    // Sort by lowest assigned patient load to highest
    mapped.sort((a, b) => a.assignedPatients - b.assignedPatients);

    return NextResponse.json(mapped);

  } catch (error) {
    console.error("[DOCTORS_AVAILABILITY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
