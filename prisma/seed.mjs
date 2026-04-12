import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { PrismaClient, UserRole } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");

if (!process.env.DATABASE_URL && fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8");
  const match = envFile.match(/^DATABASE_URL="?(.+?)"?$/m);

  if (match?.[1]) {
    process.env.DATABASE_URL = match[1];
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

const TEST_PASSWORD = "password123";

const testUsers = [
  {
    email: "admin@odontis.test",
    name: "Admin User",
    role: UserRole.ADMIN,
  },
  {
    email: "doctor@odontis.test",
    name: "Doctor User",
    role: UserRole.DOCTOR,
  },
  {
    email: "receptionist@odontis.test",
    name: "Receptionist User",
    role: UserRole.RECEPTIONIST,
  },
];

async function main() {
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

  for (const user of testUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        password: hashedPassword,
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        password: hashedPassword,
      },
    });
  }

  console.log("Seeded test users:");
  for (const user of testUsers) {
    console.log(`- ${user.role}: ${user.email} / ${TEST_PASSWORD}`);
  }
}

main()
  .catch((error) => {
    console.error("Failed to seed test users", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
