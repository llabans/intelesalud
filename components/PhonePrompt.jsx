'use client';

import { useState } from 'react';
import { Phone, X } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function PhonePrompt() {
  const { user, updatePhone } = useAuth();
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dismissed, setDismissed] = useState(false);

  // Don't show if user already has phone or prompt was dismissed
  if (!user || user.phone || dismissed) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const formatted = phone.startsWith('+51') ? phone : `+51${phone}`;
      await updatePhone(formatted);
    } catch (err) {
      setError(err.message || 'Error al guardar el número');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <Phone size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Completa tu registro</h3>
            <p className="text-xs text-slate-600">Para completar tu registro, ingresa tu número de teléfono</p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow">
          <div className="flex items-center bg-white border border-amber-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-400">
            <span className="px-3 text-sm font-medium text-slate-500 bg-slate-50 py-3 border-r border-amber-200">+51</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
              placeholder="9XX XXX XXX"
              className="flex-grow px-3 py-3 text-sm outline-none"
              maxLength={9}
              required
            />
          </div>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || phone.length !== 9}
          className="bg-amber-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors disabled:bg-amber-300 whitespace-nowrap"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}
