# InteleSalud — Directorio Médico Estilo Doctoralia: Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolucionar InteleSalud de un MVP de booking a un directorio médico tipo Doctoralia con perfiles individuales, reviews públicas, búsqueda avanzada, y UX orientada a pacientes peruanos.

**Architecture:** Server-side rendered pages con Next.js 15 App Router. Prisma/PostgreSQL para datos. Filtrado por URL params (SEO-friendly). No test framework configurado — se omite TDD, se usa build verification + manual QA.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Prisma, PostgreSQL, Lucide icons, Motion (animations)

**Basado en:** Auditoría de 4 agentes especializados (Frontend 5.6/10, Marketing 4.2/10, Backend C+, Design 5.5/10)

---

## File Structure

### New Files
- `app/(public)/profesionales/[slug]/page.jsx` — Página de perfil individual del profesional
- `app/api/professionals/[slug]/route.js` — API de perfil individual
- `app/api/professionals/[slug]/reviews/route.js` — API de reviews paginadas
- `components/professionals/ProfessionalProfile.jsx` — Componente de perfil completo
- `components/professionals/ReviewCard.jsx` — Card de review individual
- `components/professionals/ReviewList.jsx` — Lista paginada de reviews
- `components/professionals/SearchBar.jsx` — Barra de búsqueda global
- `components/marketing/MobileNav.jsx` — Menú hamburger para mobile

### Modified Files
- `prisma/schema.prisma` — Nuevos campos en SpecialistProfile + AppointmentReview
- `lib/platform/catalog.js` — Copy corregido, fotos mejoradas
- `lib/professionals/queries.js` — Query de perfil individual + reviews + búsqueda texto
- `app/(public)/page.jsx` — Hero reescrito, social proof, search bar
- `components/professionals/ProfessionalCard.jsx` — Precio, badge CMP, disponibilidad real
- `components/professionals/ProfessionalFilters.jsx` — Sort, clear all, mobile collapse
- `components/marketing/PublicNavbar.jsx` — Search bar + mobile hamburger
- `app/globals.css` — Paleta warm, font sizes
- `app/layout.jsx` — Meta descriptions, JSON-LD
- `components/marketing/PublicFooter.jsx` — WhatsApp, contacto

---

## Task 0: Deploy — Fix Production 502

**Files:**
- Modify: Local git setup + VPS `/var/www/intelesalud/`

- [ ] **Step 1: Primer commit del codebase**
```bash
git add -A
git commit -m "feat: InteleSalud MVP with security hardening and performance optimization"
```

- [ ] **Step 2: Configurar remote y push**
```bash
git remote add origin <repo-url>
git push -u origin main
```

- [ ] **Step 3: Clonar en VPS y build**
```bash
ssh admin@44.235.121.195
cd /var/www/intelesalud
git clone <repo-url> .
npm ci
set -a && source .env.production && set +a
npx prisma db push
npm run build
sudo systemctl restart intelesalud
```

- [ ] **Step 4: Verificar que el 502 se resuelve**
```bash
curl -I https://intelesalud.medicalcore.app
# Expected: HTTP/2 200
```

---

## Task 1: Paleta Warm + Accesibilidad Base

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.jsx` (meta descriptions, JSON-LD)

- [ ] **Step 1: Actualizar CSS custom properties a paleta warm**

En `app/globals.css`, cambiar:
```css
:root {
  --brand-500: #1a8faa;
  --brand-700: #0d6b80;
  --accent-500: #e07a5f;
  --accent-600: #c96a52;
  --ink-950: #1a2b36;
  --surface-50: #faf8f6;
  --surface-100: #f3efeb;
  --success: #3d8b6e;
  --warning: #d4922a;
}
```

- [ ] **Step 2: Aumentar font-size base a 16px**

En `app/globals.css`, cambiar body text de `text-sm` a `text-base` donde aplique.

- [ ] **Step 3: Agregar meta descriptions y JSON-LD MedicalOrganization**

En `app/layout.jsx`, agregar metadata con keywords geográficos y structured data.

- [ ] **Step 4: Build y verificar**
```bash
npm run build
```

- [ ] **Step 5: Commit**
```bash
git add app/globals.css app/layout.jsx
git commit -m "style: warm healthcare palette, accessibility font sizes, SEO metadata"
```

---

## Task 2: Mobile Navigation + WhatsApp

**Files:**
- Create: `components/marketing/MobileNav.jsx`
- Modify: `components/marketing/PublicNavbar.jsx`
- Modify: `components/marketing/PublicFooter.jsx`

- [ ] **Step 1: Crear componente MobileNav**

Hamburger button + slide-out drawer con todos los links de navegación, teléfono, WhatsApp.

- [ ] **Step 2: Integrar MobileNav en PublicNavbar**

Reemplazar `hidden lg:flex` con hamburger visible en mobile.

- [ ] **Step 3: Agregar WhatsApp flotante + contacto en footer**

Botón flotante bottom-right con link `https://wa.me/51970549203?text=Hola,%20quiero%20información%20sobre%20InteleSalud`.
Footer: teléfono, email, WhatsApp, redes.

