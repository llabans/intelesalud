import { prisma } from '@/lib/db';
import { isSpecialistRole } from '@/lib/auth/roles';

export const appointmentInclude = {
  service: {
    include: {
      specialty: true,
    },
  },
  slot: true,
  payment: true,
  paymentVoucher: true,
  meetingSession: true,
  patient: {
    include: {
      user: true,
    },
  },
  specialist: {
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  },
  review: true,
  messages: {
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  },
};

const appointmentListInclude = {
  service: { select: { name: true, duration: true, price: true, currency: true, specialty: { select: { id: true, slug: true, name: true } } } },
  slot: { select: { startTime: true, endTime: true } },
  specialist: { include: { user: { select: { id: true, name: true, email: true } } } },
  patient: { include: { user: { select: { id: true, name: true, email: true } } } },
  payment: { select: { status: true } },
  paymentVoucher: { select: { status: true } },
  meetingSession: { select: { joinUrl: true, status: true } },
  review: { select: { rating: true } },
};

const TERMINAL_STATUSES = new Set(['COMPLETED', 'CANCELLED', 'NO_SHOW']);

export function isTerminalStatus(status) {
  return TERMINAL_STATUSES.has(status);
}

export function getAppointmentId(params) {
  return Array.isArray(params?.appointmentId) ? params.appointmentId[0] : params?.appointmentId;
}

export function canAccessAppointment(appointment, user) {
  if (!appointment || !user) {
    return false;
  }

  if (user.role === 'ADMIN') {
    return true;
  }

  if (isSpecialistRole(user.role)) {
    return appointment.specialist?.userId === user.id;
  }

  return appointment.patient?.userId === user.id;
}

export async function getAuthorizedAppointment(appointmentId, user) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: appointmentInclude,
  });

  if (!appointment) {
    return null;
  }

  if (!canAccessAppointment(appointment, user)) {
    const error = new Error('No autorizado');
    error.status = 403;
    throw error;
  }

  return appointment;
}

export async function listAppointmentsForUser(user) {
  let where;
  if (user.role === 'PATIENT') {
    where = { patient: { is: { userId: user.id } } };
  } else if (isSpecialistRole(user.role)) {
    where = { specialist: { is: { userId: user.id } } };
  }
  // ADMIN: where remains undefined (sees all)

  return prisma.appointment.findMany({
    where,
    include: appointmentListInclude,
    orderBy: { slot: { startTime: 'desc' } },
  });
}
