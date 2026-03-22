'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import AssistantPanel from '@/components/chat/AssistantPanel';

export default function AssistantWidget({ channel = 'PUBLIC' }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open ? (
        <div className="mb-4 w-[min(360px,calc(100vw-2rem))]">
          <AssistantPanel
            channel={channel}
            heading={channel === 'PORTAL' ? 'Asistente del portal' : 'Orientacion InteleSalud'}
            compact
          />
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl shadow-slate-950/20 transition hover:bg-slate-800"
      >
        <MessageSquare className="h-5 w-5" />
      </button>
    </div>
  );
}
