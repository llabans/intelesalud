import { getAuthUser } from '@/lib/auth/withAuth';
import { getAuthorizedAppointment, getAppointmentId, isTerminalStatus } from '@/lib/appointment/queries';
import { serializeAppointment } from '@/lib/appointment/portal';
import { ensureTrustedOrigin, jsonNoStore } from '@/lib/security/http';
import { isSpecialistRole } from '@/lib/auth/roles';
import { prisma } from '@/lib/db';

const VALID_TRANSITIONS = {
  COMPLETED: { from: ['CONFIRMED'], roles: ['ADMIN', 'SPECIALIST'] },
  CANCELLED: { from: ['PENDING', 'AWAITING_CONFIRMATION', 'CONFIRMED'], roles: ['ADMIN', 'SPECIALIST', 'PATIENT'] },
  NO_SHOW: { from: ['CONFIRMED'], roles: ['ADMIN', 'SPECIALIST'] },
};

function canTransition(appointment, user, targetStatus) {
  const rule = VALID_TRANSITIONS[targetStatus];
  if (!rule) return false;
  if (!rule.from.includes(appointment.status)) return false;

  const effectiveRole = isSpecialistRole(user.role) ? 'SPECIALIST' : user.role;
  if (!rule.roles.includes(effectiveRole)) return false;

  if (effectiveRole === 'PATIENT' && targetStatus === 'CANCELLED') {
    return ['PENDING', 'AWAITING_CONFIRMATION'].includes(appointment.status);
  }

  return true;
}

export async function PATCH(request, { params }) {
  try {
    const originError = ensureTrustedOrigin(request);
    if (originError) return originError;

    const user = await getAuthUser(request);
    if (!user) {
      return jsonNoStore({ error: 'No autorizado' }, { status: 401 });
    }

    const appointmentId = getAppointmentId(params);
    const appointment = await getAuthorizedAppointment(appointmentId, user);
    if (!appointment) {
      return jsonNoStore({ error: 'La cita no existe.' }, { status: 404 });
    }

    if (isTerminalStatus(appointment.status)) {
      return jsonNoStore({ error: 'La cita ya tiene un estado final.' }, { status: 400 });
    }

    const body = await request.json();
    const { status, reason } = body;

    if (!VALID_TRANSITIONS[status]) {
      return jsonNoStore({ error: 'Estado no valido.' }, { status: 400 });
    }

    if (!canTransition(appointment, user, status)) {
      return jsonNoStore({ error: 'No tienes permisos para esta transicion.' }, { status: 403 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.appointment.updateMany({
        where: { id: appointmentId, status: appointment.status },
        data: { status },
      });

      if (result.count === 0) {
        throw new Error('La cita fue modificada por otro usuario.');
      }

      if (status === 'CANCELLED' && appointment.slot) {
        await tx.availabilitySlot.update({
          where: { id: appointment.slotId },
          data: { isBooked: false },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: `APPOINTMENT_${status}`,
          entityType: 'Appointment',
          entityId: appointmentId,
          details: reason || null,
        },
      });

      return result;
    });

    const full = await getAuthorizedAppointment(appointmentId, user);
    return jsonNoStore({ appointment: serializeAppointment(full, user.id) });
  } catch (error) {
    console.error('[API] Error updating appointment status:', error);
    return jsonNoStore(
      { error: error.status === 403 ? 'No autorizado' : 'No se pudo actualizar la cita.' },
      { status: error.status || 500 }
    );
  }
}
