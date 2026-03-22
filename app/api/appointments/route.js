import { NextResponse } from 'next/server';
import { appointmentLifecycle } from '@/lib/appointment/appointmentLifecycle';
import { ensurePlatformCatalog, ensurePatientPortalData } from '@/lib/platform/bootstrap';
import { getAuthUser } from '@/lib/auth/withAuth';
import { extractClientIp, pseudonymizeIp } from '@/lib/auth/security';
import { prisma } from '@/lib/db';
import { CONSENT_DOCUMENT_VERSION } from '@/lib/legal/legalDocuments';
import { listAppointmentsForUser } from '@/lib/appointment/queries';
import { serializeAppointment } from '@/lib/appointment/portal';
import { ensureTrustedOrigin, jsonNoStore } from '@/lib/security/http';

function splitDisplayName(name) {
  return {
    firstName: name?.split(' ')?.[0] || '',
    lastName: name?.split(' ')?.slice(1).join(' ') || '',
  };
}

function parseIsoDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function POST(request) {
  try {
    const originError = ensureTrustedOrigin(request);
    if (originError) {
      return originError;
    }

    const user = await getAuthUser(request);
    if (!user) {
      return jsonNoStore(
        { error: 'Debes iniciar sesion para confirmar la reserva.', code: 'auth/required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      specialtyId,
      specialistId,
      serviceId,
      slotId,
      slotStart,
      slotEnd,
      patientData,
    } = body;

    if (!serviceId || !specialistId || !slotId || !slotStart) {
      return jsonNoStore({ error: 'Faltan datos requeridos.' }, { status: 400 });
    }

    await ensurePlatformCatalog(prisma);
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        specialty: true,
      },
    });

    if (!service) {
      return jsonNoStore({ error: 'El servicio solicitado no existe.' }, { status: 404 });
    }

    if (service.specialistId !== specialistId) {
      return jsonNoStore(
        { error: 'El servicio seleccionado no pertenece al profesional indicado.' },
        { status: 400 }
      );
    }

    if (specialtyId && service.specialtyId !== specialtyId) {
      return jsonNoStore(
        { error: 'La especialidad no coincide con el servicio seleccionado.' },
        { status: 400 }
      );
    }

    const startTime = parseIsoDate(slotStart);
    const endTime =
      parseIsoDate(slotEnd) ||
      new Date(new Date(slotStart).getTime() + service.durationMinutes * 60 * 1000);

    if (!startTime || !endTime || endTime <= startTime) {
      return jsonNoStore({ error: 'El horario seleccionado es invalido.' }, { status: 400 });
    }

    const seededPatientProfile = await ensurePatientPortalData(user, prisma);
    const fallbackName = splitDisplayName(user.name);
    const fullName = patientData?.fullName?.trim() || user.name || '';
    const splitName = splitDisplayName(fullName);
    const firstName =
      splitName.firstName || patientData?.firstName?.trim() || seededPatientProfile.firstName || fallbackName.firstName || 'Paciente';
    const lastName =
      splitName.lastName || patientData?.lastName?.trim() || seededPatientProfile.lastName || fallbackName.lastName || 'InteleSalud';
    const phone = patientData?.phone?.trim() || user.phone || seededPatientProfile.phone || null;

    const patientProfile = await prisma.patientProfile.update({
      where: { id: seededPatientProfile.id },
      data: {
        firstName,
        lastName,
        fullName: fullName || `${firstName} ${lastName}`.trim(),
        phone,
      },
    });

    if (phone && phone !== user.phone) {
      await prisma.user.update({
        where: { id: user.id },
        data: { phone },
      });
    }

    await prisma.availabilitySlot.upsert({
      where: { id: slotId },
      update: {
        specialistId,
        startTime,
        endTime,
      },
      create: {
        id: slotId,
        specialistId,
        startTime,
        endTime,
        isBooked: false,
      },
    });

    const result = await appointmentLifecycle.initiateBooking({
      patientId: patientProfile.id,
      specialistId,
      serviceId: service.id,
      slotId,
      intakeNotes: patientData?.notes || patientData?.reason,
      initialQuestion: patientData?.notes || patientData?.reason,
      authorUserId: user.id,
    });

    if (patientData?.consent) {
      await prisma.consentRecord.create({
        data: {
          patientId: patientProfile.id,
          documentVersion: CONSENT_DOCUMENT_VERSION,
          ipAddress: pseudonymizeIp(extractClientIp(request)),
        },
      });
    }

    return jsonNoStore({
      success: true,
      appointmentId: result.appointmentId,
    });
  } catch (error) {
    console.error('[API] Error creating appointment:', error);
    return jsonNoStore(
      { error: error.message || 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return jsonNoStore({ error: 'No autorizado' }, { status: 401 });
    }

    if (user.role === 'PATIENT') {
      await ensurePatientPortalData(user, prisma);
    }

    const appointments = await listAppointmentsForUser(user);

    return jsonNoStore({
      appointments: appointments.map((appointment) => serializeAppointment(appointment, user.id)),
    });
  } catch (error) {
    console.error('[API] Error fetching appointments:', error);
    return jsonNoStore(
      { error: 'No se pudieron obtener las citas del portal.' },
      { status: 500 }
    );
  }
}
