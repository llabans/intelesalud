'use client';

import { useState } from 'react';

export default function ProfileForm({ initialProfile, initialUser }) {
  const [form, setForm] = useState({
    fullName: initialProfile?.fullName || initialUser?.name || '',
    phone: initialUser?.phone || '',
    location: initialProfile?.location || '',
    attentionPreference: initialProfile?.attentionPreference || '',
  });
  const [status, setStatus] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('guardando');

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'No se pudo actualizar el perfil.');
      }

      setStatus('ok');
    } catch (error) {
      setStatus(error.message || 'No se pudo actualizar el perfil.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          <span>Nombre completo</span>
          <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400" />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Telefono</span>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400" />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Ubicacion</span>
          <input name="location" value={form.location} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400" />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Preferencia de atencion</span>
          <input name="attentionPreference" value={form.attentionPreference} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400" />
        </label>
      </div>
      <button type="submit" className="inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
        Guardar cambios
      </button>
      {status && status !== 'guardando' ? (
        <p className={`text-sm ${status === 'ok' ? 'text-emerald-700' : 'text-red-600'}`}>
          {status === 'ok' ? 'Perfil actualizado.' : status}
        </p>
      ) : null}
    </form>
  );
}
