'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

/**
 * Specialty config: accent color, icon SVG, background illustration SVG.
 * Each card is self-explanatory through color, a central icon, and a
 * subtle line-art background illustration ("estilo sombrilla").
 */
const SPECIALTY_VISUALS = {
  'medicina-general': {
    accent: '#0E7490',       // Teal marca
    accentLight: 'rgba(14,116,144,0.08)',
    accentBorder: 'rgba(14,116,144,0.25)',
    accentGlow: 'rgba(14,116,144,0.15)',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
        <circle cx="24" cy="18" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M24 24v10M20 30h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 14c-2 2-3 5-3 8a13 13 0 0026 0c0-3-1-6-3-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
      </svg>
    ),
    bgIllustration: (
      <svg viewBox="0 0 200 160" fill="none" className="absolute inset-0 h-full w-full">
        {/* Family silhouette */}
        <circle cx="80" cy="90" r="12" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
        <line x1="80" y1="102" x2="80" y2="135" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
        <line x1="80" y1="115" x2="68" y2="128" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
        <line x1="80" y1="115" x2="92" y2="128" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
        <circle cx="120" cy="85" r="10" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
        <line x1="120" y1="95" x2="120" y2="125" stroke="currentColor" strokeWidth="0.8" opacity="0.08" />
        <circle cx="145" cy="95" r="7" stroke="currentColor" strokeWidth="0.8" opacity="0.08" />
        <line x1="145" y1="102" x2="145" y2="125" stroke="currentColor" strokeWidth="0.6" opacity="0.06" />
      </svg>
    ),
  },
  'pediatria': {
    accent: '#7DD3FC',       // Celeste pastel
    accentLight: 'rgba(125,211,252,0.10)',
    accentBorder: 'rgba(125,211,252,0.35)',
    accentGlow: 'rgba(125,211,252,0.20)',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
        {/* Teddy bear */}
        <circle cx="24" cy="26" r="10" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="19" cy="24" r="1.5" fill="currentColor" opacity="0.7" />
        <circle cx="29" cy="24" r="1.5" fill="currentColor" opacity="0.7" />
        <ellipse cx="24" cy="28" rx="3" ry="2" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="16" cy="18" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="32" cy="18" r="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    bgIllustration: (
      <svg viewBox="0 0 200 160" fill="none" className="absolute inset-0 h-full w-full">
        {/* Children jumping */}
        <circle cx="60" cy="80" r="6" stroke="currentColor" strokeWidth="0.7" opacity="0.12" />
        <path d="M60 86v15M54 78l-6-8M66 78l6-8M55 96l-5 10M65 96l5 10" stroke="currentColor" strokeWidth="0.7" opacity="0.10" strokeLinecap="round" />
        <circle cx="110" cy="75" r="6" stroke="currentColor" strokeWidth="0.7" opacity="0.10" />
        <path d="M110 81v15M104 73l-6-8M116 73l6-8M105 91l-5 10M115 91l5 10" stroke="currentColor" strokeWidth="0.7" opacity="0.08" strokeLinecap="round" />
        <circle cx="155" cy="82" r="5" stroke="currentColor" strokeWidth="0.6" opacity="0.08" />
        <path d="M155 87v12M151 80l-4-6M159 80l4-6" stroke="currentColor" strokeWidth="0.6" opacity="0.06" strokeLinecap="round" />
        {/* Stars */}
        <path d="M40 50l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
        <path d="M170 45l1.5 3 3 .7-2 2 .5 3-3-1.5-3 1.5.5-3-2-2 3-.7z" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
      </svg>
    ),
  },
  'salud-mental': {
    accent: '#A78BFA',       // Lavanda
    accentLight: 'rgba(167,139,250,0.08)',
    accentBorder: 'rgba(167,139,250,0.25)',
    accentGlow: 'rgba(167,139,250,0.15)',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
        {/* Brain with sparkle */}
        <path d="M24 8c-7 0-12 5-12 12 0 4 2 7 5 9l2 3h10l2-3c3-2 5-5 5-9 0-7-5-12-12-12z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M21 16c0-1 1-2 3-2s3 1 3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <line x1="24" y1="14" x2="24" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <path d="M30 8l1-3M32 10l3-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    bgIllustration: (
      <svg viewBox="0 0 200 160" fill="none" className="absolute inset-0 h-full w-full">
        {/* Person meditating under tree */}
        <circle cx="100" cy="100" r="5" stroke="currentColor" strokeWidth="0.7" opacity="0.1" />
        <path d="M100 105v8M95 108h10" stroke="currentColor" strokeWidth="0.7" opacity="0.08" strokeLinecap="round" />
        <path d="M100 60c-15 0-25 12-25 25 0 8 4 14 10 18" stroke="currentColor" strokeWidth="0.6" opacity="0.08" />
        <path d="M100 60c15 0 25 12 25 25 0 8-4 14-10 18" stroke="currentColor" strokeWidth="0.6" opacity="0.08" />
        <line x1="100" y1="85" x2="100" y2="55" stroke="currentColor" strokeWidth="0.8" opacity="0.06" />
        {/* Roots */}
        <path d="M100 120c-3 5-8 12-15 18M100 120c3 5 8 12 15 18M100 120v20" stroke="currentColor" strokeWidth="0.5" opacity="0.05" strokeLinecap="round" />
      </svg>
    ),
  },
  'nutricion': {
    accent: '#84CC16',       // Verde lima
    accentLight: 'rgba(132,204,22,0.08)',
    accentBorder: 'rgba(132,204,22,0.25)',
    accentGlow: 'rgba(132,204,22,0.15)',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
        {/* Apple + scale */}
        <circle cx="20" cy="22" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M20 14c2-3 5-3 5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 22a3 3 0 016 0" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <rect x="30" y="28" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <line x1="35" y1="26" x2="35" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
    bgIllustration: (
      <svg viewBox="0 0 200 160" fill="none" className="absolute inset-0 h-full w-full">
        {/* Fruits & vegetables */}
        <circle cx="60" cy="100" r="10" stroke="currentColor" strokeWidth="0.6" opacity="0.10" />
        <ellipse cx="90" cy="105" rx="12" ry="8" stroke="currentColor" strokeWidth="0.6" opacity="0.08" />
        <circle cx="130" cy="95" r="8" stroke="currentColor" strokeWidth="0.6" opacity="0.08" />
        <path d="M130 87c2-4 5-3 5-3" stroke="currentColor" strokeWidth="0.5" opacity="0.06" strokeLinecap="round" />
        <ellipse cx="160" cy="110" rx="7" ry="12" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
        <path d="M50 80c5-2 10 0 15 3s10 8 18 6" stroke="currentColor" strokeWidth="0.5" opacity="0.05" strokeLinecap="round" />
      </svg>
    ),
  },
  'endocrinologia': {
    accent: '#FB923C',       // Coral suave
    accentLight: 'rgba(251,146,60,0.08)',
    accentBorder: 'rgba(251,146,60,0.25)',
    accentGlow: 'rgba(251,146,60,0.15)',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
        {/* Thyroid / molecular */}
        <ellipse cx="20" cy="22" rx="6" ry="8" stroke="currentColor" strokeWidth="1.8" />
        <ellipse cx="28" cy="22" rx="6" ry="8" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="24" cy="14" r="3" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
        <circle cx="24" cy="14" r="1" fill="currentColor" opacity="0.4" />
      </svg>
    ),
    bgIllustration: (
      <svg viewBox="0 0 200 160" fill="none" className="absolute inset-0 h-full w-full">
        {/* Molecular / hourglass */}
        <circle cx="80" cy="70" r="6" stroke="currentColor" strokeWidth="0.6" opacity="0.10" />
        <circle cx="120" cy="90" r="6" stroke="currentColor" strokeWidth="0.6" opacity="0.08" />
        <circle cx="100" cy="110" r="4" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
        <line x1="86" y1="73" x2="114" y2="87" stroke="currentColor" strokeWidth="0.5" opacity="0.07" />
        <line x1="116" y1="95" x2="104" y2="108" stroke="currentColor" strokeWidth="0.5" opacity="0.05" />
        {/* Hourglass */}
        <path d="M145 65h20M145 125h20M148 65c0 15 14 25 14 30s-14 15-14 30M162 65c0 15-14 25-14 30s14 15 14 30" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
      </svg>
    ),
  },
  'dermatologia': {
    accent: '#F9A8D4',       // Melocotón/rosa
    accentLight: 'rgba(249,168,212,0.08)',
    accentBorder: 'rgba(249,168,212,0.30)',
    accentGlow: 'rgba(249,168,212,0.15)',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
        {/* Magnifying glass + aloe leaf */}
        <circle cx="20" cy="20" r="9" stroke="currentColor" strokeWidth="1.8" />
        <line x1="27" y1="27" x2="35" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 18c2-4 8-4 8 2s-4 8-8 6" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      </svg>
    ),
    bgIllustration: (
      <svg viewBox="0 0 200 160" fill="none" className="absolute inset-0 h-full w-full">
        {/* Skin with protective glow */}
        <ellipse cx="100" cy="100" rx="50" ry="30" stroke="currentColor" strokeWidth="0.6" opacity="0.06" />
        <ellipse cx="100" cy="100" rx="60" ry="38" stroke="currentColor" strokeWidth="0.4" opacity="0.04" strokeDasharray="4 4" />
        <ellipse cx="100" cy="100" rx="70" ry="45" stroke="currentColor" strokeWidth="0.3" opacity="0.03" strokeDasharray="2 6" />
        <circle cx="85" cy="95" r="3" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
        <circle cx="115" cy="105" r="2" stroke="currentColor" strokeWidth="0.5" opacity="0.05" />
      </svg>
    ),
  },
};

export default function SpecialtyCard({ specialty }) {
  const visuals = SPECIALTY_VISUALS[specialty.slug] || SPECIALTY_VISUALS['medicina-general'];

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 cursor-pointer"
      style={{
        borderColor: visuals.accentBorder,
        '--card-accent': visuals.accent,
        '--card-glow': visuals.accentGlow,
      }}
    >
      {/* Hover glow effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 1.5px ${visuals.accent}, 0 0 24px ${visuals.accentGlow}`,
          borderRadius: 'inherit',
        }}
      />

      {/* Background illustration */}
      <div className="pointer-events-none absolute inset-0" style={{ color: visuals.accent }}>
        {visuals.bgIllustration}
      </div>

      {/* Subtle accent gradient wash */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${visuals.accentLight}, transparent 60%)` }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className="mb-4 inline-flex items-center justify-center rounded-xl p-2.5"
          style={{ color: visuals.accent, backgroundColor: visuals.accentLight }}
        >
          {visuals.icon}
        </div>

        <h3 className="text-base font-bold text-slate-900">{specialty.name}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{specialty.summary}</p>

        <Link
          href={`/profesionales?specialty=${specialty.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
          style={{ color: visuals.accent }}
        >
          Ver profesionales
          <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
