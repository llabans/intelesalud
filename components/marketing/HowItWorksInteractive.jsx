'use client';

import { useState } from 'react';
import { ArrowRight, X, CalendarDays, UserCheck, CreditCard, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STEP_DETAILS = [
  {
    icon: CalendarDays,
    detail: 'Explora nuestro catálogo de especialidades y profesionales verificados. Selecciona la fecha y hora que mejor se adapte a tu agenda. El sistema te muestra solo horarios realmente disponibles, sin sorpresas.',
    tip: 'No necesitas crear una cuenta para explorar. Solo al confirmar tu cita.',
  },
  {
    icon: UserCheck,
    detail: 'Selecciona tu especialista según experiencia, universidad, valoración y disponibilidad. Cada profesional tiene un perfil completo con su formación, años de experiencia y opiniones de otros pacientes.',
    tip: 'Puedes filtrar por precio, especialidad o disponibilidad inmediata.',
  },
  {
    icon: CreditCard,
    detail: 'El sistema te muestra el flujo de pago vía Plin. Sube tu comprobante y el equipo lo valida en minutos. Una vez confirmado, recibes automáticamente tu enlace de videoconsulta por correo.',
    tip: 'Tu pago se valida antes de la cita. Si hay algún problema, te contactamos.',
  },
  {
    icon: Video,
    detail: 'Accede a tu portal del paciente donde encontrarás: historial de citas, mensajes con tu médico, documentos clínicos, indicaciones y tu sala virtual lista para la videoconsulta.',
    tip: 'Todo queda registrado en tu portal para seguimiento y continuidad.',
  },
];

export default function HowItWorksInteractive({ steps }) {
  const [expandedStep, setExpandedStep] = useState(null);

  return (
    <section className="mx-auto max-w-5xl px-4 md:px-6">
      <div className="rounded-2xl border border-cyan-200/40 bg-gradient-to-br from-cyan-800 to-cyan-700 px-6 py-10 md:px-10">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">Proceso simple</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Tu consulta en 4 pasos</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = STEP_DETAILS[index]?.icon || CalendarDays;
            const isExpanded = expandedStep === index;

            return (
              <div key={step.id} className="relative">
                <motion.div
                  layout
                  className="rounded-xl bg-white/10 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                >
                  <div className="flex items-start justify-between">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <Icon className="h-4 w-4 text-white/40" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">{step.title}</p>
                  <p className="mt-1.5 text-xs leading-5 text-white/60">{step.description}</p>
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : index)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/70 transition-colors hover:text-white"
                  >
                    {isExpanded ? 'Cerrar' : 'Ver detalles'}
                    <ArrowRight className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </motion.div>

                {/* Expanded detail panel */}
                <AnimatePresence>
                  {isExpanded && STEP_DETAILS[index] && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 rounded-xl bg-white p-4 shadow-lg">
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-bold uppercase tracking-wider text-cyan-800">Paso {index + 1} en detalle</p>
                          <button onClick={() => setExpandedStep(null)} className="text-slate-400 hover:text-slate-600">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{STEP_DETAILS[index].detail}</p>
                        <div className="mt-3 rounded-lg bg-cyan-50 px-3 py-2">
                          <p className="text-xs text-cyan-800">
                            <span className="font-semibold">Tip:</span> {STEP_DETAILS[index].tip}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
