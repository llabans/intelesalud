# Rediseño Visual Elite — InteleSalud

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar InteleSalud de un prototipo gris genérico a una plataforma de telemedicina premium con identidad visual fuerte, animaciones de scroll, y CTAs de alta conversión.

**Architecture:** Rediseño visual in-place sobre la estructura existente (Next.js 15 + App Router). Se modifican globals.css (design tokens), se agregan componentes de animación reutilizables, y se actualizan los componentes de marketing/landing. No se cambia la lógica de negocio ni las API routes.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Motion (Framer Motion), Google Fonts (Plus Jakarta Sans), Lucide React icons.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `app/globals.css` | Design tokens: paleta teal/coral, fuente web, utilidades |
| Modify | `app/layout.jsx` | Importar Google Font via `next/font/google` |
| Create | `components/ui/AnimatedSection.jsx` | Wrapper reutilizable de scroll-reveal con Motion |
| Create | `components/ui/AnimatedStagger.jsx` | Container para stagger children en scroll |
| Modify | `components/marketing/PublicNavbar.jsx` | CTAs con color de marca, integrar MobileNav |
| Modify | `components/marketing/MobileNav.jsx` | CTAs con color de marca coral |
| Modify | `components/marketing/PublicFooter.jsx` | Contacto, WhatsApp, badges confianza, copyright |
| Modify | `app/(public)/page.jsx` | Hero rediseñado, secciones con animaciones |
| Modify | `components/professionals/ProfessionalCard.jsx` | CTA coral, badge verificado, estilos de marca |
| Modify | `app/(public)/layout.jsx` | Sin cambios estructurales (ya correcto) |

---

## Task 1: Design Tokens y Fuente Web

**Files:**
- Modify: `app/globals.css:1-45`
- Modify: `app/layout.jsx:1-52`

- [ ] **Step 1: Instalar fuente Plus Jakarta Sans via next/font**

En `app/layout.jsx`, agregar import de `next/font/google` y configurar la fuente:

```jsx
import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});
```

Aplicar `className={jakarta.variable}` en `<html>`.

- [ ] **Step 2: Actualizar globals.css con paleta real**

Reemplazar las CSS custom properties con el sistema completo:

```css
@import "tailwindcss";

:root {
  --brand-500: #1a8faa;
  --brand-600: #15788f;
  --brand-700: #0d6b80;
  --brand-800: #0a4f5e;
  --accent-500: #e07a5f;
  --accent-600: #c96a52;
  --accent-700: #b25a44;
  --ink-950: #1a2b36;
  --ink-700: #3a5568;
  --ink-500: #64748b;
  --surface-50: #faf8f6;
  --surface-100: #f3efeb;
  --surface-200: #e8e2dc;
  --success: #3d8b6e;
  --warning: #d4922a;
  --font-sans: 'Plus Jakarta Sans', var(--font-jakarta), sans-serif;
}
```

- [ ] **Step 3: Agregar utilidades CSS para marca**

Añadir después de los tokens:

```css
/* Brand utilities */
.btn-primary {
  background: linear-gradient(135deg, var(--accent-500), var(--accent-600));
  color: white;
  box-shadow: 0 4px 14px rgba(224, 122, 95, 0.35);
  transition: all 0.2s;
}
.btn-primary:hover {
  background: linear-gradient(135deg, var(--accent-600), var(--accent-700));
  box-shadow: 0 6px 20px rgba(224, 122, 95, 0.45);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--brand-700);
  color: white;
  box-shadow: 0 4px 14px rgba(13, 107, 128, 0.25);
  transition: all 0.2s;
}
.btn-secondary:hover {
  background: var(--brand-800);
  box-shadow: 0 6px 20px rgba(13, 107, 128, 0.35);
  transform: translateY(-1px);
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--brand-700);
}
```

- [ ] **Step 4: Actualizar body background en layout.jsx**

Cambiar el gradiente del body para usar teal sutil:

