import Link from 'next/link';

export default function EmptyStateCard({ title, description, ctaHref, ctaLabel = 'Continuar' }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">{description}</p>
      {ctaHref ? (
        <Link
          href={ctaHref}
          className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
