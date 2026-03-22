'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Image as ImageIcon,
  Lock,
  ShieldCheck,
  Smartphone,
  Upload,
} from 'lucide-react';

const PLIN_PHONE = '+51 970 549 203';
const COLLECTION_NAME = 'InteleSalud Telemedicina';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = Array.isArray(params.appointmentId)
    ? params.appointmentId[0]
    : params.appointmentId;
  const fileInputRef = useRef(null);

  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
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

  const canUploadVoucher = useMemo(() => {
    if (!appointment) return false;
    return appointment.canUploadVoucher;
  }, [appointment]);

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen valida del comprobante.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar 5MB.');
      return;
    }

    setError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleUploadVoucher() {
    if (!selectedFile) {
      setError('Selecciona primero una imagen del comprobante.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('voucher', selectedFile);
      formData.append('appointmentId', appointmentId);

      const response = await fetch('/api/payments/upload-voucher', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'No se pudo subir el comprobante.');
      }

      router.push(`/confirmation/${appointmentId}`);
    } catch (requestError) {
      setError(requestError.message || 'No se pudo subir el comprobante.');
    } finally {
      setIsUploading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          Cargando resumen de pago...
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[32px] border border-red-200 bg-white p-12 text-center text-red-700 shadow-sm">
          {error || 'No se encontro la solicitud de atencion.'}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Pago y comprobante</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          La reserva queda separada, pero la cita solo pasa a confirmada cuando el
          equipo valida el comprobante en InteleSalud.
        </p>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.05fr,0.95fr]">
          <section className="border-b border-slate-100 p-8 lg:border-b-0 lg:border-r">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">
              Resumen de la consulta
            </h2>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-6 border-b border-slate-50 pb-4">
                <span className="text-slate-500">Servicio</span>
                <div className="text-right">
                  <p className="font-medium text-slate-900">
                    {appointment.service?.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {appointment.service?.specialty?.name || 'Especialidad'}
                  </p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-6 border-b border-slate-50 pb-4">
                <span className="text-slate-500">Profesional</span>
                <div className="text-right">
                  <p className="font-medium text-slate-900">
                    {appointment.specialist?.name || 'Profesional asignado'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {appointment.specialist?.title || 'InteleSalud'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between border-b border-slate-50 pb-4">
                <span className="text-slate-500">Fecha</span>
                <span className="font-medium text-slate-900">
                  {appointment.slot?.dateLabel}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-50 pb-4">
                <span className="text-slate-500">Hora</span>
                <span className="font-medium text-slate-900">
                  {appointment.slot?.startLabel}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-50 pb-4">
                <span className="text-slate-500">Estado actual</span>
                <span className="font-medium text-slate-900">
                  {appointment.statusLabel}
                </span>
              </div>

              <div className="flex items-end justify-between pt-2">
                <span className="text-lg font-semibold text-slate-900">
                  Total a pagar
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  {appointment.service?.currency} {appointment.service?.price}
                </span>
              </div>
            </div>
          </section>

          <section className="border-b border-slate-100 bg-gradient-to-br from-sky-50 to-emerald-50 p-8 lg:border-b-0">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                <Smartphone size={20} />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Instrucciones de pago
              </h2>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-700 text-sm font-bold text-white">
                  1
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    Transfiere por Plin al numero oficial
                  </p>
                  <div className="mt-2 rounded-2xl border-2 border-sky-200 bg-white p-4 text-center">
                    <p className="text-2xl font-bold tracking-wider text-sky-700">
                      {PLIN_PHONE}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{COLLECTION_NAME}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-700 text-sm font-bold text-white">
                  2
                </div>
                <div>
                  <p className="font-medium text-slate-900">Sube el comprobante</p>
                  <p className="text-sm leading-6 text-slate-600">
                    El equipo revisa el pago antes de habilitar la sala virtual y
                    mostrar la cita como confirmada.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="bg-slate-50 p-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Upload size={20} className="text-emerald-600" />
            Comprobante de pago
          </h2>

          {error ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {!canUploadVoucher ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600">
              {appointment.status === 'AWAITING_CONFIRMATION'
                ? 'Tu comprobante ya fue recibido y esta en revision.'
                : appointment.status === 'CONFIRMED'
                  ? 'El pago ya fue aprobado. Esta solicitud ya no necesita otro comprobante.'
                  : 'No puedes subir un nuevo comprobante mientras exista uno pendiente o aprobado.'}
            </div>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="mb-6">
                  <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white">
                    <img
                      src={previewUrl}
                      alt="Comprobante"
                      className="max-h-80 w-full object-contain p-4"
                    />
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white transition-colors hover:bg-red-600"
                    >
                      x
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700">
                    <CheckCircle2 size={16} />
                    <span>{selectedFile?.name} seleccionado</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group mb-6 w-full rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center transition-all hover:border-emerald-400 hover:bg-emerald-50/50"
                >
                  <ImageIcon
                    size={40}
                    className="mx-auto mb-3 text-slate-400 transition-colors group-hover:text-emerald-500"
                  />
                  <p className="font-medium text-slate-700 group-hover:text-emerald-700">
                    Haz clic para seleccionar la imagen
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    JPG, PNG o WebP - maximo 5MB
                  </p>
                </button>
              )}

              <button
                onClick={handleUploadVoucher}
                disabled={isUploading || !selectedFile}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isUploading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Upload size={20} />
                    Enviar comprobante
                  </>
                )}
              </button>
            </>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Lock size={14} />
            <span>
              Tu comprobante sera revisado antes de activar cualquier enlace de
              videollamada.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
