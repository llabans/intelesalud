import Link from 'next/link';
import { FileText, Scale, ShieldCheck } from 'lucide-react';

function Section({ section }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-4">{section.title}</h2>

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="text-slate-600 leading-7 mb-4 last:mb-0">
          {paragraph}
        </p>
      ))}

      {section.bullets?.length ? (
        <ul className="space-y-3 text-slate-600">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default function LegalDocumentPage({ document }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-white border-b border-slate-200 px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 mb-6">
            <Scale size={16} />
            Referencias normativas peruanas y politicas de telemedicina
          </div>

          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-14 w-14 rounded-2xl bg-slate-900 text-white items-center justify-center">
              <FileText size={28} />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                {document.title}
              </h1>
              <p className="text-slate-600 text-lg leading-8 max-w-3xl">
                {document.intro}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1.5">
                  Version: {document.version}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5">
                  Ultima actualizacion: {document.lastUpdated}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-indigo-950 text-indigo-50 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-1 text-emerald-300 flex-shrink-0" size={24} />
              <div>
                <h2 className="text-lg font-semibold mb-3">Importante</h2>
                <p className="text-indigo-100 leading-7">
                  Este contenido esta redactado para alinearse con el marco legal peruano vigente
                  sobre datos personales, derechos en salud y telesalud. Debe revisarse
                  periodicamente cuando cambien la operacion, los proveedores o la regulacion
                  aplicable.
                </p>
              </div>
            </div>
          </div>

          {document.sections.map((section) => (
            <Section key={section.title} section={section} />
          ))}

          <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Referencias oficiales</h2>
            <ul className="space-y-4">
              {document.references.map((reference) => (
                <li key={reference.href}>
                  <Link
                    href={reference.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-700 hover:text-indigo-900 hover:underline break-words"
                  >
                    {reference.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </div>
  );
}
