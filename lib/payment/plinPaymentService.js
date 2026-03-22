import { prisma } from '../db';
import { calendarService } from '../calendar/googleCalendarService';

export const PLIN_PHONE = process.env.PLIN_PHONE || '+51 970 549 203';
export const PLIN_RECIPIENT_NAME = process.env.PLIN_RECIPIENT_NAME || 'InteleSalud';

function normalizeCurrency(currency) {
  if (!currency || currency === 'S/') {
    return 'PEN';
  }

  return currency;
}

/**
 * Service for managing Plin payment vouchers.
 * Plin is a manual payment method — patients transfer via Plin app
 * and upload a screenshot of the receipt for admin verification.
 */
export class PlinPaymentService {
  constructor() {
    this.provider = 'PLIN';
    this.phone = PLIN_PHONE;
  }

  async syncPaymentRecord(tx, appointmentId, service) {
    const payload = {
      amount: service.price,
      currency: normalizeCurrency(service.currency),
      provider: 'PLIN',
      status: 'SUCCESS',
    };

    const existingPayment = await tx.payment.findFirst({
      where: { appointmentId },
      select: { id: true },
    });

    if (existingPayment) {
      return tx.payment.update({
        where: { id: existingPayment.id },
        data: payload,
      });
    }

    return tx.payment.create({
      data: {
        appointmentId,
        ...payload,
      },
    });
  }

  async syncMeetingSessionRecord({ appointmentId, meeting }) {
    const payload = {
      provider: calendarService.provider,
      providerEventId: meeting.eventId || null,
      joinUrl: meeting.joinUrl || null,
      status: 'SCHEDULED',
    };

    const existingSession = await prisma.meetingSession.findFirst({
      where: { appointmentId },
      select: { id: true },
    });

    if (existingSession) {
      return prisma.meetingSession.update({
        where: { id: existingSession.id },
        data: payload,
      });
    }

    return prisma.meetingSession.create({
      data: {
        appointmentId,
        ...payload,
      },
    });
  }

  /**
   * Get Plin payment instructions for an appointment.
   */
  getPaymentInstructions(appointment, service) {
    return {
      provider: this.provider,
      phone: this.phone,
      amount: service.price,
      currency: service.currency || 'S/',
      instructions: `Realiza tu pago por Plin al número ${this.phone}. Monto: ${service.currency || 'S/'} ${service.price}. Luego sube tu comprobante.`,
    };
  }

  /**
   * Create a payment voucher record after the patient uploads their receipt.
   */
  async createVoucher({ appointmentId, imageUrl }) {
    const existingVoucher = await prisma.paymentVoucher.findUnique({
      where: { appointmentId },
    });

    const voucher = existingVoucher
      ? await prisma.paymentVoucher.update({
          where: { appointmentId },
          data: {
            imageUrl,
            status: 'PENDING',
            reviewedBy: null,
            reviewedAt: null,
          },
        })
      : await prisma.paymentVoucher.create({
          data: {
            appointmentId,
            imageUrl,
            status: 'PENDING',
          },
        });

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'AWAITING_CONFIRMATION' },
    });

    return voucher;
  }

  /**
   * Approve or reject a payment voucher (admin/specialist action).
   */
  async reviewVoucher({ voucherId, action, reviewedBy }) {
    const status = action === 'approve' ? 'APPROVED' : 'REJECTED';

    const voucher = await prisma.$transaction(async (tx) => {
      const reviewedVoucher = await tx.paymentVoucher.update({
        where: { id: voucherId },
        data: {
          status,
          reviewedBy,
          reviewedAt: new Date(),
        },
        include: {
          appointment: {
            include: {
              service: true,
              slot: true,
              patient: {
                include: {
                  user: true,
                },
              },
              specialist: {
                include: {
                  user: true,
                },
              },
              meetingSession: true,
            },
          },
        },
      });

      if (status === 'APPROVED') {
        await tx.appointment.update({
          where: { id: reviewedVoucher.appointmentId },
          data: { status: 'CONFIRMED' },
        });

        await this.syncPaymentRecord(
          tx,
          reviewedVoucher.appointmentId,
          reviewedVoucher.appointment.service
        );
      } else {
        await tx.appointment.update({
          where: { id: reviewedVoucher.appointmentId },
          data: { status: 'PENDING' },
        });
      }

      return reviewedVoucher;
    });

    if (status === 'APPROVED' && !voucher.appointment.meetingSession) {
      try {
        const specialistName =
          voucher.appointment.specialist.user?.name ||
          `${voucher.appointment.specialist.firstName} ${voucher.appointment.specialist.lastName}`.trim();
        const meeting = await calendarService.createMeetingEvent({
          appointmentId: voucher.appointmentId,
          title: `${voucher.appointment.service.name} - ${specialistName}`,
          description:
            'Teleconsulta InteleSalud confirmada tras validacion del pago. Este enlace solo debe compartirse con el paciente y el profesional asignado.',
          startTime: voucher.appointment.slot.startTime,
          endTime: voucher.appointment.slot.endTime,
          patientEmail: voucher.appointment.patient.user?.email || '',
          specialistEmail: voucher.appointment.specialist.user?.email || '',
        });

        if (meeting?.eventId || meeting?.joinUrl) {
          await this.syncMeetingSessionRecord({
            appointmentId: voucher.appointmentId,
            meeting,
          });
        }
      } catch (meetingError) {
        console.error('[Payment] Payment approved but Meet generation failed:', meetingError);
      }
    }

    return voucher;
  }

  /**
   * Get all pending vouchers for review.
   */
  async getPendingVouchers() {
    return prisma.paymentVoucher.findMany({
      where: { status: 'PENDING' },
      include: {
        appointment: {
          include: {
            patient: true,
            specialist: true,
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}

export const plinPaymentService = new PlinPaymentService();
