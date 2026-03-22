import PortalHeader from '@/components/portal/PortalHeader';
import { requireServerAuth } from '@/lib/auth/serverSession';

const INDICATIONS = [
  'Mantener a la mano tus examenes y documentos previos antes de la teleconsulta.',
  'Subir comprobante de pago para acelerar la validacion y confirmacion.',
  'Revisar el portal 15 minutos antes de la cita para confirmar estado de sala virtual.',
  'Usar Mensajes para dudas administrativas o coordinacion de seguimiento.',
];

export default async function PortalIndicationsPage() {
  await requireServerAuth({ allowedRoles: ['PATIENT'], pathname: '/portal/indicaciones' });

  return (
    <>
      <PortalHeader title="Indicaciones" subtitle="Recordatorios y siguientes pasos para sostener tu continuidad de atencion." />
      <div className="grid gap-4 px-4 py-6 md:px-6 lg:grid-cols-2">
        {INDICATIONS.map((item) => (
          <article key={item} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm leading-7 text-slate-600">{item}</p>
          </article>
        ))}
      </div>
    </>
  );
}
