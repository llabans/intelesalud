# InteleSalud

Plataforma web de telesalud multiespecialidad para marketing publico, portal de
paciente, agendamiento, pagos y asistente administrativo.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Firebase Authentication
- Sesion server-side con cookies seguras
- Prisma + PostgreSQL

## Rutas principales

- Publico: `/`, `/especialidades`, `/como-funciona`, `/profesionales`, `/faq`, `/login`
- Portal paciente: `/portal`, `/portal/citas`, `/portal/agendar`, `/portal/historial`, `/portal/profesionales`, `/portal/documentos`, `/portal/indicaciones`, `/portal/mensajes`, `/portal/perfil`, `/portal/sala`, `/portal/configuracion`
- Compatibilidad legacy: `/services`, `/book/[serviceId]`, `/dashboard/patient`

## Configuracion local

1. Copia `.env.example` a `.env.local`.
2. Completa Firebase client/admin y `DATABASE_URL`.
3. Instala dependencias:

```bash
npm install
```

4. Genera Prisma:

```bash
npm run db:generate
```

5. Sincroniza esquema y seed:

```bash
npx prisma db push
npm run db:seed
```

6. Inicia desarrollo:

```bash
npm run dev
```

## Seed funcional

El seed crea:

- especialidades
- profesionales con filtros publicos
- servicios por especialidad
- disponibilidad mock
- FAQs
- documentos e historia clinica mock para portal
- conversaciones iniciales del asistente

## Validacion recomendada

```bash
npm run db:generate
npm run build
```

## Despliegue

La guia completa esta en [DEPLOYMENT.md](./DEPLOYMENT.md). El flujo VPS usa
`deploy.ps1`, `deploy_config.env` y `vps_setup.sh` con defaults ya adaptados a
`intelesalud.medicalcore.app`.