- [ ] **Step 4: Build y verificar**
- [ ] **Step 5: Commit**
```bash
git commit -m "feat: mobile navigation drawer + WhatsApp floating button + footer contact"
```

---

## Task 3: Reescribir Copy + Eliminar Jerga Dev

**Files:**
- Modify: `lib/platform/catalog.js` (BENEFIT_ITEMS, HOW_IT_WORKS_STEPS, FAQ_ITEMS, CHATBOT_KNOWLEDGE)
- Modify: `app/(public)/page.jsx` (hero section)
- Modify: `components/professionals/ProfessionalCard.jsx` (remover "mock")

- [ ] **Step 1: Reescribir hero en page.jsx**

Headline: "Tu médico especialista, a una videollamada de distancia"
Sub: "Elige entre cardiólogos, pediatras, nutricionistas y más profesionales colegiados. Reserva en minutos, paga desde tu celular."
CTA primario: "Ver horarios disponibles hoy"
Trust pills: "Médicos colegiados CMP" / "Consulta desde S/79" / "Atención en menos de 48h"

- [ ] **Step 2: Limpiar catalog.js**

Reescribir BENEFIT_ITEMS con lenguaje de paciente.
Remover toda referencia a "mock", "evolucionar", "producción", "flujo estructurado".

- [ ] **Step 3: Limpiar ProfessionalCard.jsx**

"Disponibilidad mock" → "Próximos horarios"
"0 anios" → no mostrar badge si experienceYears es 0/null.
Corregir "anios" → "años" en todo el archivo.

- [ ] **Step 4: Corregir acentos en ProfessionalFilters.jsx**

"Valoracion" → "Valoración", "Anios" → "Años", etc.

- [ ] **Step 5: Build y verificar**
- [ ] **Step 6: Commit**
```bash
git commit -m "content: patient-facing copy, remove dev jargon, fix Spanish accents"
```

---

## Task 4: ProfessionalCard — Precio, Badge CMP, Disponibilidad Real

**Files:**
- Modify: `components/professionals/ProfessionalCard.jsx`

- [ ] **Step 1: Agregar precio en card**

Mostrar "Desde S/ {precio}" del primer servicio del profesional. Posicionar debajo del nombre con `text-lg font-semibold text-slate-950`.

- [ ] **Step 2: Agregar badge CMP verificado**

Junto al nombre, si `licenseCode` existe, mostrar badge verde con ícono `BadgeCheck` de Lucide + licenseCode en tooltip/texto pequeño.

- [ ] **Step 3: Mejorar display de disponibilidad**

Reemplazar "Disponibilidad mock" con slots formateados como: "Disponible: lun 24/3 09:00" con highlight verde para "Disponible hoy" si aplica.

- [ ] **Step 4: Agregar tipo de consulta**

Badge "Teleconsulta" o "Presencial" basado en service.mode.

- [ ] **Step 5: Build y verificar**
- [ ] **Step 6: Commit**
```bash
git commit -m "feat: professional cards with price, CMP badge, real availability, consultation type"
```

---

## Task 5: Barra de Búsqueda Global

**Files:**
- Create: `components/professionals/SearchBar.jsx`
- Modify: `app/(public)/page.jsx` (hero search)
- Modify: `components/marketing/PublicNavbar.jsx` (navbar search)
- Modify: `lib/professionals/queries.js` (text search filter)

