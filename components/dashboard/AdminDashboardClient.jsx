'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CheckCircle2,
  Clock,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState('overview');
  const [processingVoucher, setProcessingVoucher] = useState(null);

  const pendingVouchers = [
    {
      id: 'voucher_1',
      appointmentId: 'app_5',
      patientName: 'Ana Lopez',
      service: 'Consulta medica virtual',
      amount: 'S/ 50',
      uploadedAt: '08 Mar 2026, 10:30 AM',
    },
  ];

  const handleVoucherAction = async (voucherId, action) => {
    setProcessingVoucher(voucherId);
    try {
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherId, action }),
      });
      if (!response.ok) {
        throw new Error('Error');
      }
      alert(action === 'approve' ? 'Pago aprobado' : 'Pago rechazado');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setProcessingVoucher(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Administracion</h1>
          <p className="text-slate-600">Control general de la plataforma</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-sm">
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold">
            AD
          </div>
          <div>
            <p className="text-sm font-medium">Admin System</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <nav className="flex flex-col">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === 'overview' ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Resumen
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === 'payments' ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                Pagos
                {pendingVouchers.length > 0 && (
                  <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {pendingVouchers.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === 'users' ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Users className="w-5 h-5 mr-3" />
                Usuarios
              </button>
            </nav>
          </div>
        </div>

        <div className="lg:col-span-4">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-500 font-medium mb-1">Ingresos (Mes)</p>
                  <p className="text-3xl font-bold text-slate-900">S/ 1,250</p>
                  <p className="text-xs text-emerald-600 font-medium mt-2">+12% vs mes anterior</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-500 font-medium mb-1">Citas Realizadas</p>
                  <p className="text-3xl font-bold text-slate-900">32</p>
                  <p className="text-xs text-emerald-600 font-medium mt-2">+5% vs mes anterior</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-500 font-medium mb-1">Pacientes Activos</p>
                  <p className="text-3xl font-bold text-slate-900">128</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-500 font-medium mb-1">Tasa de Asistencia</p>
                  <p className="text-3xl font-bold text-slate-900">98%</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Actividad Reciente</h3>
                  <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">
                    Ver todo
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-6 py-4 font-medium">ID Cita</th>
                        <th className="px-6 py-4 font-medium">Paciente</th>
                        <th className="px-6 py-4 font-medium">Servicio</th>
                        <th className="px-6 py-4 font-medium">Estado Pago</th>
                        <th className="px-6 py-4 font-medium">Estado Cita</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">#APP-1029</td>
                        <td className="px-6 py-4 text-slate-600">Juan Perez</td>
                        <td className="px-6 py-4 text-slate-600">Consulta Inicial</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle2 size={12} className="mr-1" />
                            Plin Confirmado
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                            Confirmada
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">#APP-1028</td>
                        <td className="px-6 py-4 text-slate-600">Ana Lopez</td>
                        <td className="px-6 py-4 text-slate-600">Seguimiento</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800">
                            <Clock size={12} className="mr-1" />
                            En Revision
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800">
                            Esperando Pago
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Confirmacion de Pagos Plin</h2>

              {pendingVouchers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-500">
                  <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-300" />
                  <p className="font-medium">No hay pagos pendientes de revision</p>
                </div>
              ) : (
                pendingVouchers.map((voucher) => (
                  <div key={voucher.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{voucher.patientName}</h3>
                        <p className="text-sm text-slate-600">
                          {voucher.service} - {voucher.appointmentId}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">Subido: {voucher.uploadedAt}</p>
                      </div>
                      <span className="text-xl font-bold text-emerald-600">{voucher.amount}</span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleVoucherAction(voucher.id, 'approve')}
                        disabled={processingVoucher === voucher.id}
                        className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                      >
                        <ThumbsUp size={16} />
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleVoucherAction(voucher.id, 'reject')}
                        disabled={processingVoucher === voucher.id}
                        className="flex-1 bg-white text-red-600 border border-red-200 px-4 py-3 rounded-xl font-medium hover:bg-red-50 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                      >
                        <ThumbsDown size={16} />
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-500">
              <p>Esta seccion esta en desarrollo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
