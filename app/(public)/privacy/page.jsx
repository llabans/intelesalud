export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-14 md:px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Politica de privacidad</h1>
      <p className="text-sm leading-7 text-slate-600">
        Esta implementacion usa Firebase Authentication y Prisma/PostgreSQL como base transaccional. Los documentos y registros clinicos presentes en esta entrega son mock y estan orientados a demostrar la arquitectura del portal.
      </p>
    </div>
  );
}
