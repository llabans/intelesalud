import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/withAuth';
import { prisma } from '@/lib/db';
import { getAuthorizedAppointment } from '@/lib/appointment/queries';
import { serializeMessage } from '@/lib/appointment/portal';
import { ensureTrustedOrigin, jsonNoStore } from '@/lib/security/http';

function getAppointmentId(params) {
  return Array.isArray(params?.appointmentId) ? params.appointmentId[0] : params?.appointmentId;
}

export async function GET(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return jsonNoStore({ error: 'No autorizado' }, { status: 401 });
    }

    const appointment = await getAuthorizedAppointment(getAppointmentId(params), user);
    if (!appointment) {
      return jsonNoStore({ error: 'La solicitud no existe.' }, { status: 404 });
    }

    return jsonNoStore({
      messages: appointment.messages.map((message) => serializeMessage(message, user.id)),
    });
  } catch (error) {
    console.error('[API] Error fetching appointment messages:', error);
    return jsonNoStore(
      { error: error.status === 403 ? 'No autorizado' : 'No se pudieron obtener los mensajes.' },
      { status: error.status || 500 }
    );
  }
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
      return jsonNoStore({ error: 'La solicitud no existe.' }, { status: 404 });
    }

    const { body } = await request.json();
    const messageBody = body?.trim();

    if (!messageBody) {
      return jsonNoStore({ error: 'Escribe un mensaje antes de enviarlo.' }, { status: 400 });
    }

    if (messageBody.length > 2000) {
      return jsonNoStore(
        { error: 'El mensaje supera el limite de 2000 caracteres.' },
        { status: 400 }
      );
    }

    const message = await prisma.appointmentMessage.create({
      data: {
        appointmentId,
        authorId: user.id,
        body: messageBody,
      },
      include: {
        author: true,
      },
    });

    return jsonNoStore({
      message: serializeMessage(message, user.id),
    });
  } catch (error) {
    console.error('[API] Error posting appointment message:', error);
    return jsonNoStore(
      { error: error.status === 403 ? 'No autorizado' : 'No se pudo enviar el mensaje.' },
      { status: error.status || 500 }
    );
  }
}
