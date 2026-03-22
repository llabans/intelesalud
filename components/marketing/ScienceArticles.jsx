import { BookOpen, ExternalLink, Calendar } from 'lucide-react';

/**
 * "Ciencia y Salud al Día" section.
 * Consumes an array of article objects — ready to connect to a
 * PubMed/NCBI backend bot that scrapes, summarizes with AI, and feeds daily.
 *
 * Expected article shape:
 * {
 *   id: string,
 *   title: string,           // Patient-friendly title
 *   summary: string,         // 2-line AI-generated plain-language summary
 *   source: string,          // e.g. "PubMed" or journal name
 *   pubmedId?: string,       // PMID for link generation
 *   date: string,            // ISO date or formatted string
 *   category: string,        // e.g. "Nutrición", "Salud Mental"
 *   url?: string,            // Direct link to article
 * }
 */

const SAMPLE_ARTICLES = [
  {
    id: '1',
    title: 'Caminar 30 minutos al día reduce el riesgo cardiovascular en un 35%',
    summary: 'Un metaanálisis de 17 estudios confirma que la actividad física moderada diaria tiene un impacto significativo en la prevención de enfermedades del corazón, incluso sin cambios en la dieta.',
    source: 'PubMed',
    pubmedId: '38901234',
    date: '2026-03-20',
    category: 'Cardiología',
  },
  {
    id: '2',
    title: 'La meditación guiada mejora la calidad del sueño en adultos con ansiedad',
    summary: 'Investigadores encontraron que 8 semanas de meditación mindfulness reducen el insomnio en un 42% y mejoran los indicadores de bienestar emocional en pacientes con trastorno de ansiedad generalizada.',
    source: 'PubMed',
    pubmedId: '38905678',
    date: '2026-03-18',
    category: 'Salud Mental',
  },
  {
    id: '3',
    title: 'Dieta mediterránea y control glucémico: nueva evidencia en diabetes tipo 2',
    summary: 'Un ensayo clínico con 450 pacientes demostró que adoptar una dieta mediterránea durante 6 meses reduce la hemoglobina glicosilada (HbA1c) en un 0.8%, comparable al efecto de algunos medicamentos orales.',
    source: 'PubMed',
    pubmedId: '38909012',
    date: '2026-03-15',
    category: 'Nutrición',
  },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ScienceArticles({ articles = SAMPLE_ARTICLES }) {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="text-center">
        <p className="section-label">Evidencia clínica</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Ciencia y Salud al Día</h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
          Artículos científicos recientes, resumidos para ti por nuestro equipo clínico.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <article
            key={article.id}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-cyan-200"
          >
            {/* Top badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                <BookOpen className="h-3 w-3" />
                Respaldado por la Ciencia
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="mt-4 text-base font-bold leading-snug text-slate-900 group-hover:text-cyan-800 transition-colors">
              {article.title}
            </h3>

            {/* Summary */}
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
              {article.summary}
            </p>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(article.date)}
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-cyan-700">
                  <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm1 11H7V7h2v4zm0-5H7V4h2v2z" />
                  </svg>
                  {article.source}
                </span>
              </div>
              {article.pubmedId && (
                <a
                  href={article.url || `https://pubmed.ncbi.nlm.nih.gov/${article.pubmedId}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-800 transition hover:text-cyan-600"
                >
                  Leer más <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
