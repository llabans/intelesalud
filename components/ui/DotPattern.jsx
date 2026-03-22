/**
 * Subtle dot grid pattern background.
 * Pure CSS — zero JavaScript, zero performance cost.
 * Creates depth and a "technical precision" feel appropriate for medical platforms.
 */
export default function DotPattern({ className = '', spacing = 28, opacity = 0.04 }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
      style={{
        backgroundImage: `radial-gradient(circle, var(--brand-700) 1px, transparent 1px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        opacity,
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
      }}
    />
  );
}
