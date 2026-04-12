import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await prisma.appointment.deleteMany({});
  await prisma.patient.deleteMany({});
  return NextResponse.json({ message: "Cleared all patients and appointments!" });
}
