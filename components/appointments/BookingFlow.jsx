'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogIn,
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { buildLoginPath } from '@/lib/auth/redirects';
import {
  generateAvailableSlots,
  getMonthDays,
  parseBookingDate,
} from '@/lib/booking/availability';

function buildSearchRedirect({
  selectedServiceId,
  selectedSpecialty,
  selectedProfessionalSlug,
  selectedDate,
  selectedSlot,
}) {
  const params = new URLSearchParams();

  if (selectedServiceId) params.set('serviceId', selectedServiceId);
  if (selectedSpecialty) params.set('specialty', selectedSpecialty);
  if (selectedProfessionalSlug) params.set('professional', selectedProfessionalSlug);
  if (selectedDate) params.set('date', selectedDate.toISOString().slice(0, 10));
  if (selectedSlot) params.set('slot', selectedSlot.id);

  const query = params.toString();
  return `/portal/agendar${query ? `?${query}` : ''}`;
}

export default function BookingFlow({ professionals, specialties }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const initialDate = useMemo(
    () => parseBookingDate(searchParams.get('date')),
    [searchParams]
  );
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    searchParams.get('specialty') || ''
  );
  const [selectedProfessionalSlug, setSelectedProfessionalSlug] = useState(
    searchParams.get('professional') || ''
  );
  const [selectedServiceId, setSelectedServiceId] = useState(
    searchParams.get('serviceId') || ''
  );
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    reason: '',
    consent: false,
  });

  useEffect(() => {
    if (!user) return;

    setFormData((current) => ({
      ...current,
      fullName: current.fullName || user.name || '',
      phone: current.phone || user.phone || '',
    }));
  }, [user]);

  const filteredProfessionals = useMemo(() => {
    if (!selectedSpecialty) return professionals;

    return professionals.filter((professional) =>
      professional.specialties.some((specialty) => specialty.slug === selectedSpecialty)
    );
  }, [professionals, selectedSpecialty]);

  const selectedProfessional =
    filteredProfessionals.find((professional) => professional.slug === selectedProfessionalSlug) ||
    filteredProfessionals[0] ||
    null;

  const availableServices = useMemo(() => {
    if (!selectedProfessional) return [];

    return selectedProfessional.services.filter((service) =>
      selectedSpecialty ? service.specialty.slug === selectedSpecialty : true
    );
  }, [selectedProfessional, selectedSpecialty]);

  const selectedService =
    availableServices.find((service) => service.id === selectedServiceId) ||
    availableServices[0] ||
    null;

  useEffect(() => {
    if (!selectedProfessional) {
      setSelectedProfessionalSlug('');
      return;
    }

    if (selectedProfessional.slug !== selectedProfessionalSlug) {
      setSelectedProfessionalSlug(selectedProfessional.slug);
    }
  }, [selectedProfessional, selectedProfessionalSlug]);

  useEffect(() => {
    if (!selectedService) {
      setSelectedServiceId('');
      return;
    }

    if (selectedService.id !== selectedServiceId) {
      setSelectedServiceId(selectedService.id);
    }
  }, [selectedService, selectedServiceId]);

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedProfessionalSlug, selectedServiceId, selectedDate]);

  const availableSlots = useMemo(() => {
    if (!selectedProfessional || !selectedService) return [];

    return generateAvailableSlots(
      selectedDate,
      {
        slug: selectedProfessional.slug,
        schedule: selectedProfessional.schedule,
      },
      selectedService
    );
  }, [selectedDate, selectedProfessional, selectedService]);

  const month = getMonthDays(selectedDate);
  const hasCatalog = Boolean(professionals.length && specialties.length);

  function preserveSelectionRedirect() {
    router.push(
      buildLoginPath(
        buildSearchRedirect({
          selectedServiceId,
          selectedSpecialty,
          selectedProfessionalSlug,
          selectedDate,
          selectedSlot,
        })
      )
    );
  }

  function handleMonthChange(direction) {
    const next = new Date(selectedDate);
    next.setMonth(next.getMonth() + direction);
    setSelectedDate(next);
  }

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();
    setError('');

    if (!selectedProfessional || !selectedService || !selectedSlot) {
      setError('Selecciona profesional, servicio y horario antes de continuar.');
      return;
    }

    if (!formData.consent) {
      setError('Debes aceptar el consentimiento y los terminos para continuar.');
      return;
    }

    if (!user) {
      preserveSelectionRedirect();
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedSpecialtyEntry =
        specialties.find((specialty) => specialty.slug === selectedSpecialty) ||
        selectedService.specialty;

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specialtyId: selectedSpecialtyEntry?.id || selectedService.specialty.id,
          specialistId: selectedProfessional.id,
          serviceId: selectedService.id,
          slotId: selectedSlot.id,
          slotStart: selectedSlot.startTime,
          slotEnd: selectedSlot.endTime,
          patientData: {
            fullName: formData.fullName,
            phone: formData.phone,
            reason: formData.reason,
            consent: formData.consent,
          },
        }),
      });

      const payload = await response.json();
      if (response.status === 401) {
        preserveSelectionRedirect();
        return;
      }
      if (!response.ok) {
        throw new Error(payload.error || 'No se pudo registrar la reserva.');
      }

      router.push(`/checkout/${payload.appointmentId}`);
    } catch (requestError) {
      setError(requestError.message || 'No se pudo registrar la reserva.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {!user && !authLoading ? (
        <div className="rounded-[28px] border border-sky-200 bg-sky-50 px-5 py-4 text-sm text-sky-800">
          <div className="flex items-start gap-3">
            <LogIn className="mt-0.5 h-4 w-4" />
            <p>
              Puedes explorar especialidades y horarios sin sesion, pero para
              confirmar la cita te llevaremos al login y luego volveras aqui.
            </p>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[28px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <p>{error}</p>
          </div>
        </div>
      ) : null}

      {!hasCatalog ? (
        <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Estamos preparando la agenda
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Aun no hay especialidades o profesionales visibles para reservar. Vuelve
            mas tarde o contacta soporte desde el asistente.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Especialidad</span>
                <select
                  value={selectedSpecialty}
                  onChange={(event) => {
                    setSelectedSpecialty(event.target.value);
                    setSelectedProfessionalSlug('');
                    setSelectedServiceId('');
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
                >
                  <option value="">Selecciona una especialidad</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.slug}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                <span>Profesional</span>
                <select
                  value={selectedProfessionalSlug}
                  onChange={(event) => {
                    setSelectedProfessionalSlug(event.target.value);
                    setSelectedServiceId('');
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
                >
                  {!filteredProfessionals.length ? (
                    <option value="">No hay profesionales para esta especialidad</option>
                  ) : null}
                  {filteredProfessionals.map((professional) => (
                    <option key={professional.id} value={professional.slug}>
                      {professional.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-2 text-sm text-slate-700">
              <span>Servicio</span>
              <select
                value={selectedServiceId}
                onChange={(event) => {
                  setSelectedServiceId(event.target.value);
                }}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
              >
                {!availableServices.length ? (
                  <option value="">No hay servicios visibles</option>
                ) : null}
                {availableServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.currency} {service.price}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                  <CalendarIcon className="h-4 w-4 text-sky-700" />
                  {month.monthLabel}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleMonthChange(-1)}
                    className="rounded-full border border-slate-200 bg-white p-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMonthChange(1)}
                    className="rounded-full border border-slate-200 bg-white p-2"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {month.days.map(({ day, value }) => {
                  const isSelected =
                    selectedDate.toDateString() === value.toDateString();
                  const isPast =
                    value < parseBookingDate(new Date().toISOString().slice(0, 10));

                  return (
                    <button
                      key={value.toISOString()}
                      type="button"
                      disabled={isPast}
                      onClick={() => setSelectedDate(value)}
                      className={`rounded-2xl px-2 py-3 text-sm transition ${
                        isSelected
                          ? 'bg-slate-950 text-white'
                          : isPast
                            ? 'cursor-not-allowed text-slate-300'
                            : 'bg-white text-slate-700 hover:text-slate-950'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <Clock className="h-4 w-4 text-sky-700" />
                Horarios disponibles
              </p>
              <div className="flex flex-wrap gap-3">
                {availableSlots.length ? (
                  availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        selectedSlot?.id === slot.id
                          ? 'bg-slate-950 text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950'
                      }`}
                    >
                      {slot.formattedTime}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No hay horarios visibles para la fecha elegida.
                  </p>
                )}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleBookingSubmit}
            className="space-y-5 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                Paso final
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Confirma los datos de tu consulta
              </h2>
            </div>

            <label className="block space-y-2 text-sm text-slate-700">
              <span>Nombre completo</span>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
              />
            </label>

            <label className="block space-y-2 text-sm text-slate-700">
              <span>Telefono</span>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+51 9XXXXXXXX"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
              />
            </label>

            <label className="block space-y-2 text-sm text-slate-700">
              <span>Motivo de consulta</span>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows={5}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
                placeholder="Describe brevemente el motivo o lo que deseas revisar con el profesional."
              />
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleInputChange}
                className="mt-1"
              />
              <span>
                Acepto el{' '}
                <Link href="/consent" className="font-medium text-slate-950 underline">
                  consentimiento informado
                </Link>
                , los{' '}
                <Link href="/terms" className="font-medium text-slate-950 underline">
                  terminos
                </Link>{' '}
                y la{' '}
                <Link href="/privacy" className="font-medium text-slate-950 underline">
                  politica de privacidad
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !selectedProfessional || !selectedService}
              className="inline-flex w-full justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-400"
            >
              {isSubmitting ? 'Procesando reserva...' : 'Continuar al pago'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
