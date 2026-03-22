'use client';

import { useState } from 'react';

export default function ReviewForm({ appointmentId, currentReview = null }) {
  const [rating, setRating] = useState(currentReview?.rating || 5);
  const [comment, setComment] = useState(currentReview?.comment || '');
  const [status, setStatus] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('guardando');

    try {
      const response = await fetch(`/api/appointments/${appointmentId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'No se pudo guardar la evaluacion.');
      }

      setStatus('ok');
    } catch (error) {
      setStatus(error.message || 'No se pudo guardar la evaluacion.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className={`rounded-full px-3 py-2 text-sm font-medium ${
              rating === value ? 'bg-slate-950 text-white' : 'bg-white text-slate-600'
            }`}
          >
            {value} estrella{value > 1 ? 's' : ''}
          </button>
        ))}
      </div>
      <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} placeholder="Comentario opcional sobre tu experiencia." className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400" />
      <button type="submit" className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
        Guardar evaluacion
      </button>
      {status && status !== 'guardando' ? (
        <p className={`text-sm ${status === 'ok' ? 'text-emerald-700' : 'text-red-600'}`}>
          {status === 'ok' ? 'Evaluacion guardada.' : status}
        </p>
      ) : null}
    </form>
  );
}
