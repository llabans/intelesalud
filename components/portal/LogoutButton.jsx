'use client';

import { useAuth } from '@/components/AuthProvider';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={logout}
      className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
    >
      Cerrar sesion
    </button>
  );
}
