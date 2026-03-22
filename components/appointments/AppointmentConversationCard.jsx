'use client';

import { useState } from 'react';
import { Calendar, Clock, MessageSquare, Send } from 'lucide-react';
import { getBadgeClasses } from '@/lib/appointment/portal';

export default function AppointmentConversationCard({
  appointment,
  heading,
  subheading,
  actionSlot = null,
  composerPlaceholder,
  onAppointmentChange,
  emptyStateMessage = 'Todavia no hay mensajes en esta solicitud.',
  showComposer = true,
}) {
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState(appointment.messages || []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body) {
      return;
    }

    setSending(true);
    setError('');

    try {
      const response = await fetch(`/api/appointments/${appointment.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'No se pudo enviar el mensaje.');
      }

      setDraft('');
      setMessages((current) => [...current, payload.message]);
      onAppointmentChange?.(appointment.id, payload.message);
    } catch (requestError) {
      setError(requestError.message || 'No se pudo enviar el mensaje.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getBadgeClasses(
                appointment.statusTone
              )}`}
            >
              {appointment.statusLabel}
            </span>
            {appointment.slot?.dateLabel ? (
              <span className="inline-flex items-center text-sm text-slate-500 gap-2">
                <Calendar className="w-4 h-4" />
                {appointment.slot.dateLabel}
              </span>
            ) : null}
            {appointment.slot?.startLabel ? (
              <span className="inline-flex items-center text-sm text-slate-500 gap-2">
                <Clock className="w-4 h-4" />
                {appointment.slot.startLabel}
              </span>
            ) : null}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{heading}</h3>
            {subheading ? <p className="text-sm text-slate-600 mt-1">{subheading}</p> : null}
          </div>

          <p className="text-sm text-slate-600 leading-6">{appointment.statusDescription}</p>
        </div>

        {actionSlot ? <div className="w-full lg:w-auto">{actionSlot}</div> : null}
      </div>

      {appointment.intakeNotes && !messages.length ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-2">
            Motivo inicial
          </p>
          <p className="text-sm text-emerald-900 leading-6">{appointment.intakeNotes}</p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          Conversacion clinica
        </div>

        {messages.length ? (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl px-4 py-3 border ${
                  message.isOwn
                    ? 'bg-emerald-50 border-emerald-100'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{message.author.name}</span>
                  <span className="uppercase tracking-wide">{message.author.role}</span>
                  <span>{new Date(message.createdAt).toLocaleString('es-PE')}</span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-6">{message.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-dashed border-slate-200 p-6 text-sm text-slate-500 text-center">
            {emptyStateMessage}
          </div>
        )}

        {showComposer ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              placeholder={composerPlaceholder}
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sending || !draft.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}
