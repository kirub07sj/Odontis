import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function reset() {
  try {
    await prisma.appointment.deleteMany({});
    const result = await prisma.patient.deleteMany({});
    console.log(`Successfully deleted ${result.count} patients!`);
  } catch (error) {
    console.error("Failed to delete patients:", error);
  } finally {
    await prisma.$disconnect();
  }
}

reset();
