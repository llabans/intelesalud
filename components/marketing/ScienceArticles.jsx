'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FALLBACK_ARTICLES = [
  {
    id: '1',
    title: 'Caminar 30 minutos al día reduce el riesgo cardiovascular en un 35%',
    summary: 'Un metaanálisis de 17 estudios confirma que la actividad física moderada diaria tiene un impacto significativo en la prevención de enfermedades del corazón.',
    source: 'PubMed',
    date: '2026',
    category: 'Cardiología',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38901234/',
  },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes('-')) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  return dateStr;
}

function ArticleCard({ article }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-cyan-200">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          <BookOpen className="h-3 w-3" />
          Ciencia
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
          {article.category}
        </span>
      </div>

      <a
        href={article.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-cyan-800"
      >
        {article.title}
      </a>

      {/* Summary — always visible, truncated */}
      <p className={`mt-2 text-xs leading-5 text-slate-500 ${expanded ? '' : 'line-clamp-2'}`}>
        {article.summary}
      </p>

      {/* Expand/collapse */}
      {article.summary && article.summary.length > 100 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1.5 inline-flex items-center gap-1 self-start text-[11px] font-semibold text-cyan-700 transition hover:text-cyan-600"
        >
          {expanded ? 'Ver menos' : 'Leer resumen completo'}
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      )}

      <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(article.date)}
        </span>
        <span className="font-medium text-cyan-700">
          {article.source?.length > 30 ? article.source.slice(0, 28) + '…' : article.source}
        </span>
      </div>
    </article>
  );
}

export default function ScienceArticles() {
  const [articles, setArticles] = useState(FALLBACK_ARTICLES);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('/api/articles?limit=20')
      .then(res => res.json())
      .then(data => {
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
      })
      .catch(() => {});
  }, []);

  const visible = showAll ? articles : articles.slice(0, 6);
  const hasMore = articles.length > 6;

  return (
    <section id="salud-al-dia" className="mx-auto max-w-7xl scroll-mt-24 px-4 md:px-6">
      <div className="text-center">
        <p className="section-label">Actualidad médica</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">¿Sabías que...? Salud al Día</h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
          Descubrimientos recientes que pueden mejorar tu bienestar, explicados de forma simple. Resumidos por IA desde PubMed.
        </p>
        <p className="mt-1 text-sm text-slate-400">{articles.length} artículos disponibles</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-800 px-6 py-3 text-sm font-semibold text-cyan-800 transition-all duration-200 hover:bg-cyan-50"
          >
            {showAll ? (
              <>Ver menos <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Ver los {articles.length} artículos <ChevronDown className="h-4 w-4" /></>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