- [ ] **Step 1: Agregar filtro de texto en queries.js**

En `listProfessionals`, aceptar parámetro `search` que busque en `firstName`, `lastName`, `title`, `headline` con `contains/mode:insensitive`.

- [ ] **Step 2: Crear SearchBar component**

Input con ícono Search de Lucide, placeholder "Buscar por nombre, especialidad o síntoma...", submit navega a `/profesionales?search={query}`.

- [ ] **Step 3: Integrar en hero de landing page**

SearchBar centrado debajo del headline, estilo prominente.

- [ ] **Step 4: Integrar versión compacta en navbar**

SearchBar small en el navbar (hidden en mobile, visible lg+).

- [ ] **Step 5: Actualizar parseProfessionalFilters para search param**
- [ ] **Step 6: Build y verificar**
- [ ] **Step 7: Commit**
```bash
git commit -m "feat: global search bar in hero and navbar with text search filter"
```

---

## Task 6: Schema — Perfil Enriquecido + Reviews Mejoradas

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `lib/platform/catalog.js` (seed data actualizada)
- Modify: `prisma/seed.js`

- [ ] **Step 1: Agregar campos a SpecialistProfile**

```prisma
gender              String?
city                String?
region              String?
languagesSpoken     String[]    @default(["es"])
consultationModes   String[]    @default(["VIRTUAL"])
verificationStatus  String      @default("VERIFIED")
consultationCount   Int         @default(0)
memberSince         DateTime    @default(now())
isPublished         Boolean     @default(true)
```

- [ ] **Step 2: Agregar campos a AppointmentReview**

```prisma
ratingPunctuality    Int?
ratingBedside        Int?
ratingExplanation    Int?
isVerified           Boolean    @default(true)
isPublic             Boolean    @default(true)
moderationStatus     String     @default("APPROVED")
helpfulCount         Int        @default(0)
```

- [ ] **Step 3: Agregar modelo ReviewReply**

```prisma
model ReviewReply {
  id         String            @id @default(cuid())
  reviewId   String            @unique
  authorId   String
  body       String            @db.Text
  createdAt  DateTime          @default(now())
  review     AppointmentReview @relation(fields: [reviewId], references: [id])
  author     SpecialistProfile @relation(fields: [authorId], references: [id])
}
```

- [ ] **Step 4: Actualizar seed data en catalog.js con nuevos campos**
- [ ] **Step 5: Generar y aplicar migración**
```bash
npx prisma migrate dev --name enhanced-profiles-reviews
```

- [ ] **Step 6: Commit**
```bash
git commit -m "schema: enhanced specialist profiles, sub-ratings, review replies"
```

---

## Task 7: Página de Perfil Individual del Profesional

**Files:**
- Create: `app/(public)/profesionales/[slug]/page.jsx`
- Create: `app/api/professionals/[slug]/route.js`
- Create: `app/api/professionals/[slug]/reviews/route.js`
- Create: `components/professionals/ProfessionalProfile.jsx`
- Create: `components/professionals/ReviewCard.jsx`
- Create: `components/professionals/ReviewList.jsx`
- Modify: `lib/professionals/queries.js` (getProfessionalBySlug, getReviewsForSpecialist)

- [ ] **Step 1: Agregar query getProfessionalBySlug en queries.js**

Fetch specialist by slug con include completo (user, services, specialties, reviews con patient).

- [ ] **Step 2: Agregar query getReviewsForSpecialist en queries.js**

Paginado con cursor, filtro por isPublic, ordenar por createdAt desc.

- [ ] **Step 3: Crear API route /api/professionals/[slug]**
- [ ] **Step 4: Crear API route /api/professionals/[slug]/reviews**
- [ ] **Step 5: Crear componente ReviewCard**

Muestra: rating stars, sub-ratings si existen, comentario, fecha, "Paciente verificado" badge, reply del doctor si existe.

- [ ] **Step 6: Crear componente ReviewList**

Lista paginada de ReviewCards con "Cargar más" button.

- [ ] **Step 7: Crear componente ProfessionalProfile**

