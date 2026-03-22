import { getAuthUser } from '@/lib/auth/withAuth';
import { getAuthorizedAppointment } from '@/lib/appointment/queries';
import { serializeAppointment } from '@/lib/appointment/portal';
import { jsonNoStore } from '@/lib/security/http';

function getAppointmentId(params) {
  return Array.isArray(params?.appointmentId) ? params.appointmentId[0] : params?.appointmentId;
}

export async function GET(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return jsonNoStore({ error: 'No autorizado' }, { status: 401 });
    }

    const appointmentId = getAppointmentId(params);
    const appointment = await getAuthorizedAppointment(appointmentId, user);

    if (!appointment) {
      return jsonNoStore({ error: 'La solicitud no existe.' }, { status: 404 });
    }

    return jsonNoStore({
      appointment: serializeAppointment(appointment, user.id),
    });
  } catch (error) {
    console.error('[API] Error fetching appointment detail:', error);
    return jsonNoStore(
      { error: error.status === 403 ? 'No autorizado' : 'No se pudo cargar la solicitud.' },
      { status: error.status || 500 }
    );
  }
}