```jsx
<body className={`${jakarta.variable} min-h-screen bg-[radial-gradient(circle_at_top,rgba(13,107,128,0.07),transparent_32%),linear-gradient(180deg,#faf8f6_0%,#f3efeb_100%)] font-sans text-slate-900 antialiased`}>
```

- [ ] **Step 5: Verificar build**

Run: `npm run build`
Expected: Build exitoso sin errores de CSS/fuente.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.jsx
git commit -m "style: implement brand design tokens — teal/coral palette, Plus Jakarta Sans font"
```

---

## Task 2: Componentes de Animación Reutilizables

**Files:**
- Create: `components/ui/AnimatedSection.jsx`
- Create: `components/ui/AnimatedStagger.jsx`

- [ ] **Step 1: Crear AnimatedSection**

Wrapper que anima children al entrar en viewport:

```jsx
'use client';

import { motion } from 'motion/react';

export default function AnimatedSection({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Crear AnimatedStagger**

Container que aplica stagger a children directos:

```jsx
'use client';

import { motion } from 'motion/react';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
};

export function StaggerContainer({ children, className = '' }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Verificar imports funcionan**

Run: `npm run build`
Expected: Build sin errores.

- [ ] **Step 4: Commit**

```bash
git add components/ui/AnimatedSection.jsx components/ui/AnimatedStagger.jsx
git commit -m "feat: add reusable scroll animation components (AnimatedSection, AnimatedStagger)"
```

---

## Task 3: Navbar + MobileNav Integration

**Files:**
- Modify: `components/marketing/PublicNavbar.jsx:1-59`
- Modify: `components/marketing/MobileNav.jsx:1-108`

- [ ] **Step 1: Integrar MobileNav en PublicNavbar**

Importar MobileNav y renderizarlo dentro del navbar para viewports < lg:

```jsx
import MobileNav from '@/components/marketing/MobileNav';

// Dentro del JSX, después del div de CTAs desktop:
<MobileNav user={user} />
```

- [ ] **Step 2: Actualizar CTA del navbar con color coral**

Cambiar el botón "Agendar consulta" en PublicNavbar de `bg-slate-950` a:

```jsx
className="btn-primary inline-flex rounded-full px-5 py-2.5 text-sm font-semibold"
```

Cambiar "Iniciar sesión" a teal:

```jsx
className="hidden rounded-full border border-[var(--brand-500)] px-4 py-2 text-sm font-semibold text-[var(--brand-700)] transition hover:bg-[var(--brand-500)]/10 md:inline-flex"
```

- [ ] **Step 3: Agregar hover states mejorados en nav links**

Cambiar los links de navegación para tener hover con underline animado:

```jsx
className={
  pathname === href
    ? 'text-[var(--brand-700)] font-semibold'
    : 'transition-colors hover:text-[var(--brand-700)]'
}
```

- [ ] **Step 4: Actualizar CTAs en MobileNav con coral**

En MobileNav.jsx, cambiar el botón "Agendar consulta" de `bg-slate-950` a:

```jsx
className="block w-full btn-primary rounded-full px-4 py-2.5 text-center text-sm font-semibold"
```

- [ ] **Step 5: Agregar animación de entrada al drawer móvil**

Reemplazar la aparición condicional del drawer con `motion.nav`:

```jsx
import { motion, AnimatePresence } from 'motion/react';

// En el return:
<AnimatePresence>
  {open && (
    <div className="fixed inset-0 z-[100]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <motion.nav
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        ref={drawerRef}
        className="absolute right-0 top-0 flex h-full w-[300px] max-w-[85vw] flex-col bg-white shadow-2xl"
      >
        {/* ...contenido drawer... */}
      </motion.nav>
    </div>
  )}
</AnimatePresence>
```

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: Build sin errores, MobileNav visible en viewport < 1024px.

- [ ] **Step 7: Commit**

```bash
git add components/marketing/PublicNavbar.jsx components/marketing/MobileNav.jsx
git commit -m "feat: integrate MobileNav, apply brand colors to CTAs, add drawer animation"
```

---

## Task 4: Hero Section — Rediseño Completo

**Files:**
- Modify: `app/(public)/page.jsx:1-70` (hero section)

- [ ] **Step 1: Rediseñar badge hero**

Cambiar el badge de `sky-200/sky-700` a teal vibrante:

```jsx
<div className="inline-flex rounded-full border border-[var(--brand-500)]/30 bg-[var(--brand-500)]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[var(--brand-700)]">
  Telesalud premium
</div>
```

- [ ] **Step 2: Rediseñar CTAs del hero con coral y teal**

CTA principal → coral (acción principal):

```jsx
<Link href="/portal/agendar" className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold">
  Agendar consulta <ArrowRight className="h-4 w-4" />
</Link>
```

CTA secundario → teal (explorar):

```jsx
<Link href="/profesionales" className="btn-secondary inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-bold">
  Explorar profesionales
</Link>
```

- [ ] **Step 3: Actualizar trust badges con teal**

Cambiar CheckCircle de `sky-700` a `var(--brand-500)`:

```jsx
<CheckCircle2 className="h-4 w-4 text-[var(--brand-500)]" />
```

- [ ] **Step 4: Agregar gradiente teal a la card derecha del hero**

Cambiar la card de "Flujo estructurado" para usar gradiente teal más rico:

```jsx
<div className="rounded-[36px] border border-[var(--brand-500)]/20 bg-gradient-to-br from-[var(--brand-700)] to-[var(--brand-500)] p-6 text-white">
  <p className="text-sm font-bold text-white/90">Flujo estructurado</p>
  {/* Steps con bg-white/15 backdrop-blur */}
```

Cada step dentro:
```jsx
<div className="flex gap-4 rounded-[24px] bg-white/15 px-4 py-4 backdrop-blur-sm">
  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/25 text-sm font-bold text-white">
    {index + 1}
  </span>
  <div>
    <p className="font-semibold text-white">{step.title}</p>
    <p className="mt-1 text-sm leading-6 text-white/70">{step.description}</p>
  </div>
</div>
```

- [ ] **Step 5: Envolver hero en AnimatedSection**

Importar AnimatedSection y envolver la sección hero:

```jsx
import AnimatedSection from '@/components/ui/AnimatedSection';

// Hero:
<AnimatedSection>
  <section className="mx-auto grid max-w-7xl ...">
    {/* ... */}
  </section>
</AnimatedSection>
```

- [ ] **Step 6: Actualizar section labels de sky-700 a brand**

En toda la página, cambiar `text-sky-700` por `section-label` class (que usa `--brand-700`):

```jsx
<p className="section-label">Propuesta de valor</p>
```

- [ ] **Step 7: Envolver secciones restantes con animaciones**

Cada `<section>` queda envuelta en `<AnimatedSection>`, y los grids de cards usan `<StaggerContainer>` + `<StaggerItem>`:

```jsx
import { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedStagger';

// Beneficios:
<AnimatedSection>
  <section>
    {/* header */}
    <StaggerContainer className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {BENEFIT_ITEMS.map((item) => (
        <StaggerItem key={item.id}>
          <div className="rounded-[28px] ...">...</div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  </section>
</AnimatedSection>
```

- [ ] **Step 8: Verificar build**

Run: `npm run build`
Expected: Build sin errores.

- [ ] **Step 9: Commit**

```bash
git add app/(public)/page.jsx
git commit -m "feat: redesign hero with teal/coral brand, scroll animations, premium visual identity"
```

---

## Task 5: Footer — Credibilidad y Contacto

**Files:**
- Modify: `components/marketing/PublicFooter.jsx:1-35`

- [ ] **Step 1: Rediseñar footer con fondo teal oscuro**

Cambiar el footer de blanco a teal oscuro (matching login page energy):

```jsx
<footer className="bg-[var(--ink-950)] text-white">
  <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.4fr,1fr,1fr,1fr] md:px-6">
```

- [ ] **Step 2: Agregar columna de contacto con WhatsApp**

Nueva columna:
```jsx
<div>
  <p className="text-sm font-bold text-white">Contacto</p>
  <div className="mt-4 flex flex-col gap-3 text-sm text-white/60">
    <a href="https://wa.me/51970549203" target="_blank" rel="noopener noreferrer"
       className="inline-flex items-center gap-2 transition hover:text-[var(--accent-500)]">
      <Phone className="h-4 w-4" /> +51 970 549 203
    </a>
    <a href="mailto:contacto@intelesalud.medicalcore.app"
       className="transition hover:text-[var(--accent-500)]">
      contacto@intelesalud.medicalcore.app
    </a>
  </div>
</div>
```

- [ ] **Step 3: Agregar copyright y badges de confianza**

Debajo del grid, agregar:

```jsx
<div className="mx-auto flex max-w-7xl items-center justify-between border-t border-white/10 px-4 py-6 md:px-6">
  <p className="text-xs text-white/40">© 2026 InteleSalud. Todos los derechos reservados.</p>
  <div className="flex items-center gap-4 text-xs text-white/40">
    <span className="inline-flex items-center gap-1.5">
      <ShieldCheck className="h-4 w-4 text-[var(--success)]" /> Datos encriptados
    </span>
    <span className="inline-flex items-center gap-1.5">
      <Lock className="h-4 w-4 text-[var(--brand-500)]" /> HIPAA-ready
    </span>
  </div>
</div>
```

- [ ] **Step 4: Actualizar colores de links en footer**

Links cambian de `text-slate-600` a `text-white/60 hover:text-[var(--accent-500)]`:

```jsx
<Link href="/especialidades" className="transition hover:text-[var(--accent-500)]">
  Especialidades
</Link>
```

- [ ] **Step 5: Verificar build**

Run: `npm run build`
Expected: Build sin errores.

- [ ] **Step 6: Commit**

```bash
git add components/marketing/PublicFooter.jsx
git commit -m "feat: redesign footer — dark teal bg, contact column, trust badges, copyright"
```

---

## Task 6: ProfessionalCard — Identidad de Marca

**Files:**
- Modify: `components/professionals/ProfessionalCard.jsx:1-79`

- [ ] **Step 1: Actualizar CTA de card a coral**

Cambiar el botón "Reservar cita" de `bg-slate-950` a:

```jsx
<Link
  href={bookingHref}
  className="btn-primary inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-bold"
>
  Reservar cita
</Link>
```

- [ ] **Step 2: Agregar badge de verificación**

Después del nombre, añadir badge:

```jsx
<div className="flex items-center gap-2">
  <p className="text-lg font-bold text-slate-950">{professional.name}</p>
  <span className="inline-flex items-center rounded-full bg-[var(--brand-500)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-700)]">
    Verificado
  </span>
</div>
```

- [ ] **Step 3: Actualizar acento de título profesional**

Cambiar `text-sky-700` a `text-[var(--brand-700)]`:

```jsx
<p className="text-sm font-medium text-[var(--brand-700)]">{professional.title}</p>
```

- [ ] **Step 4: Mejorar hover de la card**

Agregar borde teal al hover:

```jsx
className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--brand-500)]/10 hover:border-[var(--brand-500)]/30"
```

- [ ] **Step 5: Verificar build**

Run: `npm run build`
Expected: Build sin errores.

- [ ] **Step 6: Commit**

```bash
git add components/professionals/ProfessionalCard.jsx
git commit -m "feat: update ProfessionalCard — coral CTA, verified badge, brand accent hover"
```

---

## Task 7: Verificación Visual con Playwright

**Files:**
- Modify: `scripts/screenshot_pages.py`

- [ ] **Step 1: Ejecutar build de producción**

Run: `npm run build`
Expected: Build exitoso.

- [ ] **Step 2: Tomar screenshots de verificación**

Run: `python scripts/screenshot_pages.py`
(apuntando al dev server o producción)

- [ ] **Step 3: Revisión visual de screenshots**

Leer cada screenshot y verificar:
- Paleta teal/coral visible en hero, CTAs, footer
- Animaciones de scroll funcionan (verificar con interacción)
- MobileNav aparece en viewport móvil
- Footer oscuro con badges de confianza
- Professional cards con CTAs coral y badge verificado

- [ ] **Step 4: Commit final**

```bash
git add -A
git commit -m "style: complete visual redesign — InteleSalud premium brand identity"
```

---

## Execution Notes

- **No test framework** configurado — la verificación es visual (Playwright screenshots).
- **`motion`** (Framer Motion) ya está en `package.json` — no requiere instalación.
- **No se toca** lógica de negocio, API routes, ni Prisma schema.
- **Plus Jakarta Sans** se carga via `next/font/google` — zero external requests, self-hosted.
- Cada task es **independiente** — pueden ejecutarse en paralelo por subagentes excepto Task 1 (design tokens) que es prerequisito para todas.

## Dependency Graph

```
Task 1 (Design Tokens) ──┬──> Task 3 (Navbar + MobileNav)
                          ├──> Task 4 (Hero + Landing)
                          ├──> Task 5 (Footer)
                          └──> Task 6 (ProfessionalCard)
Task 2 (Animation Components) ──> Task 4 (Hero + Landing)
Task 7 (Verificación) ──> ALL tasks complete
```

**Parallel execution:** Tasks 2, 3, 5, 6 can run in parallel after Task 1 completes. Task 4 depends on both Task 1 and Task 2.
