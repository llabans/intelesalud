import { prisma } from '../db';

export class AppointmentLifecycle {
  async initiateBooking({
    patientId,
    specialistId,
    serviceId,
    slotId,
    intakeNotes,
    initialQuestion,
    authorUserId,
  }) {
    const appointment = await prisma.$transaction(async (tx) => {
      const locked = await tx.availabilitySlot.updateMany({
        where: {
          id: slotId,
          specialistId,
          isBooked: false,
        },
        data: {
          isBooked: true,
        },
      });

      if (locked.count === 0) {
        throw new Error('El horario no esta disponible o ya fue reservado.');
      }

      const appointment = await tx.appointment.create({
        data: {
          patientId,
          specialistId,
          serviceId,
          slotId,
          status: 'PENDING',
          intakeNotes: intakeNotes || null,
        },
      });

      if (initialQuestion?.trim() && authorUserId) {
        await tx.appointmentMessage.create({
          data: {
            appointmentId: appointment.id,
            authorId: authorUserId,
            body: initialQuestion.trim(),
          },
        });
      }

      return appointment;
    });

    return { appointmentId: appointment.id };
  }

  async preparePayment(appointmentId) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { service: true },
    });

    if (!appointment) {
      throw new Error('No se encontro la cita solicitada.');
    }

    const { PLIN_PHONE, PLIN_RECIPIENT_NAME } = await import('@/lib/payment/plinPaymentService');

    return {
      plinPhone: PLIN_PHONE,
      plinName: PLIN_RECIPIENT_NAME,
      amount: appointment.service.price,
      currency: appointment.service.currency,
    };
  }

}

export const appointmentLifecycle = new AppointmentLifecycle();
