'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (user.email?.[0] || '?').toUpperCase();

  const roleBadge = {
    ADMIN: { label: 'Admin', bg: 'bg-slate-900 text-white' },
    SPECIALIST: { label: 'Especialista', bg: 'bg-blue-100 text-blue-700' },
    PATIENT: { label: 'Paciente', bg: 'bg-emerald-100 text-emerald-700' },
  }[user.role] || { label: 'Paciente', bg: 'bg-emerald-100 text-emerald-700' };

  const dashboardPath = {
    ADMIN: '/dashboard/admin',
    SPECIALIST: '/dashboard/specialist',
    PATIENT: '/portal',
  }[user.role] || '/portal';

  async function handleLogout() {
    setIsOpen(false);
    await logout();
    window.location.href = '/';
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 transition-colors hover:border-slate-300"
      >
        {user.image ? (
          <img
            src={user.image}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
            {initials}
          </div>
        )}
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-slate-700 lg:block">
          {user.name || user.email}
        </span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 p-4">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user.name || 'Usuario'}
            </p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
            <span
              className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleBadge.bg}`}
            >
              {roleBadge.label}
            </span>
          </div>
          <div className="p-2">
            <Link
              href={dashboardPath}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              <LayoutDashboard size={16} />
              Mi portal
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut size={16} />
              Cerrar sesion
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
