import { prisma } from '@/lib/db';
import { ensurePatientPortalData } from '@/lib/platform/bootstrap';
import { listAppointmentsForUser } from '@/lib/appointment/queries';
import { serializeAppointment } from '@/lib/appointment/portal';

export async function getPatientProfileData(user) {
  const profile = await ensurePatientPortalData(user, prisma);

  return prisma.patientProfile.findUnique({
    where: { id: profile.id },
    include: {
      preferredSpecialty: true,
    },
  });
}

export async function getPortalSummary(user) {
  await ensurePatientPortalData(user, prisma);
  const appointments = await listAppointmentsForUser(user);
  const serialized = appointments.map((appointment) => serializeAppointment(appointment, user.id));
  const upcomingAppointment =
    serialized.find((appointment) => appointment.portalSection === 'upcoming') || null;

  const [documentsCount, recordsCount, activities] = await Promise.all([
    prisma.document.count({
      where: {
        patient: {
          is: {
            userId: user.id,
          },
        },
      },
    }),
    prisma.clinicalRecord.count({
      where: {
        patient: {
          is: {
            userId: user.id,
          },
        },
      },
    }),
    prisma.auditLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  return {
    appointments: serialized,
    upcomingAppointment,
    metrics: {
      appointmentsCount: serialized.length,
      documentsCount,
      recordsCount,
    },
    activities,
  };
}

export async function getPatientDocuments(user) {
  await ensurePatientPortalData(user, prisma);

  return prisma.document.findMany({
    where: {
      patient: {
        is: {
          userId: user.id,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPatientClinicalRecords(user) {
  await ensurePatientPortalData(user, prisma);

  return prisma.clinicalRecord.findMany({
    where: {
      patient: {
        is: {
          userId: user.id,
        },
      },
    },
    include: {
      specialty: true,
      appointment: {
        include: {
          service: {
            include: {
              specialty: true,
            },
          },
        },
      },
    },
    orderBy: { recordedAt: 'desc' },
  });
}

export async function getPortalMessages(user) {
  const appointments = await listAppointmentsForUser(user);
  return appointments
    .map((appointment) => serializeAppointment(appointment, user.id))
    .filter((appointment) => appointment.messages.length > 0 || appointment.portalSection === 'requests');
}
