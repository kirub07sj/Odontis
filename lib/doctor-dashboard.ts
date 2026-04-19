import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const roleHomeMap = {
  ADMIN: "/admin",
  DOCTOR: "/doctor",
  RECEPTIONIST: "/reception",
} as const;

export interface DoctorAppointmentItem {
  id: string;
  datetime: Date;
  status: string;
  patient: {
    id: string;
    fullName: string;
    phoneNumber: string;
    age: string;
    gender: string;
    address: string | null;
    additionalInfo: string | null;
    diagnosis: string | null;
    treatment: string | null;
    prescription: string | null;
  };
}

export interface DoctorPatientItem {
  id: string;
  fullName: string;
  phoneNumber: string;
  age: string;
  gender: string;
  latestAppointmentAt: Date;
  latestAppointmentStatus: string;
  totalAppointments: number;
}

export async function requireDoctorUser() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "DOCTOR") {
    const home =
      roleHomeMap[session.user.role as keyof typeof roleHomeMap] ?? "/login";
    redirect(home);
  }

  return session.user;
}

export function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

export async function getDoctorDashboardData(doctorId: string) {
  const { start, end } = getTodayRange();
  const now = new Date();

  const todayAppointmentsPromise = prisma.appointment.findMany({
    where: {
      doctorId,
      datetime: {
        gte: start,
        lt: end,
      },
      status: {
        not: "reassigned",
      },
    },
    include: {
      patient: true,
    },
    orderBy: {
      datetime: "asc",
    },
  });

  const upcomingAppointmentsPromise = prisma.appointment.findMany({
    where: {
      doctorId,
      datetime: {
        gt: now,
      },
      status: {
        not: "reassigned",
      },
    },
    include: {
      patient: true,
    },
    orderBy: {
      datetime: "asc",
    },
    take: 10,
  });

  const [todayAppointments, upcomingAppointments] = await Promise.all([
    todayAppointmentsPromise,
    upcomingAppointmentsPromise,
  ]);

  return {
    todayAppointments,
    upcomingAppointments,
  };
}

export async function getDoctorPatients(doctorId: string) {
  const latestDoctorAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      status: {
        not: "reassigned",
      },
    },
    include: {
      patient: true,
    },
    orderBy: {
      datetime: "desc",
    },
    distinct: ["patientId"],
  });

  const patientIds = latestDoctorAppointments.map(
    (appointment) => appointment.patientId,
  );

  const appointmentCounts = patientIds.length
    ? await prisma.appointment.groupBy({
        by: ["patientId"],
        where: {
          doctorId,
          patientId: {
            in: patientIds,
          },
        },
        _count: {
          patientId: true,
        },
      })
    : [];

  const appointmentCountMap = new Map(
    appointmentCounts.map((row) => [row.patientId, row._count.patientId]),
  );

  return latestDoctorAppointments.map((appointment): DoctorPatientItem => ({
    id: appointment.patient.id,
    fullName: appointment.patient.fullName,
    phoneNumber: appointment.patient.phoneNumber,
    age: appointment.patient.age,
    gender: appointment.patient.gender,
    latestAppointmentAt: appointment.datetime,
    latestAppointmentStatus: appointment.status,
    totalAppointments: appointmentCountMap.get(appointment.patientId) ?? 0,
  }));
}

export async function getDoctorPatientsGrouped(doctorId: string) {
  const patients = await prisma.patient.findMany({
    where: {
      appointments: {
        some: {
          doctorId,
        },
      },
    },
    include: {
      appointments: {
        where: { doctorId },
        orderBy: { datetime: "desc" },
        take: 1,
      },
    },
  });

  const waiting = patients
    .filter((p) => p.status === "WAITING")
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const inTreatment = patients.filter((p) => p.status === "IN_TREATMENT");

  const completed = patients.filter((p) => p.status === "COMPLETED");

  return { waiting, inTreatment, completed };
}

export async function getDoctorAppointments(doctorId: string) {
  return prisma.appointment.findMany({
    where: {
      doctorId,
      status: {
        not: "reassigned",
      },
    },
    include: {
      patient: true,
    },
    orderBy: {
      datetime: "desc",
    },
  });
}

export async function getDoctorPatientDetails(
  doctorId: string,
  patientId: string,
) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      appointments: {
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          datetime: "desc",
        },
      },
    },
  });

  if (!patient) {
    return null;
  }

  const latestAppointment = patient.appointments[0];
  if (!latestAppointment || latestAppointment.doctorId !== doctorId) {
    return null;
  }

  return {
    ...patient,
    appointments: patient.appointments.filter(
      (appointment) => appointment.doctorId === doctorId,
    ),
  };
}
