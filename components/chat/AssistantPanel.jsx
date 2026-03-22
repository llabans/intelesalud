'use client';

import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export default function AssistantPanel({
  channel = 'PUBLIC',
  heading = 'Asistente InteleSalud',
  compact = false,
}) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 'assistant_welcome',
      role: 'assistant',
      content:
        channel === 'PORTAL'
          ? 'Puedo ayudarte con reservas, estados de cita, documentos e indicaciones del portal.'
          : 'Puedo orientarte con especialidades, reservas, pago por Plin y funcionamiento de InteleSalud.',
    },
  ]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!draft.trim()) {
      return;
    }

    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: draft.trim(),
    };

    setMessages((current) => [...current, userMessage]);
    setDraft('');
    setLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          channel,
          message: userMessage.content,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'No se pudo responder.');
      }

      setConversationId(payload.conversationId);
      setMessages((current) => [...current, payload.message]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant_error_${Date.now()}`,
          role: 'assistant',
          content:
            error.message ||
            'No pude responder en este momento. Vuelve a intentarlo en unos instantes.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-950/5 ${compact ? 'w-full' : ''}`}>
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
          <MessageSquare className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-950">{heading}</p>
          <p className="text-xs text-slate-500">Asistente administrativo prudente</p>
        </div>
      </div>
      <div className="space-y-3 bg-slate-50/70 px-4 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[90%] rounded-3xl px-4 py-3 text-sm leading-6 ${
              message.role === 'user'
                ? 'ml-auto bg-slate-950 text-white'
                : 'bg-white text-slate-700 shadow-sm'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t border-slate-100 p-4">
        <div className="flex gap-3">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={2}
            placeholder="Escribe tu consulta administrativa..."
            className="min-h-[72px] flex-1 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none ring-0 transition focus:border-sky-400"
          />
          <button
            type="submit"
            disabled={loading || !draft.trim()}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center self-end rounded-full bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
