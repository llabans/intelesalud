import PortalHeader from '@/components/portal/PortalHeader';
import { requireServerAuth } from '@/lib/auth/serverSession';
import { getPatientClinicalRecords, getPatientDocuments } from '@/lib/portal/queries';

export default async function PortalDocumentsPage() {
  const user = await requireServerAuth({ allowedRoles: ['PATIENT'], pathname: '/portal/documentos' });
  const [documents, records] = await Promise.all([
    getPatientDocuments(user),
    getPatientClinicalRecords(user),
  ]);

  return (
    <>
      <PortalHeader title="Documentos" subtitle="Recetas mock, constancias, resultados y archivos clinicos de ejemplo." />
      <div className="space-y-6 px-4 py-6 md:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {documents.map((document) => (
            <article key={document.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">{document.kind}</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-950">{document.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{document.summary}</p>
            </article>
          ))}
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold text-slate-950">Historia clinica digitalizada</p>
          <div className="mt-4 space-y-4">
            {records.map((record) => (
              <div key={record.id} className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-sm font-semibold text-slate-950">{record.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-sky-700">{record.entryType}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{record.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
