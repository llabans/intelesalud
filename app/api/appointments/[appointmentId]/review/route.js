import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/withAuth';
import { prisma } from '@/lib/db';
import { getAuthorizedAppointment } from '@/lib/appointment/queries';
import { ensureTrustedOrigin, jsonNoStore } from '@/lib/security/http';

function getAppointmentId(params) {
  return Array.isArray(params?.appointmentId) ? params.appointmentId[0] : params?.appointmentId;
}

export async function POST(request, { params }) {
  try {
    const originError = ensureTrustedOrigin(request);
    if (originError) {
      return originError;
    }

    const user = await getAuthUser(request);
    if (!user) {
      return jsonNoStore({ error: 'No autorizado' }, { status: 401 });
    }

    const appointmentId = getAppointmentId(params);
    const appointment = await getAuthorizedAppointment(appointmentId, user);

    if (!appointment) {
      return jsonNoStore({ error: 'Cita no encontrada.' }, { status: 404 });
    }

    if (appointment.status !== 'COMPLETED') {
      return jsonNoStore(
        { error: 'Solo puedes evaluar atenciones completadas.' },
        { status: 400 }
      );
    }

    const { rating, comment } = await request.json();
    const normalizedRating = Number.parseInt(rating, 10);

    if (!Number.isFinite(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
      return jsonNoStore({ error: 'La calificacion debe ir de 1 a 5.' }, { status: 400 });
    }

    const review = await prisma.appointmentReview.upsert({
      where: { appointmentId },
      update: {
        rating: normalizedRating,
        comment: comment?.trim() || null,
      },
      create: {
        appointmentId,
        patientId: appointment.patientId,
        specialistId: appointment.specialistId,
        rating: normalizedRating,
        comment: comment?.trim() || null,
      },
    });

    const aggregate = await prisma.appointmentReview.aggregate({
      where: { specialistId: appointment.specialistId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.specialistProfile.update({
      where: { id: appointment.specialistId },
      data: {
        ratingAverage: aggregate._avg.rating || 0,
        ratingCount: aggregate._count.rating || 0,
      },
    });

    return jsonNoStore({ review });
  } catch (error) {
    console.error('[Review] Failed to save review:', error);
    return jsonNoStore({ error: 'No se pudo registrar la evaluacion.' }, { status: 500 });
  }
}
