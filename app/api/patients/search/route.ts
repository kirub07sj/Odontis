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

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.trim().length === 0) {
      return NextResponse.json([]);
    }

    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          { fullName: { contains: q, mode: "insensitive" } },
          { phoneNumber: { contains: q } }
        ]
      },
      take: 5,
      select: {
        id: true,
        fullName: true,
        phoneNumber: true
      }
    });

    return NextResponse.json(patients);

  } catch (error) {
    console.error("[PATIENTS_SEARCH_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
