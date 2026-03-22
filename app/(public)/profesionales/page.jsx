import ProfessionalCard from '@/components/professionals/ProfessionalCard';
import ProfessionalFilters from '@/components/professionals/ProfessionalFilters';
import { getProfessionalFilterOptions, listProfessionals, parseProfessionalFilters } from '@/lib/professionals/queries';

export default async function ProfessionalsPage({ searchParams }) {
  const filters = parseProfessionalFilters(searchParams);
  const [professionals, filterOptions] = await Promise.all([
    listProfessionals(filters),
    getProfessionalFilterOptions(),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-14 md:px-6">
      <div className="max-w-3xl space-y-4">
        <p className="section-label">Directorio medico</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Filtra por experiencia, universidad, anos como especialista y valoracion</h1>
        <p className="text-lg leading-8 text-slate-600">
          El directorio de InteleSalud ya esta preparado para un marketplace profesional multiespecialidad con filtros visibles y disponibilidad mock.
        </p>
      </div>

      <ProfessionalFilters currentFilters={filters} filterOptions={filterOptions} />

      <div className="grid gap-6 xl:grid-cols-3">
        {professionals.length ? (
          professionals.map((professional) => (
            <ProfessionalCard key={professional.id} professional={professional} />
          ))
        ) : (
          <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm xl:col-span-3">
            No encontramos profesionales con esos filtros. Ajusta experiencia, universidad o valoracion para ver mas opciones.
          </div>
        )}
      </div>
    </div>
  );
}
