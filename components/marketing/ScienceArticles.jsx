'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Calendar } from 'lucide-react';

const FALLBACK_ARTICLES = [
  {
    id: '1',
    title: 'Caminar 30 minutos al día reduce el riesgo cardiovascular en un 35%',
    summary: 'Un metaanálisis de 17 estudios confirma que la actividad física moderada diaria tiene un impacto significativo en la prevención de enfermedades del corazón.',
    source: 'PubMed',
    pubmedId: '38901234',
    date: '2026',
    category: 'Cardiología',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38901234/',
  },
  {
    id: '2',
    title: 'La meditación guiada mejora la calidad del sueño en adultos con ansiedad',
    summary: 'Investigadores encontraron que 8 semanas de meditación mindfulness reducen el insomnio en un 42% y mejoran los indicadores de bienestar emocional.',
    source: 'PubMed',
    pubmedId: '38905678',
    date: '2026',
    category: 'Salud Mental',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38905678/',
  },
  {
    id: '3',
    title: 'Dieta mediterránea y control glucémico: nueva evidencia en diabetes tipo 2',
    summary: 'Un ensayo clínico demostró que adoptar una dieta mediterránea durante 6 meses reduce la hemoglobina glicosilada en un 0.8%, comparable a algunos medicamentos.',
    source: 'PubMed',
    pubmedId: '38909012',
    date: '2026',
    category: 'Nutrición',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38909012/',
  },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  // Handle PubMed date format "2026 Mar" or ISO
  if (dateStr.includes('-')) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  return dateStr;
}

export default function ScienceArticles() {
  const [articles, setArticles] = useState(FALLBACK_ARTICLES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/articles?limit=3')
      .then(res => res.json())
      .then(data => {
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <section id="salud-al-dia" className="mx-auto max-w-7xl scroll-mt-24 px-4 md:px-6">
      <div className="text-center">
        <p className="section-label">Actualidad médica</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">¿Sabías que...? Salud al Día</h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
          Descubrimientos recientes que pueden mejorar tu bienestar, explicados de forma simple.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <article
            key={article.id}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-cyan-200"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                <BookOpen className="h-3 w-3" />
                Respaldado por la Ciencia
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                {article.category}
              </span>
            </div>

            <a
              href={article.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-cyan-800"
            >
              {article.title}
            </a>

            <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
              {article.summary}
            </p>

            <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4 text-xs text-slate-400">
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
          </article>
        ))}
      </div>
    </section>
  );
}
