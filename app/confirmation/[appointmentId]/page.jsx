'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
} from 'lucide-react';

function StatusNotice({ tone = 'amber', title, description }) {
  const palette = {
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    red: 'border-red-200 bg-red-50 text-red-700',
  }[tone];

  return (
    <div className={`rounded-2xl border p-6 ${palette}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <div>
          <p className="mb-1 font-semibold">{title}</p>
          <p className="text-sm leading-6">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  const params = useParams();
  const appointmentId = Array.isArray(params.appointmentId)
    ? params.appointmentId[0]
    : params.appointmentId;
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadAppointment() {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
          cache: 'no-store',
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.error || 'No se pudo cargar la solicitud.');
        }

        if (!cancelled) {
          setAppointment(payload.appointment);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || 'No se pudo cargar la solicitud.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAppointment();

    return () => {
      cancelled = true;
    };
  }, [appointmentId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          Cargando estado de la solicitud...
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="rounded-[32px] border border-red-200 bg-white p-12 text-center text-red-700 shadow-sm">
          {error || 'No se encontro la solicitud solicitada.'}
        </div>
      </div>
    );
  }

  const isConfirmed = appointment.status === 'CONFIRMED';
  const isAwaitingConfirmation = appointment.status === 'AWAITING_CONFIRMATION';
  const isRejected =
    appointment.status === 'PENDING' &&
    appointment.paymentVoucher?.status === 'REJECTED';

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white text-center shadow-sm">
        <div
          className={`flex flex-col items-center p-10 text-white ${
            isConfirmed ? 'bg-emerald-600' : isRejected ? 'bg-red-600' : 'bg-amber-500'
          }`}
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            {isConfirmed ? <CheckCircle2 size={40} /> : <Clock size={40} />}
          </div>
          <h1 className="mb-2 text-3xl font-bold">
            {isConfirmed
              ? 'Cita confirmada'
              : isRejected
                ? 'Comprobante observado'
                : 'Comprobante recibido'}
          </h1>
          <p className="max-w-md text-lg">
            {isConfirmed
              ? 'El pago fue validado y la consulta ya aparece como atencion activa en InteleSalud.'
              : isRejected
                ? 'Debes subir un nuevo comprobante para completar la confirmacion.'
                : 'Tu pago fue registrado y esta pendiente de revision por el equipo clinico.'}
          </p>
        </div>

        <div className="space-y-8 p-10">
          <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <div className="mb-3 flex items-center text-slate-500">
                <Calendar size={20} className="mr-2" />
                <span className="font-medium">Detalle de la consulta</span>
              </div>
              <p className="text-lg font-bold text-slate-900">
                {appointment.slot?.dateLabel}
              </p>
              <p className="text-slate-600">{appointment.slot?.startLabel}</p>
              <p className="mt-2 text-slate-600">{appointment.service?.name}</p>
              <p className="mt-1 text-sm text-slate-500">
                {appointment.specialist?.name || 'Profesional asignado'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <div className="mb-3 flex items-center text-slate-500">
                <Clock size={20} className="mr-2" />
                <span className="font-medium">Estado actual</span>
              </div>
              <p className="text-lg font-bold text-slate-900">
                {appointment.statusLabel}
              </p>
              <p className="mt-2 text-sm text-slate-500">ID: {appointment.id}</p>
            </div>
          </div>

          {isAwaitingConfirmation ? (
            <StatusNotice
              title="Pago en revision"
              description="Todavia no existe una cita activa. El paciente debe esperar la respuesta del equipo desde el portal."
            />
          ) : null}

          {isRejected ? (
            <StatusNotice
              tone="red"
              title="Se necesita un nuevo comprobante"
              description="La solicitud vuelve a estado pendiente hasta que subas un comprobante valido."
            />
          ) : null}

          {isConfirmed ? (
            appointment.canJoinMeeting ? (
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-left">
                <div className="mb-3 flex items-center text-blue-600">
                  <Video size={20} className="mr-2" />
                  <span className="font-medium">Sala virtual</span>
                </div>
                <p className="mb-4 text-sm leading-6 text-slate-700">
                  La cita ya tiene una sesion lista para ingresar. Esta base queda
                  preparada para integrar proveedor de videollamada real despues.
                </p>
                <a
                  href={appointment.meetingSession.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-semibold text-blue-700 hover:text-blue-800"
                >
                  Abrir sala <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            ) : (
              <StatusNotice
                tone="amber"
                title="Cita confirmada, sala pendiente"
                description="La aprobacion del pago ya activo la consulta, pero todavia no existe una sesion real enlazada."
              />
            )
          ) : null}

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/portal"
              className="rounded-xl bg-slate-900 px-8 py-4 font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              Ir a mi portal
            </Link>
            {!isConfirmed ? (
              <Link
                href={`/checkout/${appointment.id}`}
                className="rounded-xl border border-slate-200 bg-white px-8 py-4 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Revisar pago
              </Link>
            ) : (
              <Link
                href="/"
                className="rounded-xl border border-slate-200 bg-white px-8 py-4 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Volver al inicio
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
