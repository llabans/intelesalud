'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, CreditCard, MessageSquare, User, Video } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import PhonePrompt from '@/components/PhonePrompt';
import AppointmentConversationCard from '@/components/appointments/AppointmentConversationCard';
import { getBadgeClasses } from '@/lib/appointment/portal';
import { DEFAULT_BOOKING_PATH } from '@/lib/platform/catalog';

function EmptyState({
  title,
  description,
  href = DEFAULT_BOOKING_PATH,
  cta = 'Elegir horario',
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xl mx-auto leading-6">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center justify-center mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
      >
        {cta}
      </Link>
    </div>
  );
}

export default function PatientDashboardClient() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [appointments, setAppointments] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    let cancelled = false;

    async function loadAppointments() {
      setIsLoadingAppointments(true);
      setError('');

      try {
        const response = await fetch('/api/appointments', { cache: 'no-store' });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.error || 'No se pudo cargar el portal del paciente.');
        }

        if (!cancelled) {
          setAppointments(payload.appointments || []);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || 'No se pudo cargar el portal del paciente.');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingAppointments(false);
        }
      }
    }

    loadAppointments();

    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  const displayName = user?.name || user?.email || 'Paciente';
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0] || '?').toUpperCase();

  const requests = useMemo(
    () =>
      appointments.filter((appointment) =>
        ['PENDING', 'AWAITING_CONFIRMATION'].includes(appointment.status)
      ),
    [appointments]
  );
  const upcoming = useMemo(
    () => appointments.filter((appointment) => appointment.status === 'CONFIRMED'),
    [appointments]
  );
  const history = useMemo(
    () =>
      appointments.filter((appointment) =>
        ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(appointment.status)
      ),
    [appointments]
  );

  const updateAppointmentMessages = (appointmentId, message) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, messages: [...appointment.messages, message] }
          : appointment
      )
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-64" />
          <div className="h-4 bg-slate-200 rounded w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Portal del Paciente</h1>
          <p className="text-slate-600">
            Bienvenido de nuevo, {displayName}. Aqui coordinas tus preguntas, tu pago y la
            activacion real de cada teleconsulta.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          {user?.image ? (
            <img
              src={user.image}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
              {initials}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-slate-900">{displayName}</p>
            <p className="text-xs text-slate-500">Paciente</p>
          </div>
        </div>
      </div>

      <PhonePrompt />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <nav className="flex flex-col">
              {[
                ['requests', 'Consultas y preguntas', MessageSquare, requests.length],
                ['upcoming', 'Proximas citas', Calendar, upcoming.length],
                ['history', 'Historial', CreditCard, history.length],
                ['profile', 'Mi perfil', User, null],
              ].map(([key, label, Icon, count]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors border-l-4 ${
                    activeTab === key
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{label}</span>
                  {typeof count === 'number' ? (
                    <span className="ml-auto inline-flex items-center justify-center min-w-6 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      {count}
                    </span>
                  ) : null}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {isLoadingAppointments ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-500">
              Cargando tu portal clinico...
            </div>
          ) : null}

          {!isLoadingAppointments && activeTab === 'requests' ? (
            requests.length ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Consultas y seguimiento</h2>
                    <p className="text-sm text-slate-500">
                      Antes de activar una cita, usa este espacio para dejar preguntas, subir tu
                      comprobante y esperar la validacion del especialista.
                    </p>
                  </div>
                  <Link
                    href={DEFAULT_BOOKING_PATH}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Elegir horario
                  </Link>
                </div>

                {requests.map((appointment) => {
                  let actionSlot = null;

                  if (appointment.canUploadVoucher) {
                    actionSlot = (
                      <Link
                        href={`/checkout/${appointment.id}`}
                        className="inline-flex w-full lg:w-auto justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Continuar con pago
                      </Link>
                    );
                  } else if (appointment.status === 'AWAITING_CONFIRMATION') {
                    actionSlot = (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Pago recibido. Espera la revision del especialista.
                      </div>
                    );
                  }

                  return (
                    <AppointmentConversationCard
                      key={appointment.id}
                      appointment={appointment}
                      heading={appointment.service?.name || 'Solicitud clinica'}
                      subheading={`Especialista: ${appointment.specialist?.name || 'InteleSalud'}`}
                      actionSlot={actionSlot}
                      composerPlaceholder="Escribe aqui tu pregunta, sintomas, examenes previos o cualquier coordinacion clinica..."
                      onAppointmentChange={updateAppointmentMessages}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="Todavia no tienes consultas activas"
                description="Primero eliges un horario y registras la cita. Despues te llevaremos al pago por Plin para subir el comprobante y esperar la validacion del especialista."
              />
            )
          ) : null}

          {!isLoadingAppointments && activeTab === 'upcoming' ? (
            upcoming.length ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Proximas citas</h2>
                  <p className="text-sm text-slate-500">
                    Solo aparecen aqui las teleconsultas confirmadas despues de validar el pago.
                  </p>
                </div>

                {upcoming.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getBadgeClasses(
                          appointment.statusTone
                        )}`}
                      >
                        {appointment.statusLabel}
                      </span>
                      <h3 className="mt-3 text-lg font-bold text-slate-900">
                        {appointment.service?.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {appointment.specialist?.name}{' '}
                        {appointment.specialist?.title
                          ? `- ${appointment.specialist.title}`
                          : ''}
                      </p>
                      <p className="text-sm text-slate-500 mt-2">
                        {appointment.slot?.dateLabel} a las {appointment.slot?.startLabel}
                      </p>
                    </div>

                    {appointment.canJoinMeeting ? (
                      <a
                        href={appointment.meetingSession.joinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        <Video className="w-4 h-4" />
                        Unirse a Meet
                      </a>
                    ) : (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        El enlace de videollamada aun no fue generado por el backend.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Aun no tienes citas confirmadas"
                description="Las teleconsultas solo se activan cuando seleccionas un horario, subes el pago y el especialista aprueba el comprobante."
              />
            )
          ) : null}

          {!isLoadingAppointments && activeTab === 'history' ? (
            history.length ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Historial medico</h2>
                {history.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getBadgeClasses(
                          appointment.statusTone
                        )}`}
                      >
                        {appointment.statusLabel}
                      </span>
                      <span className="text-sm text-slate-500">
                        {appointment.slot?.dateLabel}{' '}
                        {appointment.slot?.startLabel
                          ? `- ${appointment.slot.startLabel}`
                          : ''}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {appointment.service?.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {appointment.specialist?.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Todavia no tienes historial clinico cerrado"
                description="Cuando completes una atencion o una solicitud se cierre, aparecera aqui."
                cta="Solicitar una consulta"
              />
            )
          ) : null}

          {!isLoadingAppointments && activeTab === 'profile' ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Mi perfil</h2>
              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-slate-500 mb-1">Nombre</p>
                  <p className="font-semibold text-slate-900">{displayName}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-slate-500 mb-1">Correo</p>
                  <p className="font-semibold text-slate-900">
                    {user?.email || 'No registrado'}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-slate-500 mb-1">Telefono</p>
                  <p className="font-semibold text-slate-900">
                    {user?.phone || 'Pendiente'}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-slate-500 mb-1">Rol</p>
                  <p className="font-semibold text-slate-900">Paciente</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
