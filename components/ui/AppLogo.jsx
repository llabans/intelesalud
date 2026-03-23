import Link from 'next/link';

/**
 * InteleSalud logo — modern, minimal, clinical.
 * Custom SVG mark: abstract cross + pulse line forming an "i" shape.
 * No subtitle. Just the brand name.
 */
export default function AppLogo({ href = '/', compact = false }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 group">
      {/* Logo mark — abstract medical cross with pulse */}
      <span className="relative inline-flex h-9 w-9 items-center justify-center">
        <svg viewBox="0 0 36 36" fill="none" className="h-9 w-9">
          {/* Rounded square base */}
          <rect x="2" y="2" width="32" height="32" rx="9" fill="#0E7490" />
          {/* Cross cutout - subtle medical reference */}
          <rect x="14" y="8" width="8" height="20" rx="2" fill="white" opacity="0.25" />
          <rect x="8" y="14" width="20" height="8" rx="2" fill="white" opacity="0.25" />
          {/* Pulse line — the hero element */}
          <path
            d="M7 18h5l2.5-6 3 12 3-9 2.5 3H29"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!compact && (
        <span className="text-[1.15rem] font-bold tracking-tight text-slate-900">
          Intele<span className="text-cyan-800">Salud</span>
        </span>
      )}
    </Link>
  );
}
