'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CreditCard,
  Eye,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Users,
  Video,
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import AppointmentConversationCard from '@/components/appointments/AppointmentConversationCard';
import { getBadgeClasses } from '@/lib/appointment/portal';

function EmptyPanel({ title, description }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-500">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm max-w-xl mx-auto leading-6">{description}</p>
    </div>
  );
}

export default function SpecialistDashboardClient() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('consultations');
  const [appointments, setAppointments] = useState([]);
  const [pendingVouchers, setPendingVouchers] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [processingVoucherId, setProcessingVoucherId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    let cancelled = false;

    async function loadDashboard() {
      setIsLoadingData(true);
      setError('');

      try {
        const [appointmentsResponse, vouchersResponse] = await Promise.all([
          fetch('/api/appointments', { cache: 'no-store' }),
          fetch('/api/payments/confirm', { cache: 'no-store' }),
        ]);

        const appointmentsPayload = await appointmentsResponse.json().catch(() => ({}));
        const vouchersPayload = await vouchersResponse.json().catch(() => ({}));

        if (!appointmentsResponse.ok) {
          throw new Error(appointmentsPayload.error || 'No se pudieron obtener las solicitudes.');
        }

        if (!vouchersResponse.ok) {
          throw new Error(vouchersPayload.error || 'No se pudieron obtener los comprobantes.');
        }

        if (!cancelled) {
          setAppointments(appointmentsPayload.appointments || []);
          setPendingVouchers(vouchersPayload.vouchers || []);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || 'No se pudo cargar el panel medico.');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingData(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  const consultations = useMemo(
    () => appointments.filter((appointment) => ['PENDING', 'AWAITING_CONFIRMATION'].includes(appointment.status)),
    [appointments]
  );
  const confirmedAgenda = useMemo(
    () => appointments.filter((appointment) => appointment.status === 'CONFIRMED'),
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

  const refreshDashboard = async () => {
    const [appointmentsResponse, vouchersResponse] = await Promise.all([
      fetch('/api/appointments', { cache: 'no-store' }),
      fetch('/api/payments/confirm', { cache: 'no-store' }),
    ]);

    const appointmentsPayload = await appointmentsResponse.json().catch(() => ({}));
    const vouchersPayload = await vouchersResponse.json().catch(() => ({}));

    if (appointmentsResponse.ok) {
      setAppointments(appointmentsPayload.appointments || []);
    }
    if (vouchersResponse.ok) {
      setPendingVouchers(vouchersPayload.vouchers || []);
    }
  };

  const handleVoucherAction = async (voucherId, action) => {
    setProcessingVoucherId(voucherId);
    setError('');

    try {
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherId, action }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'No se pudo procesar el comprobante.');
      }

      await refreshDashboard();
    } catch (requestError) {
      setError(requestError.message || 'No se pudo procesar el comprobante.');
    } finally {
      setProcessingVoucherId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-64" />
          <div className="h-4 bg-slate-200 rounded w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Panel Medico</h1>
          <p className="text-slate-600">
            Revisa consultas previas, confirma pagos y habilita la teleconsulta solo cuando el
            proceso este completo.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
            {(user?.name || 'DR')
              .split(' ')
              .map((chunk) => chunk[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{user?.name || user?.email}</p>
            <p className="text-xs text-slate-500">Especialista</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          ['Solicitudes activas', consultations.length, MessageSquare, 'text-emerald-600', 'bg-emerald-100'],
          ['Pagos pendientes', pendingVouchers.length, CreditCard, 'text-amber-600', 'bg-amber-100'],
          ['Agenda confirmada', confirmedAgenda.length, Calendar, 'text-blue-600', 'bg-blue-100'],
          [
            'Pacientes',
            new Set(appointments.map((appointment) => appointment.patient?.id).filter(Boolean)).size,
            Users,
            'text-indigo-600',
            'bg-indigo-100',
          ],
        ].map(([label, value, Icon, iconColor, iconBg]) => (
          <div key={label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{label}</p>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <nav className="flex flex-col">
              {[
                ['consultations', 'Consultas', MessageSquare, consultations.length],
                ['vouchers', 'Pagos pendientes', CreditCard, pendingVouchers.length],
                ['agenda', 'Agenda confirmada', Calendar, confirmedAgenda.length],
              ].map(([key, label, Icon, count]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors border-l-4 ${
                    activeTab === key
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{label}</span>
                  <span className="ml-auto inline-flex items-center justify-center min-w-6 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    {count}
                  </span>
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

          {isLoadingData ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-500">
              Cargando el panel medico...
            </div>
          ) : null}

          {!isLoadingData && activeTab === 'consultations' ? (
            consultations.length ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Solicitudes y preguntas</h2>
                  <p className="text-sm text-slate-500">
                    Responde aqui antes de que la cita quede activa. El paciente no deberia ver un
                    Meet real hasta que el pago se apruebe.
                  </p>
                </div>

                {consultations.map((appointment) => (
                  <AppointmentConversationCard
                    key={appointment.id}
                    appointment={appointment}
                    heading={appointment.patient?.name || 'Paciente'}
                    subheading={`${appointment.service?.name || 'Solicitud'} - ${appointment.slot?.dateLabel || 'Sin fecha'} ${appointment.slot?.startLabel ? `a las ${appointment.slot.startLabel}` : ''}`}
                    composerPlaceholder="Escribe una respuesta, aclaracion o indicacion previa a la teleconsulta..."
                    onAppointmentChange={updateAppointmentMessages}
                    emptyStateMessage="Todavia no hay mensajes. El paciente vera aqui la primera respuesta del especialista."
                  />
                ))}
              </div>
            ) : (
              <EmptyPanel
                title="No hay consultas activas"
                description="Cuando un paciente reserve horario, suba dudas clinicas o este pendiente de pago, aparecera aqui."
              />
            )
          ) : null}

          {!isLoadingData && activeTab === 'vouchers' ? (
            pendingVouchers.length ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Comprobantes pendientes</h2>
                  <p className="text-sm text-slate-500">
                    Solo al aprobar el pago la teleconsulta pasa a confirmada. Si Calendar/Meet
                    esta configurado, el backend intentara crear la videollamada en ese momento.
                  </p>
                </div>

                {pendingVouchers.map((voucher) => {
                  const patientName = [
                    voucher.appointment?.patient?.firstName,
                    voucher.appointment?.patient?.lastName,
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <div key={voucher.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">{patientName || 'Paciente'}</h3>
                            <p className="text-sm text-slate-600 mt-1">{voucher.appointment?.service?.name}</p>
                            <p className="text-sm text-slate-500 mt-2">
                              {new Date(voucher.createdAt).toLocaleString('es-PE')}
                            </p>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                            Pendiente
                          </span>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Comprobante adjunto</p>
                            <p className="text-sm text-slate-500 mt-1">Revisa la captura antes de aprobar.</p>
                          </div>
                          <a
                            href={voucher.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <Eye className="w-4 h-4" />
                            Ver comprobante
                          </a>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleVoucherAction(voucher.id, 'approve')}
                            disabled={processingVoucherId === voucher.id}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Aprobar pago
                          </button>
                          <button
                            onClick={() => handleVoucherAction(voucher.id, 'reject')}
                            disabled={processingVoucherId === voucher.id}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <ThumbsDown className="w-4 h-4" />
                            Rechazar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyPanel
                title="No hay pagos pendientes"
                description="Cuando un paciente suba un comprobante por Plin, apareceran aqui para revision."
              />
            )
          ) : null}

          {!isLoadingData && activeTab === 'agenda' ? (
            confirmedAgenda.length ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Agenda confirmada</h2>
                {confirmedAgenda.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getBadgeClasses(
                            appointment.statusTone
                          )}`}
                        >
                          {appointment.statusLabel}
                        </span>
                        <span className="text-sm text-slate-500">
                          {appointment.slot?.dateLabel}{' '}
                          {appointment.slot?.startLabel ? `- ${appointment.slot.startLabel}` : ''}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{appointment.patient?.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{appointment.service?.name}</p>
                    </div>

                    {appointment.canJoinMeeting ? (
                      <a
                        href={appointment.meetingSession.joinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        <Video className="w-4 h-4" />
                        Iniciar Meet
                      </a>
                    ) : (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        El pago esta confirmado, pero aun no existe un enlace de Meet valido.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyPanel
                title="No hay agenda confirmada"
                description="Las citas confirmadas apareceran aqui solo despues de validar el pago."
              />
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