Layout: foto grande + info + badge CMP + stats (consultas, rating, años) + servicios + calendario de disponibilidad + reviews.

- [ ] **Step 8: Crear page /profesionales/[slug]**

Server component que carga datos y renderiza ProfessionalProfile. Agregar JSON-LD `Physician` structured data para SEO.

- [ ] **Step 9: Agregar generateMetadata para SEO dinámico**

Title: "Dra. Camila Suárez — Medicina General | InteleSalud"
Description con especialidad, universidad, rating.

- [ ] **Step 10: Linkear desde ProfessionalCard**

El nombre del profesional linkea a `/profesionales/{slug}`.

- [ ] **Step 11: Build y verificar**
- [ ] **Step 12: Commit**
```bash
git commit -m "feat: individual professional profile pages with reviews, SEO, JSON-LD"
```

---

## Task 8: Social Proof + Landing Page Redesign

**Files:**
- Modify: `app/(public)/page.jsx`
- Modify: `app/(public)/especialidades/page.jsx` (renderizar íconos)

- [ ] **Step 1: Agregar sección social proof en landing**

Strip horizontal: "X+ consultas realizadas | 4.8 valoración promedio | 7 especialidades"
Trust badges: "Datos cifrados | Profesionales verificados CMP | Pago seguro"

- [ ] **Step 2: Agregar testimonios en landing**

2-3 cards de testimonial con quote, nombre (iniciales), rating, especialidad consultada. Datos mock iniciales en catalog.js.

- [ ] **Step 3: Renderizar íconos de especialidades**

En la página de especialidades, importar dinámicamente los íconos Lucide definidos en `SPECIALTY_CATALOG` y renderizarlos en cada card.

- [ ] **Step 4: Build y verificar**
- [ ] **Step 5: Commit**
```bash
git commit -m "feat: social proof strip, testimonials, specialty icons on landing"
```

---

## Task 9: Filtros Mejorados — Sort, Clear, Mobile Collapse

**Files:**
- Modify: `components/professionals/ProfessionalFilters.jsx`
- Modify: `lib/professionals/queries.js` (sort options)

- [ ] **Step 1: Agregar botón "Limpiar filtros"**

Link que navega a `/profesionales` sin query params.

- [ ] **Step 2: Agregar sort options**

Dropdown: "Ordenar por: Valoración, Experiencia, Precio (menor), Precio (mayor)". Implementar como query param `sort=rating|experience|price_asc|price_desc`.

- [ ] **Step 3: Agregar results count**

"X profesionales encontrados" arriba del grid.

- [ ] **Step 4: Hacer filtros colapsables en mobile**

Botón "Filtros" que muestra/oculta el panel. En desktop siempre visible.

- [ ] **Step 5: Cambiar universidad de chips a dropdown**

Select/autocomplete para escalar más allá de 6 universidades.

- [ ] **Step 6: Build y verificar**
- [ ] **Step 7: Commit**
```bash
git commit -m "feat: filter sort, clear all, results count, mobile collapse, university dropdown"
```

---

## Task 10: Deploy Final + Verificación

- [ ] **Step 1: Push todos los cambios a main**
- [ ] **Step 2: Deploy en VPS**
```bash
ssh admin@44.235.121.195
cd /var/www/intelesalud
git pull origin main
npm ci
npx prisma db push
npm run build
sudo systemctl start intelesalud
```

- [ ] **Step 3: Capturar screenshots con Playwright**

Verificar todas las páginas en desktop y mobile.

- [ ] **Step 4: Verificar SEO con Lighthouse**
- [ ] **Step 5: Commit de verificación si hay ajustes**

---

## Orden de Ejecución Recomendado

```
Task 0 (Deploy fix) → Task 1 (Paleta) → Task 2 (Mobile nav) → Task 3 (Copy)
→ Task 4 (Cards) → Task 5 (Search) → Task 6 (Schema) → Task 7 (Profiles)
→ Task 8 (Social proof) → Task 9 (Filters) → Task 10 (Deploy final)
```

Las tasks 1-5 son cambios frontend que no requieren migración de DB.
Las tasks 6-7 requieren migración de schema.
Las tasks 8-9 son mejoras iterativas.
