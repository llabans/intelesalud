'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function OnboardingClient({
  specialties,
  careIntents,
  attentionPreferences,
  initialName = '',
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: initialName || user?.name || '',
    careIntent: careIntents[0] || '',
    preferredSpecialtyId: specialties[0]?.id || '',
    location: '',
    attentionPreference: attentionPreferences[0] || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'No se pudo completar el onboarding.');
      }

      router.push(payload.redirectTo || '/portal');
      router.refresh();
    } catch (requestError) {
      setError(requestError.message || 'No se pudo completar el onboarding.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-950/5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
          Primer acceso
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Personaliza tu portal de paciente
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Solo necesitamos algunos datos para orientarte mejor y llevarte al flujo correcto de reserva y seguimiento.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          <span>Nombre completo</span>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span>Tipo de atencion que buscas</span>
          <select
            name="careIntent"
            value={form.careIntent}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
          >
            {careIntents.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span>Especialidad de interes</span>
          <select
            name="preferredSpecialtyId"
            value={form.preferredSpecialtyId}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
          >
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span>Ubicacion opcional</span>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Ej. Lima, Peru"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
          <span>Preferencia de atencion</span>
          <select
            name="attentionPreference"
            value={form.attentionPreference}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
          >
            {attentionPreferences.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-400"
      >
        {loading ? 'Guardando...' : 'Entrar al portal'}
      </button>
    </form>
  );
}
